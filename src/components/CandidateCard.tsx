import React from 'react';
import { CandidateConfig } from '../types/voting';
import { AnimatedCounter } from './AnimatedCounter';

interface CandidateCardProps {
  candidate: CandidateConfig;
  side: 'left' | 'right';
  votes: number;
  isHighlighted: boolean;
  onClickVote?: () => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  side,
  votes,
  isHighlighted,
  onClickVote,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const isLula = candidate.id === 'lula';

  React.useEffect(() => {
    setImgFailed(false);
  }, [candidate.avatarUrl]);

  const borderAccent = isLula
    ? isHighlighted
      ? 'border-red-400 shadow-[0_0_28px_rgba(239,68,68,0.65)]'
      : 'border-red-600/70'
    : isHighlighted
    ? 'border-emerald-400 shadow-[0_0_28px_rgba(34,197,94,0.65)]'
    : 'border-emerald-600/70';

  const bgGradient = isLula
    ? 'bg-gradient-to-b from-red-950/90 via-[#1c0918]/95 to-[#110617]'
    : 'bg-gradient-to-b from-emerald-950/90 via-[#071f18]/95 to-[#081312]';

  const cornerRadius =
    side === 'left'
      ? 'rounded-l-xl rounded-r-none border-r'
      : 'rounded-r-xl rounded-l-none border-l';

  return (
    <div
      onClick={onClickVote}
      title={`Clique para adicionar +1 voto para ${candidate.name}`}
      className={`relative flex flex-col justify-between border-2 ${cornerRadius} ${borderAccent} ${bgGradient} p-1.5 sm:p-2 transition-all duration-200 h-full cursor-pointer`}
    >
      {/* Retrato do Candidato */}
      <div className="relative w-full flex-1 min-h-[160px] sm:min-h-[190px] overflow-hidden rounded-lg border border-white/15 bg-slate-950">
        {!imgFailed && candidate.avatarUrl ? (
          <img
            src={candidate.avatarUrl}
            alt={candidate.name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className={`w-full h-full object-cover ${
              isLula ? 'object-[78%_top]' : 'object-[22%_top]'
            }`}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${
              isLula
                ? 'bg-gradient-to-br from-red-900 to-slate-950'
                : 'bg-gradient-to-br from-emerald-900 to-slate-950'
            }`}
          >
            <span className="font-display text-3xl font-black text-white/90">
              {candidate.number}
            </span>
          </div>
        )}

        {/* Nome do Candidato em Destaque — Posicionado Próximo ao Meio da Tela */}
        <div
          className={`absolute bottom-2 z-10 flex ${
            side === 'left' ? 'right-1.5 sm:right-2 items-end' : 'left-1.5 sm:left-2 items-start'
          }`}
        >
          <div
            className={`rounded-lg px-2.5 py-1 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.95)] border ${
              isLula
                ? 'bg-gradient-to-r from-red-950/95 via-red-900/95 to-black/95 border-red-500/80 text-red-50'
                : 'bg-gradient-to-r from-black/95 via-emerald-900/95 to-emerald-950/95 border-emerald-500/80 text-emerald-50'
            }`}
          >
            <h2 className="font-display text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] leading-tight whitespace-nowrap">
              {candidate.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Placar Digital do Candidato */}
      <div
        className={`mt-1.5 rounded-lg border px-2 py-1 text-center shrink-0 ${
          isLula
            ? 'bg-red-950/85 border-red-500/50'
            : 'bg-emerald-950/85 border-emerald-500/50'
        }`}
      >
        <AnimatedCounter
          value={votes}
          className="block text-base sm:text-xl font-extrabold tracking-tight text-white truncate"
        />
      </div>
    </div>
  );
};
