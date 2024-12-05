import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { TextLetter } from "../text/TextLetter";

loadFont();

export const LayoutFour = ({
  title,
  backgroundColor,
  insights,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TextComponent = title.animation === "fade" ? TextFade : TextSlide;

  const getSlideDirection = () => {
    switch (title.animation) {
      case "slide-left":
        return "right";
      case "slide-right":
        return "left";
      case "slide-up":
        return "down";
      case "slide-down":
        return "up";
      default:
        return "left";
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {/* Title at the top */}
      <TextComponent
        direction={title.animation !== "fade" ? getSlideDirection() : "left"}
      >
        <h1
          className="text-[70px] font-bold"
          style={{
            fontFamily,
            color: title.color,
          }}
        >
          {title.text}
        </h1>
      </TextComponent>

      {/* Centered Insights */}
      <TextLetter 
        insights={insights} 
        color={title.color}
        font={fontFamily}
        style={{ 
          // top: '30%', 
          width: '100%', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
