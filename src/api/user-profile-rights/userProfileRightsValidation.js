import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const getUserRightsValidate = Joi.object({
    userProfileID: Joi.number().required(),
    menuMasterID: Joi.number().required(),
    viewMode: Joi.string().required(),
    ...commonValidate
})
