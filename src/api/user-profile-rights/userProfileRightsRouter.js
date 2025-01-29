import express from 'express'
import {UserProfileRightsController} from './userProfileRightsController.js'
import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {getUserRightsValidate} from "./userProfileRightsValidation.js";

const userProfileRightsController = new UserProfileRightsController()
export const userProfileRightsRouter = express.Router()
const validator = createValidator({
    passError: true
})

userProfileRightsRouter.post('/GetUserProfileRight', authMiddleware,
    validator.body(getUserRightsValidate), userProfileRightsController.getUserProfileRight)
userProfileRightsRouter.post('/UserProfileRightAssign', authMiddleware, userProfileRightsController.getUserProfileRightAssign)
userProfileRightsRouter.post('/GetUserRight', authMiddleware, userProfileRightsController.getUserRight)
