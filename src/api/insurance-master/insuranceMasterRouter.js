import express from 'express'
import {InsuranceMasterController} from './insuranceMasterController.js'
import {createValidator} from "express-joi-validation";
import {
    addInsuranceMasterMasterValidate,
} from "./insuranceMasterValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const insuranceMasterController = new InsuranceMasterController()
export const insuranceMasterRouter = express.Router()
const validator = createValidator({
    passError: true
})

insuranceMasterRouter.post('/GetInsuranceMaster', authMiddleware,insuranceMasterController.getInsuranceMaster)
insuranceMasterRouter.post('/AddInsuranceMaster', authMiddleware,insuranceMasterController.addInsuranceMaster)
     insuranceMasterRouter.post('/UpdateInsuranceMaster', authMiddleware,insuranceMasterController.updateInsuranceMaster)
     insuranceMasterRouter.post('/IsActiveInsuranceMaster', authMiddleware,insuranceMasterController.isActiveInsuranceMaster)
     