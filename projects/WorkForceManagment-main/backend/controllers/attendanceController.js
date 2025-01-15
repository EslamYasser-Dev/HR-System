import AttendanceModel from '../models/attendanceModel.js';
import { io } from '../server.js';
import { EmployeesModel } from '../models/employeesModel.js';
import { getCacheData, setCacheData } from '../utils/getEmployeeAndCache.js';
import moment from 'moment';
const currentTime = moment();
const isValidDate = date => moment(date, moment.ISO_8601, true).isValid();
const handleError = (res, error, message = "Internal server error") => {
    console.error(error);
    res.status(500).json({ message });
};

// Controller to get attendance data
export const getAttendance = async (req, res) => {
    try {
        const { state, from, to } = req.query;
        let dbQuery = {};
        if (from && to) {
            if (!isValidDate(from) || !isValidDate(to)) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            dbQuery.date = { $gte: moment(from).startOf('day'), $lte: moment(to).endOf('day') };
        }

        if (state && state !== 'all') {
            dbQuery.state = state;
        }
        const attendanceData = await AttendanceModel.find(dbQuery, { img: 0, __v: 0, employeeId: 0, reason: 0 }).sort({ date: 1 });
        res.status(200).json(attendanceData);
    } catch (error) {
        handleError(res, error, "Error in getting attendance data");
    }
};

// Controller to create attendance
export const createAttendance = async (req, res) => {
    try {
        const { area, employeeId, img } = req.body;
        const employee = await EmployeesModel.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found. Please add this employee." });
        }
        const { employeeName, site, category, _id } = employee;
        const state = site.includes(area) ? "in" : "out";
        const lastReading = await getCacheData(employeeId);
        if (state === "out") {
            io.emit(process.env.SOCKET_EVENT_NAME, JSON.stringify({ area, employeeId, date: currentTime, employeeName, state }));
        }
        if (lastReading && currentTime.diff(lastReading.date, 'minutes') <= 3 && area === lastReading.area) {
            return res.status(304).json({ msg: "Employee in the same area within 2 minutes" });
        }
        await AttendanceModel.create({
            employeeId: _id,
            area,
            date: currentTime,
            employeeName,
            category,
            state,
            img,
        });
        await setCacheData(employeeId, { date: currentTime, area }, 180);
        res.status(200).json({ msg: "Attendance successfully recorded." });
    } catch (error) {
        handleError(res, error, "Error in creating attendance");
    }
};

// Controller to get attendance by ID
export const getAttendanceById = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await AttendanceModel.findById(id, { img: 1, confirmed: 1, reason: 1 });
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        handleError(res, error, "Error in getting attendance by ID");
    }
};

// Controller to update attendance
export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAttendance = await AttendanceModel.findByIdAndUpdate(id, req.body, { runValidators: true });
        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }

        res.status(200).json(updatedAttendance);
    } catch (error) {
        handleError(res, error, "Error in updating attendance");
    }
};

// Controller to delete attendance
export const deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAttendance = await AttendanceModel.findByIdAndDelete(id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json({ message: "Attendance deleted successfully" });
    } catch (error) {
        handleError(res, error, "Error in deleting attendance");
    }
};
