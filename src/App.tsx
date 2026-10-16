import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimationQueueItem,
  CandidateId,
  GiftItem,
  NormalizedGiftEvent,
  VotingStoreState,
} from './types/voting';
import {
  getLeader,
  loadVotingState,
  processGiftEvent,
  saveVotingState,
} from './services/votingService';
import { soundFX } from './services/soundService';
import { CandidateCard } from './components/CandidateCard';
import { UrnaCenterpiece } from './components/UrnaCenterpiece';
import { RotateCcw } from 'lucide-react';
import votosStickersColumnImg from './assets/images/votos_stickers_column_transparent.png';
import votosFlavioColumnImg from './assets/images/votos_flavio_column_transparent.png';

export default function App() {
  const [store, setStore] = useState<VotingStoreState>(() => loadVotingState());
  const [activeAnimation, setActiveAnimation] = useState<AnimationQueueItem | null>(null);
  const [highlightedCandidate, setHighlightedCandidate] = useState<CandidateId | null>(null);

  const storeRef = useRef<VotingStoreState>(store);
  storeRef.current = store;
  const highlightTimerRef = useRef<number | null>(null);

  useEffect(() => {
    saveVotingState(store);
  }, [store]);

  const handleGiftSelect = useCallback((gift: GiftItem) => {
    if (gift.candidateId !== 'lula' && gift.candidateId !== 'flavio') return;

    const currentState: VotingStoreState = {
      ...storeRef.current,
      status: 'running',
      mode: 'demo',
    };

    const event: NormalizedGiftEvent = {
      eventId: `vote_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      giftId: gift.giftId,
      giftName: gift.name,
      giftCoinValue: gift.coinValue,
      repeatCount: 1,
      totalCoinValue: gift.coinValue,
      senderName: 'Espectador',
      timestamp: new Date().toISOString(),
      origin: 'demo',
    };

    const result = processGiftEvent(currentState, event, gift.candidateId);
    if (!result.accepted) return;

    setStore(result.nextState);

    if (result.record && result.giftUsed) {
      const animItem: AnimationQueueItem = {
        id: `${result.record.eventId}_${Date.now()}`,
        eventId: result.record.eventId,
        giftName: result.record.giftName,
        iconType: result.giftUsed.iconType,
        customImageUrl: result.giftUsed.customImageUrl,
        candidateId: result.record.candidateId,
        votesAdded: result.record.votesAdded,
        senderName: result.record.senderName,
        origin: result.record.origin,
        timestamp: Date.now(),
      };

      setActiveAnimation(animItem);
      setHighlightedCandidate(result.record.candidateId);
      soundFX.playUrnaChime(result.record.votesAdded >= 50);

      if (highlightTimerRef.current !== null) {
        clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = window.setTimeout(() => {
        setHighlightedCandidate(null);
      }, 900);
    }
  }, []);

  const handleQuickVoteCandidate = useCallback(
    (candidateId: CandidateId) => {
      const gift = storeRef.current.gifts.find(
        (g) => g.active && g.candidateId === candidateId
      );
      if (gift) {
        handleGiftSelect(gift);
      }
    },
    [handleGiftSelect]
  );

  const handleResetScoreboard = useCallback(() => {
    setActiveAnimation(null);
    setHighlightedCandidate(null);
    setStore((prev) => ({
      ...prev,
      lulaVotes: 0,
      flavioVotes: 0,
      history: [],
      processedEventIds: [],
    }));
  }, []);

  const totalVotes = store.lulaVotes + store.flavioVotes;
  const leader = getLeader(store.lulaVotes, store.flavioVotes);

  return (
    <div className="relative h-screen max-h-screen w-full bg-[#0b0616] text-white flex items-center justify-center overflow-hidden select-none">
      {/* Iluminação de Disputa ao Fundo */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-45"
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 35%, rgba(220, 38, 38, 0.35) 0%, transparent 45%),
            radial-gradient(circle at 70% 35%, rgba(22, 163, 74, 0.35) 0%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(126, 34, 206, 0.22) 0%, transparent 60%)
          `,
        }}
      />

      {/* Layout Principal com Faixa Lateral Esquerda e Faixa Lateral Direita Livres */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* DOIS LETREIROS PEGANDO DE CANTO A CANTO DA TELA, LOGO ACIMA DO TÍTULO DUELO 2026 */}
        <div className="w-screen flex flex-col mb-1.5 shrink-0 z-30">
          {/* 1º Letreiro: Um pouco maior e mais chamativo — "JOGO INTERATIVO" */}
          <div className="w-full overflow-hidden border-y border-amber-400/50 bg-gradient-to-r from-red-950/95 via-purple-950/95 to-emerald-950/95 py-1 shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
            <div className="animate-marquee-primary items-center">
              {[0, 1].map((groupIndex) => (
                <div key={groupIndex} className="flex items-center shrink-0">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((itemIndex) => (
                    <span
                      key={itemIndex}
                      className="mx-8 font-display text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
                    >
                      JOGO INTERATIVO
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 2º Letreiro: Letra menor, leitura devagar — "Não é pesquisa eleitoral nem resultado oficial." */}
          <div className="w-full overflow-hidden border-b border-white/15 bg-black/75 py-0.5">
            <div className="animate-marquee-disclaimer items-center">
              {[0, 1].map((groupIndex) => (
                <div key={groupIndex} className="flex items-center shrink-0">
                  {[0, 1, 2, 3, 4, 5].map((itemIndex) => (
                    <span
                      key={itemIndex}
                      className="mx-8 font-sans text-[9px] sm:text-[10px] font-medium tracking-wide text-slate-200"
                    >
                      Não é pesquisa eleitoral nem resultado oficial.
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Central com Faixas Laterais Livres para as duas colunas de votos */}
        <div className="relative w-full flex-1 flex items-center justify-center px-8 sm:px-12 md:px-4">
          <main className="w-full max-w-[440px] flex flex-col items-stretch justify-center gap-1.5">
            {/* BLOCO SUPERIOR: TÍTULO DUELO 2026 + CANDIDATOS + LINHA EMPATADO */}
            <div className="relative w-full flex flex-col items-stretch gap-1.5">
              {/* Coluna de Votos Esquerda (Lula - Vermelho): palavra Votos um pouco para cima, figurinhas fora da imagem do candidato e apenas as moedas sobrepondo */}
              <div className="pointer-events-none absolute left-0 -top-4 sm:-top-5 bottom-1 z-30 select-none flex items-start -translate-x-[53%]">
                <img
                  src={votosStickersColumnImg}
                  alt="Painel de Votos e Presentes TikTok - Lula"
                  referrerPolicy="no-referrer"
                  className="h-[92%] sm:h-[94%] max-h-[310px] sm:max-h-[330px] w-auto object-contain object-top drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] filter"
                />
              </div>

              {/* Coluna de Votos Direita (Flávio - Verde): mesma proporção, palavra Votos um pouco para cima, figurinhas fora da imagem à direita e apenas as moedas sobrepondo */}
              <div className="pointer-events-none absolute right-0 -top-4 sm:-top-5 bottom-1 z-30 select-none flex items-start translate-x-[45%]">
                <img
                  src={votosFlavioColumnImg}
                  alt="Painel de Votos e Presentes TikTok - Flávio Bolsonaro"
                  referrerPolicy="no-referrer"
                  className="h-[92%] sm:h-[94%] max-h-[310px] sm:max-h-[330px] w-auto object-contain object-top drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] filter"
                />
              </div>

              {/* TÍTULO ESTILO ADESIVO 3D: "Duelo 2026" com bordas vermelhas (esquerda) e verdes (direita) */}
              <div className="w-full flex justify-center -mb-1 z-20 shrink-0">
                <svg
              viewBox="0 0 420 96"
              className="w-full max-w-[360px] h-auto overflow-visible drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
            >
              <defs>
                {/* Borda externa dividida: Vermelho na esquerda (Lula) e Verde na direita (Flávio) */}
                <linearGradient id="borderRedGreenOuter" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="48%" stopColor="#dc2626" />
                  <stop offset="52%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>

                {/* Borda interna escura dividida para profundidade 3D do adesivo */}
                <linearGradient id="borderRedGreenDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7f1d1d" />
                  <stop offset="48%" stopColor="#991b1b" />
                  <stop offset="52%" stopColor="#14532d" />
                  <stop offset="100%" stopColor="#166534" />
                </linearGradient>

                {/* Preenchimento Dourado/Amarelo 3D igual à escrita "Votos" da imagem */}
                <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="22%" stopColor="#fde047" />
                  <stop offset="65%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {/* Estrelinha Esquerda com Borda Vermelha */}
              <g transform="translate(132, 8)">
                <path
                  d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z"
                  fill="url(#goldTextGrad)"
                  stroke="#dc2626"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z"
                  fill="url(#goldTextGrad)"
                />
              </g>

              {/* Estrelinha Direita com Borda Verde */}
              <g transform="translate(264, 8)">
                <path
                  d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z"
                  fill="url(#goldTextGrad)"
                  stroke="#16a34a"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z"
                  fill="url(#goldTextGrad)"
                />
              </g>

              {/* Coroa Dourada no Topo Central com Borda Vermelha/Verde */}
              <g transform="translate(182, 2)">
                <path
                  d="M8 32 L4 12 L18 21 L28 6 L38 21 L52 12 L48 32 Z"
                  fill="url(#goldTextGrad)"
                  stroke="url(#borderRedGreenOuter)"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 32 L4 12 L18 21 L28 6 L38 21 L52 12 L48 32 Z"
                  fill="url(#goldTextGrad)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="4" cy="10" r="2.8" fill="#fef08a" stroke="#dc2626" strokeWidth="1.5" />
                <circle cx="28" cy="5" r="3.2" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
                <circle cx="52" cy="10" r="2.8" fill="#fef08a" stroke="#16a34a" strokeWidth="1.5" />
                {/* Joias da coroa */}
                <circle cx="19" cy="26" r="2.2" fill="#ef4444" />
                <circle cx="28" cy="25" r="2.5" fill="#ffffff" />
                <circle cx="37" cy="26" r="2.2" fill="#22c55e" />
              </g>

              {/* Escrita Principal "Duelo 2026" em arco suave estilo sticker */}
              <g transform="translate(210, 74)">
                {/* Camada 1: Borda Externa Grossa Vermelha (Esquerda) e Verde (Direita) */}
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill="none"
                  stroke="url(#borderRedGreenOuter)"
                  strokeWidth="16"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="font-display font-black tracking-tight"
                  fontSize="46"
                >
                  Duelo 2026
                </text>

                {/* Camada 2: Sombra 3D Inferior Vermelho-Escuro / Verde-Escuro */}
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="none"
                  stroke="url(#borderRedGreenDark)"
                  strokeWidth="10"
                  strokeLinejoin="round"
                  className="font-display font-black tracking-tight"
                  fontSize="46"
                >
                  Duelo 2026
                </text>

                {/* Camada 3: Contorno Marrom-Dourado de Transição */}
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  className="font-display font-black tracking-tight"
                  fontSize="46"
                >
                  Duelo 2026
                </text>

                {/* Camada 4: Preenchimento Dourado Brilhante */}
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  fill="url(#goldTextGrad)"
                  className="font-display font-black tracking-tight"
                  fontSize="46"
                >
                  Duelo 2026
                </text>
              </g>
            </svg>
          </div>

          {/* LINHA 1: Os dois candidatos encostados um no outro com o "X" destacado bem no centro */}
          <div className="relative grid grid-cols-2 gap-0 items-stretch w-full">
            {/* Esquerda: Figura Lula */}
            <div className="w-full">
              <CandidateCard
                candidate={store.candidates.lula}
                side="left"
                votes={store.lulaVotes}
                isHighlighted={highlightedCandidate === 'lula'}
                onClickVote={() => handleQuickVoteCandidate('lula')}
              />
            </div>

            {/* Direita: Figura Flávio Bolsonaro */}
            <div className="w-full">
              <CandidateCard
                candidate={store.candidates.flavio}
                side="right"
                votes={store.flavioVotes}
                isHighlighted={highlightedCandidate === 'flavio'}
                onClickVote={() => handleQuickVoteCandidate('flavio')}
              />
            </div>

            {/* "X" de Disputa Sobreposto e Destacado no Meio dos Dois Candidatos */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]">
                <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="xSplitRedGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="49.8%" stopColor="#dc2626" />
                      <stop offset="50.2%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <filter id="xGlow" x="-25%" y="-25%" width="150%" height="150%">
                      <feDropShadow
                        dx="0"
                        dy="4"
                        stdDeviation="6"
                        floodColor="#000000"
                        floodOpacity="0.95"
                      />
                    </filter>
                  </defs>

                  <path
                    d="M20 14 L42 14 L60 42 L78 14 L100 14 L73 60 L100 106 L78 106 L60 78 L42 106 L20 106 L47 60 Z"
                    fill="url(#xSplitRedGreen)"
                    stroke="#ffffff"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    filter="url(#xGlow)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* LINHA 2: Linha de Liderança (Mesma largura dos dois candidatos e da urna) */}
          <div className="w-full shrink-0">
            <div
              className={`w-full rounded-lg border py-1.5 px-4 text-center font-display text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                leader === 'lula'
                  ? 'border-red-500/75 bg-gradient-to-r from-red-950/90 via-red-900/85 to-red-950/90 text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.45)]'
                  : leader === 'flavio'
                  ? 'border-emerald-500/75 bg-gradient-to-r from-emerald-950/90 via-emerald-900/85 to-emerald-950/90 text-emerald-100 shadow-[0_0_22px_rgba(34,197,94,0.45)]'
                  : 'border-slate-500/60 bg-gradient-to-r from-slate-800/90 via-slate-700/85 to-slate-800/90 text-slate-200 shadow-[0_0_16px_rgba(148,163,184,0.25)]'
              }`}
            >
              {leader === 'lula'
                ? 'Lula Ganhando'
                : leader === 'flavio'
                ? 'Flávio Ganhando'
                : 'Empatado!'}
            </div>
          </div>
        </div>

        {/* LINHA 3: Urna Eletrônica com exatamente a mesma largura dos cantos externos das imagens dos candidatos */}
          <div className="w-full shrink-0">
            <UrnaCenterpiece
              totalVotes={totalVotes}
              candidates={store.candidates}
              activeAnimation={activeAnimation}
              onResetVotes={handleResetScoreboard}
              onQuickVoteCandidate={handleQuickVoteCandidate}
            />
          </div>

          {/* Botão de Reset pequeno abaixo da urna */}
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => {
                soundFX.playKeyBeep();
                handleResetScoreboard();
              }}
              title="Zerar o placar"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-[10px] sm:text-xs font-semibold text-slate-300 hover:bg-white/15 hover:text-white active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          </main>
        </div>
      </div>
    </div>
  );
}
