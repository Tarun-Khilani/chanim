import { z } from "zod";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { CompositionProps, VIDEO_FPS } from "../../../types/constants";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { Chart } from "../chart/Chart";
import { TextLetter } from "../text/TextLetter";
import { fonts } from "../utils/fonts";
import { AnimatedAsset } from "../components/AnimatedAsset";


export const LayoutTwo = ({
  title,
  backgroundColor,
  chart,
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

      <TextComponent
        direction={title.animation !== "fade" ? getSlideDirection() : "left"}
      >
        <h1
          className="text-[60px] font-bold"
          style={{
            fontFamily,
            color: title.color,
            marginLeft: "180px"
          }}
        >
          {title.text}
        </h1>
      </TextComponent>

      {/* Left side - Insights */}
      <TextLetter 
        insights={insights} 
        color={title.color}
        font={fontFamily}
        style={{ left: '0%', top: '35%', width: '50%' }}
      />

      {/* Right side - Chart */}
      <AbsoluteFill style={{ left: '50%', top: '35%', width: '50%' }}>
        <div className="flex justify-center items-start px-12">
          <div className="w-full">
            <Chart 
              data={chart.data} 
              colors={chart.colors} 
              backgroundColor={chart.backgroundColor}
              chartType={chart.chartType}
            />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};