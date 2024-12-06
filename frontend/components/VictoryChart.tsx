import React from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryArea,
  VictoryLabel,
  VictoryBar,
  VictoryPie,
  VictoryContainer,
  VictoryStack,
  VictoryGroup,
  VictoryLegend,
} from 'victory';

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
}

interface MultiSeriesChartProps {
  data: MultiSeriesDataPoint[];
  width?: number;
  height?: number;
  colors?: string[];
  backgroundColor?: string;
}

export const LineChart: React.FC<ChartProps> = ({ 
  data, 
  width = 600, 
  height = 400,
  color = "#c43a31",
  backgroundColor = "#ffffff"
}) => {
  const transformedData = data.map((point) => ({
    x: point.key,
    y: point.data
  }));

  const maxY = Math.max(...data.map(d => d.data)) * 1.2;

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryArea
          data={transformedData}
          style={{
            data: { 
              fill: color,
              opacity: 0.1
            }
          }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />

        <VictoryLine
          style={{
            data: { 
              stroke: color,
              strokeWidth: 3
            }
          }}
          data={transformedData}
          labels={({ datum }) => Math.round(datum.y)}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
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
  backgroundColor = "#ffffff"
}) => {
  const transformedData = data.map((point) => ({
    x: point.key,
    y: point.data
  }));

  const maxY = Math.max(...data.map(d => d.data)) * 1.2;

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 50 }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: color, opacity: 0.3 },
            grid: { stroke: color, opacity: 0.1 },
            tickLabels: { fill: color, opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryBar
          data={transformedData}
          style={{
            data: { 
              fill: color,
              opacity: 0.8
            }
          }}
          cornerRadius={{ top: 8 }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
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
  color = "#c43a31",
  backgroundColor = "#ffffff"
}) => {
  const total = Math.round(data.reduce((sum, point) => sum + point.data, 0) * 1000) / 1000;
  const transformedData = data.map((point) => ({
    x: point.key,
    y: Math.round(point.data * 1000) / 1000,
    label: `${point.key}\n${Math.round((point.data / total) * 1000) / 10}%`
  }));

  const colorScale = data.map((_, i) => {
    const opacity = 1 - (i * 0.2);
    return color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
  });

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryPie
        theme={VictoryTheme.material}
        width={width}
        height={height}
        data={transformedData}
        colorScale={colorScale}
        style={{
          labels: { 
            fill: color,
            fontSize: 14
          }
        }}
        containerComponent={
          <VictoryContainer
            style={{
              touchAction: "auto"
            }}
          />
        }
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
        padAngle={2}
        innerRadius={50}
      />
    </div>
  );
};

export const StackedBarChart: React.FC<MultiSeriesChartProps> = ({
  data,
  width = 600,
  height = 400,
  colors = ["#c43a31", "#2196f3", "#4caf50", "#ff9800"],
  backgroundColor = "#ffffff"
}) => {
  const series = Object.keys(data[0].values);
  const transformedData = series.map(seriesName => 
    data.map(point => ({
      x: point.key,
      y: point.values[seriesName]
    }))
  );

  const maxY = data.reduce((max, point) => {
    const sum = Object.values(point.values).reduce((a, b) => a + b, 0);
    return Math.max(max, sum);
  }, 0) * 1.2;

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 50 }}
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
            axis: { stroke: "transparent" },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryStack
          colorScale={colors}
        >
          {transformedData.map((seriesData, index) => (
            <VictoryBar
              key={index}
              data={seriesData}
              style={{
                data: { 
                  opacity: 0.8
                }
              }}
              cornerRadius={index === transformedData.length - 1 ? { top: 8 } : 0}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
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
  colors = ["#c43a31", "#2196f3", "#4caf50", "#ff9800"],
  backgroundColor = "#ffffff"
}) => {
  const series = Object.keys(data[0].values);
  const transformedData = series.map(seriesName => 
    data.map(point => ({
      x: point.key,
      y: point.values[seriesName]
    }))
  );

  const maxY = data.reduce((max, point) => {
    const highest = Math.max(...Object.values(point.values));
    return Math.max(max, highest);
  }, 0) * 1.2;

  return (
    <div style={{ backgroundColor, padding: "20px" }}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width}
        height={height}
        domain={{ y: [0, maxY] }}
        domainPadding={{ x: 50 }}
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
            axis: { stroke: "transparent" },
            grid: { stroke: colors[0], opacity: 0.1 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 12 }
          }}
        />
        <VictoryAxis
          style={{
            axis: { stroke: colors[0], opacity: 0.3 },
            tickLabels: { fill: colors[0], opacity: 0.7, fontSize: 14 }
          }}
        />
        
        <VictoryGroup
          offset={50}
          colorScale={colors}
        >
          {transformedData.map((seriesData, index) => (
            <VictoryBar
              key={index}
              data={seriesData}
              style={{
                data: { 
                  opacity: 0.8
                }
              }}
              cornerRadius={{ top: 8 }}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          ))}
        </VictoryGroup>
      </VictoryChart>
    </div>
  );
};