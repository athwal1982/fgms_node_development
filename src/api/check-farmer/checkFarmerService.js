import {UtilService} from "../../helper/utilService.js";
import axios from "axios";
import {constant} from "../../constants/constant.js";
import {sequelize} from "../../database";
import flatMap from "lodash/flatMap";
import {STORE_PROCEDURE} from "../../constants/db_tables";
import https from "https";
import {loggingApi} from "../../logger.js";

import { SupportTicketService } from "../support-ticket/supportTicketService.js";
import('dotenv').config;


//const client = createClient();


//client.on('error', err => console.log('Redis Client Error', err));
//(async() =>{
//await client.connect();
//})
export class CheckFarmerService {

    constructor() {
        this.utilService = new UtilService();
        this.supportTicketService = new SupportTicketService()
    }
    async getEnquiryTicketReview(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.ENQUIRY_TICKET_HISTORY_SELECT}(
       :SPFarmerMasterID,
       :SPPageIndex,
       :SPPageSize,
       @SPRecordCount,
        @rcode, @rmessage)`, {
            replacements: {
                SPFarmerMasterID: +body.farmerMasterID,
                SPPageIndex: +body.pageIndex,
                SPPageSize: +body.pageSize,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @SPRecordCount AS recordCount, @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error('Something Went Wrong!')
        })
        return {data: {Ticket: items}, message};

    }
    
    async calculatedPremiumReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_PREMIUM_CALCULATORY_HISTORY_REPORT}(
       :SPInsuranceCompanyID,
       :SPStateID,       
        @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceCompanyID: body.insuranceCompanyID,
                SPStateID: body.stateID,
           
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select  @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error(error)
        })
        return {data: {data: items}, message};

    }
    async addEnquiryTicketReview(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.ENQUIRY_TICKET_HISTORY_INSERT}(
       @SPTicketHistoryID,
       :SPFarmerMasterID,
       :SPAgentUserID,
       :SPTicketStatusID,
       :SPTicketDescription,
       :SPHasDocument,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPFarmerMasterID: body.farmerMasterID,
                SPAgentUserID: body.agentUserID,
                SPTicketStatusID: body.ticketStatusID,
                SPTicketDescription: body.ticketDescription,
                SPHasDocument: body.hasDocument,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async () => {
            await sequelize.query(`select @SPTicketHistoryID AS TicketHistoryID, @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {TicketHistoryID: data[0].TicketHistoryID}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async checkFarmerByMobileNumber(body) {
        let data = null;    
        let message = '';
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
                
                loggingApi.logger.info( res.data.data);
                loggingApi.logger.debug('Debugging info');
                          loggingApi.logger.warn('Warning message');
                loggingApi.logger.error('Error info');
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
                    let   result = await this.supportTicketService.farmerCallingHistory(apibody);
                    console.log('result',result);
                    data = res.data;
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        })
        return {data, message}
    }
    async checkKRPHFarmerByMobileNumber(body) {
        let data = null;    
        let message = '';
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
                
                loggingApi.logger.info( res.data.data);
                loggingApi.logger.debug('Debugging info');
                          loggingApi.logger.warn('Warning message');
                loggingApi.logger.error('Error info');
                const user = res.data.data;
                console.log('user',user);
                if (user.output === 0) {
                    throw new Error('No farmer found with this record')
                } else if (user.output === 2) {
                    message = {msg: 'Farmer Registered with Duplicate Mobile Number', code: user.output}
                } else {
                    
                    data = res.data;
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        })
        return {data, message}
    }

    async checkFarmer(body, searchType) {
        let data = {};
        let message = '';
        const url = `${constant.PM_API_HTTPS}farmers/farmers/searchFarmer`;
        const config = {
            method: "POST",
            url,
            data: {
                ...body,
                searchType,
                authToken: constant.PM_API_TOKEN,
            },
        }
        console.log('ur',url);
        console.log('config',config);
        await axios(config).then(res => {
            if (res.data && res.data.status) {
                const result = res.data.data;
                if (result.output === 1) {
                    data = res.data;
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
    }

    async checkDistrictCropWise(params, API) {
        let data = [];
        let message = '';
        const url = `${constant.PM_API_HTTPS}services/services/${API}`;
        const config = {
            method: "GET",
            url,
            params,
        }
        console.log('config',config);
        await axios(config).then(res => {
            if (res.data && res.data.status) {
                const result = res.data.data;
                if (result.output === 1) {
                    data = res.data;
                    console.log('sssyID - data',data.data);
                   let sssyID = data.data.result[0].sssyID.substring(4, 6);
                   console.log('sssyID',sssyID);
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
    }
    async fetchFarmerDetail(body, API) {
        let data = [];
        let message = '';
        const url = `${constant.PM_API_HTTPS}services/services/${API}`;
        const config = {
            method: "GET",
            url,
            params: {
                ...body,
                authToken: constant.PM_API_TOKEN,
            },
        }

        await axios(config).then(res => {
            if (res.data && res.data.status) {
                const result = res.data.data;
                if (result.output === 1) {
                    data = res.data;
                    message = 'SUCCESS'
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        })
        return {data, message}
    }

    async fetchClaimDetail1(body) {
        let data = [];
        let data1 = [];
        let message = '';
      //  const redisClient =cacheClient();
        const url = `${constant.PM_API_HTTPS}user/user/login`;
        let requestData = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               };
        const config = {
            method: "POST",
            url,
            data:
                {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               },
        }
            await  axios.post(url,requestData,  {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            }).then(async (res) => {
console.log('resress',res.data);
            if (res.data.status) {
          
                const result = res.data;
                console.log('resresresresres',result);
                console.log('token',result.data.token);
              
                    if(result.data.token!=="") {
                         
                   
                        const url1 = `${constant.PM_API_HTTPS}claims/claims/claimSearchReport?`;
                        const config1 = {
                            method: "GET",
                            url1,
                            params: {
                                ...body,
                                token:result.data.token,
                              
                            },
                            headers:{
                                token:result.data.token 
                            },
                        }
                        console.log('url1',url1);
                        console.log('config',config1);
                       await axios.get(`${constant.PM_API_HTTPS}claims/claims/claimSearchReport`, {
                            params: {    ...body, },
                            headers: {
                                token:result.data.token
                            }},{
                                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                            }).then(async (res) => {                   
                        
                            if (res.data.status) {
                           
                                const result1 = res.data;
                                    data = result1.data;
                                    message = 'SUCCESS'
                              
                                  
                            } 
                         
                           }).catch((err) => {
                throw new Error(err);
            })
    
        }}}).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
                 
                           
    
    }
    /*async fetchClaimDetail(body) {
        let data = [];
        let data1 = [];
        let message = '';
        
//const client = createClient();
//const client=createClient();


//client.on('error', err => console.log('Redis Client Error', err));

//await client.connect();
//        const loginToken =await KrphRedis.getValueFromCache('PMFBYToken');

//const loginToken =await KrphRedis.getValueFromCache('PMFBYToken');
console.log('342',appCache.get("PMFBYToken"));
let loginToken =appCache.get("PMFBYToken");

if(loginToken===undefined) {
  //  if(appCache.has('PMFBYToken'))   
       
        
            console.log('fetchToken From URL',loginToken)
            const url = `${constant.PM_API_HTTPS}user/user/login`;
            let requestData = {
                        "deviceType": "android",
                        "otp": 123456,
                        "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                        "mobile": "9899499022"
                   };
            const config = {
                method: "POST",
                url,
                data:
                    {
                        "deviceType": "android",
                        "otp": 123456,
                        "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                        "mobile": "9899499022"
                   },
            }
           
            await axios(config).then(res => {
                if (res.data && res.data.status) {
                    const result = res.data.data;
                    if (result.token ) {
                      loginToken   = result.token ;
                      console.log("set value: " + loginToken);
                     let tokenSession =result.sessionTTL;
                      //  setValueInCache('PMFBYToken',result.token,result.sessionTTL)
                      appCache.set("PMFBYToken",result.token,Number(result.sessionTTL));
                        console.log('337666',appCache.get("PMFBYToken") );
                    }
                } else {
                    throw new Error(res.data.error);
                }
            }).catch((err) => {
                throw new Error(err);
            })

            }
            console.log('loginToken',loginToken);
            if(loginToken!==null) {
                const url1 = `${constant.PM_API_HTTPS}claims/claims/claimSearchReport?`;
                        const config1 = {
                            method: "GET",
                            url1,
                            params: {
                                ...body,
                                token:loginToken,
                              
                            },
                            headers:{
                                token:loginToken
                            },
                        }
                        console.log('url1',url1);
                        console.log('config',config1);
                       await axios.get(`${constant.PM_API_HTTPS}claims/claims/claimSearchReport`, {
                            params: {    ...body, },
                            headers: {
                                token:loginToken
                            }},{
                                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                            }).then(async (res) => {                   
                        
                            if (res.data.status) {
                           
                                const result1 = res.data;
                                    data = result1.data;
                                    message = 'SUCCESS'
                              
                                  
                            } 
                         
                           }).catch((err) => {
                throw new Error(err);
            })
    
       
        return {data, message}
                 
            }
        
        }                 
    
    */

    async fetchToken() {
        let data = [];
        let message = '';
         const url = `${constant.PM_API_HTTPS}user/user/login`;
        let requestData = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               };
        const config = {
            method: "POST",
            url,
            data:
                {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               },
        }
       
        await axios(config).then(res => {
            if (res.data && res.data.status) {
                const result = res.data.data;
                if (result.token ) {
                 let token   = result.token ;
                 let tokenSession =result.sessionTTL;
                //    setValueInCache('PMFBYToken',result.token,result.sessionTTL)
                    message = 'SUCCESS'
                  data=  {token:token,tokenSession:tokenSession};
                }
            } else {
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
    }

    async checkFarmerByDb(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_FARMERS_MASTER_SELECT}(
       :SPViewMode,
       :SPTicketRequestorID,
       :SPMobileNumber,
       :SPAadharNumber,
       :SPAccountNumber,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPTicketRequestorID:body.ticketRequestorID,
                SPMobileNumber: body.mobilenumber,
                SPAadharNumber: body.aadharNumber,
                SPAccountNumber: body.accountNumber,
                SPUserID: +body.objCommon.insertedUserID
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                console.log('data',data)
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }

                if (data.length === 0) {
                    throw new Error('No farmer found with this record')
                }
            else{
                items = {status: true, data: {output: 1, result: res}};
                message = data[0].message;
            }
            })
        })
        return {data: items, message};
    }

    async checkFarmerAddInDb(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_FARMERS_MASTER_INSERT}(
       @SPFarmerMasterID,
       :SPAddMode,
       @SPFarmerID,
       :SPCallerContactNumber,
       :SPFarmerFullName,
       :SPRelationShipID,
       :SPRelationShip,
       :SPMobileNumber,
       :SPCasteID,
       :SPFarmerTypeID,
       :SPFarmerCategoryID,
       :SPFarmerIDType,
       :SPDistrictID,
       :SPStateID,
       :SPAge,
       :SPGender,
       :SPDistrict,
       :SPVillageID,
       :SPVillage,
       :SPSubDistrictID,
       :SPSubDistrict,
       :SPAddress,
       :SPPinCode,       
       :SPBankID,
       :SPBankName,
       :SPBranchID,
       :SPBranchName,
       :SPAadharNumber,
       :SPYear,
       :SPCropSeasonID,
       :SPCropName,
       :SPSchemeID ,
       :SPSelectedCropID,
       :SPSSSYID,
       :SPInsuranceCompanyCode,
       :SPArea,
       :SPCalculatedPremium,
       :SPAccountNumber,
       :SPDescription,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPAddMode: body.addMode,
                SPCallerContactNumber:body.callerContactNumber,
                SPFarmerFullName: body.farmerFullName,
                SPRelationShipID: body.relationShipID,
                SPRelationShip: body.relationShip,
                SPMobileNumber: body.mobileNumber,
                SPCasteID: body.casteID,
                SPFarmerTypeID: body.farmerTypeID,
                SPFarmerCategoryID: body.farmerCategoryID,
                SPFarmerIDType: body.farmerIDType,
                SPDistrictID: body.districtID,
                SPStateID: body.stateId,
                SPAge: body.age,
                SPGender: body.gender,
                SPDistrict: body.district,
                SPVillageID: body.villageId,
                SPVillage: body.village,
                SPSubDistrictID: body.subDistrictId,
                SPSubDistrict: body.subDistrict,
                SPAddress: body.address,
                SPPinCode: body.pinCode,
                SPBankID: body.bankId,
                SPBankName: body.bankName,
                SPBranchID: body.branchId,
                SPBranchName: body.branchName,
                SPAadharNumber: body.aadharNumber,
                SPYear: body.year,
                SPCropSeasonID: body.cropSeasonId,
                SPCropName:body.cropName,
                SPSchemeID: body.schemeId,
                SPSelectedCropID: body.selectedCropId,
                SPSSSYID: body.sSSYId,
                SPInsuranceCompanyCode: body.insuranceCompanyCode,
                SPArea: body.area,
                SPCalculatedPremium: body.calculatedPremium,
                SPAccountNumber: body.accountNumber,
                SPDescription: body.description,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {

            await sequelize.query('select @SPFarmerMasterID AS farmerMasterId, @SPFarmerID AS farmerId, @rcode AS code, @rmessage AS message').then((result) => {
                console.log("result", result);
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {FarmerMasterID: data[0].farmerMasterId,FarmerID: data[0].farmerId};
                message = data[0].message;
            })
        })
        return {data: items, message};
    
    
    }
    async checkFarmerUpdateInDb(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_FARMERS_MASTER_UPDATE}(
       :SPFarmerMasterID,
       :SPYear,
       :SPCropSeasonID,
       :SPCropName,
       :SPSchemeID ,
       :SPSelectedCropID,
       :SPSSSYID,
       :SPInsuranceCompanyCode,
       :SPArea,
       :SPCalculatedPremium,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPFarmerMasterID: body.farmerMasterID,
                SPYear: body.year,
                SPCropSeasonID: body.cropSeasonID,
                SPCropName:body.cropName,
                SPSchemeID: body.schemeID,
                SPSelectedCropID: body.selectedCropID,
                SPSSSYID: body.sssyID,
                SPInsuranceCompanyCode: body.insuranceCompanyCode,
                SPArea: body.area,
                SPCalculatedPremium: body.calculatedPremium,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {

            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                console.log("result", result);
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;

                message = data[0].message;
            })
        })
        return {data: items, message};
    
    
    }
    async addCalculatedPremium(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_PREMIUM_CALCULATORY_HISTORY_INSERT}(
        @SPCalculatorHistoryID,
       :SPMobileNumber,
       :SPDistrictID,
       :SPStateMasterID,
       :SPYear,
       :SPCropSeasonID,
       :SPCropName,
       :SPSchemeID,
       :SPSelectedCropID,
       :SPSSSYID,
       :SPInsuranceCompanyCode,
       :SPArea,
       :SPCalculatedPremium,
       :SPDescription,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPMobileNumber:body.mobileNumber,
                SPDistrictID: body.districtID,
                SPStateMasterID: body.stateMasterID,
                SPYear: body.year,
                SPCropSeasonID: body.cropSeasonID,
                SPCropName: body.cropName,
                SPSchemeID: body.schemeID,
                SPSelectedCropID: body.selectedCropID,
                SPSSSYID: body.sSSYID,
                SPInsuranceCompanyCode: body.insuranceCompanyCode,
                SPArea: body.area,
                SPCalculatedPremium: body.calculatedPremium,
                SPDescription: body.description,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select 
            @SPCalculatorHistoryID AS historyId,
            @rcode AS code, 
            @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {
                    CalculatorHistoryID : data[0].historyId,
                };
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    
    
}
