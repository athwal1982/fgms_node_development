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

agentTrainingRouter.post('/getAgentRegion',authMiddleware, agentTrainingController.GetAgentRegion);
agentTrainingRouter.post('/updateAgent', authMiddleware,agentTrainingController.UpdateAgent);
agentTrainingRouter.post('/agentList', agentTrainingController.AgentList);

agentTrainingRouter.post('/updateStatus', agentTrainingController.UpdateStatus);

agentTrainingRouter.post('/CreateTraining', agentTrainingController.CreateTraining);
agentTrainingRouter.post('/AssignTrainingToUsers', agentTrainingController.AssignedTrainingToUsers);
agentTrainingRouter.post('/UpdateTraining', agentTrainingController.UpdateTraining);
agentTrainingRouter.post('/GetTrainingType', agentTrainingController.GetTrainingType);

agentTrainingRouter.post('/GetTrainingList', agentTrainingController.GetTrainingList);
agentTrainingRouter.post('/CenterList', agentTrainingController.GetCenterList)
agentTrainingRouter.post('/UpcomingTrainingList', agentTrainingController.UpcomingTrainingList)
agentTrainingRouter.post('/CscTrainingDataBinding', agentTrainingController.CscTrainingDataBinding)
agentTrainingRouter.post('/CSCUserTrainingAssignManage', agentTrainingController.cscUserTrainingAssignManage)
agentTrainingRouter.post('/CSCCenterWiseTraining', agentTrainingController.CenterWiseTrainingList)
agentTrainingRouter.post('/CSCAgentBYID', agentTrainingController.CSCAgentById)
agentTrainingRouter.post('/CSCUpdateAgentBYID', agentTrainingController.CSCUpdateAgentById)



















