import React, { useEffect, useState } from 'react';
import {
  AnimationQueueItem,
  CandidateConfig,
  CandidateId,
} from '../types/voting';
import { formatNumberBR } from '../services/votingService';
import { AnimatedCounter } from './AnimatedCounter';
import { GiftIcon } from './GiftIcon';
import { soundFX } from '../services/soundService';

interface UrnaCenterpieceProps {
  totalVotes: number;
  candidates: Record<CandidateId, CandidateConfig>;
  activeAnimation: AnimationQueueItem | null;
  onResetVotes?: () => void;
  onQuickVoteCandidate?: (candidateId: CandidateId) => void;
}

export const UrnaCenterpiece: React.FC<UrnaCenterpieceProps> = ({
  totalVotes,
  candidates,
  activeAnimation,
  onResetVotes,
  onQuickVoteCandidate,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [pulseEffect, setPulseEffect] = useState<boolean>(false);

  useEffect(() => {
    if (!activeAnimation) return;
    setPulseEffect(true);
    const t = window.setTimeout(() => setPulseEffect(false), 750);
    return () => clearTimeout(t);
  }, [activeAnimation?.id]);

  const glowClass =
    pulseEffect && activeAnimation
      ? activeAnimation.candidateId === 'lula'
        ? 'urna-glow-lula border-red-400'
        : 'urna-glow-flavio border-emerald-400'
      : 'border-slate-400/80 shadow-[0_15px_40px_rgba(0,0,0,0.85)]';

  const handleKeyPress = (keyLabel: string) => {
    soundFX.playKeyBeep();
    setPressedKey(keyLabel);
    setTimeout(() => setPressedKey(null), 150);
    if (keyLabel === 'CORRIGE' && onResetVotes) {
      onResetVotes();
    }
  };

  const activeCand = activeAnimation ? candidates[activeAnimation.candidateId] : null;
  const numberDigits = activeCand ? activeCand.number.split('') : ['-', '-'];

  return (
    <div className="w-full">
      {/* Gabinete Físico Realista da Urna Eletrônica Brasileira — Mesma largura exata dos 2 candidatos juntos */}
      <div
        className={`relative w-full rounded-xl bg-gradient-to-b from-[#f3f4f6] via-[#e5e7eb] to-[#bfc5ce] p-2.5 sm:p-3 border-b-6 border-r-4 border-t border-l transition-all duration-300 ${glowClass}`}
      >
        {/* Sulcos Superiores do Gabinete Plástico da Urna */}
        <div className="flex items-center justify-between border-b border-slate-400/60 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-full border border-white/80 flex items-center justify-center shadow-inner"
              style={{
                background: 'linear-gradient(90deg, #dc2626 0%, #dc2626 50%, #16a34a 50%, #16a34a 100%)',
              }}
            >
              <span className="font-display font-black text-[7px] tracking-tighter text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                2026
              </span>
            </div>
            <div className="leading-none">
              <span className="block font-display text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-800">
                Duelo Eleitoral
              </span>
              <span className="block text-[8px] font-semibold text-slate-600 uppercase">
                Urna Eletrônica · Brasil
              </span>
            </div>
          </div>

          <div className="rounded-md bg-slate-800/95 px-2.5 py-0.5 border border-slate-600 shadow-inner">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 mr-1">
              Total:
            </span>
            <AnimatedCounter
              value={totalVotes}
              className="text-xs sm:text-sm font-extrabold text-amber-300"
            />
          </div>
        </div>

        {/* Painel Frontal: Visor LCD (Esquerda) + Teclado Físico (Direita) */}
        <div className="grid grid-cols-12 gap-2 sm:gap-2.5 items-stretch">
          {/* Moldura Profunda do Visor LCD */}
          <div className="col-span-7 rounded-lg bg-gradient-to-b from-[#9ca3af] to-[#cbd5e1] p-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.45)] border border-slate-400">
            <div className="w-full h-full rounded border-2 border-slate-700 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-2 text-slate-900 shadow-inner flex flex-col justify-between min-h-[145px] sm:min-h-[160px]">
              {activeAnimation && activeCand ? (
                <div
                  key={activeAnimation.id}
                  className="flex flex-col justify-between h-full transition-all duration-150"
                >
                  {/* Cabeçalho do Visor LCD */}
                  <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
                    <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-700">
                      SEU VOTO PARA
                    </span>
                    <span
                      className={`text-[10px] font-mono-tabular font-black px-1.5 py-0.2 rounded shadow-sm ${
                        activeAnimation.candidateId === 'lula'
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      +{formatNumberBR(activeAnimation.votesAdded)}
                    </span>
                  </div>

                  {/* Corpo do Visor com Dados do Candidato + Foto + Presente */}
                  <div className="grid grid-cols-12 gap-1.5 my-auto py-1 items-center">
                    <div className="col-span-7 space-y-1">
                      <div className="text-[8px] sm:text-[9px] font-bold uppercase text-slate-500">
                        Presidente
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] sm:text-[9px] font-semibold text-slate-600">
                          Nº:
                        </span>
                        {numberDigits.map((d, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center justify-center w-4 h-5 sm:w-5 sm:h-6 border-2 border-slate-800 bg-white font-mono-tabular text-xs font-black text-slate-950 shadow-sm"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="font-display text-[10px] sm:text-xs font-black text-slate-950 uppercase leading-tight truncate">
                        {activeCand.name}
                      </div>

                      <div className="inline-flex items-center gap-1 rounded bg-slate-200/90 border border-slate-300 px-1.5 py-0.5 max-w-full">
                        <GiftIcon
                          iconType={activeAnimation.iconType}
                          customImageUrl={activeAnimation.customImageUrl}
                          name={activeAnimation.giftName}
                          size="xs"
                        />
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-700 truncate">
                          {activeAnimation.giftName}
                        </span>
                      </div>
                    </div>

                    {/* Retrato do Candidato na Tela da Urna */}
                    <div className="col-span-5 flex flex-col items-center justify-center">
                      <div
                        className={`relative w-14 h-18 sm:w-18 sm:h-22 rounded border-2 overflow-hidden bg-slate-900 shadow-md ${
                          activeAnimation.candidateId === 'lula'
                            ? 'border-red-600'
                            : 'border-emerald-600'
                        }`}
                      >
                        <img
                          src={activeCand.avatarUrl}
                          alt={activeCand.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#16a34a] text-white text-center py-0.5 rounded font-display text-[9px] sm:text-[10px] font-black tracking-widest uppercase shadow-sm">
                    GRAVADO · FIM
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
                    <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-slate-700">
                      URNA ELETRÔNICA
                    </span>
                    <span className="text-[8px] font-mono-tabular font-bold text-emerald-700">
                      PRONTA
                    </span>
                  </div>

                  <div className="my-auto py-1 flex flex-col items-center justify-center text-center gap-1.5">
                    <div className="font-display text-xs font-black uppercase tracking-wide text-slate-800">
                      Presidente
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-6 h-7 border-2 border-slate-800 bg-white font-mono-tabular text-sm font-black text-slate-800 animate-pulse">
                        _
                      </span>
                      <span className="inline-flex items-center justify-center w-6 h-7 border-2 border-slate-800 bg-white font-mono-tabular text-sm font-black text-slate-800">
                        _
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-semibold text-slate-600">
                      Toque no candidato acima para votar
                    </span>
                  </div>

                  <div className="border-t border-slate-300 pt-0.5 text-[8px] text-slate-600 font-semibold flex items-center justify-between">
                    <span>Aperte a tecla:</span>
                    <span className="font-bold text-emerald-700">VERDE para CONFIRMAR</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Painel do Teclado Físico da Urna Brasileira */}
          <div className="col-span-5 rounded-lg bg-gradient-to-b from-[#1e232a] to-[#111418] p-1.5 sm:p-2 border-2 border-slate-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div className="text-[7px] sm:text-[8px] font-display font-bold uppercase tracking-widest text-slate-300 text-center border-b border-slate-700 pb-0.5 mb-1">
              Duelo Eleitoral
            </div>

            {/* Teclas Numéricas Pretas com Relevo 3D */}
            <div className="grid grid-cols-3 gap-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeyPress(digit)}
                  className={`relative h-5 sm:h-6 rounded bg-gradient-to-b from-[#2c333d] to-[#161a20] text-white font-mono-tabular text-[10px] sm:text-[11px] font-extrabold border-t border-slate-500/50 border-b-2 border-b-black shadow hover:brightness-110 active:translate-y-0.5 transition-transform cursor-pointer flex items-center justify-between px-1 ${
                    pressedKey === digit ? 'translate-y-0.5 brightness-90' : ''
                  }`}
                >
                  <span>{digit}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-400/60" />
                </button>
              ))}
              <div />
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className={`relative h-5 sm:h-6 rounded bg-gradient-to-b from-[#2c333d] to-[#161a20] text-white font-mono-tabular text-[10px] sm:text-[11px] font-extrabold border-t border-slate-500/50 border-b-2 border-b-black shadow hover:brightness-110 active:translate-y-0.5 transition-transform cursor-pointer flex items-center justify-between px-1 ${
                  pressedKey === '0' ? 'translate-y-0.5 brightness-90' : ''
                }`}
              >
                <span>0</span>
                <span className="w-1 h-1 rounded-full bg-slate-400/60" />
              </button>
              <div />
            </div>

            {/* Teclas de Função: BRANCO, CORRIGE e CONFIRMA */}
            <div className="grid grid-cols-3 gap-1 items-end mt-1.5 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => handleKeyPress('BRANCO')}
                className="h-5 sm:h-6 rounded bg-gradient-to-b from-white to-slate-200 text-slate-950 font-display text-[6px] sm:text-[7px] font-black uppercase tracking-tighter border-b-2 border-slate-400 shadow hover:brightness-95 active:translate-y-0.5 cursor-pointer"
              >
                Branco
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('CORRIGE')}
                className="h-5 sm:h-6 rounded bg-gradient-to-b from-[#fb923c] to-[#ea580c] text-slate-950 font-display text-[6px] sm:text-[7px] font-black uppercase tracking-tighter border-b-2 border-orange-900 shadow hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                Corrige
              </button>
              <button
                type="button"
                onClick={() => soundFX.playUrnaChime(false)}
                className="h-6 sm:h-7 rounded bg-gradient-to-b from-[#22c55e] to-[#15803d] text-white font-display text-[6px] sm:text-[7px] font-black uppercase tracking-tighter border-b-2 border-emerald-950 shadow-md hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                Confirma
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
