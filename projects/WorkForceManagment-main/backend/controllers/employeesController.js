import { EmployeesModel } from "../models/employeesModel.js";

const handleErrorResponse = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ error: error.message });
};

const validateEmployeeData = (data) => {
  if (!data.employeeName) {
    throw new Error("Device ID and employee name are required");
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeesModel.find({}, { __v: 0, updatedAt: 0, img: 0 });
    res.status(200).json(employees);
  } catch (error) {
    handleErrorResponse(res, error);
  }
}

export const getEmployeesImages = async (req, res) => {
  try {
    const employees = await EmployeesModel.find({}, { _id: 1, img: 1, employeeName: 1, site: 1 });
    res.status(200).json(employees);
  } catch (error) {
    handleErrorResponse(res, error);
  }
}
export const getEmployeeDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await EmployeesModel.findOne({ _id: id }, { img: 1 });
    res.status(200).json(employee);
  } catch (error) {
    handleErrorResponse(res, error);
  }
}

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await EmployeesModel.findById(req.params.id);
    res.json(employee);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const addNewEmployee = async (req, res) => {

  try {
    const { img, employeeName, category, site } = req.body;
    const newEmployee = new EmployeesModel({ employeeName, category, site, img });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.log(Object.keys(savedEmployee));
    return res.json({ error: error.message });
  }
};


export const updateEmployeeById = async (req, res) => {
  try {
    validateEmployeeData(req.body);

    const updatedEmployee = await EmployeesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    handleErrorResponse(res, error);
  }
};

export const deleteEmployeeById = async (req, res) => {
  try {
    await EmployeesModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
