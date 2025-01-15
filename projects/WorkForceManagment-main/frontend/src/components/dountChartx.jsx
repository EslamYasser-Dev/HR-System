/* eslint-disable react/prop-types */
import { DonutChart, Legend } from "@tremor/react";
import useSiteCounts from "../hooks/useSiteCounts";

const DonutChartx = ({ data }) => {
  const siteCounts = useSiteCounts(data);

  const valueFormatter = (number) =>
    `${Intl.NumberFormat("us").format(number).toString()} employees`;
  return (
    <div className="flex items-center justify-center space-x-6">
      <DonutChart
        data={siteCounts}
        category="count"
        index="site"
        valueFormatter={valueFormatter}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        className="w-40"
      />
      <Legend
        categories={siteCounts.map((item) => "site: " + item.site)}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        className="max-w-xs"
      />
    </div>
  );
};
export default DonutChartx;
