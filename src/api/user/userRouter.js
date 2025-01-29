import express from 'express'
import {UserController} from './userController.js'
import {createValidator} from "express-joi-validation";
import {getUserValidate, resetPasswordValidate, updateUserStatusValidate} from "./userValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const userController = new UserController()
export const userRouter = express.Router()
const validator = createValidator({
    passError: true
})

userRouter.post('/GetUser', authMiddleware, validator.body(getUserValidate), userController.getUsers)

userRouter.post('/AddUser', authMiddleware, userController.addUsers)
userRouter.post('/UserUpdateActiveStatus', authMiddleware, validator.body(updateUserStatusValidate), userController.updateUserStatus)
userRouter.post('/ResetPassword', authMiddleware, validator.body(resetPasswordValidate), userController.resetUserPassword)
userRouter.post('/GetUserStateAssignManage', authMiddleware, userController.getUserStateAssignManage)
userRouter.post('/GetUserDistrictAssignManage', authMiddleware, userController.getUserDistrictAssignManage)
userRouter.post('/GetUserSubDistrictAssignManage', authMiddleware, userController.getUserSubDistrictAssignManage)
userRouter.post('/GetUserInsuranceAssignManage', authMiddleware, userController.getUserInsuranceAssignManage)
userRouter.post('/GetUserBlockAssignManage', authMiddleware, userController.getUserBlockAssignManage)
userRouter.post('/UserProfileMenuAssign', authMiddleware, userController.userProfileMenuAssign)
userRouter.post('/UserCategoryAssign', authMiddleware, userController.userCategoryAssignManageNode)