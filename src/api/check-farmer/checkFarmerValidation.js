import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const checkMobileNumberValidate = Joi.object({
    mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    ...commonValidate
})

export const checkFarmerDbValidate = Joi.object({
    viewMode: Joi.string().required(),
    mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    aadharNumber: Joi.string().allow(''),
    accountNumber: Joi.string().allow(''),
    ...commonValidate
})

export const checkFarmerDbAddValidate = Joi.object({
    viewMode: Joi.string().required(),
    mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    aadharNumber: Joi.string().allow(''),
    accountNumber: Joi.string().allow(''),
    ...commonValidate
})

export const checkFarmerByAccountNumberValidate = Joi.object({
    branchID: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ...commonValidate
})
