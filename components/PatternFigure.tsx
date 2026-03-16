type PatternFigureData = {
  shape: "circle" | "triangle" | "diamond" | "ring";
  tone?: "cyan" | "violet" | "gold" | "neutral";
};

type PatternFigureProps = PatternFigureData & {
  size?: "sm" | "md" | "lg";
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

  const boxSize =
    size === "sm"
      ? 24
      : size === "lg"
        ? 44
        : 30;

  const filterId = `glow-${shape}-${tone}-${size}`;

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
      >
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.8"
              floodColor={palette.glow}
            />
          </filter>
        </defs>

        {shape === "circle" && (
          <>
            <circle
              cx="14"
              cy="14"
              r="9.2"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              filter={`url(#${filterId})`}
            />
            <circle
              cx="10.8"
              cy="10.8"
              r="2.3"
              fill="rgba(255,255,255,0.18)"
            />
          </>
        )}

        {shape === "triangle" && (
          <>
            <path
              d="M14 4.9L22.4 20.7H5.6L14 4.9Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter={`url(#${filterId})`}
            />
            <path
              d="M14 7.8L19.3 17.8H8.7L14 7.8Z"
              fill="rgba(255,255,255,0.12)"
            />
          </>
        )}

        {shape === "diamond" && (
          <>
            <path
              d="M14 4.8L23.2 14L14 23.2L4.8 14L14 4.8Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.4"
              strokeLinejoin="round"
              filter={`url(#${filterId})`}
            />
            <path
              d="M14 7.6L19.5 14L14 20.4L8.5 14L14 7.6Z"
              fill="rgba(255,255,255,0.12)"
            />
          </>
        )}

        {shape === "ring" && (
          <>
            <circle
              cx="14"
              cy="14"
              r="8.4"
              stroke={palette.stroke}
              strokeWidth="3.6"
              opacity="0.95"
              filter={`url(#${filterId})`}
            />
            <circle cx="14" cy="14" r="4.8" fill="#0f172a" />
            <circle
              cx="11.2"
              cy="11"
              r="1.6"
              fill="rgba(255,255,255,0.16)"
            />
          </>
        )}
      </svg>
    </div>
  );
}