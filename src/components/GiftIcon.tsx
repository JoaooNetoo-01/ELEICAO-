import React from 'react';
import { GiftItem } from '../types/voting';

interface GiftIconProps {
  iconType: GiftItem['iconType'];
  customImageUrl?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const GiftIcon: React.FC<GiftIconProps> = ({
  iconType,
  customImageUrl,
  name,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (customImageUrl && !imgError) {
    return (
      <img
        src={customImageUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center select-none drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)] shrink-0 ${className}`}
      title={name}
    >
      {/* ==================== PAINEL LULA (1ª IMAGEM) ==================== */}

      {/* 1. Rosa (1 moeda) — Rosa 3D pink/vermelha com caule e 2 folhas verdes */}
      {iconType === 'rose' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="tikRosePink" cx="45%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ff85a1" />
              <stop offset="50%" stopColor="#ff1e56" />
              <stop offset="100%" stopColor="#a30027" />
            </radialGradient>
            <linearGradient id="tikStem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Caule e folhas */}
          <path d="M30 35 L35 58" stroke="url(#tikStem)" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M32 45 C42 38, 52 40, 46 48 C40 52, 34 48, 32 45 Z" fill="#10b981" />
          <path d="M31 47 C22 43, 14 48, 20 53 C26 55, 30 50, 31 47 Z" fill="#34d399" />
          {/* Pétalas externas */}
          <path
            d="M14 24 C10 14, 24 8, 32 12 C40 8, 54 14, 50 24 C54 32, 42 42, 32 40 C22 42, 10 32, 14 24 Z"
            fill="url(#tikRosePink)"
          />
          {/* Pétalas internas espiral */}
          <path
            d="M20 22 C20 14, 44 14, 44 22 C44 31, 32 36, 32 36 C32 36, 20 31, 20 22 Z"
            fill="#ff4d79"
          />
          <ellipse cx="32" cy="19" rx="8" ry="5.5" fill="#ff0a54" stroke="#ff9ebb" strokeWidth="1.5" />
          <path d="M28 19 C30 16, 35 16, 36 19 C34 22, 29 21, 28 19 Z" fill="#ffb3c6" />
        </svg>
      )}

      {/* 2. Heart Me (1 moeda) — Coração laranja/vermelho com borda dourada, óculos brancos piscando e bastão de luz amarelo */}
      {iconType === 'heart_me' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="heartMeBody" cx="45%" cy="38%" r="60%">
              <stop offset="0%" stopColor="#ff7b54" />
              <stop offset="65%" stopColor="#ef233c" />
              <stop offset="100%" stopColor="#b80d23" />
            </radialGradient>
            <linearGradient id="heartGoldRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Braço esquerdo */}
          <path d="M12 36 C6 33, 6 41, 13 43" fill="#ef233c" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
          {/* Corpo do coração com aro dourado */}
          <path
            d="M32 53 C32 53, 10 40, 10 24 C10 13, 21 9, 32 18 C43 9, 54 13, 54 24 C54 40, 32 53, 32 53 Z"
            fill="url(#heartMeBody)"
            stroke="url(#heartGoldRim)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Óculos brancos */}
          <rect x="18" y="22" width="12" height="9" rx="2.5" fill="none" stroke="#fffbeb" strokeWidth="2.3" />
          <rect x="34" y="22" width="12" height="9" rx="2.5" fill="none" stroke="#fffbeb" strokeWidth="2.3" />
          <line x1="30" y1="25" x2="34" y2="25" stroke="#fffbeb" strokeWidth="2.2" />
          {/* Olho esquerdo aberto + direito piscando */}
          <circle cx="24" cy="26.5" r="2.2" fill="#2b090e" />
          <circle cx="23.3" cy="25.8" r="0.8" fill="#ffffff" />
          <path d="M37 27 Q40 24 43 27" stroke="#2b090e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Sorriso fofo */}
          <path d="M29 34 Q32 37 35 34" stroke="#2b090e" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Bastão de luz amarelo na mão direita */}
          <g transform="rotate(14 53 34)">
            <rect x="50" y="22" width="5.5" height="14" rx="2.5" fill="#fef08a" stroke="#facc15" strokeWidth="1.2" />
            <rect x="51" y="36" width="3.5" height="7" rx="1" fill="#fed7aa" />
          </g>
        </svg>
      )}

      {/* 3. Amo você (1 moeda) — Emoji amarelo sorrindo de olhos fechados abraçando um coração vermelho */}
      {iconType === 'love_you' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="emojiYellow" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>
            <radialGradient id="hugHeart" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="100%" stopColor="#b91c1c" />
            </radialGradient>
          </defs>
          {/* Cabeça redonda 3D */}
          <circle cx="32" cy="28" r="20" fill="url(#emojiYellow)" />
          {/* Bochechas rosadas */}
          <ellipse cx="19" cy="29" rx="4" ry="2.2" fill="#f43f5e" opacity="0.55" />
          <ellipse cx="45" cy="29" rx="4" ry="2.2" fill="#f43f5e" opacity="0.55" />
          {/* Olhos felizes fechados */}
          <path d="M20 23 Q24 19 27 23" stroke="#5c2d0c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M37 23 Q40 19 44 23" stroke="#5c2d0c" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          {/* Boquinha "w" */}
          <path d="M28 28 Q30 31 32 28 Q34 31 36 28" stroke="#5c2d0c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Coração vermelho grande sendo abraçado */}
          <path
            d="M32 57 C32 57, 15 46, 15 35 C15 28, 24 25, 32 33 C40 25, 49 28, 49 35 C49 46, 32 57, 32 57 Z"
            fill="url(#hugHeart)"
          />
          {/* Mãozinhas amarelas segurando o coração */}
          <ellipse cx="17" cy="43" rx="4.5" ry="3.2" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
          <ellipse cx="47" cy="43" rx="4.5" ry="3.2" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" />
        </svg>
      )}

      {/* 4. Ingresso de bis (5 moedas) — Bilhete vermelho inclinado com aro prateado e texto luminoso ENCORE */}
      {iconType === 'encore_ticket' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <g transform="rotate(-14 32 32)">
            <rect
              x="6"
              y="18"
              width="52"
              height="28"
              rx="4"
              fill="#b91c1c"
              stroke="#cbd5e1"
              strokeWidth="2.8"
            />
            <rect
              x="10"
              y="21"
              width="44"
              height="22"
              rx="2"
              fill="#dc2626"
              stroke="#fca5a5"
              strokeWidth="1"
            />
            {/* Entalhes laterais do ingresso */}
            <circle cx="6" cy="32" r="4.5" fill="#18071a" />
            <circle cx="58" cy="32" r="4.5" fill="#18071a" />
            {/* Texto ENCORE brilhante */}
            <text
              x="32"
              y="36"
              textAnchor="middle"
              fill="#fef08a"
              stroke="#b45309"
              strokeWidth="0.8"
              fontSize="11.5"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="0.5"
            >
              ENCORE
            </text>
          </g>
        </svg>
      )}

      {/* 5. Coração (10 moedas) — Coração 3D vermelho clássico com brilho branco no canto superior esquerdo */}
      {iconType === 'finger_heart' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="redHeart10" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="55%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>
          <path
            d="M32 55 C32 55, 8 39, 8 22 C8 11, 20 7, 32 19 C44 7, 56 11, 56 22 C56 39, 32 55, 32 55 Z"
            fill="url(#redHeart10)"
          />
          {/* Reflexo branco característico da imagem */}
          <path
            d="M15 21 C15 16, 19 13, 23 14"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="14.5" cy="25.5" r="1.6" fill="#ffffff" opacity="0.9" />
        </svg>
      )}

      {/* 6. Capybara (30 moedas) — Capivara caramelo/marrom realista sentada */}
      {iconType === 'capybara' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="capyFur" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#f6ad55" />
              <stop offset="65%" stopColor="#c05621" />
              <stop offset="100%" stopColor="#7b341e" />
            </radialGradient>
          </defs>
          {/* Orelhinhas */}
          <ellipse cx="23" cy="14" rx="3.2" ry="4.2" fill="#7b341e" />
          <ellipse cx="42" cy="14" rx="3.2" ry="4.2" fill="#7b341e" />
          {/* Corpo sentado */}
          <path
            d="M18 32 C14 42, 16 55, 22 56 H44 C50 55, 51 40, 46 31 Z"
            fill="url(#capyFur)"
          />
          {/* Cabeça e focinho */}
          <ellipse cx="32" cy="24" rx="14" ry="11.5" fill="url(#capyFur)" />
          <ellipse cx="26" cy="25" rx="7.5" ry="6.5" fill="#dd6b20" />
          {/* Narinas e boca */}
          <ellipse cx="23" cy="23" rx="1.6" ry="2.2" fill="#2d1606" />
          <ellipse cx="28" cy="23" rx="1.6" ry="2.2" fill="#2d1606" />
          <path d="M25.5 26 V30 M23 30 Q25.5 32 28 30" stroke="#2d1606" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Olhinhos */}
          <circle cx="36" cy="20" r="2.1" fill="#1a110b" />
          <circle cx="35.5" cy="19.4" r="0.7" fill="#ffffff" />
          {/* Patinhas dianteiras */}
          <rect x="23" y="47" width="4.5" height="9" rx="2" fill="#9c4221" />
          <rect x="36" y="47" width="4.5" height="9" rx="2" fill="#9c4221" />
        </svg>
      )}

      {/* 7. Acordeão fiesta (99 moedas) — Sanfona vermelha e dourada com teclado e fole */}
      {iconType === 'accordion' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <g transform="rotate(-6 32 32)">
            {/* Caixa direita vermelha/dourada */}
            <rect x="42" y="15" width="12" height="32" rx="3" fill="#b91c1c" stroke="#facc15" strokeWidth="2" />
            {/* Fole central sanfonado */}
            <polygon
              points="20,17 26,14 31,17 37,14 42,17 42,45 37,48 31,45 26,48 20,45"
              fill="#7f1d1d"
              stroke="#fde047"
              strokeWidth="1.8"
            />
            <line x1="26" y1="14" x2="26" y2="48" stroke="#fde047" strokeWidth="1.8" />
            <line x1="31" y1="17" x2="31" y2="45" stroke="#fde047" strokeWidth="1.8" />
            <line x1="37" y1="14" x2="37" y2="48" stroke="#fde047" strokeWidth="1.8" />
            {/* Teclado lateral esquerdo */}
            <rect x="9" y="15" width="12" height="32" rx="3" fill="#eab308" stroke="#fef08a" strokeWidth="1.8" />
            <rect x="11" y="18" width="6" height="26" rx="1" fill="#fffbeb" />
            <line x1="11" y1="23" x2="17" y2="23" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="11" y1="28" x2="17" y2="28" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="11" y1="33" x2="17" y2="33" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="11" y1="38" x2="17" y2="38" stroke="#1e293b" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* 8. Pistola de dinheiro (500 moedas) — Pistola rosa TikTok disparando notas azuis */}
      {iconType === 'money_gun' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Cédulas azuis saindo da frente */}
          <g transform="rotate(-12 20 34)">
            <rect x="6" y="26" width="22" height="12" rx="2" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="1.5" />
            <circle cx="17" cy="32" r="3.5" fill="#0284c7" />
          </g>
          {/* Corpo da pistola rosa em perspectiva */}
          <g transform="rotate(18 36 30)">
            <rect x="20" y="14" width="32" height="16" rx="4" fill="#f472b6" stroke="#fbcfe8" strokeWidth="2" />
            <rect x="34" y="28" width="12" height="18" rx="3" fill="#ec4899" stroke="#fbcfe8" strokeWidth="1.8" />
            <text
              x="36"
              y="25"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="900"
              fontFamily="sans-serif"
            >
              TikTok
            </text>
          </g>
        </svg>
      )}

      {/* ==================== PAINEL FLÁVIO (2ª IMAGEM) ==================== */}

      {/* 1. Rosa branca (1 moeda) — Rosa branca/creme com caule e folhas verdes */}
      {iconType === 'white_rose' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="whiteRoseGrad" cx="45%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#d6d3d1" />
            </radialGradient>
          </defs>
          {/* Caule e folhas */}
          <path d="M31 35 L35 58" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M33 44 C43 38, 52 40, 46 47 C40 50, 35 47, 33 44 Z" fill="#22c55e" />
          <path d="M31 47 C21 43, 14 48, 20 53 C26 55, 30 50, 31 47 Z" fill="#4ade80" />
          {/* Pétalas brancas */}
          <path
            d="M13 24 C9 14, 24 8, 32 12 C40 8, 55 14, 51 24 C55 32, 42 42, 32 40 C22 42, 9 32, 13 24 Z"
            fill="url(#whiteRoseGrad)"
            stroke="#e7e5e4"
            strokeWidth="1.2"
          />
          <path
            d="M20 22 C20 14, 44 14, 44 22 C44 31, 32 36, 32 36 C32 36, 20 31, 20 22 Z"
            fill="#fffbeb"
            stroke="#fde68a"
            strokeWidth="1"
          />
          <ellipse cx="32" cy="19" rx="7.5" ry="5" fill="#fef3c7" stroke="#eab308" strokeWidth="1" />
        </svg>
      )}

      {/* 2. Palmas (1 moeda) — Mãos amarelas 3D aplaudindo com traços verdes de som */}
      {iconType === 'clap' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Traços verdes de aplauso */}
          <polygon points="16,18 10,10 14,8" fill="#10b981" />
          <polygon points="22,14 19,5 24,5" fill="#34d399" />
          <polygon points="42,14 45,5 40,5" fill="#34d399" />
          <polygon points="48,18 54,10 50,8" fill="#10b981" />
          {/* Mão de trás */}
          <path
            d="M16 38 C12 28, 24 14, 32 20 L42 30 C46 38, 34 52, 22 46 Z"
            fill="#d97706"
          />
          {/* Mão da frente com dedos */}
          <path
            d="M22 42 C16 33, 28 16, 36 22 L48 32 C54 40, 42 56, 28 49 Z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <line x1="25" y1="25" x2="36" y2="34" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="22" y1="30" x2="33" y2="39" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="20" y1="35" x2="30" y2="44" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}

      {/* 3. Bom trabalho (1 moeda) — Joinha 3D amarelo com confetes coloridos no topo */}
      {iconType === 'thumbs_up' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="thumb3D" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>
          {/* Confetes no topo */}
          <path d="M14 14 Q18 11 21 15" stroke="#fb923c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="38" y="10" width="6" height="3" rx="1" fill="#34d399" transform="rotate(-25 41 11)" />
          <rect x="42" y="18" width="7" height="3" rx="1" fill="#f472b6" transform="rotate(15 45 19)" />
          {/* Mão 3D em joinha */}
          <path
            d="M16 34 C16 29, 22 28, 24 25 L26 14 C27 9, 34 9, 35 15 L35 25 H46 C51 25, 53 29, 50 33 C53 35, 52 40, 49 42 C51 45, 49 49, 45 50 H24 C18 50, 16 45, 16 34 Z"
            fill="url(#thumb3D)"
          />
          {/* Divisórias dos dedos dobrados */}
          <line x1="38" y1="32" x2="49" y2="32" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="39" x2="48" y2="39" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="45" x2="46" y2="45" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}

      {/* 4. Bola de futebol giratória (5 moedas) — Bola clássica com rastro espiral verde e azul */}
      {iconType === 'soccer_ball' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Anel de giro verde e azul ao redor da bola */}
          <path
            d="M10 38 C4 50, 28 56, 48 44 C58 38, 60 24, 48 18"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M16 48 C30 56, 56 46, 56 30"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Bola de futebol */}
          <circle cx="32" cy="30" r="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="32,21 39,26 36,35 28,35 25,26" fill="#0f172a" />
          <polygon points="32,12 37,15 32,21 27,15" fill="#0f172a" />
          <polygon points="48,24 49,31 39,26 43,19" fill="#0f172a" />
          <polygon points="16,24 21,19 25,26 15,31" fill="#0f172a" />
          <polygon points="22,44 28,35 36,35 42,44 32,47" fill="#0f172a" opacity="0.85" />
        </svg>
      )}

      {/* 5. Mini dino (10 moedas) — Dinossauro bebê verde sentado de barriga clara */}
      {iconType === 'mini_dino' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Cristas nas costas */}
          <circle cx="45" cy="24" r="3" fill="#15803d" />
          <circle cx="47" cy="32" r="3" fill="#15803d" />
          <circle cx="46" cy="40" r="3" fill="#15803d" />
          {/* Corpo sentado */}
          <ellipse cx="34" cy="41" rx="12" ry="14" fill="#4ade80" />
          {/* Barriga verde-clara */}
          <ellipse cx="31" cy="42" rx="8" ry="10" fill="#bbf7d0" />
          {/* Cabeça grande fofa */}
          <ellipse cx="31" cy="22" rx="13" ry="11" fill="#4ade80" />
          {/* Olho grande com pupila preta */}
          <circle cx="34" cy="19" r="3.5" fill="#ffffff" />
          <circle cx="34" cy="19" r="2" fill="#0f172a" />
          {/* Sorriso e narina */}
          <circle cx="22" cy="19" r="1.2" fill="#166534" />
          <path d="M21 25 Q27 28 33 25" stroke="#166534" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Pezinhos */}
          <ellipse cx="24" cy="52" rx="5" ry="3.5" fill="#22c55e" />
          <ellipse cx="38" cy="53" rx="5" ry="3.5" fill="#22c55e" />
        </svg>
      )}

      {/* 6. Buquê de flores (30 moedas) — Rosas cor-de-rosa embrulhadas em papel azul/lilás com laço rosa */}
      {iconType === 'flower_bouquet' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="bouquetWrap" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          {/* Cone de papel azul/lilás */}
          <polygon points="14,26 50,26 38,56 26,56" fill="url(#bouquetWrap)" />
          {/* Folhagem verde no topo */}
          <circle cx="18" cy="22" r="6" fill="#10b981" />
          <circle cx="46" cy="22" r="6" fill="#10b981" />
          <circle cx="32" cy="14" r="6" fill="#059669" />
          {/* Rosas cor-de-rosa no buquê */}
          <circle cx="23" cy="22" r="6.5" fill="#fb7185" stroke="#ffe4e6" strokeWidth="1" />
          <circle cx="41" cy="22" r="6.5" fill="#fb7185" stroke="#ffe4e6" strokeWidth="1" />
          <circle cx="32" cy="18" r="6.5" fill="#f43f5e" stroke="#ffe4e6" strokeWidth="1" />
          <circle cx="27" cy="28" r="6" fill="#ec4899" stroke="#fce7f3" strokeWidth="1" />
          <circle cx="37" cy="28" r="6" fill="#ec4899" stroke="#fce7f3" strokeWidth="1" />
          {/* Laço rosa na base */}
          <ellipse cx="27" cy="48" rx="6" ry="3.5" fill="#f472b6" transform="rotate(-15 27 48)" />
          <ellipse cx="37" cy="48" rx="6" ry="3.5" fill="#f472b6" transform="rotate(15 37 48)" />
          <circle cx="32" cy="48" r="3" fill="#ec4899" />
        </svg>
      )}

      {/* 7. Chapéu e Bigode (99 moedas) — Chapéu caramelo de aba larga + bigode castanho curvado */}
      {iconType === 'hat_mustache' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <radialGradient id="cowboyHat" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          {/* Aba larga do chapéu */}
          <ellipse cx="32" cy="30" rx="25" ry="11" fill="url(#cowboyHat)" stroke="#b45309" strokeWidth="1.5" />
          {/* Copa do chapéu */}
          <path
            d="M19 27 C19 12, 26 11, 32 13 C38 11, 45 12, 45 27 C38 31, 26 31, 19 27 Z"
            fill="url(#cowboyHat)"
            stroke="#92400e"
            strokeWidth="1.2"
          />
          {/* Bigode castanho curvado logo abaixo */}
          <path
            d="M32 48 C27 43, 18 44, 15 50 C19 54, 27 53, 32 49 C37 53, 45 54, 49 50 C46 44, 37 43, 32 48 Z"
            fill="#b45309"
            stroke="#fde68a"
            strokeWidth="1.2"
          />
        </svg>
      )}

      {/* 8. Mestre das Batalhas (500 moedas) — Elmo real azul e dourado com plumas coloridas */}
      {iconType === 'battle_master' && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Plumas no topo (verde, amarela, azul, vermelha) */}
          <path d="M26 22 C18 10, 12 12, 16 22" fill="#22c55e" />
          <path d="M30 20 C26 6, 20 8, 24 20" fill="#facc15" />
          <path d="M34 20 C38 6, 44 8, 40 20" fill="#38bdf8" />
          <path d="M38 22 C46 10, 52 12, 48 22" fill="#f97316" />
          {/* Casco azul com bordas douradas */}
          <path
            d="M14 42 C14 24, 50 24, 50 42 L44 48 C32 42, 32 42, 20 48 Z"
            fill="#1e3a8a"
            stroke="#facc15"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          {/* Joia azul celeste frontal */}
          <circle cx="32" cy="34" r="4" fill="#38bdf8" stroke="#fef08a" strokeWidth="1.5" />
        </svg>
      )}

      {/* Fallbacks legados */}
      {(iconType === 'tiktok' ||
        iconType === 'cap' ||
        iconType === 'doughnut' ||
        iconType === 'confetti' ||
        iconType === 'crown' ||
        iconType === 'galaxy' ||
        iconType === 'lion' ||
        iconType === 'custom') && (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="22" fill="#eab308" stroke="#fef08a" strokeWidth="2.5" />
          <polygon points="32,16 36,26 47,26 38,33 41,44 32,37 23,44 26,33 17,26 28,26" fill="#ffffff" />
        </svg>
      )}
    </div>
  );
};
