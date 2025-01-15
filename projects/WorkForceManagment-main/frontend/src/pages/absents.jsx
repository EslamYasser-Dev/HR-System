import { useState, useMemo, useCallback } from "react";
import { Select, SelectItem, Card, DateRangePicker, Button } from "@tremor/react";
import DataTable from "../components/dataTable";
import useFetch from "../hooks/useFetch";
import Loading from "../components/loading";

// Constants for state filters and decoration colors
const STATE_FILTERS = ["all", "out", "absent", "in"];
const CARD_DECORATION_COLORS = {
  out: "indigo",
  in: "fuchsia",
  absent: "orange",
};

const Absents = () => {
  const { VITE_ALL_ATTENDANCE_ENDPOINT, VITE_ATTENDANCE_IMG_ENDPOINT } = import.meta.env;

  const [constraints, setConstraints] = useState(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return { from: sevenDaysAgo, to: today, state: "all" };
  });

  const { data, loading, error } = useFetch(VITE_ALL_ATTENDANCE_ENDPOINT, {
    initialData: [],
    params: constraints,
    initialLoading: true,
    cacheTime: 30000,
    debounceTime: 300,
  });

  // Reset filters logic
  const handleResetFilters = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    setConstraints({
      from: sevenDaysAgo,
      to: today,
      state: "all",
    });
  };

  // Memoize the total outs in minutes calculation
  const totals = useMemo(() => {
    return data?.reduce(
      (acc, item) => {
        if (item.state === "out") acc.totalOuts++;
        if (item.state === "in") acc.totalIn++;
        if (item.state === "absent") acc.totalAbsents++;
        return acc;
      },
      { totalOuts: 0, totalIn: 0, totalAbsents: 0 }
    ) || { totalOuts: 0, totalIn: 0, totalAbsents: 0 };
  }, [data]);
  
  const { totalOuts, totalIn, totalAbsents } = totals;
  

  const handleSelectChange = useCallback((value) => {
    setConstraints((prevConstraints) => ({
      ...prevConstraints,
      state: value,
    }));
  }, []);

  const handleDateRangeChange = (newDateRange) => {
    setConstraints((prevConstraints) => ({
      ...prevConstraints,
      from: newDateRange.from,
      to: newDateRange.to,
    }));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>An error occurred: {error?.message || "Unknown error"}</div>;
  }

  // Render Card component
  const renderCard = (title, count, color) => (
    <Card className="w-full max-w-md mx-auto" decoration="top" decorationColor={color}>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{title}</p>
      <p className="text-2xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{count}</p>
    </Card>
  );

  // Render the component UI
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 lg:space-x-8 mb-6">
        {/* State filter */}
        <Select
          className="max-w-xs mb-4 sm:mb-0"
          value={constraints.state}
          onChange={handleSelectChange}
        >
          {STATE_FILTERS.map((state) => (
            <SelectItem key={state} value={state}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </SelectItem>
          ))}
        </Select>

        {/* Date range picker */}
        <DateRangePicker
          className="max-w-xs sm:max-w-md lg:max-w-lg"
          enableSelect={false}
          maxDate={new Date()}
          value={{ from: constraints.from, to: constraints.to }}
          onValueChange={handleDateRangeChange}
        />

        {/* Filter and Reset buttons */}
        {/* <Button onClick={handleSubmit}>Filter Data</Button> */}
        <Button onClick={handleResetFilters}>Reset Filters</Button>
      </div>

      {/* Display Card Information */}
      <div className="max-w-full m-auto grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3 sm:gap-6">
        {renderCard("Total Outs", totalOuts, CARD_DECORATION_COLORS.out)}
        {renderCard("Total In Site", totalIn, CARD_DECORATION_COLORS.in)}
        {renderCard("Total Absents", totalAbsents, CARD_DECORATION_COLORS.absent)}
      </div>

      <DataTable
        data={data}
        title="Attendance Data"
        link={VITE_ATTENDANCE_IMG_ENDPOINT}
        loading={loading}
        error={error}
        addNew={false}
      />
    </div>
  );
};

export default Absents;
