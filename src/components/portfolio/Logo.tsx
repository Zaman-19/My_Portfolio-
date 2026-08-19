export function Logo({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="SZ monogram"
      className="shrink-0"
      style={{ filter: "drop-shadow(0 0 10px color-mix(in oklab, var(--primary) 55%, transparent))" }}
    >
      <defs>
        <linearGradient id="sz-logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--ring)" />
        </linearGradient>
      </defs>

      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="13"
        fill="none"
        stroke="url(#sz-logo-grad)"
        strokeWidth="2"
        opacity="0.9"
      />
      <rect x="7" y="7" width="34" height="34" rx="10" fill="url(#sz-logo-grad)" opacity="0.12" />

      <text
        x="24"
        y="31"
        textAnchor="middle"
        className="font-display"
        fontSize="18"
        fontWeight="700"
        letterSpacing="0.5"
        fill="url(#sz-logo-grad)"
      >
        SZ
      </text>

      <circle cx="40" cy="9" r="3" fill="var(--accent)">
        <animate attributeName="opacity" values="1;0.25;1" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="8" cy="39" r="2" fill="var(--primary)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
