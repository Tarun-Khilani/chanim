import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import React from "react";
import { fonts } from "../utils/fonts";
import { AnimatedAsset } from "../components/AnimatedAsset";
import { InsightCard } from "../components/InsightCard";

export const LayoutFive = ({
  title,
  backgroundColor,
  insights,
  asset,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fontFamily = fonts[title.font as keyof typeof fonts] || fonts.Inter;

  const titleEnter = spring({
    fps,
    frame: frame - 15,
    config: {
      damping: 12,
    },
  });

  const titleOpacity = interpolate(titleEnter, [0, 1], [0, 1]);
  const titleScale = interpolate(titleEnter, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 80px'
      }}
    >
      {/* Title with scale animation */}
      <div 
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          marginBottom: '60px'
        }}
      >
        <h1
          className="text-[60px] font-bold"
          style={{
            fontFamily,
            color: title.color,
          }}
        >
          {title.text}
        </h1>
      </div>

      {/* Left Asset */}
      <div className="absolute left-[80px] top-[200px]" style={{ width: '20%' }}>
        <AnimatedAsset assetName={asset} position="left" delay={fps * 1.5}  scale={1} />
      </div>

      {/* Right Asset */}
      <div className="absolute right-[80px] top-[200px]" style={{ width: '20%' }}>
        <AnimatedAsset 
          assetName={asset} 
          position="right" 
          delay={fps * 1.5} 
          scale={1}
        />
      </div>

      {/* Insights positioned in the center */}
      <div 
        className="absolute top-[200px]"
        style={{ 
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          left: '55%',
          transform: 'translateX(-50%)'
        }}
      >
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            text={insight}
            index={index}
            backgroundColor={title.color}
            color={backgroundColor}
            fontFamily={fontFamily}
          />
        ))}
      </div>
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
