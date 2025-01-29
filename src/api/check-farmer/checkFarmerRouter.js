import express from 'express'
import {CheckFarmerController} from './checkFarmerController.js'
import {createValidator} from "express-joi-validation";
import {
    checkFarmerByAccountNumberValidate,
    checkMobileNumberValidate,
    checkFarmerDbValidate
} from "./checkFarmerValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const checkFarmerController = new CheckFarmerController()
export const checkFarmerRouter = express.Router()
const validator = createValidator({
    passError: true
})

checkFarmerRouter.post('/CheckFarmerByMobileNumber', authMiddleware,
    validator.body(checkMobileNumberValidate), checkFarmerController.checkFarmerByMobileNumber)
    checkFarmerRouter.post('/CheckKRPHFarmerByMobileNumber', authMiddleware,
        validator.body(checkMobileNumberValidate), checkFarmerController.checkKRPHFarmerByMobileNumber)
    
checkFarmerRouter.post('/CheckFarmerByDb', authMiddleware,  checkFarmerController.checkFarmerByDb)
checkFarmerRouter.post('/CheckFarmerAddInDb', authMiddleware, checkFarmerController.checkFarmerAddInDb)
checkFarmerRouter.post('/CheckFarmerUpdateInDb', authMiddleware, checkFarmerController.checkFarmerUpdateInDb)

checkFarmerRouter.post('/CheckFarmerByAccountNumber', authMiddleware,
    validator.body(checkFarmerByAccountNumberValidate), checkFarmerController.checkFarmerByAccountNumber)
checkFarmerRouter.post('/CheckFarmerByAadharNumber', authMiddleware,
    checkFarmerController.checkFarmerByAadharNumber)
checkFarmerRouter.post('/CheckDistrictCropWise', authMiddleware,
    checkFarmerController.checkDistrictCropWise)
checkFarmerRouter.post('/CheckSSSYIDBYDistrict', authMiddleware,
    checkFarmerController.checkSSSYIDBYDistrict)
checkFarmerRouter.post('/FetchFarmerApplicationDetail', authMiddleware,
    checkFarmerController.fetchFarmerApplicationDetail)
checkFarmerRouter.post('/FetchInsuranceDetail', authMiddleware,
    checkFarmerController.fetchInsuranceDetail)
checkFarmerRouter.post('/GetEnquiryTicketReview', authMiddleware, checkFarmerController.getEnquiryTicket)
checkFarmerRouter.post('/AddEnquiryTicketReview', authMiddleware, checkFarmerController.addEnquiryTicket)
checkFarmerRouter.post('/AddCalculatedPremium', authMiddleware, checkFarmerController.addCalculatedPremium)
checkFarmerRouter.post('/CalculatedPremiumReport', authMiddleware, checkFarmerController.calculatedPremiumReport)
/*checkFarmerRouter.post('/GetClaimDetail', authMiddleware, checkFarmerController.getClaimDetail)*/

