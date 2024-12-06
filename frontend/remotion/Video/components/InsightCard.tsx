import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

interface InsightCardProps {
  text: string;
  index: number;
  backgroundColor: string;
  color: string;
  fontFamily: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ text, index, backgroundColor, color, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    fps,
    frame: frame - (fps * 2) - (index * fps),
    config: {
      damping: 20,
      mass: 0.8,
    },
  });

  const translateY = interpolate(enter, [0, 1], [50, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      className="relative"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        className="absolute -left-2 top-1 w-1 h-full rounded-full"
        style={{
          backgroundColor: backgroundColor,
          opacity: 0.6,
        }}
      />
      <div
        className="bg-opacity-10 backdrop-blur-sm rounded-lg p-2"
        style={{
          backgroundColor: backgroundColor,
          width: '450px',
        }}
      >
        <p
          className="text-[24px] leading-relaxed font-bold"
          style={{
            color,
            fontFamily,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
