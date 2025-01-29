import express from 'express'

import {authMiddleware} from "../middleware/authMiddleware.js";
import {FarmerloginController} from './farmerloginController.js'
import {farmerMobileNumberValidate} from "./farmerloginValidation.js";
import {createValidator} from "express-joi-validation";

const farmerloginController = new FarmerloginController()
export const farmerloginRouter = express.Router()
const validator = createValidator({
    passError: true
})

farmerloginRouter.post('/FarmerLoginByMobileNumber', 
    validator.body(farmerMobileNumberValidate), farmerloginController.farmerLoginByMobileNumber)
    
    farmerloginRouter.post('/GetFarmerTicketsListIndex', authMiddleware, farmerloginController.getFarmerTicketsListIndex)
    farmerloginRouter.post('/FarmerGenerateSupportTicket', authMiddleware, farmerloginController.farmerGenerateSupportTicket)
