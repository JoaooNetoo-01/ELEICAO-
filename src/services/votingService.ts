import {
  CandidateConfig,
  CandidateId,
  GiftItem,
  NormalizedGiftEvent,
  OperatingMode,
  VoteRecord,
  VotingRoundStatus,
  VotingStoreState,
} from '../types/voting';
import lulaPortraitImg from '../assets/images/candidate_lula_portrait_1791675748499.jpg';
import flavioPortraitImg from '../assets/images/candidate_flavio_portrait_1791675758337.jpg';

const STORAGE_KEY = 'urna_ao_vivo_state_v3';
const LEGACY_KEYS = ['urna_ao_vivo_state_v1', 'urna_ao_vivo_state_v2'];
const MAX_HISTORY_ITEMS = 250;
const MAX_PROCESSED_IDS = 1000;

export const DEFAULT_CANDIDATES: Record<CandidateId, CandidateConfig> = {
  lula: {
    id: 'lula',
    name: 'LULA',
    shortName: 'Lula',
    number: '13',
    party: 'Partido dos Trabalhadores',
    avatarUrl: lulaPortraitImg,
    primaryColor: '#dc2626',
    secondaryColor: '#ef4444',
  },
  flavio: {
    id: 'flavio',
    name: 'FLÁVIO BOLSONARO',
    shortName: 'Flávio Bolsonaro',
    number: '22',
    party: 'Partido Liberal',
    avatarUrl: flavioPortraitImg,
    primaryColor: '#16a34a',
    secondaryColor: '#22c55e',
  },
};

export const DEFAULT_GIFTS: GiftItem[] = [
  // PAINEL ESQUERDO — LULA (Vermelho) - Ordem crescente
  {
    giftId: 'lula_rosa_1',
    name: 'Rosa',
    shortName: 'Rosa',
    sortOrder: 1,
    iconType: 'rose',
    coinValue: 1,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_heart_me_1',
    name: 'Heart Me',
    shortName: 'Heart Me',
    sortOrder: 2,
    iconType: 'heart_me',
    coinValue: 1,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_amo_voce_1',
    name: 'Amo você',
    shortName: 'Amo você',
    sortOrder: 3,
    iconType: 'love_you',
    coinValue: 1,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_ingresso_bis_5',
    name: 'Ingresso de bis',
    shortName: 'Ingresso bis',
    sortOrder: 4,
    iconType: 'encore_ticket',
    coinValue: 5,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_coracao_10',
    name: 'Coração',
    shortName: 'Coração',
    sortOrder: 5,
    iconType: 'finger_heart',
    coinValue: 10,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_capybara_30',
    name: 'Capybara',
    shortName: 'Capybara',
    sortOrder: 6,
    iconType: 'capybara',
    coinValue: 30,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_acordeao_99',
    name: 'Acordeão fiesta',
    shortName: 'Acordeão',
    sortOrder: 7,
    iconType: 'accordion',
    coinValue: 99,
    candidateId: 'lula',
    active: true,
  },
  {
    giftId: 'lula_pistola_500',
    name: 'Pistola de dinheiro',
    shortName: 'Pistola $',
    sortOrder: 8,
    iconType: 'money_gun',
    coinValue: 500,
    candidateId: 'lula',
    active: true,
  },

  // PAINEL DIREITO — FLÁVIO BOLSONARO (Verde) - Ordem crescente
  {
    giftId: 'flavio_rosa_branca_1',
    name: 'Rosa branca',
    shortName: 'Rosa branca',
    sortOrder: 1,
    iconType: 'white_rose',
    coinValue: 1,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_palmas_1',
    name: 'Palmas',
    shortName: 'Palmas',
    sortOrder: 2,
    iconType: 'clap',
    coinValue: 1,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_bom_trabalho_1',
    name: 'Bom trabalho',
    shortName: 'Bom trabalho',
    sortOrder: 3,
    iconType: 'thumbs_up',
    coinValue: 1,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_bola_futebol_5',
    name: 'Bola de futebol giratória',
    shortName: 'Bola futebol',
    sortOrder: 4,
    iconType: 'soccer_ball',
    coinValue: 5,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_mini_dino_10',
    name: 'Mini dino',
    shortName: 'Mini dino',
    sortOrder: 5,
    iconType: 'mini_dino',
    coinValue: 10,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_buque_flores_30',
    name: 'Buquê de flores',
    shortName: 'Buquê flores',
    sortOrder: 6,
    iconType: 'flower_bouquet',
    coinValue: 30,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_chapeu_bigode_99',
    name: 'Chapéu e Bigode',
    shortName: 'Chapéu/Bigode',
    sortOrder: 7,
    iconType: 'hat_mustache',
    coinValue: 99,
    candidateId: 'flavio',
    active: true,
  },
  {
    giftId: 'flavio_mestre_batalhas_500',
    name: 'Mestre das Batalhas',
    shortName: 'Mestre Batalha',
    sortOrder: 8,
    iconType: 'battle_master',
    coinValue: 500,
    candidateId: 'flavio',
    active: true,
  },
];

/**
 * Ordena presentes sempre pelo valor em moedas (do menor para o maior).
 * Quando dois presentes possuem o mesmo valor, preserva a ordem definida (sortOrder).
 */
export function sortGiftsByAscendingValue(gifts: GiftItem[]): GiftItem[] {
  return [...gifts].sort((a, b) => {
    if (a.coinValue !== b.coinValue) {
      return a.coinValue - b.coinValue;
    }
    return (a.sortOrder ?? 99) - (b.sortOrder ?? 99);
  });
}

export function createInitialState(): VotingStoreState {
  return {
    roundId: 1,
    status: 'running',
    mode: 'demo',
    lulaVotes: 0,
    flavioVotes: 0,
    candidates: DEFAULT_CANDIDATES,
    gifts: DEFAULT_GIFTS,
    history: [],
    processedEventIds: [],
    websocketUrl: 'ws://localhost:21213/',
  };
}

export function loadVotingState(): VotingStoreState {
  if (typeof window === 'undefined') {
    return createInitialState();
  }
  try {
    LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<VotingStoreState>;
    const defaults = createInitialState();

    // Verifica se o catálogo salvo já possui os 16 presentes atualizados; caso contrário, usa o novo catálogo preservando os votos
    const hasUpdatedCatalog =
      Array.isArray(parsed.gifts) &&
      parsed.gifts.some((g) => g.giftId === 'lula_pistola_500') &&
      parsed.gifts.some((g) => g.giftId === 'flavio_mestre_batalhas_500');

    const resolveAvatarUrl = (savedUrl: string | undefined, defaultUrl: string) => {
      if (!savedUrl || savedUrl.startsWith('/src/assets/')) {
        return defaultUrl;
      }
      return savedUrl;
    };

    return {
      roundId: typeof parsed.roundId === 'number' ? parsed.roundId : defaults.roundId,
      status: parsed.status || defaults.status,
      mode: parsed.mode || defaults.mode,
      lulaVotes: typeof parsed.lulaVotes === 'number' && parsed.lulaVotes >= 0 ? parsed.lulaVotes : 0,
      flavioVotes: typeof parsed.flavioVotes === 'number' && parsed.flavioVotes >= 0 ? parsed.flavioVotes : 0,
      candidates: parsed.candidates
        ? {
            lula: {
              ...defaults.candidates.lula,
              ...parsed.candidates.lula,
              avatarUrl: resolveAvatarUrl(
                parsed.candidates.lula?.avatarUrl,
                defaults.candidates.lula.avatarUrl
              ),
            },
            flavio: {
              ...defaults.candidates.flavio,
              ...parsed.candidates.flavio,
              avatarUrl: resolveAvatarUrl(
                parsed.candidates.flavio?.avatarUrl,
                defaults.candidates.flavio.avatarUrl
              ),
            },
          }
        : defaults.candidates,
      gifts: hasUpdatedCatalog && parsed.gifts ? parsed.gifts : defaults.gifts,
      history: Array.isArray(parsed.history) ? parsed.history : [],
      processedEventIds: Array.isArray(parsed.processedEventIds) ? parsed.processedEventIds : [],
      websocketUrl: typeof parsed.websocketUrl === 'string' ? parsed.websocketUrl : defaults.websocketUrl,
    };
  } catch (err) {
    console.error('Erro ao carregar estado da urna:', err);
    return createInitialState();
  }
}

export function saveVotingState(state: VotingStoreState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Erro ao salvar estado da urna:', err);
  }
}

export interface ProcessEventResult {
  accepted: boolean;
  reason?: string;
  nextState: VotingStoreState;
  record?: VoteRecord;
  giftUsed?: GiftItem;
  leadChanged?: boolean;
  newLeader?: CandidateId | 'tie';
}

export function getLeader(lulaVotes: number, flavioVotes: number): CandidateId | 'tie' {
  if (lulaVotes > flavioVotes) return 'lula';
  if (flavioVotes > lulaVotes) return 'flavio';
  return 'tie';
}

export function calculatePercentages(lulaVotes: number, flavioVotes: number): {
  total: number;
  lulaPercent: number;
  flavioPercent: number;
} {
  const total = lulaVotes + flavioVotes;
  if (total <= 0) {
    return { total: 0, lulaPercent: 0, flavioPercent: 0 };
  }
  const lulaPercent = (lulaVotes / total) * 100;
  const flavioPercent = (flavioVotes / total) * 100;
  return { total, lulaPercent, flavioPercent };
}

export function formatNumberBR(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(Math.round(value));
}

export function formatPercentBR(value: number): string {
  if (value === 0) return '0%';
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value) + '%'
  );
}

/**
 * Processa um evento normalizado de presente com validação estrita,
 * prevenção de duplicidade por eventId e cálculo fiel por moedas (1 moeda = 1 voto).
 */
export function processGiftEvent(
  currentState: VotingStoreState,
  event: NormalizedGiftEvent,
  overrideCandidateId?: CandidateId
): ProcessEventResult {
  if (currentState.status !== 'running') {
    return {
      accepted: false,
      reason:
        currentState.status === 'paused'
          ? 'A votação está pausada. Novos presentes não são contabilizados até a retomada.'
          : 'A votação desta rodada já foi encerrada.',
      nextState: currentState,
    };
  }

  if (currentState.mode === 'live' && event.origin === 'demo') {
    return {
      accepted: false,
      reason: 'Modo Conectado (LIVE) ativo: eventos de demonstração estão bloqueados para não misturar dados.',
      nextState: currentState,
    };
  }

  if (!event || typeof event.eventId !== 'string' || !event.eventId.trim()) {
    return {
      accepted: false,
      reason: 'Identificador único do evento (eventId) inválido ou ausente.',
      nextState: currentState,
    };
  }

  if (!event.giftId || typeof event.giftId !== 'string') {
    return {
      accepted: false,
      reason: 'Identificador do presente (giftId) inválido.',
      nextState: currentState,
    };
  }

  if (currentState.processedEventIds.includes(event.eventId)) {
    return {
      accepted: false,
      reason: `Evento duplicado ignorado (${event.eventId}).`,
      nextState: currentState,
    };
  }

  const configuredGift = currentState.gifts.find(
    (g) =>
      g.giftId.toLowerCase() === event.giftId.toLowerCase() ||
      g.name.toLowerCase() === (event.giftName || '').toLowerCase()
  );

  if (!configuredGift) {
    return {
      accepted: false,
      reason: `Presente "${event.giftName || event.giftId}" não encontrado no cadastro.`,
      nextState: currentState,
    };
  }

  if (!configuredGift.active) {
    return {
      accepted: false,
      reason: `O presente "${configuredGift.name}" está inativo na configuração.`,
      nextState: currentState,
    };
  }

  const targetCandidate: CandidateId | 'unassigned' =
    overrideCandidateId || configuredGift.candidateId;

  if (targetCandidate !== 'lula' && targetCandidate !== 'flavio') {
    return {
      accepted: false,
      reason: `O presente "${configuredGift.name}" ainda não está associado a nenhum candidato.`,
      nextState: currentState,
    };
  }

  const repeatCount =
    typeof event.repeatCount === 'number' && event.repeatCount > 0
      ? Math.floor(event.repeatCount)
      : 1;

  const unitCoins =
    typeof event.giftCoinValue === 'number' && event.giftCoinValue > 0
      ? Math.floor(event.giftCoinValue)
      : configuredGift.coinValue;

  if (unitCoins <= 0 || !Number.isFinite(unitCoins)) {
    return {
      accepted: false,
      reason: 'Valor de moedas inválido ou negativo.',
      nextState: currentState,
    };
  }

  let votesAdded = unitCoins * repeatCount;
  if (
    typeof event.totalCoinValue === 'number' &&
    event.totalCoinValue > 0 &&
    Number.isFinite(event.totalCoinValue)
  ) {
    votesAdded = Math.floor(event.totalCoinValue);
  }

  if (votesAdded <= 0) {
    return {
      accepted: false,
      reason: 'Quantidade de votos calculada inválida.',
      nextState: currentState,
    };
  }

  const prevLeader = getLeader(currentState.lulaVotes, currentState.flavioVotes);

  const nextLulaVotes =
    targetCandidate === 'lula' ? currentState.lulaVotes + votesAdded : currentState.lulaVotes;
  const nextFlavioVotes =
    targetCandidate === 'flavio'
      ? currentState.flavioVotes + votesAdded
      : currentState.flavioVotes;

  const newLeader = getLeader(nextLulaVotes, nextFlavioVotes);
  const leadChanged =
    prevLeader !== newLeader && newLeader !== 'tie' && (currentState.lulaVotes > 0 || currentState.flavioVotes > 0);

  const record: VoteRecord = {
    eventId: event.eventId,
    timestamp: event.timestamp || new Date().toISOString(),
    giftId: configuredGift.giftId,
    giftName: configuredGift.name,
    candidateId: targetCandidate,
    votesAdded,
    coinValueUnit: unitCoins,
    repeatCount,
    senderName: event.senderName?.trim() || 'Espectador TikTok',
    origin: event.origin,
    justification: event.justification,
  };

  const nextState: VotingStoreState = {
    ...currentState,
    lulaVotes: nextLulaVotes,
    flavioVotes: nextFlavioVotes,
    history: [record, ...currentState.history].slice(0, MAX_HISTORY_ITEMS),
    processedEventIds: [event.eventId, ...currentState.processedEventIds].slice(
      0,
      MAX_PROCESSED_IDS
    ),
  };

  return {
    accepted: true,
    nextState,
    record,
    giftUsed: configuredGift,
    leadChanged,
    newLeader,
  };
}

export function applyManualVoteCorrection(
  currentState: VotingStoreState,
  candidateId: CandidateId,
  newVoteTotal: number,
  justification: string
): ProcessEventResult {
  if (!justification || justification.trim().length < 3) {
    return {
      accepted: false,
      reason: 'Informe uma justificativa válida para a correção manual.',
      nextState: currentState,
    };
  }

  if (typeof newVoteTotal !== 'number' || newVoteTotal < 0 || !Number.isFinite(newVoteTotal)) {
    return {
      accepted: false,
      reason: 'O novo total de votos não pode ser negativo.',
      nextState: currentState,
    };
  }

  const sanitizedTotal = Math.floor(newVoteTotal);
  const currentCandidateVotes =
    candidateId === 'lula' ? currentState.lulaVotes : currentState.flavioVotes;
  const delta = sanitizedTotal - currentCandidateVotes;

  if (delta === 0) {
    return {
      accepted: false,
      reason: 'O valor informado é idêntico ao placar atual.',
      nextState: currentState,
    };
  }

  const prevLeader = getLeader(currentState.lulaVotes, currentState.flavioVotes);
  const nextLulaVotes = candidateId === 'lula' ? sanitizedTotal : currentState.lulaVotes;
  const nextFlavioVotes = candidateId === 'flavio' ? sanitizedTotal : currentState.flavioVotes;
  const newLeader = getLeader(nextLulaVotes, nextFlavioVotes);
  const leadChanged = prevLeader !== newLeader && newLeader !== 'tie';

  const record: VoteRecord = {
    eventId: `manual_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    giftId: 'manual_adjustment',
    giftName: `Ajuste Manual (${delta > 0 ? '+' : ''}${formatNumberBR(delta)})`,
    candidateId,
    votesAdded: delta,
    coinValueUnit: Math.abs(delta),
    repeatCount: 1,
    senderName: 'Administrador',
    origin: 'manual_adjustment',
    justification: justification.trim(),
  };

  const nextState: VotingStoreState = {
    ...currentState,
    lulaVotes: nextLulaVotes,
    flavioVotes: nextFlavioVotes,
    history: [record, ...currentState.history].slice(0, MAX_HISTORY_ITEMS),
  };

  return {
    accepted: true,
    nextState,
    record,
    leadChanged,
    newLeader,
  };
}

export function setRoundStatus(
  currentState: VotingStoreState,
  newStatus: VotingRoundStatus
): VotingStoreState {
  return {
    ...currentState,
    status: newStatus,
  };
}

export function startNewRound(currentState: VotingStoreState): VotingStoreState {
  return {
    ...currentState,
    roundId: currentState.roundId + 1,
    status: 'running',
    lulaVotes: 0,
    flavioVotes: 0,
    history: [],
    processedEventIds: [],
  };
}

export function clearDemoData(currentState: VotingStoreState): VotingStoreState {
  const liveHistory = currentState.history.filter((h) => h.origin === 'live');
  const lulaLiveVotes = liveHistory
    .filter((h) => h.candidateId === 'lula')
    .reduce((acc, h) => acc + h.votesAdded, 0);
  const flavioLiveVotes = liveHistory
    .filter((h) => h.candidateId === 'flavio')
    .reduce((acc, h) => acc + h.votesAdded, 0);

  return {
    ...currentState,
    lulaVotes: Math.max(0, lulaLiveVotes),
    flavioVotes: Math.max(0, flavioLiveVotes),
    history: liveHistory,
    processedEventIds: liveHistory.map((h) => h.eventId),
  };
}

export function switchOperatingMode(
  currentState: VotingStoreState,
  mode: OperatingMode
): VotingStoreState {
  return {
    ...currentState,
    mode,
  };
}
