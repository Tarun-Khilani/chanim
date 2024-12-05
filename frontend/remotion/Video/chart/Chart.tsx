import { z } from "zod";
import { LineChart, BarChart, PieChart } from "../../../components/VictoryChart";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export const chartSchema = z.object({
  data: z.array(z.object({
    key: z.string(),
    data: z.number()
  })),
  color: z.string(),
  backgroundColor: z.string()
});

export const Chart: React.FC<z.infer<typeof chartSchema>> = ({ data, color, backgroundColor }) => {
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

  return (
    <div 
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        transformOrigin: 'center',
      }}
      className="origin-center"
    >
      <LineChart 
        data={data} 
        color={color} 
        backgroundColor={backgroundColor}
        width={chartWidth}
        height={chartHeight}
      />
    </div>
  );
};
