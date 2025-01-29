import express from 'express'
import {DashboardController} from './dashboardController.js'
import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";

const dashboardController = new DashboardController()
export const dashboardRouter = express.Router()
const validator = createValidator({
    passError: true
})

dashboardRouter.post('/GetDashBoard', authMiddleware, dashboardController.getDashBoard)
dashboardRouter.post('/GetInsuranceDashBoard', authMiddleware, dashboardController.getDashBoardInsurance)
