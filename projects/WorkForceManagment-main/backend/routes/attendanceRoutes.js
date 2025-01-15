import express from "express";
import {
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    createAttendance
} from "../controllers/attendanceController.js";


const attendanceRouter = new express.Router();

attendanceRouter.post("/notifactions", createAttendance);
attendanceRouter.get("/img/:id", getAttendanceById);
attendanceRouter.get("/", getAttendance);
attendanceRouter.put("/:id", updateAttendance);
attendanceRouter.delete("/:id", deleteAttendance);

export default attendanceRouter;
