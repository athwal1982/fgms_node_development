import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const getUserValidate = Joi.object({
    appAccessID: Joi.number().integer().positive().required(),
    viewMode: Joi.string().required(),
    userRelationType: Joi.string(),
    userType: Joi.number(),
    searchText: Joi.string(),
    ...commonValidate,
})


export const updateUserStatusValidate = Joi.object({
    appAccessID: Joi.number().integer().positive().required(),
    isActive: Joi.string().valid('Y', 'N').required(),
    ...commonValidate,
})

export const resetPasswordValidate = Joi.object({
    appAccessID: Joi.number().integer().positive().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    resetPasswordBy:Joi.number().integer().positive().required(),
    ...commonValidate,
})
