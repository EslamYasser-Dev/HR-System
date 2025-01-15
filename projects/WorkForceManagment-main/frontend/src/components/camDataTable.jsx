/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
  Button,
} from "@tremor/react";
import { useState, Suspense, lazy, useEffect } from "react";
import Loading from "./loading";
import useSaveAsXLSX from "../hooks/useSaveAsXlsx";
import { RiDeleteBin2Line, RiFileExcel2Line } from "@remixicon/react";
import axios from "axios";

const { VITE_CAMERAS_ENDPOINT } = import.meta.env;

const CamModel = lazy(() => import("./camModel"));

const CamDataTable = ({
  data = [],
  loading = false,
  addNew = false,
  error = null,
  title = "",
  link = "",
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { saveAsXLSX } = useSaveAsXLSX();

  // Update filteredData when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <Loading />;

  const deleteCam = async (id) => {
    try {
      await axios.delete(`${VITE_CAMERAS_ENDPOINT}/${id}`);
      setFilteredData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert("Failed to delete camera. Please try again.");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const excludedKeys = ["_id"];

  // Filter out excluded keys from the titles dynamically
  const filteredTitles = Object.keys(data[0] || {}).filter(
    (key) => !excludedKeys.includes(key)
  );

  return (
    <Card className="w-full md:mx-2 md:p-5 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 md:space-x-10">
        <Title className="text-xl mb-4 sm:mb-0">{title}</Title>
        {addNew && (
          <Suspense fallback={<Loading />}>
            <CamModel title="Add a New Camera" />
          </Suspense>
        )}
        <Button
          onClick={() => saveAsXLSX(filteredData, new Date().toLocaleString())}
          variant="secondary"
          color="green"
          icon={RiFileExcel2Line}
          className="mt-4 sm:mt-0"
        >
          Save {title} as XLSX
        </Button>
      </div>

      <div className="overflow-x-auto mt-4">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              {filteredTitles.map((item) => (
                <TableHeaderCell key={item}>{item.toUpperCase()}</TableHeaderCell>
              ))}
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item._id}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleRowClick(item._id)}
              >
                {filteredTitles.map((key) => (
                  <TableCell key={key}>{item[key]}</TableCell>
                ))}
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCam(item._id);
                    }}
                    variant="primary"
                    color="red"
                    icon={RiDeleteBin2Line}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> 
    </Card>
  );
};

export default CamDataTable;
