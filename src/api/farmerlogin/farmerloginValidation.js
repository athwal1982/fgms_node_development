import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const farmerMobileNumberValidate = Joi.object({
    mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    ...commonValidate
})
