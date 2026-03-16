type PatternFigureData = {
  shape: "circle" | "triangle" | "diamond" | "ring";
  tone?: "cyan" | "violet" | "gold" | "neutral";
};

type PatternFigureProps = PatternFigureData & {
  size?: "sm" | "md";
};

const toneMap = {
  cyan: {
    fill: "#67e8f9",
    stroke: "#a5f3fc",
    glow: "rgba(103, 232, 249, 0.22)",
  },
  violet: {
    fill: "#a78bfa",
    stroke: "#c4b5fd",
    glow: "rgba(167, 139, 250, 0.22)",
  },
  gold: {
    fill: "#f5c56b",
    stroke: "#fde68a",
    glow: "rgba(245, 197, 107, 0.22)",
  },
  neutral: {
    fill: "#cbd5e1",
    stroke: "#e2e8f0",
    glow: "rgba(203, 213, 225, 0.18)",
  },
};

export default function PatternFigure({
  shape,
  tone = "neutral",
  size = "md",
}: PatternFigureProps) {
  const palette = toneMap[tone];
  const boxSize = size === "sm" ? 24 : 28;
  const innerScale = size === "sm" ? "scale(0.92)" : "scale(1)";

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: boxSize, height: boxSize }}
    >
      <svg
        width={boxSize}
        height={boxSize}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ transform: innerScale }}
      >
        <defs>
          <filter id={`glow-${shape}-${tone}-${size}`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.8" floodColor={palette.glow} />
          </filter>
        </defs>

        {shape === "circle" && (
          <>
            <circle
              cx="14"
              cy="14"
              r="8"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              filter={`url(#glow-${shape}-${tone}-${size})`}
            />
            <circle cx="11.2" cy="11.2" r="2.1" fill="rgba(255,255,255,0.18)" />
          </>
        )}

        {shape === "triangle" && (
          <>
            <path
              d="M14 6.2L21.2 19.8H6.8L14 6.2Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter={`url(#glow-${shape}-${tone}-${size})`}
            />
            <path
              d="M14 8.7L18.6 17.3H9.4L14 8.7Z"
              fill="rgba(255,255,255,0.12)"
            />
          </>
        )}

        {shape === "diamond" && (
          <>
            <path
              d="M14 5.5L22 14L14 22.5L6 14L14 5.5Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter={`url(#glow-${shape}-${tone}-${size})`}
            />
            <path
              d="M14 8.2L18.8 14L14 19.8L9.2 14L14 8.2Z"
              fill="rgba(255,255,255,0.12)"
            />
          </>
        )}

        {shape === "ring" && (
          <>
            <circle
              cx="14"
              cy="14"
              r="7.4"
              stroke={palette.stroke}
              strokeWidth="3.2"
              opacity="0.95"
              filter={`url(#glow-${shape}-${tone}-${size})`}
            />
            <circle cx="14" cy="14" r="4.4" fill="#0f172a" />
            <circle cx="11.5" cy="11.3" r="1.5" fill="rgba(255,255,255,0.16)" />
          </>
        )}
      </svg>
    </div>
  );
}