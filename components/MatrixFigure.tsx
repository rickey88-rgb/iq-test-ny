import type { MatrixLayout } from "@/lib/questions";

const layoutMap: Record<MatrixLayout, Array<[number, number]>> = {
  center: [[0.5, 0.5]],

  horizontal2: [
    [0.35, 0.5],
    [0.65, 0.5],
  ],
  horizontal3: [
    [0.24, 0.5],
    [0.5, 0.5],
    [0.76, 0.5],
  ],

  diagonal2: [
    [0.35, 0.35],
    [0.65, 0.65],
  ],
  diagonal3: [
    [0.24, 0.24],
    [0.5, 0.5],
    [0.76, 0.76],
  ],

  vertical2: [
    [0.5, 0.35],
    [0.5, 0.65],
  ],
  vertical3: [
    [0.5, 0.24],
    [0.5, 0.5],
    [0.5, 0.76],
  ],
};

export default function MatrixFigure({
  layout,
  missing = false,
  size = "lg",
}: {
  layout?: MatrixLayout;
  missing?: boolean;
  size?: "lg" | "sm";
}) {
  const px = size === "lg" ? 84 : 58;
  const outerStroke = 2.5;
  const innerStroke = 2.5;
  const innerPad = size === "lg" ? 16 : 11;
  const dotRadius = size === "lg" ? 6.5 : 4.8;

  const dark = "#24364A";
  const teal = "#7CC9BE";
  const questionColor = "#58A797";

  const innerSize = px - innerPad * 2;
  const dots = layout ? layoutMap[layout] : [];

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      className="block shrink-0"
      aria-hidden="true"
    >
      {/* outer frame */}
      <rect
        x={outerStroke / 2}
        y={outerStroke / 2}
        width={px - outerStroke}
        height={px - outerStroke}
        fill="white"
        stroke={dark}
        strokeWidth={outerStroke}
      />

      {!missing && (
        <rect
          x={innerPad}
          y={innerPad}
          width={innerSize}
          height={innerSize}
          rx={6}
          fill={teal}
          stroke={dark}
          strokeWidth={innerStroke}
        />
      )}

      {missing ? (
        <text
          x="50%"
          y="56%"
          textAnchor="middle"
          fontSize={size === "lg" ? 34 : 24}
          fontWeight="700"
          fill={questionColor}
        >
          ?
        </text>
      ) : (
        dots.map(([x, y], i) => (
          <circle
            key={i}
            cx={innerPad + x * innerSize}
            cy={innerPad + y * innerSize}
            r={dotRadius}
            fill="white"
            stroke={dark}
            strokeWidth={2}
          />
        ))
      )}
    </svg>
  );
}