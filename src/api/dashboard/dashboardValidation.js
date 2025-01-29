import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const getRegionalOfficeMasterValidate = Joi.object({
    regionalOfficeID: Joi.number().required(),
    searchText: Joi.string().required(),
})
