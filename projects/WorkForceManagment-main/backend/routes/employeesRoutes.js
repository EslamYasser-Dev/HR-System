import express from "express";
import {
  addNewEmployee,
  updateEmployeeById,
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeDetails,
  getEmployeesImages
} from "../controllers/employeesController.js";
import { upload } from "../utils/uploadimg.js";


const employeesRouter = new express.Router();
//get
employeesRouter.get("/", getAllEmployees);
employeesRouter.get("/img/:id", getEmployeeDetails);
employeesRouter.get("/imgs", getEmployeesImages);

//rest of CRUD
employeesRouter.post("/", upload, addNewEmployee);
employeesRouter.put("/:id", updateEmployeeById);
employeesRouter.delete("/:id", deleteEmployeeById);

export default employeesRouter;
