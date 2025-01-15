import mongoose from 'mongoose';

const AttendanceSchema = mongoose.Schema({
    area: { type: String, required: true },
    employeeName: { type: String, required: true },
    employeeId: { type: mongoose.Types.ObjectId, required: true, ref: 'employees' },
    confirmed: { type: String, required: true, default: "new" },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    state: { type: String, required: true },
    img: { type: String, required: false },
    reason: { type: String, required: false },
},
    {
        timestamp: true
    }
);
const AttendanceModel = mongoose.model('attendance', AttendanceSchema);

export default AttendanceModel;
