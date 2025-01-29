import Joi from 'joi';
import {commonValidate} from "../../helper/validationJoi.js";

export const masterDataBindingValidate = Joi.object({
    filterID: Joi.number().required(),
    filterID1: Joi.number().required(),
    masterName: Joi.string().required(),
    searchText: Joi.string().required(),
    searchCriteria: Joi.string().allow(''),
    ...commonValidate
})

export const uploadInvoiceValidation = Joi.object({
    customers: Joi.array().items({
        customerNumber:  Joi.string().required(),
        campaign: Joi.string().allow(''),
        status: Joi.string().allow(''),
	agentID: Joi.string().allow(''),
	agent: Joi.string().allow(''),
	circle: Joi.string().allow(''),
	ticketNumber:Joi.string().allow(''),
    source:Joi.string().allow(''),
	callStartTime: Joi.string().allow(''),
	callEndTime: Joi.string().allow(''),
	agentCallStartTime: Joi.string().allow(''), 
	agentCallEndTime: Joi.string().allow(''),
	customerCallSec: Joi.string().allow(''), 
	queueSeconds: Joi.string().allow(''), 
	agentTalkTime: Joi.string().allow(''),
	uniqueID: Joi.string().allow(''), 
	transferStatus: Joi.string().allow(''),
	customerPulse: Joi.string().allow(''),
	date: Joi.string().allow(''), 
	iCName: Joi.string().allow(''),
	iCStatus: Joi.string().allow(''),
   
	}),
	...commonValidate,
	 

})
  