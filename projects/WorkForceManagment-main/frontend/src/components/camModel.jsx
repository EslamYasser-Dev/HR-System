/* eslint-disable react/prop-types */
import { Button, Dialog, DialogPanel, TextInput, Text } from "@tremor/react";
import { useState } from "react";
import { RiAddCircleLine } from "@remixicon/react";
import { useForm } from "react-hook-form";
import axios from "axios";
const { VITE_CAMERAS_ENDPOINT } = import.meta.env;

const CamModel = ({ title = "Show", dialogTitle = "Add New Camera" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (!VITE_CAMERAS_ENDPOINT) {
        throw new Error("API endpoint is not defined.");
      }
      setLoading(true);
      const postData = { ...data };
      await axios.post(VITE_CAMERAS_ENDPOINT, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
      reset();
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleOpen} icon={RiAddCircleLine}>
        {title}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleOpen}
        static={true}
        className="z-[100]"
      >
        <DialogPanel className="max-w-md space-y-5">
          <span className="text-lg font-medium">{dialogTitle}</span>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <TextInput
              className="mx-auto max-w-xs"
              placeholder="Site"
              {...register("deviceLocation", { required: "Site is required" })}
            />
            {errors.site && (
              <Text className="text-red-500">{errors.site.message}</Text>
            )}

            <TextInput
              className="mx-auto max-w-xs"
              placeholder="Cam URL"
              {...register("deviceUrl", {
                required: "Cam URL is required",
              })}
            />
            {errors.deviceURL && (
              <Text className="text-red-500">{errors.deviceURL.message}</Text>
            )}

            <Button
              type="submit"
              variant="primary"
              className="mx-auto flex items-center"
              disabled={loading || isSubmitting}
            >
              {loading ? "Saving..." : "Save"}
            </Button>

            <Button
              type="button"
              variant="light"
              className="mx-auto flex items-center"
              onClick={handleOpen}
            >
              Close
            </Button>
          </form>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default CamModel;
