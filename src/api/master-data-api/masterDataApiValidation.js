import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const getDistrictByStateValidate = Joi.object({
    stateAlphaCode: Joi.string().required(),
    ...commonValidate
})

export const getBankByDistrictValidate = Joi.object({
    districtAlphaCode: Joi.string().required(),
    ...commonValidate
})

export const getBranchByBankAndDistrictValidate = Joi.object({
    districtAlphaCode: Joi.string().required(),
    bankAlphaCode: Joi.string().required(),
    ...commonValidate
})

export const getSubDistrictByStateANDDistrictValidate = Joi.object({
    districtAlphaCode: Joi.string().required(),
    stateAlphaCode: Joi.string().required(),
    ...commonValidate
})

export const getVillageSubDistrictByStateANDDistrictValidate = Joi.object({
    districtAlphaCode: Joi.string().required(),
    subDistrictAlphaCode: Joi.string().required(),
    ...commonValidate
})

export const getLocationHierarchyValidate = Joi.object({
    sssyID: Joi.string().required(),
        ...commonValidate
})
export const getlevel3Validate = Joi.object({
    level2: Joi.string().required(),
   
    ...commonValidate
})
export const getlevel4Validate = Joi.object({
    level3: Joi.string().required(),
  
    ...commonValidate
})


export const getlevel6Validate = Joi.object({
    level3: Joi.string().required(),
    level4: Joi.string().required(),
    level5: Joi.string().required(),
    ...commonValidate
})
export const getlevel7Validate = Joi.object({
    level3: Joi.string().required(),
    level4: Joi.string().required(),
    level5: Joi.string().required(),
    level6: Joi.string().required(),
    ...commonValidate
})
export const getNotificationCropListValidate = Joi.object({
    villageAlphaCode: Joi.string().required(),
    sssyID: Joi.string().required(),
    mobileNo: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    ...commonValidate
})

export const searchPolicyValidate = Joi.object({
    policyID: Joi.string().required(),
    seasonCode: Joi.string().required(),
    yearCode: Joi.string().required(),
    ...commonValidate
})

export const getPolicyByVillageIDValidate = Joi.object({
    districtAlphaCode: Joi.string().required(),
    villageAlphaCode: Joi.string().required(),
    seasonCode: Joi.string().required(),
    yearCode: Joi.string().required(),
    ...commonValidate
})

export const getFarmerPolicyDetailValidate = Joi.object({
    mobilenumber: Joi.string().required(),
    seasonID: Joi.string().required(),
    year: Joi.string().required(),
    farmerID: Joi.string().required(),
    ...commonValidate
})
