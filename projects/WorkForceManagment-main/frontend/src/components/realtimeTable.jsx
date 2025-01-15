import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  Badge,
  Button,
  Accordion,
  AccordionBody,
  AccordionHeader
} from "@tremor/react";
import useSaveAsXLSX from "../hooks/useSaveAsXlsx";
import { RiFileExcel2Line } from "@remixicon/react";
import { useSocketDataContext } from "../context/SocketDataContext";

// eslint-disable-next-line react/prop-types
const RealtimeTable = ({ area }) => {
  const { data, loading, error } = useSocketDataContext();
  const { saveAsXLSX } = useSaveAsXLSX();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <span>No one in Has arrived to Area {area} yet just Wait</span>;
  }

  if (data) {
    const filteredData = data?.filter((field) => field?.area === area);

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    return (

      <Accordion className="m-1 p-1 w-full sm:w-auto rounded-xl overflow-x-auto ease-in-out duration-500" defaultOpen={true}>
        <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Show Details</AccordionHeader>

        <AccordionBody >
          <Button onClick={() => saveAsXLSX(data, new Date().toLocaleString())} variant="secondary" color="green" icon={RiFileExcel2Line}>Save as XLSX</Button>
          <Table className="m-5 max-h-40 sm:w-full md:w-full lg:w-full">
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-3/8 sm:w-2/6 md:w-2/6 lg:w-2/6">last Seen in</TableHeaderCell>
                <TableHeaderCell className="w-3/8 sm:w-2/6 md:w-2/6 lg:w-2/6">Employee Name</TableHeaderCell>
                <TableHeaderCell className="w-1/6 sm:w-1/6 md:w-1/6 lg:w-1/6">state</TableHeaderCell>
                <TableHeaderCell className="w-1/8 sm:w-1/6 md:w-1/6 lg:w-1/6">Area</TableHeaderCell>

              </TableRow>
            </TableHead>

            <TableBody className="p-2 border-separate ">
              {paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {/* <TableCell><Text className="font-bold text-center">{item.deviceId}</Text></TableCell> */}
                  <TableCell>{new Date(item.date).toLocaleString()}</TableCell>
                  <TableCell className="hover:border-zinc-950">{item.employeeName}</TableCell>
                  <TableCell>
                    <Badge
                      color={"red"}
                      tooltip={`he is ${item.state} and appears in area: ${item.area}`}
                    >
                      Outside
                    </Badge>

                  </TableCell>
                  <TableCell className="hover:border-zinc-950">{item.area}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-3">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Text className="m-1">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </AccordionBody>
      </Accordion>
    );
  } else {
    return <Text>Wait for incoming data</Text>;
  }
};

export default RealtimeTable;
