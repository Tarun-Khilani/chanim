import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TextSlide: React.FC<{
  children: React.ReactNode;
  direction: "left" | "right" | "up" | "down";
}> = ({ children, direction }) => {
  const { fps, width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const progress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    durationInFrames: 60,
  });

  const slideAnimation = useMemo(() => {
    const distance =
      direction === "left" || direction === "right" ? width : height;
    const start =
      direction === "right" || direction === "down" ? -distance : distance;
    const end = 0;

    const translateValue = interpolate(progress, [0, 1], [start, end], {
      easing: Easing.inOut(Easing.quad),
    });

    switch (direction) {
      case "left":
      case "right":
        return { transform: `translateX(${translateValue}px)` };
      case "up":
      case "down":
        return { transform: `translateY(${translateValue}px)` };
    }
  }, [direction, progress, width, height]);

  const content: React.CSSProperties = useMemo(() => {
    return {
      ...slideAnimation,
      position: "absolute",
      top: 20,
      left: 40,
    };
  }, [slideAnimation]);

  return (
    <AbsoluteFill>
      <AbsoluteFill className="justify-center items-center">
        <div style={content}>{children}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
