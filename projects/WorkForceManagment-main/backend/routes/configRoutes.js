import express from "express";
import * as settingsController from "../controllers/userConfigController.js";

const userConfigRouter = new express.Router();
//get
userConfigRouter.get("/", settingsController.getAllSettings);
userConfigRouter.get("/setting", settingsController.getLatestSettings);
userConfigRouter.get("/:id", settingsController.getSettingById);


userConfigRouter.post("/", settingsController.createSetting);
userConfigRouter.put("/:id", settingsController.updateSetting);
userConfigRouter.delete("/:id", settingsController.deleteSetting);

export default userConfigRouter;
