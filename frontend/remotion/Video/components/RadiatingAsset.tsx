import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Img, staticFile } from 'remotion';

interface RadiatingAssetProps {
  assetName: string;
  delay?: number;
  scale?: number;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  style?: React.CSSProperties;
}

export const RadiatingAsset: React.FC<RadiatingAssetProps> = ({
  assetName,
  delay = 0,
  scale = 1,
  position = 'center',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial entrance animation
  const entrance = spring({
    fps,
    frame: frame - delay,
    config: {
      damping: 200,
    },
    durationInFrames: 30,
  });

  // Continuous breathing animation using interpolate for smoother effect
  const progress = (frame % (fps * 2)) / (fps * 2); // 2 second loop
  const breathe = interpolate(
    progress,
    [0, 0.5, 1],
    [1, 1.1, 1],
    {
      extrapolateRight: 'loop',
    }
  );

  // Scale and opacity animation
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const baseScale = interpolate(entrance, [0, 1], [0.5, scale]);

  // Position based styles
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      width: '200px',
      height: '200px',
    };

    switch (position) {
      case 'left':
        return { ...baseStyles, marginLeft: '10%' };
      case 'right':
        return { ...baseStyles, marginRight: '10%' };
      case 'top':
        return { ...baseStyles, marginTop: '10%' };
      case 'bottom':
        return { ...baseStyles, marginBottom: '10%' };
      default:
        return baseStyles;
    }
  };

  return (
    <div 
      style={{ 
        opacity,
        transform: `scale(${baseScale * breathe})`,
        transition: 'transform 0.1s ease-out',
        ...getPositionStyles(),
        ...style,
      }}
    >
      <Img 
        src={staticFile(`icons/${assetName}`)} 
        style={{ 
          width: '100%', 
          height: '100%',
          objectFit: 'contain',
        }} 
      />
    </div>
  );
};
