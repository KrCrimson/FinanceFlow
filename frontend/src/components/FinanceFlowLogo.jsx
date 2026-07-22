import React from 'react';

export default function FinanceFlowLogo({ className = "h-9 w-auto", size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ff_emerald_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="ff_mint_grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Wave flow base */}
      <path
        d="M 10,75 C 30,55 55,85 85,65 C 100,55 110,60 115,65 C 105,75 85,88 55,78 C 30,70 18,85 10,75 Z"
        fill="url(#ff_emerald_grad)"
      />
      <path
        d="M 5,68 C 25,48 50,75 78,58 C 92,49 105,55 110,58 C 98,68 76,78 48,68 C 25,60 14,75 5,68 Z"
        fill="url(#ff_mint_grad)"
        opacity="0.9"
      />

      {/* Growth Chart Bars */}
      <rect x="48" y="42" width="10" height="25" rx="3" fill="url(#ff_emerald_grad)" transform="rotate(-15 48 42)" />
      <rect x="65" y="28" width="11" height="38" rx="3" fill="url(#ff_emerald_grad)" transform="rotate(-15 65 28)" />
      <rect x="83" y="12" width="12" height="52" rx="3.5" fill="url(#ff_emerald_grad)" transform="rotate(-15 83 12)" />

      {/* Dollar Sign Overlay */}
      <text
        x="82"
        y="58"
        fill="#FFFFFF"
        fontSize="32"
        fontWeight="900"
        fontFamily="sans-serif"
        stroke="#065F46"
        strokeWidth="1.5"
      >
        $
      </text>
    </svg>
  );
}
