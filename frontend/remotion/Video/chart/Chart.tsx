import { z } from "zod";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";
import { ChartComponentMap, ChartType } from "../utils/mappings";

export const chartSchema = z.object({
  data: z.array(z.object({
    key: z.string(),
    data: z.number()
  })),
  colors: z.array(z.string()),
  backgroundColor: z.string(),
  chartType: z.nativeEnum(ChartType).nullable()
});

export const Chart: React.FC<z.infer<typeof chartSchema>> = ({ 
  data, 
  colors, 
  backgroundColor,
  chartType
}) => {
  const { width: videoWidth, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Make chart responsive but slightly smaller for better layout
  const chartWidth = Math.min(videoWidth * 0.4, 700);
  const chartHeight = chartWidth * 0.6;

  // Animation progress
  const progress = spring({
    fps,
    frame,
    config: {
      damping: 100,
    },
    durationInFrames: 30,
  });

  // Scale and opacity animation
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [50, 0]);

  if (!chartType) return null;

  const ChartComponent = ChartComponentMap[chartType];
  if (!ChartComponent) return null;

  return (
    <div 
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        transformOrigin: 'center',
      }}
      className="origin-center"
    >
      <ChartComponent
        data={data}
        width={chartWidth}
        height={chartHeight}
        colors={colors}
        backgroundColor={backgroundColor}
      />
    </div>
  );
};
