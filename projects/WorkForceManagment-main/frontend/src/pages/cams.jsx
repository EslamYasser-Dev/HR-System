import useFetch from "../hooks/useFetch";
import Loading from "../components/loading";
import { Card, Text } from "@tremor/react";
// import DonutChartx from "../components/dountChartx";
import { Suspense } from "react";
const { VITE_CAMERAS_ENDPOINT, VITE_EMPLOYEE_IMG_ENDPOINT } = import.meta.env;
import CamDataTable from "../components/camDataTable";
const ManageCams = () => {
  let { data, loading, error } = useFetch(VITE_CAMERAS_ENDPOINT, {
    initialLoading: true,
    cacheTime: 60000,
    debounceTime: 300,
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  if (data) {
    return (
      <div className="p-4 m-5 bg-white shadow-sm rounded-xl sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-center m-6">
          <div className="w-full mb-6 sm:w-1/2 lg:mb-0">
            <Text className="text-2xl sm:text-3xl font-bold mb-5 text-center">
              Cameras According to Sites
            </Text>
            {/* <DonutChartx data={data} /> */}
          </div>

          <div className="lg:ml-auto flex">
            <Card
              className="w-max mx-auto"
              decoration="top"
              decorationColor="indigo"
            >
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Total Available Cameras
              </p>
              <p className="text-2xl sm:text-3xl font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {data.length}
              </p>
            </Card>
          </div>
        </div>

        <Suspense fallback={<Loading />}>
          <CamDataTable
            link={VITE_EMPLOYEE_IMG_ENDPOINT}
            data={data}
            title="Areas & its Cameras"
            loading={loading}
            error={error}
            addNew={true}
          />
        </Suspense>
      </div>
    );
  }
};

export default ManageCams;
