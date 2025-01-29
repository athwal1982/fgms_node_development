import express from 'express'
import {RegionalOfficeController} from './regionalOfficeController.js'
import {createValidator} from "express-joi-validation";
import {
    addRegionalOfficeMasterValidate,
    getRegionalOfficeMasterValidate, getRegionalStateAssignmentManageValidate,
    userRegionalAssignmentManageValidate,
} from "./regionalOfficeValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const regionalOfficeController = new RegionalOfficeController()
export const regionalOfficeRouter = express.Router()
const validator = createValidator({
    passError: true
})

regionalOfficeRouter.post('/GetRegionalOfficeMaster', authMiddleware,
    validator.body(getRegionalOfficeMasterValidate), regionalOfficeController.getRegionalOfficeMaster)
regionalOfficeRouter.post('/AddRegionalOfficeMaster', authMiddleware,
    validator.body(addRegionalOfficeMasterValidate), regionalOfficeController.addRegionalOfficeMaster)
regionalOfficeRouter.post('/GetRegionalStateAssignmentManage', authMiddleware,
    validator.body(getRegionalStateAssignmentManageValidate), regionalOfficeController.getRegionalStateAssignmentManage)
regionalOfficeRouter.post('/UserRegionalAssignmentManage', authMiddleware, regionalOfficeController.userRegionalAssignmentManage)
