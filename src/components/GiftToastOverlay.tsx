import React from 'react';
import { AnimationQueueItem, CandidateConfig, CandidateId } from '../types/voting';
import { formatNumberBR } from '../services/votingService';
import { GiftIcon } from './GiftIcon';
import { Crown, Sparkles } from 'lucide-react';

interface GiftToastOverlayProps {
  activeAnimation: AnimationQueueItem | null;
  queueLength: number;
  leadChangeCandidate: CandidateId | null;
  candidates: Record<CandidateId, CandidateConfig>;
}

export const GiftToastOverlay: React.FC<GiftToastOverlayProps> = ({
  activeAnimation,
  queueLength,
  leadChangeCandidate,
  candidates,
}) => {
  return (
    <>
      {/* Efeito Especial de Mudança de Liderança */}
      {leadChangeCandidate && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border-2 px-6 py-3 shadow-[0_0_50px_rgba(0,0,0,0.85)] transition-transform duration-200 ${
              leadChangeCandidate === 'lula'
                ? 'border-red-400 bg-gradient-to-r from-red-950/95 via-red-900/95 to-red-950/95 text-white'
                : 'border-blue-400 bg-gradient-to-r from-blue-950/95 via-blue-900/95 to-blue-950/95 text-white'
            }`}
          >
            <Crown className="w-6 h-6 text-amber-300 fill-amber-300/30 shrink-0" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                Mudança de Liderança na Apuração
              </div>
              <div className="font-display text-lg font-black uppercase tracking-wide">
                {candidates[leadChangeCandidate].name} assume a frente!
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          </div>
        </div>
      )}

      {/* Notificação Animada de Presente Contabilizado */}
      {activeAnimation && (
        <div
          className={`pointer-events-none fixed bottom-24 z-30 flex items-center transition-all duration-200 ${
            activeAnimation.candidateId === 'lula' ? 'left-8' : 'right-8'
          }`}
        >
          <div
            className={`flex items-center gap-3.5 rounded-2xl border-2 px-5 py-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.75)] backdrop-blur-md ${
              activeAnimation.candidateId === 'lula'
                ? 'border-red-400 bg-red-950/90 text-white'
                : 'border-blue-400 bg-blue-950/90 text-white'
            }`}
          >
            <GiftIcon
              iconType={activeAnimation.iconType}
              customImageUrl={activeAnimation.customImageUrl}
              name={activeAnimation.giftName}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <span>{activeAnimation.senderName}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-300 font-bold">{activeAnimation.giftName}</span>
                {activeAnimation.origin === 'demo' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-200/90 uppercase text-[10px]">Teste</span>
                  </>
                )}
              </div>
              <div className="font-display text-2xl font-black tracking-tight text-white">
                +{formatNumberBR(activeAnimation.votesAdded)}{' '}
                {activeAnimation.votesAdded === 1 ? 'VOTO' : 'VOTOS'} PARA{' '}
                {candidates[activeAnimation.candidateId].name}
              </div>
              {queueLength > 0 && (
                <div className="text-[11px] text-slate-300 font-mono-tabular">
                  +{queueLength} {queueLength === 1 ? 'evento na fila' : 'eventos na fila'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
