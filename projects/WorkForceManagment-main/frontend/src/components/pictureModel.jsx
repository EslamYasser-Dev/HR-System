/* eslint-disable react/prop-types */
import { Dialog, DialogPanel, Button, TextInput } from "@tremor/react";
import useFetch from "../hooks/useFetch";
import Loading from "./loading";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import axios from "axios";
import { useState } from "react";
const { VITE_ALL_ATTENDANCE_ENDPOINT } = import.meta.env;

const PicModel = ({ title, id, link, isOpen, onClose }) => {
  let validLink;
  if (id) {
    validLink = `${link}/${id}`; // Construct the URL with the employee ID/${id}`; // Construct the URL with the employee ID
  }

  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(isOpen);

  const { data, loading } = useFetch(
    validLink, // Dynamically construct the URL
    {
      debounceTime: 500, // Optional debounce time for preventing rapid requests
      cacheTime: 10000, // Optional cache duration (10 seconds)
    }
  );
  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const confirmImg = async (isConfirmed) => {

    try {
      await axios.put(`${VITE_ALL_ATTENDANCE_ENDPOINT}/${id}`, {
        confirmed: isConfirmed,
        reason: reason,
      });
      window.location.href = "/attendance";
    } catch (error) {
      console.error("Error updating image status:", error);
      alert("Failed to update. Please try again.");
    }
  };



  return (
    <Dialog open={open} onClose={onClose} static={true} className="z-[100]">
      <DialogPanel className="max-w-4xl space-y-5 p-8">
        <span className="text-lg font-medium">{title}</span>
        {loading ? (
          <Loading />
        ) : (
          <>
            {data && typeof data.img === "string" ? (
              <div className="my-6">
                <img
                  src={`data:image/png;base64,${data.img}`}
                  alt="Employee"
                  className="w-full h-auto max-w-[800px] object-cover rounded-lg" // Adjusted image size
                />
              </div>
            ) : (
              <p>No image found.</p>
            )}
          </>
        )}
        {(!loading && title != "Employee Profile Picture") &&
          (data?.confirmed === true || data?.confirmed === false ? (
            <p className="text-center">{data.reason}</p>
          ) : (
            <div className="flex justify-between w-1/2 mx-auto space-x-3">
              <Button
                icon={RiCheckLine}
                color="green"
                onClick={() => confirmImg("true")}
              ></Button>
              <TextInput
                placeholder="Reason if any"
                onChange={(e) => handleReasonChange(e)}
              />
              <Button
                icon={RiCloseLine}
                color="red"
                onClick={() => confirmImg("false")}
              ></Button>
            </div>
          ))}
      </DialogPanel>
    </Dialog>
  );
};

export default PicModel;
