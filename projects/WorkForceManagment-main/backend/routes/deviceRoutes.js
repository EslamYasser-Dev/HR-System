// routes/deviceRoutes.js
import express from 'express';
import { getAllDevices, addDevice, deleteDevice } from '../controllers/deviceController.js';

const deviceRouter = new express.Router();

deviceRouter.get('/', getAllDevices);
deviceRouter.post('/', addDevice);
deviceRouter.delete('/:id', deleteDevice);

export default deviceRouter;
