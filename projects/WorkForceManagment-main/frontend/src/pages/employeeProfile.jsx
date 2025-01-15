import { Card, DonutChart, Text, Legend } from "@tremor/react";
import DataTable from "../components/dataTable";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
const { VITE_NODE_EMPLOYEE } = import.meta.env;
const EmployeeProfile = () => {
    const { id } = useParams();
    const { data, Loading, error } = useFetch(VITE_NODE_EMPLOYEE`/stats/${id}`);
    const summaryText = `${data.name}'s statistics`;

    if (Loading) { return <Text>loading ...</Text> }
    if (error) { return <Text>error: ${error}</Text> }

    if (data) return (
        <>
            <Card className="flex flex-col-2">
                <>
                    <Text>{summaryText}</Text>
                    <Text>Current Job : {data.category}</Text>
                    <Text>Site : {data.site}</Text>
                </>

                <>
                    <Text>Summary</Text>
                    <DonutChart
                        data={data}
                        category="percentage"
                        index="type"
                        colors={['blue', 'violet', 'fuchsia']}
                    />
                    <Legend
                        categories={['Absents', 'In', 'Outs']}
                        colors={['blue', 'violet', 'fuchsia']}
                        className="max-w-xs"
                    />
                </>
            </Card>

            <Card>
                <DataTable />
            </Card>
        </>
    );
};

export default EmployeeProfile;
