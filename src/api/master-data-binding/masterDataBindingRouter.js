import express from 'express'
import {MasterDataBindingController} from './masterDataBindingController.js'
import {createValidator} from "express-joi-validation";
import {
    masterDataBindingValidate,uploadInvoiceValidation
} from "./masterDataBindingValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const masterDataBindingController = new MasterDataBindingController()
export const masterDataBindingRouter = express.Router()
const validator = createValidator({
    passError: true
})

masterDataBindingRouter.post('/GetMasterDataBinding', authMiddleware, validator.body(masterDataBindingValidate), masterDataBindingController.masterDataBinding)
masterDataBindingRouter.post('/UploadInvoiceData', authMiddleware, validator.body(uploadInvoiceValidation),masterDataBindingController.uploadInvoiceData)
 masterDataBindingRouter.post('/TicketDataBinding', authMiddleware,masterDataBindingController.ticketDataBinding)
masterDataBindingRouter.post('/GetUploadedInvoiceData', authMiddleware,masterDataBindingController.getUploadedInvoiceData)
masterDataBindingRouter.post('/GetLocationMasterDataBinding', authMiddleware, masterDataBindingController.locationmasterDataBinding)
