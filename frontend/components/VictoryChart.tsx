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
  VictoryLabel
} from 'victory';
import { VIDEO_FPS, DURATION_IN_FRAMES } from '../types/constants';

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
  colors?: string[];
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
  colors = ["#10B981"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const chartColor = Array.isArray(colors) ? colors[0] : colors;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const { transformedData, maxY } = useMemo(() => {
    const transformed = data.map((point) => ({
      x: point.key,
      y: point.data
    }));
    const max = Math.max(...data.map(d => d.data)) * 1.2;
    return { transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((point, index) => {
    // Stagger the animation for each point
    const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
    
    // Create a separate progress for each point
    const pointProgress = spring({
      frame: frame - pointStartFrame,
      fps,
      config: {
        damping: 200,
      },
    });

    return {
      x: point.x,
      y: interpolate(
        pointProgress, 
        [0, 1], 
        [0, point.y],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    };
  });

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
            axis: { stroke: chartColor, opacity: 0.3 },
            grid: { stroke: chartColor, opacity: 0.1 },
            tickLabels: { fill: chartColor, opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: chartColor, opacity: 0.3 },
            grid: { stroke: chartColor, opacity: 0.1 },
            tickLabels: { 
              fill: chartColor, 
              opacity: 0.7, 
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
              fill: chartColor,
              opacity: spring({
                frame: frame - startFrame,
                fps,
                config: { damping: 200 }
              }) * 0.1
            }
          }}
        />

        <VictoryLine
          style={{
            data: { 
              stroke: chartColor,
              strokeWidth: 3,
              opacity: transformedData.map((_, index) => {
                const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
                const pointProgress = spring({
                  frame: frame - pointStartFrame,
                  fps,
                  config: { damping: 200 }
                });
                return pointProgress;
              })
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
  colors = ["#10B981", "#72bc4e", "#b8b712", "#ff9800"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const { transformedData, maxY } = useMemo(() => {
    const transformed = data.map((point, index) => ({
      x: point.key,
      y: point.data,
      fill: colors[index % colors.length],
    }));
    const max = Math.max(...data.map(d => d.data)) * 1.2;
    return { transformedData: transformed, maxY: max };
  }, [data]);

  const animatedData = transformedData.map((point, index) => {
    // Stagger the animation for each bar
    const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
    
    // Create a separate progress for each bar
    const pointProgress = spring({
      frame: frame - pointStartFrame,
      fps,
      config: {
        damping: 200,
      },
    });

    return {
      x: point.x,
      y: interpolate(
        pointProgress, 
        [0, 1], 
        [0, point.y],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ),
      fill: point.fill
    };
  });

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
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryBar
          data={animatedData}
          style={{
            data: { 
              fill: ({ datum }) => datum.fill,
              opacity: transformedData.map((_, index) => {
                const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
                const pointProgress = spring({
                  frame: frame - pointStartFrame,
                  fps,
                  config: { damping: 200 }
                });
                return pointProgress * 0.8;
              })
            }
          }}
        />
      </VictoryChart>
    </div>
  );
};

export const PieChart: React.FC<ChartProps> = ({
  data,
  width = 400,
  height = 400,
  colors = ["#10B981", "#72bc4e", "#b8b712", "#ff9800"],
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
    const transformed = data.map((point, index) => ({
      x: point.key,
      y: Math.round(point.data * 1000) / 1000,
      label: `${point.key}\n${Math.round((point.data / total) * 1000) / 10}%`,
      fill: colors[index % colors.length]
    }));
    
    const colorsScale = data.map((_, i) => {
      const opacity = 1 - (i * 0.2);
      return colors[i % colors.length].replace(')', `, ${opacity})`).replace('rgb', 'rgba');
    });

    return { transformedData: transformed, colorScale: colorsScale };
  }, [data, colors[0]]);

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
            fill: colors[0],
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
  colors = ["#10B981", "#72bc4e", "#b8b712", "#ff9800"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const { transformedData, maxY, seriesKeys } = useMemo(() => {
    const keys = Object.keys(data[0].values);
    
    const transformed = data.map((point) => {
      const stackedPoint: { [key: string]: number } = { x: point.key };
      let currentHeight = 0;
      
      keys.forEach((series) => {
        const value = point.values[series] || 0;
        stackedPoint[series] = value;
        currentHeight += value;
      });
      
      return { 
        x: point.key, 
        ...stackedPoint,
        total: currentHeight
      };
    });

    const max = Math.max(...transformed.map(d => d.total)) * 1.2;

    return { 
      transformedData: transformed, 
      maxY: max, 
      seriesKeys: keys 
    };
  }, [data]);

  const animatedData = transformedData.map((point, index) => {
    const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
    
    const pointProgress = spring({
      frame: frame - pointStartFrame,
      fps,
      config: {
        damping: 200,
      },
    });

    const interpolatedPoint: { [key: string]: number } = { x: point.x };
    seriesKeys.forEach(series => {
      interpolatedPoint[series] = interpolate(
        pointProgress, 
        [0, 1], 
        [0, point[series]],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
    });

    return interpolatedPoint;
  });

  const labelOpacity = transformedData.map((_, index) => {
    const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
    const pointProgress = spring({
      frame: frame - pointStartFrame,
      fps,
      config: { damping: 200 }
    });
    return pointProgress;
  });

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
        <VictoryLegend
          x={width /2}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{ 
            labels: { fill: colors[0], fontSize: 12 }
          }}
          data={seriesKeys.map((seriesName, i) => ({
            name: seriesName,
            symbol: { fill: colors[i % colors.length] }
          }))}
        />
        
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryStack
          style={{
            data: { 
              strokeWidth: 0,
              stroke: backgroundColor
            }
          }}
        >
          {seriesKeys.map((series, seriesIndex) => (
            <VictoryBar
              key={series}
              data={animatedData}
              x="x"
              y={series}
              labels={({ datum }) => {
                const value = datum[series];
                return value > 0 ? Math.round(value) : '';
              }}
              labelComponent={
                <VictoryLabel
                  style={[{
                    fill: colors[0],
                    fontSize: 10,
                    opacity: labelOpacity
                  }]}
                />
              }
              style={{
                data: { 
                  fill: colors[seriesIndex % colors.length],
                  opacity: transformedData.map((_, index) => {
                    const pointStartFrame = startFrame + index * (DURATION_IN_FRAMES / transformedData.length);
                    const pointProgress = spring({
                      frame: frame - pointStartFrame,
                      fps,
                      config: { damping: 200 }
                    });
                    return pointProgress * 0.8;
                  })
                }
              }}
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
  colors = ["#10B981", "#72bc4e", "#b8b712", "#ff9800"],
  backgroundColor = "#ffffff",
  startFrame = VIDEO_FPS
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Validate and prepare data
  if (!data || data.length === 0) {
    return null;
  }

  // Extract series keys
  const seriesKeys = Object.keys(data[0].values);

  // Prepare data for rendering
  const chartData = seriesKeys.map((series, seriesIndex) => 
    data.map((point, index) => ({
      x: point.key,
      y: point.values[series] || 0,
      fill: colors[seriesIndex % colors.length],
      index
    }))
  );

  // Calculate max Y value
  const maxY = Math.max(
    ...data.map(point => 
      Object.values(point.values).reduce((a, b) => Math.max(a, b), 0)
    )
  ) * 1.2;

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
        <VictoryLegend
          x={width / 2}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{ 
            labels: { fill: colors[0], fontSize: 12 }
          }}
          data={seriesKeys.map((seriesName, i) => ({
            name: seriesName,
            symbol: { fill: colors[i % colors.length] }
          }))}
        />
        
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryGroup
          offset={20}
          style={{
            data: { 
              strokeWidth: 0,
              stroke: backgroundColor
            }
          }}
        >
          {chartData.map((seriesData, seriesIndex) => (
            <VictoryBar
              key={seriesKeys[seriesIndex]}
              data={seriesData.map(point => {
                // Calculate individual point progress with staggered start
                const pointStartFrame = startFrame + 
                  point.index * (DURATION_IN_FRAMES / (data.length));
                
                const pointProgress = spring({
                  frame: frame - pointStartFrame,
                  fps,
                  config: { damping: 200 }
                });

                return {
                  x: point.x,
                  y: interpolate(
                    pointProgress, 
                    [0, 1], 
                    [0, point.y],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )
                };
              })}
              style={{
                data: { 
                  fill: seriesData[0].fill,
                  opacity: seriesData.map(point => {
                    const pointStartFrame = startFrame + 
                      point.index * (DURATION_IN_FRAMES / (data.length * seriesKeys.length));
                    
                    const pointProgress = spring({
                      frame: frame - pointStartFrame,
                      fps,
                      config: { damping: 200 }
                    });

                    return pointProgress * 0.8;
                  })
                }
              }}
              labels={({ datum }) => 
                datum.y > 0 ? Math.round(datum.y).toString() : ''
              }
              labelComponent={
                <VictoryLabel
                  style={{
                    fill: colors[0],
                    fontSize: 10,
                    opacity: seriesData.map(point => {
                      const pointStartFrame = startFrame + 
                        point.index * (DURATION_IN_FRAMES / (data.length * seriesKeys.length));
                      
                      const pointProgress = spring({
                        frame: frame - pointStartFrame,
                        fps,
                        config: { damping: 200 }
                      });

                      return pointProgress;
                    })
                  }}
                />
              }
            />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
};