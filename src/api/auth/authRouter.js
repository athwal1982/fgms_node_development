import express from 'express'
import {authThirdMiddleware} from "../middleware/authMiddleware.js";
import {AuthController} from './authController'
import {loginValidate,addCSCUserValidate,cSCAgentLoginValidate,MongoSyncApiValidation,UserIDValidate,MobileNumberValidate,CSCInboundVoiceApiValidation,logoutValidate,CSCInboundVoiceSelectApiValidation,IntialValidate,voiceApiValidation,timevalidate,forgetValidate,otpValidation,resetForgetValidate,diffUsersLoginValidate} from "./authValidation.js";
import {createValidator} from "express-joi-validation";

const authController = new AuthController()
export const authRouter = express.Router()
const validator = createValidator({
    passError: true
})

authRouter.post('/GetTime', validator.body(timevalidate), authController.getTime)
authRouter.post('/GetSupportTicketUserDetail', validator.body(UserIDValidate), authController.getSupportTicketUserDetail)
authRouter.post('/SupportTicketMongoDBSYNC', validator.body(MongoSyncApiValidation), authController.supportTicketMongoDBSYNC)
authRouter.post('/PrepareDBByMobileNumber', validator.body(timevalidate), authController.prepareDBByMobileNumber)
authRouter.post('/PushVoiceAPIResponse', validator.body(voiceApiValidation), authController.pushVoiceAPIResponse)
authRouter.post('/Intial', validator.body(IntialValidate), authController.intial)
authRouter.post('/UserLogin', validator.body(loginValidate), authController.logIn)
authRouter.post('/DiffUsersLogin', validator.body(diffUsersLoginValidate), authController.diffUsersLogin)
authRouter.post('/CSCAgentLogin', validator.body(cSCAgentLoginValidate), authController.cSCAgentLogin)
authRouter.post('/AddCSCUser', validator.body(addCSCUserValidate), authController.addCSCUser)

authRouter.post('/LogOutUser', validator.body(logoutValidate), authController.logOut)
authRouter.post('/Forget', validator.body(forgetValidate), authController.forget)
authRouter.post('/ResetForgetPassword',  validator.body(resetForgetValidate), authController.resetForgetPassword)
authRouter.post('/OtpValidate', validator.body(otpValidation), authController.otpValidate)
authRouter.post('/CSCInboundVoiceApi',authThirdMiddleware ,validator.body(CSCInboundVoiceApiValidation), authController.cscInboundVoiceApi)
authRouter.post('/CSCInboundVoiceSelectApi',validator.body(CSCInboundVoiceSelectApiValidation), authController.cscInboundVoiceSelectApi)

authRouter.post('/GetTicketStatus',  validator.body(MobileNumberValidate),authController.getTicketStatusChatBot)

