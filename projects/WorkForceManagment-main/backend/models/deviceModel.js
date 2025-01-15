import mongoose from 'mongoose';

const deviceSchema = mongoose.Schema({
  deviceState: {
    type: Boolean,
    required: false,
    default: true
  },
  deviceUrl: {
    type: String,
    required: true,
  },
  deviceLocation: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const DeviceModel = mongoose.model('devices', deviceSchema);
