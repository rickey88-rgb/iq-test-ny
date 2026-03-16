"use client";

import { useId } from "react";
import type {
  MatrixCell,
  MatrixFill,
  MatrixLayout,
  MatrixMarkerPosition,
  MatrixShape,
} from "@/lib/questions";

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

type MatrixFigureProps = MatrixCell & {
  cell?: MatrixCell;
  missing?: boolean;
  size?: "lg" | "sm";
};

export default function MatrixFigure({
  cell,
  layout,
  shape,
  fill,
  rotation,
  marker,
  markerPosition,
  missing = false,
  size = "lg",
}: MatrixFigureProps) {
  // locked outer sizing — do not touch
  const px = size === "lg" ? 84 : 58;
  const outerStroke = 2.5;
  const innerStroke = 2.5;
  const innerPad = size === "lg" ? 16 : 11;
  const dotRadius = size === "lg" ? 6.6 : 4.9;

  const dark = "#24364A";
  const teal = "#7CC9BE";
  const questionColor = "#58A797";
  const accent = "#A5E1D7";

  const innerSize = px - innerPad * 2;
  const innerRectSize = innerSize;

  // bigger symbol area than before, without changing layout
  const shapeInset = size === "lg" ? 4.25 : 3.2;
  const shapeStroke = size === "lg" ? 2.7 : 2.25;
  const accentStroke = size === "lg" ? 1.5 : 1.25;
  const markerStroke = size === "lg" ? 1.8 : 1.5;
  const markerRadius = size === "lg" ? 4.9 : 3.8;

  const cx = innerPad + innerSize / 2;
  const cy = innerPad + innerSize / 2;

  const shapeBox = {
    x: innerPad + shapeInset,
    y: innerPad + shapeInset,
    size: innerSize - shapeInset * 2,
  };

  const uniqueId = useId().replace(/:/g, "");
  const clipId = `matrix-shape-clip-${uniqueId}`;

  const resolvedLayout = layout ?? cell?.layout;
  const resolvedShape = shape ?? cell?.shape;
  const resolvedFill = fill ?? cell?.fill ?? "none";
  const resolvedRotation = rotation ?? cell?.rotation ?? 0;
  const resolvedMarker = marker ?? cell?.marker;
  const resolvedMarkerPosition = markerPosition ?? cell?.markerPosition ?? "center";

  const dots = resolvedLayout ? layoutMap[resolvedLayout] : [];
  const hasShape = Boolean(
    resolvedShape || resolvedFill !== "none" || resolvedMarker
  );

  const effectiveShape: MatrixShape | undefined =
    resolvedShape ??
    (resolvedFill !== "none" || resolvedMarker ? "circle" : undefined);

  const rotate = `rotate(${resolvedRotation} ${cx} ${cy})`;

  function getCircleR() {
    return shapeBox.size * 0.39;
  }

  function getRingOuterR() {
    return shapeBox.size * 0.39;
  }

  function getRingInnerR() {
    return shapeBox.size * 0.22;
  }

  function getDiamondPath(scale = 1) {
    const half = (shapeBox.size * scale) / 2;
    return `M ${cx} ${cy - half}
            L ${cx + half} ${cy}
            L ${cx} ${cy + half}
            L ${cx - half} ${cy}
            Z`;
  }

  function getTrianglePath(scale = 1) {
    const full = shapeBox.size * scale;
    const leftX = cx - full * 0.43;
    const rightX = cx + full * 0.43;
    const topY = cy - full * 0.46;
    const bottomY = cy + full * 0.36;
    return `M ${cx} ${topY}
            L ${rightX} ${bottomY}
            L ${leftX} ${bottomY}
            Z`;
  }

  function getEyePath(scale = 1) {
    const eyeWidth = shapeBox.size * 1.02 * scale;
    const eyeHeight = shapeBox.size * 0.56 * scale;

    const leftX = cx - eyeWidth / 2;
    const rightX = cx + eyeWidth / 2;
    const topY = cy - eyeHeight / 2;
    const bottomY = cy + eyeHeight / 2;

    return `M ${leftX} ${cy}
            Q ${cx} ${topY} ${rightX} ${cy}
            Q ${cx} ${bottomY} ${leftX} ${cy}
            Z`;
  }

  function renderClipShape(shapeType: MatrixShape) {
    switch (shapeType) {
      case "circle":
        return <circle cx={cx} cy={cy} r={getCircleR()} transform={rotate} />;

      case "square":
        return (
          <rect
            x={shapeBox.x}
            y={shapeBox.y}
            width={shapeBox.size}
            height={shapeBox.size}
            rx={size === "lg" ? 10 : 7}
            transform={rotate}
          />
        );

      case "diamond":
        return <path d={getDiamondPath()} transform={rotate} />;

      case "triangle":
        return <path d={getTrianglePath()} transform={rotate} />;

      case "eye":
        return <path d={getEyePath()} transform={rotate} />;

      case "ring":
        return (
          <path
            d={`
              M ${cx - getRingOuterR()} ${cy}
              a ${getRingOuterR()} ${getRingOuterR()} 0 1 0 ${getRingOuterR() * 2} 0
              a ${getRingOuterR()} ${getRingOuterR()} 0 1 0 ${-getRingOuterR() * 2} 0
              M ${cx - getRingInnerR()} ${cy}
              a ${getRingInnerR()} ${getRingInnerR()} 0 1 1 ${getRingInnerR() * 2} 0
              a ${getRingInnerR()} ${getRingInnerR()} 0 1 1 ${-getRingInnerR() * 2} 0
            `}
            fillRule="evenodd"
            transform={rotate}
          />
        );

      default:
        return null;
    }
  }

  function renderShapeOutline(shapeType: MatrixShape) {
    switch (shapeType) {
      case "circle":
        return (
          <circle
            cx={cx}
            cy={cy}
            r={getCircleR()}
            fill="white"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      case "square":
        return (
          <rect
            x={shapeBox.x}
            y={shapeBox.y}
            width={shapeBox.size}
            height={shapeBox.size}
            rx={size === "lg" ? 10 : 7}
            fill="white"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      case "diamond":
        return (
          <path
            d={getDiamondPath()}
            fill="white"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      case "triangle":
        return (
          <path
            d={getTrianglePath()}
            fill="white"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      case "eye":
        return (
          <path
            d={getEyePath()}
            fill="white"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      case "ring":
        return (
          <path
            d={`
              M ${cx - getRingOuterR()} ${cy}
              a ${getRingOuterR()} ${getRingOuterR()} 0 1 0 ${getRingOuterR() * 2} 0
              a ${getRingOuterR()} ${getRingOuterR()} 0 1 0 ${-getRingOuterR() * 2} 0
              M ${cx - getRingInnerR()} ${cy}
              a ${getRingInnerR()} ${getRingInnerR()} 0 1 1 ${getRingInnerR() * 2} 0
              a ${getRingInnerR()} ${getRingInnerR()} 0 1 1 ${-getRingInnerR() * 2} 0
            `}
            fill="white"
            fillRule="evenodd"
            stroke={dark}
            strokeWidth={shapeStroke}
            transform={rotate}
          />
        );

      default:
        return null;
    }
  }

  function renderShapeAccent(shapeType: MatrixShape) {
    switch (shapeType) {
      case "circle":
        return (
          <circle
            cx={cx}
            cy={cy}
            r={shapeBox.size * 0.19}
            fill="none"
            stroke={accent}
            strokeWidth={accentStroke}
            transform={rotate}
          />
        );

      case "square":
        return (
          <rect
            x={shapeBox.x + shapeBox.size * 0.18}
            y={shapeBox.y + shapeBox.size * 0.18}
            width={shapeBox.size * 0.64}
            height={shapeBox.size * 0.64}
            rx={size === "lg" ? 6 : 4.5}
            fill="none"
            stroke={accent}
            strokeWidth={accentStroke}
            transform={rotate}
          />
        );

      case "diamond":
        return (
          <path
            d={getDiamondPath(0.52)}
            fill="none"
            stroke={accent}
            strokeWidth={accentStroke}
            transform={rotate}
          />
        );

      case "triangle":
        return (
          <path
            d={getTrianglePath(0.56)}
            fill="none"
            stroke={accent}
            strokeWidth={accentStroke}
            transform={rotate}
          />
        );

      case "ring":
        return (
          <circle
            cx={cx}
            cy={cy}
            r={shapeBox.size * 0.305}
            fill="none"
            stroke={accent}
            strokeWidth={accentStroke}
            transform={rotate}
          />
        );

      case "eye":
      default:
        return null;
    }
  }

  function renderFill(fillType: MatrixFill) {
    const half = shapeBox.size / 2;
    const fullX = shapeBox.x;
    const fullY = shapeBox.y;
    const fullW = shapeBox.size;
    const fullH = shapeBox.size;

    const activeFill = dark;

    switch (fillType) {
      case "full":
        return <rect x={fullX} y={fullY} width={fullW} height={fullH} fill={activeFill} />;

      case "top":
        return <rect x={fullX} y={fullY} width={fullW} height={half} fill={activeFill} />;

      case "right":
        return (
          <rect x={fullX + half} y={fullY} width={half} height={fullH} fill={activeFill} />
        );

      case "bottom":
        return (
          <rect x={fullX} y={fullY + half} width={fullW} height={half} fill={activeFill} />
        );

      case "left":
        return <rect x={fullX} y={fullY} width={half} height={fullH} fill={activeFill} />;

      case "topLeft":
        return <rect x={fullX} y={fullY} width={half} height={half} fill={activeFill} />;

      case "topRight":
        return (
          <rect x={fullX + half} y={fullY} width={half} height={half} fill={activeFill} />
        );

      case "bottomLeft":
        return (
          <rect x={fullX} y={fullY + half} width={half} height={half} fill={activeFill} />
        );

      case "bottomRight":
        return (
          <rect
            x={fullX + half}
            y={fullY + half}
            width={half}
            height={half}
            fill={activeFill}
          />
        );

      case "none":
      default:
        return null;
    }
  }

  function getMarkerCoords(position: MatrixMarkerPosition) {
    if (effectiveShape === "eye") {
      const eyeWidth = shapeBox.size * 1.02;
      const eyeHeight = shapeBox.size * 0.56;
      const xStep = eyeWidth * 0.23;
      const yStep = eyeHeight * 0.24;

      switch (position) {
        case "top":
          return [cx, cy - yStep] as const;
        case "right":
          return [cx + xStep, cy] as const;
        case "bottom":
          return [cx, cy + yStep] as const;
        case "left":
          return [cx - xStep, cy] as const;
        case "center":
        default:
          return [cx, cy] as const;
      }
    }

    const step = shapeBox.size * 0.24;

    switch (position) {
      case "top":
        return [cx, cy - step] as const;
      case "right":
        return [cx + step, cy] as const;
      case "bottom":
        return [cx, cy + step] as const;
      case "left":
        return [cx - step, cy] as const;
      case "center":
      default:
        return [cx, cy] as const;
    }
  }

  function renderEyeCore() {
    if (effectiveShape !== "eye") return null;

    const [mx, my] = getMarkerCoords(
      resolvedMarker ? resolvedMarkerPosition : "center"
    );

    const irisRx = size === "lg" ? 8.4 : 6.2;
    const irisRy = size === "lg" ? 6.1 : 4.5;
    const pupilR = size === "lg" ? 2.8 : 2.1;

    return (
      <g transform={rotate}>
        <ellipse cx={mx} cy={my} rx={irisRx} ry={irisRy} fill={dark} />
        <circle cx={mx} cy={my} r={pupilR} fill={questionColor} stroke={dark} strokeWidth={1.2} />
      </g>
    );
  }

  function renderMarker() {
    if (!resolvedMarker || effectiveShape === "eye") return null;

    const [mx, my] = getMarkerCoords(resolvedMarkerPosition);

    return (
      <g transform={rotate}>
        <circle
          cx={mx}
          cy={my}
          r={markerRadius}
          fill={questionColor}
          stroke={dark}
          strokeWidth={markerStroke}
        />
      </g>
    );
  }

  function renderLegacyDots() {
    return dots.map(([x, y], i) => {
      const dotCx = innerPad + x * innerSize;
      const dotCy = innerPad + y * innerSize;
      const coreR = dotRadius * 0.36;

      return (
        <g key={i}>
          <circle
            cx={dotCx}
            cy={dotCy}
            r={dotRadius}
            fill="white"
            stroke={dark}
            strokeWidth={2}
          />
          <circle cx={dotCx} cy={dotCy} r={coreR} fill={questionColor} />
        </g>
      );
    });
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      className="block shrink-0"
      aria-hidden="true"
    >
      <defs>
        {effectiveShape && (
          <clipPath id={clipId}>{renderClipShape(effectiveShape)}</clipPath>
        )}
      </defs>

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
          width={innerRectSize}
          height={innerRectSize}
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
      ) : hasShape && effectiveShape ? (
        <>
          {renderShapeOutline(effectiveShape)}

          {resolvedFill !== "none" && (
            <g clipPath={`url(#${clipId})`} transform={rotate}>
              {renderFill(resolvedFill)}
            </g>
          )}

          {renderShapeAccent(effectiveShape)}
          {renderEyeCore()}
          {renderMarker()}
        </>
      ) : (
        renderLegacyDots()
      )}
    </svg>
  );
}