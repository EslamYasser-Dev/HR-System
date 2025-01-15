// controllers/deviceController.js
import { DeviceModel } from "../models/deviceModel.js"

const getAllDevices = async (req, res) => {
  try {
    const devices = await DeviceModel.find({}, { createdAt: 0, __v: 0, updatedAt: 0 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error)
  }
};

const addDevice = async (req, res) => {
  const { deviceUrl, deviceLocation } = req.body;

  try {
    const newDevice = await DeviceModel.create({
      deviceUrl,
      deviceLocation
    });

    res.status(201).json(newDevice);
  } catch (error) {
    res.status(400).json({ error: 'Bad Request', details: error.message });


    console.log(error)
  }
};

const deleteDevice = async (req, res) => {
  const { id } = req.params;

  try {

    const deletedDevice = await DeviceModel.findByIdAndDelete(id);

    if (!deletedDevice) {
      return res.status(404).json({ error: 'Device not found' });
    }

    return res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error)
  }
};

export { getAllDevices, addDevice, deleteDevice };

