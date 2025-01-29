import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";



export const addInsuranceMasterMasterValidate = Joi.object({
    insuranceMasterName: Joi.string().required(),
    insuranceShortCode: Joi.string().required(),
    ...commonValidate
})


