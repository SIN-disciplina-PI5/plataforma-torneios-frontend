export function TrophyRanking() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="trophyGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#91D8FF" />
          <stop offset="100%" stopColor="#FFF200" />
        </linearGradient>
      </defs>

      {/* Cup */}
      <path
        d="M8 8C8 6.89543 8.89543 6 10 6H22C23.1046 6 24 6.89543 24 8V12C24 12 24 14 20 14H12C8 14 8 12 8 12V8Z"
        fill="url(#trophyGradient)"
        opacity="0.9"
      />

      {/* Left Handle */}
      <path
        d="M8 10C6 10 5 11 5 13C5 15 6 16 8 16"
        stroke="url(#trophyGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right Handle */}
      <path
        d="M24 10C26 10 27 11 27 13C27 15 26 16 24 16"
        stroke="url(#trophyGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Base */}
      <rect
        x="10"
        y="14"
        width="12"
        height="2"
        fill="url(#trophyGradient)"
        opacity="0.8"
      />

      {/* Pedestal */}
      <path
        d="M12 16H20V20C20 21.1046 19.1046 22 18 22H14C12.8954 22 12 21.1046 12 20V16Z"
        fill="url(#trophyGradient)"
        opacity="0.7"
      />

      {/* Star accent */}
      <path
        d="M16 4L17 6H19L17.5 7L18 9L16 7.5L14 9L14.5 7L13 6H15L16 4Z"
        fill="url(#trophyGradient)"
      />
    </svg>
  );
}
