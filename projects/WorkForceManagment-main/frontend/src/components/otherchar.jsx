import { useMemo } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { useSocketDataContext } from '../context/SocketDataContext';
import { Badge } from '@tremor/react';

const OtherChart = ({ area }) => {
  const { data, connected } = useSocketDataContext();
  console.log(connected);

  // Memoize filteredData to avoid recalculating on every render
  const filteredData = useMemo(() => {
    if (!data) return [];

    const filtered = data?.filter((field) => field?.area === area);
    return filtered.map(item => ({
      x: Math.floor(Math.random() * 20) + 2, // Generate random x value
      y: Math.floor(Math.random() * 20) + 2, // Generate random y value
      name: item.employeeName,
    }));
  }, [data, area]);

  return (
    <>
      <span className="p-2 font-semibold text-white bg-blue-800 rounded-full shadow-md m-15 text-md">
        {area} Area

      </span>
      {connected ? <Badge color="green" className='mx-5'>connected to server</Badge>:
      <Badge color="red" className='mx-5'>Disconnected</Badge>}

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" className="hidden" />
          <YAxis type="number" dataKey="y" className="hidden" />
          <ZAxis type="category" dataKey="name" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            // animationDuration={700}
            animationEasing="ease-in-out"
          />
          <Scatter
            name="An Employee"
            data={filteredData}
            fill="#c1121f"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
};

// Define prop types
OtherChart.propTypes = {
  area: PropTypes.string.isRequired,
};

export default OtherChart;
