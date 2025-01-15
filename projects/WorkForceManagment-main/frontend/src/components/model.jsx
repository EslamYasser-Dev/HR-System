/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Dialog, DialogPanel, TextInput, Text } from "@tremor/react";
import { useState } from "react";
import { RiAddCircleLine } from "@remixicon/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import imageCompression from "browser-image-compression";

const { VITE_EMPLOYEE_ENDPOINT } = import.meta.env;

const Model = ({ title = "Show", dialogTitle = "Add New Employee" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);
    try {
      if (!VITE_EMPLOYEE_ENDPOINT) {
        throw new Error("API endpoint is not defined.");
      }
      setLoading(true);
      const imageData = selectedImage
        ? await convertImageToBase64(selectedImage)
        : null;

      data.site = data.site.split(",");
      const postData = { ...data, img: imageData };
      const response = await axios.post(VITE_EMPLOYEE_ENDPOINT, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) setSuccess("Employee added successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong, please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      reset();
      setPreviewImage(null);
      setIsOpen(false);
      window.location.reload();
    }
  };

  const convertImageToBase64 = (image) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageLoading(true);
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
        });
        const imageUrl = URL.createObjectURL(compressedFile);
        setSelectedImage(compressedFile);
        setPreviewImage(imageUrl);
        setValue("img", compressedFile);
      } catch (err) {
        console.error("Image compression error:", err);
        setError("Failed to process image.");
      } finally {
        setImageLoading(false);
      }
    }
  };

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    setSelectedImage(null);
    setPreviewImage(null);
    setImageLoading(false);
    setError(null);
    setSuccess(null);
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
              placeholder="Name"
              {...register("employeeName", { required: "Name is required" })}
            />
            {errors.employeeName && (
              <Text className="text-red-400 py-0">
                {errors.employeeName.message}
              </Text>
            )}

            <TextInput
              className="mx-auto max-w-xs"
              placeholder="Site(s) Comma Separated"
              {...register("site", { required: "Site is required" })}
            />
            {errors.site && (
              <Text className="text-red-500">{errors.site.message}</Text>
            )}

            <TextInput
              className="mx-auto max-w-xs"
              placeholder="Job Category"
              {...register("category", {
                required: "Job Category is required",
              })}
            />
            {errors.category && (
              <Text className="text-red-500">{errors.category.message}</Text>
            )}


            <div className="mx-auto max-w-xs mt-5 text-center">
              <label htmlFor="emp-img" className="cursor-pointer">
                Add Employee Image (jpeg, png only)
              </label>
              <input
                id="emp-img"
                type="file"
                accept=".jpeg, .png"
                className="mt-2 hidden"
                onChange={handleImageChange}
              />
            </div>

            {previewImage && (
              <div className="mx-auto max-w-xs">
                <img src={previewImage} alt="Preview" className="mt-2" />
              </div>
            )}

            {error && <Text className="text-red-500 text-center">{error}</Text>}
            {success && (
              <Text className="text-green-500 text-center">{success}</Text>
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

export default Model;
