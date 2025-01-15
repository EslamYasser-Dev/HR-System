import useFetch from "../hooks/useFetch";
import Loading from "../components/loading";
import { Card, Text } from "@tremor/react";
import DonutChartx from "../components/dountChartx";
import { Suspense } from "react";
const { VITE_EMPLOYEE_ENDPOINT, VITE_EMPLOYEE_IMG_ENDPOINT } = import.meta.env;
// const DataTable = lazy(() => import("../components/dataTable"));
import DataTable from "../components/dataTable";
const ManageEmployees = () => {
  let { data, loading, error } = useFetch(VITE_EMPLOYEE_ENDPOINT, {
    initialLoading: true,
    cacheTime: 60000,
    debounceTime: 300
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Text>An error occurred: {error}</Text>;
  }
  if (data.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Text className="text-xl sm:text-2xl font-bold">No employees found</Text>
      </div>
    );
  }

  if (data.length > 0) {
    return (
      <div className="p-4 m-5 bg-white shadow-sm rounded-xl sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:space-x-6 m-6">
          <div className="w-full mb-6 sm:w-1/2 lg:mb-0">
            <Text className="text-2xl sm:text-3xl font-bold">Employees According to Sites</Text>
            <DonutChartx data={data} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Total Available Men</p>
              <p className="text-2xl sm:text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{data.length}</p>
            </Card>

            <Card className="max-w-xs mx-auto" decoration="top" decorationColor="fuchsia">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Total Retired</p>
              <p className="text-2xl sm:text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">0</p>
            </Card>

            <Card className="max-w-xs mx-auto" decoration="top" decorationColor="orange">
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Total Man Power</p>
              <p className="text-2xl sm:text-4xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{data.length}</p>
            </Card>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <DataTable
            link={VITE_EMPLOYEE_IMG_ENDPOINT}
            data={data}
            title="Employees"
            loading={loading}
            error={error}
            addNew={true} />
        </Suspense>
      </div>
    );
  }
};

export default ManageEmployees;
