import express from 'express'
import {AgentTrainingController} from './agentTrainingController.js'
import {createValidator} from "express-joi-validation";
// import {
//     checkFarmerByAccountNumberValidate,
//     checkMobileNumberValidate,
//     checkFarmerDbValidate
// } from "./agentTrainingValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const agentTrainingController = new AgentTrainingController()
export const agentTrainingRouter = express.Router()
const validator = createValidator({
    passError: true
})

agentTrainingRouter.post('/getAgentRegion',authMiddleware, agentTrainingController.getAgentRegion);
agentTrainingRouter.post('/updateAgent', authMiddleware,agentTrainingController.updateAgent);
agentTrainingRouter.post('/agentList', agentTrainingController.agentList);



   

