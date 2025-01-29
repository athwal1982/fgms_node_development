import Joi from 'joi';
import {commonBNValidate} from "../../helper/validationJoi.js";

export const loginValidate = Joi.object({
    appAccessUID: Joi.string().required(),
    appAccessPWD: Joi.string().required(),
    objCommon: Joi.object({
        insertedIPAddress: Joi.string().required(),
    }),
})

export const diffUsersLoginValidate = Joi.object({
    mobilenumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    appAccessPWD: Joi.string().required(),
   })
    export const cSCAgentLoginValidate = Joi.object({
        mobileNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        appAccessID: Joi.number().integer().positive().required(),
        
        objCommon: Joi.object({
            insertedIPAddress: Joi.string().required(),
        }),
    })
    
   export const logoutValidate = Joi.object({
    appAccessUID: Joi.number().integer().positive().required(),
    sessionID: Joi.number().integer().positive().required(),
})
export const MobileNumberValidate = Joi.object({
    requestorMobileNo: Joi.string().length(10).pattern(/^[0-9]+$/).required()
})
export const IntialValidate = Joi.object({
    appAccessUID: Joi.string().required(),
    objCommon: Joi.object({
        insertedIPAddress: Joi.string().required(),
    }),
})
export const UserIDValidate = Joi.object({
    userID: Joi.number().integer().positive().required()
})

export const timevalidate= Joi.object({
   
    
})
export const forgetValidate = Joi.object({
    appAccessUserName: Joi.string().required(),
    
})
export const resetForgetValidate = Joi.object({
    appAccessID: Joi.number().integer().positive().required(),
    newPassword: Joi.string().required(),
})
export const CSCInboundVoiceSelectApiValidation = Joi.object({
    fromDate:Joi.string().allow(''),
    toDate:Joi.string().allow(''),
    batchID:Joi.string().allow(''),
})
export const MongoSyncApiValidation = Joi.object({
    viewMode: Joi.string().required(),
    fromDate:Joi.string().required(),
    toDate:Joi.string().required(),
    pageIndex:Joi.number().integer().positive().required(),
    pageSize:Joi.number().integer().positive().required(),
})

export const addCSCUserValidate= Joi.object({
    userID: Joi.number().integer().positive().required(),
    userName:Joi.string().required(),
    name:Joi.string().required(),
    mobileNumber:Joi.number().integer().positive().required(),
})
export const otpValidation = Joi.object({
    appAccessUserName: Joi.string().required(),
    otp: Joi.required(),
    
})
export const voiceApiValidation = Joi.object({
    voxbotCallDetails: Joi.array().items({
        InitiateDateTime:  Joi.string().required(),
        CallSummary:  Joi.string().allow(''),
        CorrectPersonRes:   Joi.string().allow(''),
        BatchId:  Joi.string().required(),
        Durations: Joi.number().integer().positive(),
        CallStatus:   Joi.string().required(),
        PathTaken:   Joi.string().allow(''),
        CallDateTime:   Joi.string().allow(''),
        AudioFile:   Joi.string().allow(''),
        RetryCount: Joi.number(),
        CustomerNumber:   Joi.string().allow(''),
        TicketNumber:   Joi.string().allow(''),
        RequestDateTime:   Joi.string().allow(''),
        CorrectPersonInt:   Joi.string().allow(''),
        Id: Joi.number().integer().positive(),
        CustomerName:   Joi.string().allow(''),
        AgentName:   Joi.string().allow(''),
        SatisfiedRes:   Joi.string().allow(''),
	SatisfiedInt:   Joi.string().allow(''),
	OpenCaseRes	:   Joi.string().allow(''),
	OpenCaseInt:   Joi.string().allow(''),
	RetryDateTime:   Joi.string().allow(''),

}),
batchId:  Joi.string().required(),
})
export const CSCInboundVoiceApiValidation = Joi.object({
    voxbotCallDetails: Joi.array().items({
        UniqueId: Joi.string().required(),
        BatchId:  Joi.string().required(),
        CustomerNumber:   Joi.string().allow(''),
        State:   Joi.string().allow(''),
        District:   Joi.string().allow(''),
        CallDateTime:   Joi.string().allow(''),
        CallStatus:   Joi.string().allow(''),
        Durations: Joi.number().integer().positive(),
        Id:Joi.number().integer().positive(),
        Language:  Joi.string().allow(''),
        LangRes:  Joi.string().allow(''),
        Languages: Joi.string().allow(''),
        UserName:   Joi.string().allow(''),
        PathTaken: Joi.string().allow(''),
        Reason:  Joi.string().allow(''),
        CallSummary:  Joi.string().allow(''),
        AudioFile:   Joi.string().allow(''),
       }),
       batchId:  Joi.string().required(),
       })
