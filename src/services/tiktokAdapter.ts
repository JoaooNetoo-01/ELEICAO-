import { ConnectionState, NormalizedGiftEvent } from '../types/voting';

type GiftEventCallback = (event: NormalizedGiftEvent) => void;
type StatusCallback = (state: ConnectionState, errorMessage?: string) => void;

/**
 * Adaptador independente para integração real via WebSocket com serviços de captura
 * do TikTok LIVE (ex.: TikFinity, TikTok-Live-Connector Bridge, EulerStream local bridge).
 *
 * IMPORTANTE: Uma página web executada no navegador não possui acesso direto aos eventos
 * privados do TikTok sem um serviço ponte (bridge). Este adaptador nunca simula conexão
 * bem-sucedida se o servidor WebSocket não responder de verdade.
 */
export class TikTokLiveAdapter {
  private ws: WebSocket | null = null;
  private url: string = '';
  private status: ConnectionState = 'disconnected';
  private reconnectTimer: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 6;
  private manualDisconnect: boolean = false;

  private onGiftEvent: GiftEventCallback;
  private onStatusChange: StatusCallback;

  constructor(onGiftEvent: GiftEventCallback, onStatusChange: StatusCallback) {
    this.onGiftEvent = onGiftEvent;
    this.onStatusChange = onStatusChange;
  }

  public connect(wsUrl: string): void {
    this.cleanupSocket();
    this.manualDisconnect = false;
    this.url = wsUrl.trim();

    if (!this.url.startsWith('ws://') && !this.url.startsWith('wss://')) {
      this.updateStatus('error', 'A URL deve iniciar com ws:// ou wss://');
      return;
    }

    this.updateStatus('connecting');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateStatus('connected');
      };

      this.ws.onmessage = (messageEvent) => {
        this.handleRawMessage(messageEvent.data);
      };

      this.ws.onerror = () => {
        this.updateStatus(
          'error',
          `Não foi possível estabelecer conexão com ${this.url}. Verifique se o bridge local (ex: TikFinity ou conector Node.js) está em execução.`
        );
      };

      this.ws.onclose = () => {
        if (this.manualDisconnect) {
          this.updateStatus('disconnected');
          return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts += 1;
          const delayMs = Math.min(15000, 2000 * Math.pow(1.5, this.reconnectAttempts - 1));
          this.updateStatus(
            'error',
            `Conexão encerrada. Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts}) em ${Math.round(delayMs / 1000)}s... Os votos atuais estão preservados.`
          );
          this.reconnectTimer = window.setTimeout(() => {
            if (!this.manualDisconnect) {
              this.connect(this.url);
            }
          }, delayMs);
        } else {
          this.updateStatus(
            'error',
            'Serviço WebSocket externo indisponível. Verifique o conector TikTok LIVE e clique em Conectar novamente.'
          );
        }
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido ao abrir WebSocket.';
      this.updateStatus('error', msg);
    }
  }

  public disconnect(): void {
    this.manualDisconnect = true;
    this.cleanupSocket();
    this.updateStatus('disconnected');
  }

  public getStatus(): ConnectionState {
    return this.status;
  }

  private cleanupSocket(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      try {
        this.ws.close();
      } catch {
        // Ignore
      }
      this.ws = null;
    }
  }

  private updateStatus(newState: ConnectionState, errorMessage?: string): void {
    this.status = newState;
    this.onStatusChange(newState, errorMessage);
  }

  /**
   * Normaliza payloads provenientes de diferentes bridges do TikTok LIVE
   * (formato direto, formato TikFinity `{ event: "gift", data: {...} }` ou `tiktok-live-connector`).
   */
  private handleRawMessage(rawData: unknown): void {
    if (typeof rawData !== 'string') return;

    try {
      const parsed = JSON.parse(rawData);
      if (!parsed || typeof parsed !== 'object') return;

      // Suporte tanto para payload direto quanto envelope { event: 'gift', data: { ... } }
      const eventType = parsed.event || parsed.type || 'gift';
      if (
        typeof eventType === 'string' &&
        !['gift', 'gift_event', 'tiktok_gift'].includes(eventType.toLowerCase())
      ) {
        return;
      }

      const payload = parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed;

      // Ignorar eventos intermediários de streak quando repeatEnd === false (padrão tiktok-live-connector)
      // para evitar duplicação da mesma sequência de combo
      if (payload.giftType === 1 && payload.repeatEnd === false) {
        return;
      }

      const eventId = String(
        payload.eventId ||
          payload.msgId ||
          payload.id ||
          `${payload.userId || 'anon'}_${payload.giftId || 'gift'}_${payload.timestamp || Date.now()}`
      );

      const giftId = String(payload.giftId ?? payload.gift_id ?? payload.giftName ?? '');
      const giftName = String(payload.giftName ?? payload.gift_name ?? payload.describe ?? giftId);
      const giftCoinValue = Number(
        payload.giftCoinValue ?? payload.diamondCount ?? payload.coinValue ?? payload.coins ?? 0
      );
      const repeatCount = Number(payload.repeatCount ?? payload.repeat_count ?? payload.comboCount ?? 1);
      const totalCoinValue =
        payload.totalCoinValue !== undefined
          ? Number(payload.totalCoinValue)
          : payload.totalDiamondCount !== undefined
          ? Number(payload.totalDiamondCount)
          : undefined;
      const senderName = String(
        payload.senderName ?? payload.nickname ?? payload.uniqueId ?? 'Espectador LIVE'
      );

      const normalized: NormalizedGiftEvent = {
        eventId,
        giftId,
        giftName,
        giftCoinValue,
        repeatCount: Number.isFinite(repeatCount) && repeatCount > 0 ? repeatCount : 1,
        totalCoinValue:
          totalCoinValue !== undefined && Number.isFinite(totalCoinValue) && totalCoinValue > 0
            ? totalCoinValue
            : undefined,
        senderName,
        timestamp: new Date().toISOString(),
        origin: 'live',
      };

      this.onGiftEvent(normalized);
    } catch {
      // Ignora mensagens malformadas sem interromper a transmissão
    }
  }
}
