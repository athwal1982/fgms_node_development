import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import jwt from "jsonwebtoken";
import moment from "moment/moment.js";
import {AuthHelpers} from "../../helper/authHelper.js";
import axios from "axios";
import {constant} from "../../constants/constant.js";
import toUpper from "lodash/toUpper";
import isEmpty from "lodash/isEmpty";
import https from "https";
import bcrypt  from "bcryptjs";
import cron  from "node-cron";
import nodemailer  from "nodemailer";
import { SupportTicketService } from "../support-ticket/supportTicketService.js";
export class FarmerloginService {

    constructor() {
        this.utilService = new UtilService();
        this.supportTicketService = new SupportTicketService()
 ///   this.scheduler();
    }
    async getTime(body) {
        const timestamp = moment().utc();
        return {timestamp}
    }
    
    async getFarmerTicketsListIndex(body,  SP) {
        let items = {};
        let message = '';
     
        await sequelize.query(`CALL ${SP}(
       :SPViewTYP,
       :SPSupportTicketTypeID,
       :SPRequestorMobileNo,
       :SPSupportTicketID,
       :SPTicketHeaderID,
       :SPSupportTicketNo,
       :SPApplicationNo,
       :SPTicketSourceID,
       :SPTicketCategoryID,
       :SPStatusID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
       :SPSchemeID,
       :SPInsuranceCompanyID,
       :SPStateID,
       :SPPageIndex,
	   :SPPageSize,
@SPRecordCount, 	
        @rcode, @rmessage)`, {
            replacements: {
                SPViewTYP: body.viewTYP,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || "",
                SPSupportTicketID: +body.supportTicketID,
                SPTicketHeaderID: +body.ticketHeaderID,
                SPSupportTicketNo: body.supportTicketNo,
                SPApplicationNo: body.applicationNo,
                SPTicketSourceID: +body.ticketSourceID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPStatusID: +body.statusID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID,
                SPSchemeID: +body.schemeID,
                SPInsuranceCompanyID: +body.insuranceCompanyID,
                SPStateID: body.stateID,
                SPPageIndex: body.pageIndex, 
                SPPageSize: body.pageSize, 
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
          //  console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message,@SPRecordCount').then((result) => {
              //  console.log("result", result)
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                const status = Object.values(res[0]).map((el) => el);
                const supportTicket = Object.values(res[1]).map((el) => el);
                items = {status, supportTicket}
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error('Something Went Wrong!')
        })
        return {data: items, message};
    }
    async farmerLoginByMobileNumber(body) {
        let data = null;    
        let items={};
        let message = '';
        let tokenPayload = {};
        const url = `${constant.PM_API_HTTPS}services/services/farmerMobileExists`;
          const   objCom={    insertedUserID:  body.objCommon.insertedUserID,
            insertedIPAddress: body.objCommon.insertedIPAddress};
        const config = {
            method: "GET",
            url,
            params: {
                mobile: body.mobilenumber,
                authToken: constant.PM_API_TOKEN,
            },
        }
        console.log(config);
        await axios(config).then(async res => {
            console.log(res);
            if (res.data && res.data.status) {
                
                const user = res.data.data;
                console.log('user',user);
                if (user.output === 0) {
                    throw new Error('No farmer found with this record')
                } else if (user.output === 2) {
                    message = {msg: 'Farmer Registered with Duplicate Mobile Number', code: user.output}
                } else {
                    
                let    apibody={
                       
                        callerMobileNumber:  body.mobilenumber,
                        farmerMobileNumber:  body.mobilenumber,
                        farmerName:  res.data.data.result.farmerName,
                        callStatus:"" ,
                        reason: "",
                        stateCodeAlpha: res.data.data.result.stateID,
                        districtCodeAlpha: res.data.data.result.districtID,
                        isRegistered: 'R',
                         objCommon:objCom
                      
                    }
                    console.log('apibody',apibody);
                 //   let   result = await this.supportTicketService.farmerCallingHistory(apibody);
                   // console.log('result',result);
                    tokenPayload = await this.generateJwtToken('99999', body.mobilenumber);
                    let  userdata = {
                        LoginID: 99999,
                        AppAccessUID: body.mobilenumber,
                        AppAccessTypeID: 0,
                        AccessProfileID: 0,
                        AccessProfileType: 'D',
                        UserDisplayName: res.data.data.result.farmerName,
                        UserRelationID: 124307,
                        UserRelationType:'FAR',
                        UserMobileNumber: body.mobilenumber,
                        UserCompanyType: 'Farmer',
                        CompanyName: 'Farmer',
                        BRHeadTypeID:124307,
                        LocationTypeID: 1,
                        ActivationDays: 100,
                        FirstTimeLogin: 'N',
                        LocationMasterName: 'State',
                        SessionID:999,
                        rcode: 1,
                        rmessage: 'Success',
    
                    };
                    items={...userdata ,data:res.data,userMenuMaster:[],token: {
                    Token: tokenPayload.token,
                        expirationTime: tokenPayload.timestamp,
                        validFrom: moment().utc(),
                        validTo: tokenPayload.expiresIn}}
                   // data = res.data;
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        })
        
        return {data: items, message};
        
    }
    async farmerGenerateSupportTicket(req) {
        let body=req.body;    
        let items = {};
        let tokenvalue =undefined;
        let message = '';
        let ticketmessage = '';
        let apiResult='';
        let varheaderID = body.ticketHeaderID.toString();
        let categoryMapID=0;
        await sequelize.query(`CALL ${STORE_PROCEDURE.FARMER_LOGIN_SUPPORT_TICKET_INSERT}(
        @SPSupportTicketID,
        :SPCallerContactNumber,
       :SPTicketRequestorID,
       :SPVillageRequestorID,
       :SPStateCodeAlpha,
       :SPDistrictRequestorID,
       @SPSupportTicketNo,
       :SPRequestorName,
       :SPRequestorMobileNo,
       :SPRequestorAccountNo,
       :SPRequestorAadharNo,
       :SPTicketCategoryID,
       :SPCropCategoryOthers,
       :SPCropStageMasterID,
       :SPTicketHeaderID,
       :SPRequestYear,
       :SPRequestSeason,
       :SPTicketSourceID,
       :SPTicketDescription,
       :SPLossDate,
       :SPLossTime,
       :SPPostHarvestDate,
       :SPTicketStatusID,
       :SPApplicationNo,
       @SPInsuranceCompanyID,
       :SPInsurancePolicyNo,
       :SPInsurancePolicyDate,
       :SPInsuranceExpiryDate,
       :SPBankMasterID,
       :SPAgentUserID,
       :SPSchemeID,
       :SPHasDocument,
       :SPCompanyCode,
       :SPCompanyName,
       :SPOnTimeIntimationFlag,
       @SPCategoryMapID,
       :SPAttachmentPath,
        :SPCropName,
        :SPApplicationCropName,
        :SPArea,
        :SPVillageName,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPCallerContactNumber:body.callerContactNumber,
                SPTicketRequestorID: body.ticketRequestorID,
                SPVillageRequestorID: body.villageRequestorID,
                SPStateCodeAlpha: body.stateCodeAlpha,
                SPDistrictRequestorID: body.districtRequestorID,
                SPRequestorName: body.requestorName,
                SPRequestorMobileNo: body.requestorMobileNo,
                SPRequestorAccountNo: body.requestorAccountNo,
                SPRequestorAadharNo: body.requestorAadharNo,
                SPTicketCategoryID: body.ticketCategoryID,
                 SPCropCategoryOthers: body.cropCategoryOthers,
                SPCropStageMasterID: body.cropStageMasterID,
                SPTicketHeaderID: body.ticketHeaderID,
                SPRequestYear: body.requestYear,
                SPRequestSeason: body.requestSeason,
                SPTicketSourceID: body.ticketSourceID,
                SPTicketDescription: body.ticketDescription,
                SPLossDate: body.lossDate,
                SPLossTime: body.lossTime,
                SPPostHarvestDate: body.postHarvestDate,
                SPTicketStatusID: body.ticketStatusID,
                SPApplicationNo: body.applicationNo,
                SPInsurancePolicyNo: body.insurancePolicyNo,
                SPInsurancePolicyDate: body.insurancePolicyDate || null,
                SPInsuranceExpiryDate: body.insuranceExpiryDate || null,
                SPBankMasterID: body.bankMasterID,
                SPAgentUserID: body.agentUserID,
                SPSchemeID: body.schemeID,
                SPHasDocument: body.hasDocument,
                SPCompanyCode: body.companyCode,
                SPCompanyName: body.companyName,
                SPOnTimeIntimationFlag: body.onTimeIntimationFlag,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPAttachmentPath: body.attachmentPath,
                SPCropName: body.cropName,
                SPApplicationCropName: body.applicationCropName,
                SPArea: body.area,
                SPVillageName: body.villageName,
                SPInsertIPAddress: body.objCommon.insertedIPAddress
            },
            type: sequelize.QueryTypes.RAW,
                       
        }).then(async (res) => {
            await sequelize.query(`select 
            @SPSupportTicketID AS ticketId, 
            @SPSupportTicketNo AS ticketNo, 
            @SPInsuranceCompanyID AS insComId,
            @SPCategoryMapID as categoryMapID,
            @rcode AS code, 
            @rmessage AS message`).then(async(result) => {
                const data = flatMap(result);
                
                
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                else{
                categoryMapID=data[0].categoryMapID;
                message=data[0].message;
                ticketmessage=data[0].message;
                items = {
                    InsuranceCompany: data[0].insComId,
                    SupportTicketID: data[0].ticketId,
                    SupportTicketNo: data[0].ticketNo,
                    CategoryMapID: data[0].categoryMapID
                };
         
    } 
             })
         
           
      
    })
    return {data: items, ticketmessage};
    
    }
    async generateJwtToken(id, username) {
        const timestamp = Date.now() / 1000
      //  const expiresIn = moment().add(1, 'M').utc();
      const expiresIn = moment().add(10, 'hours').utc();
        const token = jwt.sign(
            {
                expiresIn,
                iat: timestamp,
                id,
                username
            },
            process.env.JWT_SECRET
        )
        return {token, timestamp, expiresIn}
    }
}