import React, { useState } from 'react';
import {
  CandidateConfig,
  CandidateId,
  ConnectionState,
  GiftItem,
  NormalizedGiftEvent,
  OperatingMode,
  VoteRecord,
  VotingRoundStatus,
} from '../types/voting';
import { formatNumberBR } from '../services/votingService';
import { GiftIcon } from './GiftIcon';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Zap,
  Plus,
  Trash2,
  Edit3,
  Radio,
  History,
  Settings,
  Sliders,
  Volume2,
  VolumeX,
  Check,
  X,
  AlertTriangle,
  Wifi,
  WifiOff,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminPanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roundId: number;
  status: VotingRoundStatus;
  mode: OperatingMode;
  connectionState: ConnectionState;
  connectionError?: string;
  websocketUrl: string;
  lulaVotes: number;
  flavioVotes: number;
  candidates: Record<CandidateId, CandidateConfig>;
  gifts: GiftItem[];
  history: VoteRecord[];
  soundEnabled: boolean;
  statusBannerMessage: string | null;
  onToggleSound: () => void;
  onSimulateGift: (event: NormalizedGiftEvent, overrideCandidate?: CandidateId) => void;
  onSimulateSequence: () => void;
  onQuickExampleVotes: () => void;
  onClearDemoData: () => void;
  onSwitchMode: (mode: OperatingMode) => void;
  onConnectWebSocket: (url: string) => void;
  onDisconnectWebSocket: () => void;
  onChangeRoundStatus: (status: VotingRoundStatus) => void;
  onStartNewRound: () => void;
  onManualCorrection: (candidateId: CandidateId, newTotal: number, justification: string) => void;
  onSaveGift: (gift: GiftItem, isNew: boolean) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateCandidateAvatar: (candidateId: CandidateId, avatarUrl: string) => void;
}

type AdminTab = 'simulator' | 'controls' | 'gifts' | 'integration' | 'history';

const ICON_OPTIONS: { value: GiftItem['iconType']; label: string }[] = [
  { value: 'rose', label: 'Rosa' },
  { value: 'finger_heart', label: 'Coração de Dedo' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'cap', label: 'Boné Azul' },
  { value: 'doughnut', label: 'Rosquinha' },
  { value: 'confetti', label: 'Confete' },
  { value: 'crown', label: 'Coroa Real' },
  { value: 'galaxy', label: 'Galáxia' },
  { value: 'lion', label: 'Leão Imperial' },
  { value: 'custom', label: 'Imagem Personalizada' },
];

export const AdminPanelDrawer: React.FC<AdminPanelDrawerProps> = ({
  isOpen,
  onClose,
  roundId,
  status,
  mode,
  connectionState,
  connectionError,
  websocketUrl,
  lulaVotes,
  flavioVotes,
  candidates,
  gifts,
  history,
  soundEnabled,
  statusBannerMessage,
  onToggleSound,
  onSimulateGift,
  onSimulateSequence,
  onQuickExampleVotes,
  onClearDemoData,
  onSwitchMode,
  onConnectWebSocket,
  onDisconnectWebSocket,
  onChangeRoundStatus,
  onStartNewRound,
  onManualCorrection,
  onSaveGift,
  onDeleteGift,
  onUpdateCandidateAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('simulator');

  // Simulator state
  const [selectedGiftId, setSelectedGiftId] = useState<string>(gifts[0]?.giftId || '');
  const [simRepeatCount, setSimRepeatCount] = useState<number>(1);
  const [simSenderName, setSimSenderName] = useState<string>('Espectador_Teste');
  const [overrideCandidate, setOverrideCandidate] = useState<CandidateId | 'respect_config'>(
    'respect_config'
  );

  // Confirmations
  const [confirmClearDemo, setConfirmClearDemo] = useState(false);
  const [confirmNewRound, setConfirmNewRound] = useState(false);
  const [confirmEndRound, setConfirmEndRound] = useState(false);

  // Manual Correction state
  const [corrCandidate, setCorrCandidate] = useState<CandidateId>('lula');
  const [corrNewTotal, setCorrNewTotal] = useState<string>(String(lulaVotes));
  const [corrJustification, setCorrJustification] = useState<string>('');
  const [confirmCorrection, setConfirmCorrection] = useState(false);

  // Gift CRUD state
  const [editingGiftId, setEditingGiftId] = useState<string | null>(null);
  const [giftForm, setGiftForm] = useState<GiftItem>({
    giftId: '',
    name: '',
    iconType: 'rose',
    customImageUrl: '',
    coinValue: 1,
    candidateId: 'lula',
    active: true,
  });

  // WebSocket URL input
  const [wsUrlInput, setWsUrlInput] = useState<string>(websocketUrl);

  // Candidate portrait customization
  const [lulaAvatarInput, setLulaAvatarInput] = useState<string>(candidates.lula.avatarUrl);
  const [flavioAvatarInput, setFlavioAvatarInput] = useState<string>(candidates.flavio.avatarUrl);

  // History filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'demo' | 'live' | 'manual_adjustment'>(
    'all'
  );

  if (!isOpen) return null;

  const selectedGift = gifts.find((g) => g.giftId === selectedGiftId) || gifts[0];

  const handleTriggerSingleSim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;
    const targetCand =
      overrideCandidate === 'respect_config'
        ? selectedGift.candidateId === 'unassigned'
          ? undefined
          : selectedGift.candidateId
        : overrideCandidate;

    const event: NormalizedGiftEvent = {
      eventId: `demo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      giftId: selectedGift.giftId,
      giftName: selectedGift.name,
      giftCoinValue: selectedGift.coinValue,
      repeatCount: Math.max(1, Math.floor(simRepeatCount)),
      totalCoinValue: selectedGift.coinValue * Math.max(1, Math.floor(simRepeatCount)),
      senderName: simSenderName.trim() || 'Espectador_Teste',
      timestamp: new Date().toISOString(),
      origin: 'demo',
    };

    onSimulateGift(event, targetCand);
  };

  const startEditGift = (gift: GiftItem) => {
    setEditingGiftId(gift.giftId);
    setGiftForm({ ...gift });
  };

  const startCreateGift = () => {
    setEditingGiftId('__NEW__');
    setGiftForm({
      giftId: `gift_${Date.now().toString(36)}`,
      name: '',
      iconType: 'rose',
      customImageUrl: '',
      coinValue: 10,
      candidateId: 'lula',
      active: true,
    });
  };

  const handleGiftFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftForm.giftId.trim() || !giftForm.name.trim() || giftForm.coinValue <= 0) return;
    onSaveGift(
      {
        ...giftForm,
        giftId: giftForm.giftId.trim(),
        name: giftForm.name.trim(),
        coinValue: Math.max(1, Math.floor(Number(giftForm.coinValue))),
        customImageUrl: giftForm.customImageUrl?.trim() || undefined,
      },
      editingGiftId === '__NEW__'
    );
    setEditingGiftId(null);
  };

  const filteredHistory = history.filter((item) =>
    historyFilter === 'all' ? true : item.origin === historyFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-3xl flex-col border-l border-white/15 bg-[#0f081d] text-slate-100 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#160b2b]">
          <div>
            <h2 className="font-display text-lg font-bold tracking-wide text-white uppercase">
              Painel Administrativo · Controle de Transmissão
            </h2>
            <p className="text-xs text-slate-400">
              Este painel fica oculto na captura principal da Live quando fechado (Atalho: Tecla A)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSound}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{soundEnabled ? 'Som Ativo' : 'Mudo'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <X className="w-4 h-4" />
              <span>Fechar Painel</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-white/10 bg-[#120924] px-6 py-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'simulator'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Modo de Teste (Simulador)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('controls')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'controls'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Controles da Rodada & Retratos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gifts')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'gifts'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cadastro de Presentes ({gifts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('integration')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'integration'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Integração TikTok LIVE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico ({history.length})</span>
          </button>
        </div>

        {/* Feedback Alert Banner */}
        {statusBannerMessage && (
          <div className="bg-amber-500/15 border-b border-amber-400/30 px-6 py-2.5 text-xs font-medium text-amber-200 flex items-center justify-between">
            <span>{statusBannerMessage}</span>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MODO DE TESTE (SIMULADOR) */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              {/* Mode Switch Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <div className="text-sm font-bold text-white">
                    Modo de Operação Atual:{' '}
                    <span className={mode === 'demo' ? 'text-amber-300' : 'text-emerald-400'}>
                      {mode === 'demo' ? 'MODO DE DEMONSTRAÇÃO (TESTE)' : 'MODO CONECTADO (LIVE REAL)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Eventos simulados são identificados como teste e nunca se misturam silenciosamente com eventos reais.
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => onSwitchMode('demo')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mode === 'demo'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Modo Demonstração
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchMode('live')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      mode === 'live'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Modo Conectado (Live)
                  </button>
                </div>
              </div>

              {/* Botões de Teste Rápido e Sequência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-purple-500/30 bg-purple-950/25 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Teste Rápido de Placar</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Gera votos de exemplo imediatamente para verificar placares, barra comparativa e som da urna.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={mode === 'live' || status !== 'running'}
                    onClick={onQuickExampleVotes}
                    className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Gerar Votos de Exemplo Agora
                  </button>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Simular Sequência de Presentes</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Dispara uma bateria de 6 presentes seguidos para testar a fila de animações sem travar a votação.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={mode === 'live' || status !== 'running'}
                    onClick={onSimulateSequence}
                    className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Simular Sequência em Fila (6 Eventos)
                  </button>
                </div>
              </div>

              {/* Formulário de Simulação Individual */}
              <form
                onSubmit={handleTriggerSingleSim}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Simular Envio de Presente Específico
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Selecionar Presente Cadastrado
                    </label>
                    <select
                      value={selectedGift?.giftId || ''}
                      onChange={(e) => setSelectedGiftId(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      {gifts.map((g) => (
                        <option key={g.giftId} value={g.giftId}>
                          {g.name} — {formatNumberBR(g.coinValue)}{' '}
                          {g.coinValue === 1 ? 'moeda' : 'moedas'} (
                          {g.candidateId === 'lula'
                            ? 'Lula'
                            : g.candidateId === 'flavio'
                            ? 'Flávio Bolsonaro'
                            : 'Sem candidato'}
                          )
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Candidato Beneficiado
                    </label>
                    <select
                      value={overrideCandidate}
                      onChange={(e) =>
                        setOverrideCandidate(e.target.value as CandidateId | 'respect_config')
                      }
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      <option value="respect_config">
                        Respeitar configuração do presente (
                        {selectedGift?.candidateId === 'lula'
                          ? 'Lula'
                          : selectedGift?.candidateId === 'flavio'
                          ? 'Flávio Bolsonaro'
                          : 'Não definido'}
                        )
                      </option>
                      <option value="lula">Forçar voto para LULA</option>
                      <option value="flavio">Forçar voto para FLÁVIO BOLSONARO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Quantidade de Unidades (Combo)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={simRepeatCount}
                      onChange={(e) => setSimRepeatCount(Number(e.target.value))}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nome do Remetente (Teste)
                    </label>
                    <input
                      type="text"
                      value={simSenderName}
                      onChange={(e) => setSimSenderName(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                {selectedGift && (
                  <div className="flex items-center justify-between rounded-lg bg-slate-900/90 border border-white/10 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <GiftIcon
                        iconType={selectedGift.iconType}
                        customImageUrl={selectedGift.customImageUrl}
                        name={selectedGift.name}
                        size="sm"
                      />
                      <div className="text-xs text-slate-300">
                        <div>
                          Presente: <strong className="text-white">{selectedGift.name}</strong> (
                          {formatNumberBR(selectedGift.coinValue)} moedas/un.)
                        </div>
                        <div>
                          Total a adicionar:{' '}
                          <strong className="text-amber-300 font-mono-tabular">
                            +{formatNumberBR(selectedGift.coinValue * Math.max(1, simRepeatCount))}{' '}
                            votos
                          </strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={mode === 'live' || status !== 'running'}
                      className="rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Adicionar Votos de Teste
                    </button>
                  </div>
                )}
              </form>

              {/* Limpar Dados de Teste Mediante Confirmação */}
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Limpar Dados de Teste</h4>
                  <p className="text-xs text-slate-300">
                    Remove todos os votos e eventos gerados em modo de demonstração, preservando votos reais caso existam.
                  </p>
                </div>

                {!confirmClearDemo ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClearDemo(true)}
                    className="rounded-lg border border-red-400/50 bg-red-900/40 px-4 py-2 text-xs font-bold text-red-200 hover:bg-red-800/60 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Limpar Votos de Teste
                  </button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClearDemoData();
                        setConfirmClearDemo(false);
                      }}
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer whitespace-nowrap"
                    >
                      Confirmar Limpeza
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearDemo(false)}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONTROLES DE TRANSMISSÃO & CORREÇÃO MANUAL */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              {/* Estado da Rodada */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Controle da Rodada #{roundId}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pausar impede novos votos. Encerrar trava o resultado final até que uma nova rodada seja iniciada.
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-bold uppercase px-2.5 py-1 rounded bg-white/10 text-white">
                    {status === 'running'
                      ? 'EM ANDAMENTO'
                      : status === 'paused'
                      ? 'PAUSADA'
                      : 'ENCERRADA'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {status !== 'running' && status !== 'ended' && (
                    <button
                      type="button"
                      onClick={() => onChangeRoundStatus('running')}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>Retomar Votação</span>
                    </button>
                  )}

                  {status === 'running' && (
                    <button
                      type="button"
                      onClick={() => onChangeRoundStatus('paused')}
                      className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pausar Votação</span>
                    </button>
                  )}

                  {status !== 'ended' && (
                    <>
                      {!confirmEndRound ? (
                        <button
                          type="button"
                          onClick={() => setConfirmEndRound(true)}
                          className="flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
                        >
                          <Square className="w-4 h-4" />
                          <span>Encerrar Votação</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onChangeRoundStatus('ended');
                              setConfirmEndRound(false);
                            }}
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white cursor-pointer"
                          >
                            Confirmar Encerramento
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmEndRound(false)}
                            className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {!confirmNewRound ? (
                    <button
                      type="button"
                      onClick={() => setConfirmNewRound(true)}
                      className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reiniciar Nova Rodada (Zerar Placar)</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onStartNewRound();
                          setConfirmNewRound(false);
                        }}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white cursor-pointer"
                      >
                        Confirmar Reinício Total
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmNewRound(false)}
                        className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Correção Manual de Votos com Justificativa */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Correção Manual de Placar (Auditada)
                </h3>
                <p className="text-xs text-slate-400">
                  Qualquer ajuste manual exige justificativa e confirmação, ficando registrado no histórico da rodada.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Candidato
                    </label>
                    <select
                      value={corrCandidate}
                      onChange={(e) => {
                        const c = e.target.value as CandidateId;
                        setCorrCandidate(c);
                        setCorrNewTotal(String(c === 'lula' ? lulaVotes : flavioVotes));
                      }}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"
                    >
                      <option value="lula">LULA (Atual: {formatNumberBR(lulaVotes)})</option>
                      <option value="flavio">
                        FLÁVIO BOLSONARO (Atual: {formatNumberBR(flavioVotes)})
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Novo Total de Votos
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={corrNewTotal}
                      onChange={(e) => setCorrNewTotal(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white font-mono-tabular"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Justificativa Obrigatória
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Correção de falha de rede durante combo de presentes"
                      value={corrJustification}
                      onChange={(e) => setCorrJustification(e.target.value)}
                      className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                {!confirmCorrection ? (
                  <button
                    type="button"
                    onClick={() => setConfirmCorrection(true)}
                    disabled={!corrJustification.trim()}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-40 cursor-pointer"
                  >
                    Aplicar Correção Manual
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onManualCorrection(
                          corrCandidate,
                          Number(corrNewTotal),
                          corrJustification
                        );
                        setConfirmCorrection(false);
                        setCorrJustification('');
                      }}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                    >
                      Confirmar Alteração de Votos
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCorrection(false)}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Substituição Configurável das Fotos dos Candidatos */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Retratos Configuráveis dos Candidatos
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Permite substituir a URL da imagem de cada candidato a qualquer momento sem alterar o código-fonte.
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={lulaAvatarInput}
                      onChange={(e) => setLulaAvatarInput(e.target.value)}
                      placeholder="URL da foto de Lula"
                      className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateCandidateAvatar('lula', lulaAvatarInput.trim())}
                      className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Atualizar Foto Lula
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={flavioAvatarInput}
                      onChange={(e) => setFlavioAvatarInput(e.target.value)}
                      placeholder="URL da foto de Flávio Bolsonaro"
                      className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateCandidateAvatar('flavio', flavioAvatarInput.trim())}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Atualizar Foto Flávio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CADASTRO CONFIGURÁVEL DE PRESENTES */}
          {activeTab === 'gifts' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Catálogo de Presentes Configurável
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adicione, edite ou remova presentes, seu valor em moedas (1 moeda = 1 voto) e o candidato associado.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startCreateGift}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Presente</span>
                </button>
              </div>

              {editingGiftId && (
                <form
                  onSubmit={handleGiftFormSubmit}
                  className="rounded-xl border border-purple-400/40 bg-purple-950/30 p-4 space-y-4"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                    {editingGiftId === '__NEW__' ? 'Cadastrar Novo Presente' : 'Editar Presente'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        ID Único do Presente (giftId)
                      </label>
                      <input
                        type="text"
                        required
                        value={giftForm.giftId}
                        disabled={editingGiftId !== '__NEW__'}
                        onChange={(e) => setGiftForm({ ...giftForm, giftId: e.target.value })}
                        placeholder="Ex: Rose ou 5655"
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Nome do Presente</label>
                      <input
                        type="text"
                        required
                        value={giftForm.name}
                        onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })}
                        placeholder="Ex: Rosa"
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Valor em Moedas (1 Moeda = 1 Voto)
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={giftForm.coinValue}
                        onChange={(e) =>
                          setGiftForm({ ...giftForm, coinValue: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white font-mono-tabular"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Candidato Beneficiado
                      </label>
                      <select
                        value={giftForm.candidateId}
                        onChange={(e) =>
                          setGiftForm({
                            ...giftForm,
                            candidateId: e.target.value as CandidateId | 'unassigned',
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                      >
                        <option value="lula">LULA (Esquerda · Vermelho)</option>
                        <option value="flavio">FLÁVIO BOLSONARO (Direita · Azul)</option>
                        <option value="unassigned">Não Associado (Aguardando definição)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Ícone Placeholder</label>
                      <select
                        value={giftForm.iconType}
                        onChange={(e) =>
                          setGiftForm({
                            ...giftForm,
                            iconType: e.target.value as GiftItem['iconType'],
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        URL de Imagem Personalizada (Opcional)
                      </label>
                      <input
                        type="text"
                        value={giftForm.customImageUrl || ''}
                        onChange={(e) =>
                          setGiftForm({ ...giftForm, customImageUrl: e.target.value })
                        }
                        placeholder="https://.../presente.png"
                        className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={giftForm.active}
                        onChange={(e) => setGiftForm({ ...giftForm, active: e.target.checked })}
                      />
                      <span>Presente Ativo para contabilização</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingGiftId(null)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar Presente</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Tabela de Presentes */}
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Presente</th>
                      <th className="py-2.5 px-3">ID</th>
                      <th className="py-2.5 px-3 text-right">Moedas / Votos</th>
                      <th className="py-2.5 px-3">Candidato</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-xs">
                    {gifts.map((g) => (
                      <tr key={g.giftId} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <GiftIcon
                              iconType={g.iconType}
                              customImageUrl={g.customImageUrl}
                              name={g.name}
                              size="sm"
                            />
                            <span className="font-semibold text-white">{g.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono-tabular text-slate-400">{g.giftId}</td>
                        <td className="py-2.5 px-3 text-right font-mono-tabular font-bold text-amber-300">
                          {formatNumberBR(g.coinValue)}
                        </td>
                        <td className="py-2.5 px-3">
                          {g.candidateId === 'lula' && (
                            <span className="text-red-400 font-bold">LULA</span>
                          )}
                          {g.candidateId === 'flavio' && (
                            <span className="text-blue-400 font-bold">FLÁVIO BOLSONARO</span>
                          )}
                          {g.candidateId === 'unassigned' && (
                            <span className="text-slate-400">Não associado</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={g.active ? 'text-emerald-400' : 'text-slate-500'}>
                            {g.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEditGift(g)}
                              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteGift(g.giftId)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: INTEGRAÇÃO TIKTOK LIVE */}
          {activeTab === 'integration' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {connectionState === 'connected' && (
                      <Wifi className="w-5 h-5 text-emerald-400" />
                    )}
                    {connectionState === 'connecting' && (
                      <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                    )}
                    {(connectionState === 'disconnected' || connectionState === 'error') && (
                      <WifiOff className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Estado Real da Conexão WebSocket
                      </h3>
                      <p className="text-xs text-slate-400">
                        Status honesto: apenas exibe Conectado quando um servidor externo responde ao handshake WebSocket.
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-mono-tabular text-xs font-bold uppercase px-3 py-1 rounded ${
                      connectionState === 'connected'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : connectionState === 'connecting'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : connectionState === 'error'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {connectionState === 'connected'
                      ? 'CONECTADO'
                      : connectionState === 'connecting'
                      ? 'CONECTANDO...'
                      : connectionState === 'error'
                      ? 'ERRO DE CONEXÃO'
                      : 'DESCONECTADO'}
                  </span>
                </div>

                {connectionError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{connectionError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Endpoint WebSocket do Conector Externo (ex: TikFinity ou Bridge Node.js)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={wsUrlInput}
                      onChange={(e) => setWsUrlInput(e.target.value)}
                      placeholder="ws://localhost:21213/"
                      className="flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white font-mono-tabular"
                    />
                    {connectionState === 'connected' || connectionState === 'connecting' ? (
                      <button
                        type="button"
                        onClick={onDisconnectWebSocket}
                        className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Desconectar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onConnectWebSocket(wsUrlInput)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Conectar ao Serviço
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Documentação Técnica Clara do Formato Esperado */}
              <div className="rounded-xl border border-white/10 bg-slate-950 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Documentação Técnica para Integração Real com TikTok LIVE
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Como navegadores web não possuem acesso direto aos pacotes internos do TikTok LIVE, utilize um serviço conector local como{' '}
                  <strong className="text-white">TikFinity (WebSocket Action)</strong> ou um script Node.js com{' '}
                  <strong className="text-white">tiktok-live-connector</strong> transmitindo eventos JSON para a porta configurada acima.
                </p>
                <div className="text-xs text-slate-400">
                  Formato JSON normalizado aceito pelo adaptador (qualquer um dos envelopes abaixo):
                </div>
                <pre className="overflow-x-auto rounded-lg bg-black/70 border border-white/10 p-3 text-[11px] font-mono-tabular text-emerald-300">
{`{
  "event": "gift",
  "data": {
    "eventId": "msg_987654321",
    "giftId": "gift_rose_1",
    "giftName": "Rosa",
    "giftCoinValue": 1,
    "repeatCount": 5,
    "totalCoinValue": 5,
    "senderName": "@usuario_tiktok"
  }
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: HISTÓRICO E AUDITORIA */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Histórico Auditável de Eventos ({filteredHistory.length})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Todos os votos são persistidos localmente para evitar perda caso a página seja recarregada.
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-lg bg-slate-900 p-1 border border-white/10 text-xs">
                  {(['all', 'demo', 'live', 'manual_adjustment'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setHistoryFilter(f)}
                      className={`px-2.5 py-1 rounded font-medium cursor-pointer whitespace-nowrap ${
                        historyFilter === f
                          ? 'bg-purple-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f === 'all'
                        ? 'Todos'
                        : f === 'demo'
                        ? 'Testes'
                        : f === 'live'
                        ? 'Live Real'
                        : 'Ajustes'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-xs text-slate-400">
                  Nenhum evento registrado para o filtro selecionado nesta rodada.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/10">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.04] text-[11px] uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Horário</th>
                        <th className="py-2.5 px-3">Origem</th>
                        <th className="py-2.5 px-3">Presente / Remetente</th>
                        <th className="py-2.5 px-3">Candidato</th>
                        <th className="py-2.5 px-3 text-right">Votos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-xs">
                      {filteredHistory.map((item) => (
                        <tr key={item.eventId} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono-tabular text-slate-400 whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleTimeString('pt-BR')}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {item.origin === 'demo' && (
                              <span className="text-amber-300 font-semibold">Demonstração</span>
                            )}
                            {item.origin === 'live' && (
                              <span className="text-emerald-400 font-semibold">Live Real</span>
                            )}
                            {item.origin === 'manual_adjustment' && (
                              <span className="text-purple-300 font-semibold">Ajuste Manual</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-white">{item.giftName}</div>
                            <div className="text-[11px] text-slate-400">
                              Por {item.senderName} · ID: {item.eventId.slice(0, 14)}
                              {item.justification ? ` · Motivo: "${item.justification}"` : ''}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`font-bold ${
                                item.candidateId === 'lula' ? 'text-red-400' : 'text-blue-400'
                              }`}
                            >
                              {item.candidateId === 'lula' ? 'LULA' : 'FLÁVIO BOLSONARO'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-tabular font-bold text-white">
                            {item.votesAdded > 0 ? `+${formatNumberBR(item.votesAdded)}` : formatNumberBR(item.votesAdded)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
