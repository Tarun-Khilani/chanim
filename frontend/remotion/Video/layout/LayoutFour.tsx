import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { TextLetter } from "../text/TextLetter";
import { fonts } from "../utils/fonts";
import { AnimatedAsset } from "../components/AnimatedAsset";


export const LayoutFour = ({
  title,
  backgroundColor,
  insights,
  asset,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TextComponent = title.animation === "fade" ? TextFade : TextSlide;
  const fontFamily = fonts[title.font as keyof typeof fonts] || fonts.Inter;

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
      <AnimatedAsset assetName={asset} position="left" delay={10} scale={0.7} />
      {/* Title at the top */}
      <TextComponent
        direction={title.animation !== "fade" ? getSlideDirection() : "left"}
      >
        <h1
          className="text-[70px] font-bold"
          style={{
            fontFamily,
            color: title.color,
            marginLeft: "160px",
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
