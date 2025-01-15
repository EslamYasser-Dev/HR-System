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
  TextInput,
} from "@tremor/react";
import { useState, useCallback, Suspense, lazy, memo } from "react";
import Loading from "./loading";
import useSaveAsXLSX from "../hooks/useSaveAsXlsx";
import {
  RiDeleteBin2Line,
  RiEyeLine,
  RiFileExcel2Line,
  RiMedalLine,
  RiSearchLine,
} from "@remixicon/react";
const { VITE_EMPLOYEE_ENDPOINT, VITE_ALL_ATTENDANCE_ENDPOINT } = import.meta.env;
import axios from "axios";

const PicModel = memo(lazy(() => import("./pictureModel")));
const Model = lazy(() => import("./model"));

const DataTable = ({
  data = [],
  loading = false,
  addNew = false,
  error = null,
  title = "",
  link = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { saveAsXLSX } = useSaveAsXLSX();

  const titles =
    data.length > 0
      ? Object.keys(data[0]).filter(
        (key) => key !== "_id" && key !== "employeeId"
      )
      : [];

  // Filter data based on search term
  // const filteredData = data?.filter(
  //   (field) =>
  //     field.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     searchTerm === ""
  // );


  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onRowClick = useCallback((id, confirmed) => {
    setSelectedId(id);
    setSelectedStatus(confirmed);
    setIsDialogOpen(true);
  }, []);

  const deleteEmp = async (id) => {
    try {
      const url = title === "Attendance Data" ? VITE_ALL_ATTENDANCE_ENDPOINT : VITE_EMPLOYEE_ENDPOINT;
      await axios.delete(`${url}/${id}`);
      setFilteredData((prevData) => prevData.filter((item) => item._id !== id));
    } catch (e) {
      console.error(`Error deleting user with id: ${id}`, e);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <Loading />;
  }

  const validLink = link || null;

  // search by employee name or site
  const search = (e) => {
    const value = e.target.value;

    if (value === "") {
      setCurrentPage(1);
      setFilteredData(data);
      setSearchTerm("");
    } else {
      setSearchTerm(value);
      setCurrentPage(1);

      setFilteredData(
        data.filter((field) => {
          const employeeMatch = field.employeeName
            .toLowerCase()
            .includes(value.toLowerCase());

          const siteMatch =
            Array.isArray(field.site) && title === "Employees" ?
              field.site.join(",").toLowerCase().includes(value.toLowerCase()) : field.area.toLowerCase().includes(value.toLowerCase());

          return employeeMatch || siteMatch;
        })
      );
    }
  };


  return (
    <Card className="w-full md:mx-2 md:p-5 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 md:space-x-10">
        <Title className="text-xl mb-4 sm:mb-0">{title}</Title>
        <TextInput
          icon={RiSearchLine}
          type="text"
          placeholder="Search for Employees by Name or Site"
          value={searchTerm}
          onChange={(e) => search(e)}
          className="mb-4 sm:mb-0 w-full sm:w-1/2 md:w-1/3"
        />
        {addNew && (
          <Suspense fallback={<Loading />}>
            <Model title="Add a New Employee" />
          </Suspense>
        )}
        <Button
          onClick={() => saveAsXLSX(filteredData, new Date().toLocaleString())}
          variant="secondary"
          color="green"
          icon={RiFileExcel2Line}
          className="mt-4 sm:mt-0"
        >
          Save As ExcelSheet
        </Button>
      </div>

      <div className="overflow-x-auto mt-4">
        <Table className="min-w-full">
          <TableHead>
            <TableRow>
              {titles?.sort().map((item) => (
                <TableHeaderCell key={item}>
                  {item.toLocaleUpperCase()}
                </TableHeaderCell>
              ))}
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData?.map((item) => (
              <TableRow
                key={item._id}
                className="cursor-pointer hover:bg-gray-100 transition-colors h-10"
              >
                {titles.map((key, i) => (
                  <TableCell key={i}>
                    {key === "confirmed" ? (
                      item.confirmed === "true" ? (
                        <Button color="green" icon={RiMedalLine} disabled />
                      ) : item.confirmed === "false" ? (
                        <Button color="red" icon={RiMedalLine} disabled />
                      ) : (
                        <Button color="blue" icon={RiMedalLine} disabled />
                      )
                    ) : key === "date" || key === "createdAt" ? (
                      new Date(item[key]).toLocaleString()
                    ) : (
                      item[key]
                    )}
                  </TableCell>
                ))}
                <TableCell className="p-1 text-sm leading-tight">
                  <Button
                    onClick={() => onRowClick(item._id, item.confirmed)}
                    variant="secondary"
                    color="green"
                    icon={RiEyeLine}
                    className="mr-2 my-0"
                    size="sm"
                  ></Button>
                  <Button
                    className="my-0"
                    variant="secondary"
                    color="red"
                    size="sm"
                    icon={RiDeleteBin2Line}
                    onClick={() => {
                      deleteEmp(item._id);
                    }}
                  ></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          variant="secondary"
        >
          Previous
        </Button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          variant="secondary"
        >
          Next
        </Button>
      </div>

      {isDialogOpen && (
        <Suspense fallback={<Loading />}>
          <PicModel
            title={title}
            id={selectedId}
            status={selectedStatus}
            link={validLink}
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
          />
        </Suspense>
      )}
    </Card>
  );
};

export default DataTable;



