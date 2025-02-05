import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'user',],
        default: 'user'
    },
},
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
