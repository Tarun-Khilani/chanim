import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, spring, interpolate, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import React from "react";
import { fonts } from "../utils/fonts";
import { RadiatingAsset } from "../components/RadiatingAsset";

export const LayoutSix = ({
  title,
  backgroundColor,
  asset,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fontFamily = fonts[title.font as keyof typeof fonts] || fonts.Inter;

  // Initial entrance animation
  const enter = spring({
    fps,
    frame: frame - fps,  // Start after 1 second
    config: {
      damping: 20,
      mass: 0.8,
    },
  });

  // Continuous radiating animation
  const radiate = interpolate(
    frame % fps,
    [0, fps / 2, fps],
    [1, 1.02, 1], // Reduced scale range for subtler effect
    {
      extrapolateRight: "clamp",
    }
  );

  // Calculate gradient colors
  const lighterColor = `${title.color}0D`; // 5% opacity
  const darkerColor = `${title.color}1A`;  // 10% opacity

  // Title entrance animation
  const titleScale = interpolate(enter, [0, 1], [0.8, 1]);
  const titleOpacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill 
      style={{ 
        backgroundColor,
        background: `radial-gradient(circle at 50% 40%, ${lighterColor} 0%, ${backgroundColor} 70%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background gradient circles */}
      <div 
        className="absolute z-[0]"
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 50% 40%, ${darkerColor} 0%, transparent 60%)`,
          opacity: 0.6,
          transform: `scale(${radiate})`,
        }}
      />

      {/* Content container */}
      <div className="relative z-[1]">
        {/* Title */}
        <h1
          className="text-[80px] font-bold text-center mb-8"
          style={{
            fontFamily,
            color: title.color,
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            textShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {title.text}
        </h1>

        {/* Asset container */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '40px',
          }}
        >
          <RadiatingAsset 
            assetName={asset} 
            position="center" 
            delay={fps} 
            scale={0.9}
          />
        </div>
      </div>
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
