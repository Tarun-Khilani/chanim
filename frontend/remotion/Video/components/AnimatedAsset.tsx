import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AbsoluteFill, Img, staticFile } from 'remotion';

interface AnimatedAssetProps {
  assetName: string;
  delay?: number;
  scale?: number;
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

export const AnimatedAsset: React.FC<AnimatedAssetProps> = ({
  assetName,
  delay = 0,
  scale = 1,
  position = 'center',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame: frame - delay,
    config: {
      damping: 200,
    },
    durationInFrames: 30,
  });

  // Scale and opacity animation
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scaleValue = interpolate(progress, [0, 1], [0.5, scale]);

  // Position based styles
  const getPositionStyles = () => {
    switch (position) {
      case 'left':
        return { left: '10%', top: '50%', transform: 'translate(-50%, -50%)' };
      case 'right':
        return { right: '10%', top: '50%', transform: 'translate(50%, -50%)' };
      case 'top':
        return { top: '10%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'bottom':
        return { bottom: '10%', left: '50%', transform: 'translate(-50%, 50%)' };
      default:
        return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <AbsoluteFill style={{ ...getPositionStyles(), opacity }}>
      <Img
        src={staticFile(`icons/${assetName}`)}
        style={{
          width: 'auto',
          height: '200px',
          transform: `scale(${scaleValue})`,
        }}
      />
    </AbsoluteFill>
  );
};
