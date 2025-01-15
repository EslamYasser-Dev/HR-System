import moment from 'moment';
import { getAttendance } from '../controllers/attendanceController.js';

jest.mock('../models/attendanceModel.js', () => ({
    AttendanceModel: {
        distinct: jest.fn(),
    },
}));
jest.mock('../models/employeesModel.js', () => ({
    EmployeesModel: {
        find: jest.fn(),
    },
}));

describe('getAttendance function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 status for invalid state parameter', async () => {
        const req = { params: { state: 'invalid' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAttendance(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid state parameter' });
    });

    it('should return employees without attendance records for state "absent"', async () => {
        const employeesWithoutAttendance = [{ _id: '1', name: 'John' }]; // Example data

        // Mock AttendanceModel.distinct to return data
        const mockDistinct = jest.fn().mockResolvedValue(['1']);
        require('../models/attendanceModel.js').AttendanceModel.distinct = mockDistinct;

        // Mock EmployeesModel.find to return data
        const mockFind = jest.fn().mockResolvedValue(employeesWithoutAttendance);
        require('../models/employeesModel.js').EmployeesModel.find = mockFind;

        const req = { params: { state: 'absent' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAttendance(req, res);

        expect(mockDistinct).toHaveBeenCalled();
        expect(mockFind).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(employeesWithoutAttendance);
    });

});
