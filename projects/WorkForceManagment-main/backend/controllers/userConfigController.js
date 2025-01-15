import { ConfigModel } from "../models/configModel.js";

export const getAllSettings = async (req, res) => {
  try {
    const settings = await ConfigModel.find();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestSettings = async (req, res) => {
  try {
    const latestSetting = await ConfigModel.findOne().sort({ updatedAt: -1 }).limit(1);

    if (!latestSetting) {
      return res.status(404).json({ message: 'No settings found.' });
    }

    res.status(200).json(latestSetting);
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

export const getSettingById = async (req, res) => {
  try {
    const setting = await ConfigModel.findById(req.params.id);
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSetting = async (req, res) => {
  const setting = new ConfigModel(req.body);

  try {
    const savedSetting = await setting.save();
    res.status(201).json(savedSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const updatedSetting = await ConfigModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSetting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    await ConfigModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
