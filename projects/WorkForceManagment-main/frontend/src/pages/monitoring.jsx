import axios from "axios";
import { useState, useEffect } from "react";
import { Badge } from "@tremor/react";
// Remove lazy loading by importing directly
import OtherChart from "../components/otherchar";
import RealtimeTable from "../components/realtimeTable";
import Loading from "../components/loading";

const { VITE_CAMERAS_ENDPOINT } = import.meta.env;

const Monitoring = () => {
  const [areas, setAreas] = useState([]); // Initialize areas as an empty array
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Fetch data when the component mounts (only once)
    const fetchAreas = async () => {
      try {
        const response = await axios.get(VITE_CAMERAS_ENDPOINT);
        // Use the environment variable for the endpoint
        if (response.data) {
          setAreas(response.data);
        } else {
          console.error("No data found");
          setAreas([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching areas:", err);
        setError("Failed to fetch areas. Please try again.");
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return <Badge color="red" className='m-12'>Server is Down</Badge>; 
  }

  return (
    <>
      <span className="text-3xl font-medium p-3 m-3">Real-time tracking</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-2 rounded shadow-xl">
        {areas.length > 0 ? (
          areas.map((area) => (
            <div key={area._id} className="flex-grow flex-col bg-white p-2 rounded shadow-md">
              <OtherChart area={area.deviceLocation} />
              <RealtimeTable area={area.deviceLocation} />
            </div>
          ))
        ) : (
          <Badge color="red" className='mx-5 m-auto'>No areas Has been Added please Add Cameras</Badge>
        )}
      </div>
    </>
  );
};

export default Monitoring;
