import React from 'react';
import { formatNumberBR, formatPercentBR } from '../services/votingService';

interface ComparisonBarProps {
  lulaVotes: number;
  flavioVotes: number;
  lulaPercent: number;
  flavioPercent: number;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  lulaVotes,
  flavioVotes,
  lulaPercent,
  flavioPercent,
}) => {
  const total = lulaVotes + flavioVotes;
  const visualLulaWidth = total === 0 ? 50 : Math.max(4, Math.min(96, lulaPercent));
  const visualFlavioWidth = 100 - visualLulaWidth;

  return (
    <div className="w-full rounded-2xl border border-white/15 bg-[#140a24]/95 px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
      {/* Labels Above Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
        <div className="flex items-center gap-2 text-red-400">
          <span className="font-display uppercase tracking-wider text-white">LULA</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-red-400">
            {formatPercentBR(lulaPercent)}
          </span>
          <span className="hidden sm:inline text-xs text-slate-400 font-mono-tabular">
            ({formatNumberBR(lulaVotes)} votos)
          </span>
        </div>

        <div className="text-[11px] uppercase tracking-widest text-purple-200/80 font-semibold">
          {total === 0 ? 'Aguardando Primeiros Votos' : 'Barra Comparativa Ao Vivo'}
        </div>

        <div className="flex items-center gap-2 text-blue-400">
          <span className="hidden sm:inline text-xs text-slate-400 font-mono-tabular">
            ({formatNumberBR(flavioVotes)} votos)
          </span>
          <span className="font-mono-tabular text-base sm:text-lg font-extrabold text-blue-400">
            {formatPercentBR(flavioPercent)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-display uppercase tracking-wider text-white">
            FLÁVIO BOLSONARO
          </span>
        </div>
      </div>

      {/* Horizontal Split Progress Track */}
      <div className="relative h-6 w-full overflow-hidden rounded-xl bg-slate-900 border border-white/20 flex">
        <div
          style={{ width: `${visualLulaWidth}%` }}
          className="h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 transition-all duration-300 flex items-center justify-start pl-3"
        >
          {total > 0 && lulaPercent >= 12 && (
            <span className="font-mono-tabular text-xs font-extrabold text-white drop-shadow">
              {formatPercentBR(lulaPercent)}
            </span>
          )}
        </div>

        {/* Center 50% Mark */}
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-amber-300/80 z-10"
          title="Marca de 50%"
        />

        <div
          style={{ width: `${visualFlavioWidth}%` }}
          className="h-full bg-gradient-to-l from-blue-700 via-blue-600 to-blue-500 transition-all duration-300 flex items-center justify-end pr-3"
        >
          {total > 0 && flavioPercent >= 12 && (
            <span className="font-mono-tabular text-xs font-extrabold text-white drop-shadow">
              {formatPercentBR(flavioPercent)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
