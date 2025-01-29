import express from 'express'
import {MasterDataApiController} from './masterDataApiController.js'
import {createValidator} from "express-joi-validation";
import {
    getBankByDistrictValidate,
    getDistrictByStateValidate,
    getBranchByBankAndDistrictValidate,
    getSubDistrictByStateANDDistrictValidate,
    getVillageSubDistrictByStateANDDistrictValidate,getlevel3Validate,getlevel4Validate,getlevel6Validate,getlevel7Validate,getLocationHierarchyValidate,
    getNotificationCropListValidate, searchPolicyValidate, getPolicyByVillageIDValidate, getFarmerPolicyDetailValidate
} from "./masterDataApiValidation.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const masterDataApiController = new MasterDataApiController()
export const masterDataApiRouter = express.Router()
const validator = createValidator({
    passError: true
})

masterDataApiRouter.post('/GetDistrictByState',
    authMiddleware, validator.body(getDistrictByStateValidate), masterDataApiController.getDistrictByState)
masterDataApiRouter.post('/GetBankByDistrict',
    authMiddleware, validator.body(getBankByDistrictValidate), masterDataApiController.getBankByDistrict)
masterDataApiRouter.post('/GetBranchByBankANDDistrict',
    authMiddleware, validator.body(getBranchByBankAndDistrictValidate), masterDataApiController.getBranchByBankANDDistrict)
masterDataApiRouter.post('/GetSubDistrictByStateANDDistrict',
    authMiddleware, validator.body(getSubDistrictByStateANDDistrictValidate), masterDataApiController.getSubDistrictByStateANDDistrict)
masterDataApiRouter.post('/GetVillageListBYSubDistrictAndDistrict',
    authMiddleware, validator.body(getVillageSubDistrictByStateANDDistrictValidate), masterDataApiController.getVillageListBYSubDistrictAndDistrict)
masterDataApiRouter.post('/GetNotificationCropListVillageWise',
    authMiddleware, validator.body(getNotificationCropListValidate), masterDataApiController.getNotificationCropListVillageWise)
masterDataApiRouter.post('/SearchPolicy',
    authMiddleware, validator.body(searchPolicyValidate), masterDataApiController.searchPolicy)
masterDataApiRouter.post('/GetPolicyByVillageID',
    authMiddleware, validator.body(getPolicyByVillageIDValidate), masterDataApiController.getPolicyByVillageID)
masterDataApiRouter.post('/GetFarmerPolicyDetail', authMiddleware, validator.body(getFarmerPolicyDetailValidate), masterDataApiController.getFarmerPolicyDetail)
    
masterDataApiRouter.post('/GetLevel3', authMiddleware, validator.body(getlevel3Validate), masterDataApiController.getLevel3)
masterDataApiRouter.post('/GetLevel4', authMiddleware, validator.body(getlevel4Validate), masterDataApiController.getLevel4)
    masterDataApiRouter.post('/GetLevel5', authMiddleware, validator.body(getVillageSubDistrictByStateANDDistrictValidate), masterDataApiController.getLevel5)
    masterDataApiRouter.post('/GetLevel6',authMiddleware, validator.body(getlevel6Validate), masterDataApiController.getLevel6)
    masterDataApiRouter.post('/GetLevel7', authMiddleware, validator.body(getlevel7Validate), masterDataApiController.getLevel7)
    masterDataApiRouter.post('/GetLocationHierarchy', authMiddleware, validator.body(getLocationHierarchyValidate), masterDataApiController.getLocationHierarchy)
    
   
    