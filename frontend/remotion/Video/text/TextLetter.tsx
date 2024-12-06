import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DURATION_IN_FRAMES } from "../../../types/constants";

const MAX_CHARS_PER_LINE = 45; // Maximum characters per line

export const TextLetter: React.FC<{
  insights: string[];
  color: string;
  font?: string;
  style?: React.CSSProperties;
}> = ({ insights, color, font = "Arial", style = {} }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Function to split text into lines
  const splitIntoLines = (text: string): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + " " + word).length <= MAX_CHARS_PER_LINE) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Calculate total number of letters across all lines
  const allLines = insights.flatMap(splitIntoLines);
  const totalLetters = allLines.reduce((acc, line) => acc + line.replace(/\s/g, '').length, 0);
  
  // Calculate delay per letter to spread across duration
  const availableFrames = DURATION_IN_FRAMES - 2 * fps;
  const delayPerLetter = Math.max(1, availableFrames / totalLetters);

  // Keep track of cumulative letter index for animation delay
  let cumulativeLetterIndex = 0;

  return (
    <AbsoluteFill style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center", // Center horizontally
          paddingLeft: "2rem",
          paddingRight: "2rem",
          fontFamily: font,
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto', // Center the container
        }}
      >
        {insights.map((text, insightIndex) => {
          const lines = splitIntoLines(text);
          return (
            <div 
              key={insightIndex} 
              style={{ 
                marginBottom: "1.5rem",
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center each insight block
              }}
            >
              {lines.map((line, lineIndex) => {
                const words = line.split(" ");
                return (
                  <p
                    key={lineIndex}
                    style={{
                      fontSize: "24px",
                      marginBottom: lineIndex === lines.length - 1 ? 0 : "0.5rem",
                      lineHeight: 1.4,
                      color,
                      opacity: 0.9,
                      textAlign: 'center', // Center text
                    }}
                  >
                    {words.map((word, wordIndex) => {
                      const letters = word.split("");
                      return (
                        <React.Fragment key={wordIndex}>
                          {letters.map((letter, letterIndex) => {
                            cumulativeLetterIndex++;
                            const delay = 15 + (cumulativeLetterIndex * delayPerLetter);
                            const progress = spring({
                              frame: frame - delay,
                              fps,
                              config: {
                                damping: 200,
                              },
                            });

                            const opacity = interpolate(progress, [0, 1], [0, 1]);
                            const translateY = interpolate(
                              progress,
                              [0, 1],
                              [20, 0]
                            );

                            return (
                              <span
                                key={letterIndex}
                                style={{
                                  display: "inline-block",
                                  opacity,
                                  transform: `translateY(${translateY}px)`,
                                }}
                              >
                                {letter}
                              </span>
                            );
                          })}
                          {wordIndex !== words.length - 1 ? " " : ""}
                        </React.Fragment>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
