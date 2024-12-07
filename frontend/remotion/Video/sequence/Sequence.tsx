import { Sequence as RemotionSequence } from 'remotion';
import { AbsoluteFill } from 'remotion';
import React from 'react';
import { ChartType, LayoutType } from '../utils/mappings';
import { Layout } from '../layout/Layout';
import { DURATION_IN_FRAMES } from '../../../types/constants';

export interface SequenceProps {
  title: { 
    text: string;
    animation: string;
    color: string;
    font: string;
  };
  backgroundColor: string;
  chart: {
    data: Array<{ key: string; data: number }>;
    colors: string[];
    backgroundColor: string;
    chartType: ChartType;
  };
  asset: string;
  arrangement: LayoutType;
  insights: string[];
}

interface SequenceComponentProps {
  sequences: SequenceProps[];
}

export const Sequence: React.FC<SequenceComponentProps> = ({ sequences }) => {
  return (
    <AbsoluteFill>
      {sequences.map((sequence, index) => (
        <RemotionSequence 
          key={index} 
          from={index * DURATION_IN_FRAMES} 
          durationInFrames={DURATION_IN_FRAMES}
        >
          <Layout {...sequence} />
        </RemotionSequence>
      ))}
    </AbsoluteFill>
  );
};
