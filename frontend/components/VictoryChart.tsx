import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryArea,
  VictoryBar,
  VictoryPie,
  VictoryContainer,
  VictoryStack,
  VictoryGroup,
  VictoryLegend,
} from 'victory';
import { VIDEO_FPS } from '../types/constants';

interface DataPoint {
  key: string;
  data: number;
}

interface MultiSeriesDataPoint {
  key: string;
  values: { [series: string]: number };
}

interface ChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  startFrame?: number;
}

interface MultiSeriesChartProps {
  data: MultiSeriesDataPoint[];
  width?: number;
  height?: number;
  colors?: string[];
  backgroundColor?: string;
  startFrame?: number;
}

export const LineChart: React.FC<ChartProps> = ({ 
  data, 
  width = 600, 
  height = 400,
  color = "#c43a31",
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 200,
    },
  });

  const { transformedData, maxY } = useMemo(() => {
    const transformed = data.map((point) => ({
      x: point.key,
      y: point.data
    }));
    const max = Math.max(...data.map(d => d.data)) * 1.2;
    return { transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((point) => ({
    x: point.x,
    y: interpolate(progress, [0, 1], [0, point.y])
  }));

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7 * progress, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { 
              fill: color, 
              opacity: 0.7 * progress, 
              fontSize: 12,
              angle: -30,
              textAnchor: 'end'
            }
          }}
        />
        
        <VictoryArea
          data={animatedData}
          style={{
            data: { 
              fill: color,
              opacity: 0.1 * progress
            }
          }}
        />

        <VictoryLine
          style={{
            data: { 
              stroke: color,
              strokeWidth: 3,
              opacity: progress
            }
          }}
          data={animatedData}
          labels={({ datum }) => Math.round(datum.y)}
        />
      </VictoryChart>
    </div>
  );
};

export const BarChart: React.FC<ChartProps> = ({
  data,
  width = 600,
  height = 400,
  color = "#c43a31",
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 200,
    },
  });

  const { transformedData, maxY } = useMemo(() => {
    const transformed = data.map((point) => ({
      x: point.key,
      y: point.data
    }));
    const max = Math.max(...data.map(d => d.data)) * 1.2;
    return { transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((point) => ({
    x: point.x,
    y: interpolate(progress, [0, 1], [0, point.y])
  }));

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 50 }}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7 * progress, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7 * progress, fontSize: 14 }
          }}
        />
        
        <VictoryBar
          data={animatedData}
          style={{
            data: { 
              fill: color,
              opacity: 0.8 * progress
            }
          }}
          cornerRadius={{ top: 8 }}
        />
      </VictoryChart>
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({
  data,
  width = 400,
  height = 400,
  color = "#c43a31",
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 200,
    },
  });

  const { transformedData, colorScale } = useMemo(() => {
    const total = Math.round(data.reduce((sum, point) => sum + point.data, 0) * 1000) / 1000;
    const transformed = data.map((point) => ({
      x: point.key,
      y: Math.round(point.data * 1000) / 1000,
      label: `${point.key}\n${Math.round((point.data / total) * 1000) / 10}%`
    }));
    
    const colors = data.map((_, i) => {
      const opacity = 1 - (i * 0.2);
      return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    });

    return { transformedData: transformed, colorScale: colors };
  }, [data, color]);

  const animatedData = transformedData.map((point) => ({
    ...point,
    y: interpolate(progress, [0, 1], [0, point.y])
  }));

  const animatedInnerRadius = interpolate(progress, [0, 1], [0, 50]);
  const animatedPadAngle = interpolate(progress, [0, 1], [0, 2]);

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryPie
        theme={VictoryTheme.material}
        width={width}
        height={height}
        data={animatedData}
        colorScale={colorScale}
        style={{
          labels: { 
            fill: color,
            fontSize: 14,
            opacity: progress
          }
        }}
        containerComponent={
          <VictoryContainer
            responsive={false}
            style={{
              touchAction: "auto"
            }}
          />
        }
        padAngle={animatedPadAngle}
        innerRadius={animatedInnerRadius}
      />
    </div>
  );
};

export const StackedBarChart: React.FC<MultiSeriesChartProps> = ({
  data,
  width = 600,
  height = 400,
  colors = ["#c43a31", "#2196f3", "#4caf50", "#ff9800"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 200,
    },
  });

  const { series, transformedData, maxY } = useMemo(() => {
    const seriesNames = Object.keys(data[0].values);
    const transformed = seriesNames.map(seriesName => 
      data.map(point => ({
        x: point.key,
        y: point.values[seriesName]
      }))
    );
    const max = data.reduce((max, point) => {
      const sum = Object.values(point.values).reduce((a, b) => a + b, 0);
      return Math.max(max, sum);
    }, 0) * 1.2;

    return { series: seriesNames, transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((seriesData) => 
    seriesData.map((point) => ({
      x: point.x,
      y: interpolate(progress, [0, 1], [0, point.y])
    }))
  );

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 60 }}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryLegend
          x={width - 150}
          y={20}
          orientation="vertical"
          gutter={20}
          style={{ 
            labels: { fill: colors[0], fontSize: 12 }
          }}
          data={series.map((seriesName, i) => ({
            name: seriesName,
            symbol: { fill: colors[i % colors.length] }
          }))}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7 * progress, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7 * progress, fontSize: 14 }
          }}
        />
        
        <VictoryStack
          colorScale={colors}
        >
          {animatedData.map((seriesData, index) => (
            <VictoryBar
              key={index}
              data={seriesData}
              style={{
                data: { 
                  opacity: 0.8 * progress
                }
              }}
              cornerRadius={index === animatedData.length - 1 ? { top: 8 } : 0}
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </div>
  );
};

export const GroupedBarChart: React.FC<MultiSeriesChartProps> = ({
  data,
  width = 600,
  height = 400,
  colors = ["#c43a31", "#2196f3", "#4caf50", "#ff9800"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 200,
    },
  });

  const { series, transformedData, maxY } = useMemo(() => {
    const seriesNames = Object.keys(data[0].values);
    const transformed = seriesNames.map(seriesName => 
      data.map(point => ({
        x: point.key,
        y: point.values[seriesName]
      }))
    );
    const max = data.reduce((max, point) => {
      const highest = Math.max(...Object.values(point.values));
      return Math.max(max, highest);
    }, 0) * 1.2;

    return { series: seriesNames, transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((seriesData) => 
    seriesData.map((point) => ({
      x: point.x,
      y: interpolate(progress, [0, 1], [0, point.y])
    }))
  );

  return (
    <div style={{ backgroundColor, padding: "10px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 60 }}
        containerComponent={<VictoryContainer responsive={false} />}
      >
        <VictoryLegend
          x={width - 150}
          y={20}
          orientation="vertical"
          gutter={20}
          style={{ 
            labels: { fill: colors[0], fontSize: 12 }
          }}
          data={series.map((seriesName, i) => ({
            name: seriesName,
            symbol: { fill: colors[i % colors.length] }
          }))}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7 * progress, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7 * progress, fontSize: 14 }
          }}
        />
        
        <VictoryGroup
          offset={15}
          colorScale={colors}
        >
          {animatedData.map((seriesData, index) => (
            <VictoryBar
              key={index}
              data={seriesData}
              style={{
                data: { 
                  opacity: 0.8 * progress
                }
              }}
              cornerRadius={{ top: 8 }}
            />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
};