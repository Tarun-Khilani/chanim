import { LineChart, BarChart, PieChart, StackedBarChart, GroupedBarChart } from "../../../components/VictoryChart";
import { LayoutOne } from "../layout/LayoutOne";
import { LayoutTwo } from "../layout/LayoutTwo";
import { LayoutThree } from "../layout/LayoutThree";
import { LayoutFour } from "../layout/LayoutFour";

export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie",
  STACKED_BAR = "stacked_bar",
  GROUPED_BAR = "grouped_bar",
}

export enum LayoutType {
  LEFT_CHART_RIGHT_TEXT = "LEFT_CHART_RIGHT_TEXT",
  RIGHT_CHART_LEFT_TEXT = "RIGHT_CHART_LEFT_TEXT",
  CHART_CENTER_TEXT_BELOW = "CHART_CENTER_TEXT_BELOW",
  TOP_TITLE_BOTTOM_CONTENT = "TOP_TITLE_BOTTOM_CONTENT",
}

export const ChartComponentMap = {
  [ChartType.BAR]: BarChart,
  [ChartType.LINE]: LineChart,
  [ChartType.PIE]: PieChart,
  [ChartType.STACKED_BAR]: StackedBarChart,
  [ChartType.GROUPED_BAR]: GroupedBarChart,
} as const;

export const LayoutComponentMap = {
  [LayoutType.LEFT_CHART_RIGHT_TEXT]: LayoutOne,
  [LayoutType.RIGHT_CHART_LEFT_TEXT]: LayoutTwo,
  [LayoutType.CHART_CENTER_TEXT_BELOW]: LayoutThree,
  [LayoutType.TOP_TITLE_BOTTOM_CONTENT]: LayoutFour,
} as const;
