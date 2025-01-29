import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const getRegionalOfficeMasterValidate = Joi.object({
    regionalOfficeID: Joi.number().required(),
    searchText: Joi.string().required(),
    ...commonValidate
})

export const addRegionalOfficeMasterValidate = Joi.object({
    regionOfficeName: Joi.string().required(),
    regionalOfficeID: Joi.number().required(),
    ...commonValidate
})

export const getRegionalStateAssignmentManageValidate = Joi.object({
    viewMode: Joi.string().required(),
    regionalStateID: Joi.string(),
    regionalOfficeID: Joi.number(),
    stateMasterID: Joi.string(),
    ...commonValidate
})

export const userRegionalAssignmentManageValidate = Joi.object({
    viewMode: Joi.string().required(),
})
