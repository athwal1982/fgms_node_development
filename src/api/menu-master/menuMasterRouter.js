import express from 'express'
import {MenuMasterController} from './menuMasterController.js'
import {createValidator} from "express-joi-validation";
import {
    getDistrictByStateValidate,
} from "./menuMasterValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const menuMasterController = new MenuMasterController()
export const menuMasterRouter = express.Router()
const validator = createValidator({
    passError: true
})

menuMasterRouter.post('/MenuMasterCreate', authMiddleware, menuMasterController.menuMasterCreate)
