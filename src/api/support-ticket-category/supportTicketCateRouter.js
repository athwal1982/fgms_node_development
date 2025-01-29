import express from 'express'
import {SupportTicketCateController} from './supportTicketCateController.js'
import {authMiddleware} from "../middleware/authMiddleware.js";

const supportTicketCateController = new SupportTicketCateController()
export const supportTicketCateRouter = express.Router()

supportTicketCateRouter.post('/GetUserProfile', authMiddleware, supportTicketCateController.getUserProfile)
supportTicketCateRouter.post('/AddUserProfile', authMiddleware, supportTicketCateController.addUserProfile)
supportTicketCateRouter.post('/ManageUserProfileAssign', authMiddleware, supportTicketCateController.manageUserProfileAssign)
