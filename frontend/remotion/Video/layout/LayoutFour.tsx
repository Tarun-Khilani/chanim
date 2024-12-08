import { z } from "zod";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { CompositionProps, VIDEO_FPS } from "../../../types/constants";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { fonts } from "../utils/fonts";
import { AnimatedAsset } from "../components/AnimatedAsset";
import { TextLetterWide } from "../text/TextLetterWide";


export const LayoutFour = ({
  title,
  backgroundColor,
  insights,
  asset,
}: z.infer<typeof CompositionProps>) => {
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
      <AnimatedAsset assetName={asset} position="left" delay={VIDEO_FPS} scale={0.7} />
      {/* Title at the top */}
      <TextComponent
        direction={title.animation !== "fade" ? getSlideDirection() : "left"}
      >
        <h1
          className="text-[60px] font-bold"
          style={{
            fontFamily,
            color: title.color,
            marginLeft: "180px",
          }}
        >
          {title.text}
        </h1>
      </TextComponent>

      {/* Centered Insights */}
      <TextLetterWide 
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
