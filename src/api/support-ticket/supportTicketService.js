import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import axios from "axios";
import multer from "multer";
import moment from "moment";
//import redis from "redis"
import cron  from "node-cron";
import https from "https";
//import {cacheClient, setValueInCache, getValueFromCache } from "../../database/redis.js";
import dateFormat  from "dateformat";
import {constant} from "../../constants/constant.js";
import toUpper from "lodash/toUpper";
import {loggingApi} from "../../logger.js";
import('dotenv').config;
import nodecache from 'node-cache';
const appCache = new nodecache( { stdTTL: 100, checkperiod: 120 } );

export class SupportTicketService {

    constructor() {
        this.utilService = new UtilService();
this.uploadExcelINTODataBase();
    }


    async uploadExcelINTODataBase()
{
    cron.schedule('*/10 * * * *', async function () {
        
            let datareturn=[];
          await sequelize.query("SELECT * FROM krph_insurance_upload_file_master WHERE STATUS ='NEW'", {
            replacements: {                                          
            },
               type: sequelize.QueryTypes.SELECT,
           }).then( async (res,error) => {
         datareturn=res;
        
     console.log('datareturn',datareturn);
           
          if(datareturn.length>0)
          {
       for (let i = 0; i < datareturn.length; i++)
                    
                    {
            const   objCom={    insertedUserID: datareturn[i].InsertUserID,
                insertedTime: 'Now()',
                    insertedIPAddress: datareturn[i].InsertIPAddress};
             //   filename=datareturn[i].FileName;
            let excelFile="./krph_excel/" + datareturn[i].FileName;
         //   let stream = fs.createReadStream(excelFile);
         //   const valExtension = excelFile.substring(excelFile.lastIndexOf(".")).toLowerCase().slice(1);
           // if(valExtension!=="xlsx"){
             //   message: "Please select only xlsx extension file.";
           // }
            //else
            //{
            console.log('excelFile',excelFile);
            let sqlstring='';
                 const workBook = XLSX.readFile(excelFile);
      const workSheetName = workBook.SheetNames[0];
      const wokrSheet = workBook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(wokrSheet, {
        header: 0,
        defval: "",
      });
      console.log('data_3348',data.length);
      if (data && data.length > 0) {
                let startcount=0;
        let setcounter=800;
        let initailcounter=0;
       
        const obj = data[0];
    
        if (!Object.keys(obj).includes("Ticket No")) {
           
             
              message= "Please do not change the Header cloumn Ticket No"
            
            return;
          }
          if (!Object.keys(obj).includes("Type")) {
          
              message= "Please do not change the Header cloumn Type";
            return;
          }
          if (!Object.keys(obj).includes("Ticket Status")) {
           
              message= "Please do not change the Header cloumn Ticket Status";
           
            return;
          }
          if (!Object.keys(obj).includes("Comments")) {
           
              message= "Please do not change the Header cloumn Comments";
           
            return;
          }
          sqlstring="insert into krph_insurance_upload_ticket_master(FileMasterID,SupportTicketNo,TicketDescription,NewTicketStatusID,`UpdateStatus`,`InsertUserID`,`InsertedTime`,`InsertIPAddress`) VALUES ";
          const dataForUpload = [];
          let rtnval = true;
          data.forEach(async (val) => {
          startcount =startcount+1;
            let statusID=  val["Ticket Status"] === "Open"  ? 109301 : val["Ticket Status"] === "In-Progress"   ? 109302 : val["Ticket Status"] === "Resolved" ? 109303 : val["Ticket Status"] === "Re-Open" ? 109304 : 0;
            dataForUpload.push({
              supportTicketNo: val["Ticket No"],
              ticketDescription: val.Comments,
              ticketStatusID:statusID,
              ticketStatus: val["Ticket Status"],
              ticketHeaderID: val.Type === "Grievance" ? 1 : val.Type === "Information" ? 2 : val.Type === "Crop Loss Intimation" ? 4 : 0,
              ticketHeader: val.Type,
            });
                  if((val.Comments!=='') && (val["Ticket No"]!=='') && (statusID!==0)&& (statusID!==109301)) {
          
          sqlstring += "(" + datareturn[i].FileMasterID  + ",'" + val["Ticket No"]  + "','" + JSON.stringify(val.Comments, null, 2)  +  "',"  + statusID + ",2," + objCom.insertedUserID  +  "," + objCom.insertedTime  +  ",'" + objCom.insertedIPAddress  +  "'),"; 
            }
       //     console.log('startcount',startcount);
            if(startcount==800)
            {
            console.log('startcount',startcount);
             if(sqlstring.length>0){
          sqlstring = sqlstring.substring(0,sqlstring.length-1);
          sqlstring += ";";
         // console.log('sqlstring',sqlstring);
      InsertDBfunction(sqlstring);
      //let insertResponse=InsertDBfunction(sqlstring);
      sequelize.query(sqlstring, {
        replacements: {
              
        },
           type: sequelize.QueryTypes.INSERT,
       }).then(async (res) => {
        startcount=0;
        sqlstring='';
         sqlstring="insert into krph_insurance_upload_ticket_master(FileMasterID,SupportTicketNo,TicketDescription,NewTicketStatusID,`UpdateStatus`,`InsertUserID`,`InsertedTime`,`InsertIPAddress`) VALUES ";
       })
         
     
    
            }
            }

          });
          if(sqlstring.length>0){
          sqlstring = sqlstring.substring(0,sqlstring.length-1);
          sqlstring += ";";
         console.log('sqlstring2044444444');
    //  let insertResponse= await this.InsertDBfunction(sqlstring);
     
    sequelize.query(sqlstring, {
        replacements: {
              
        },
           type: sequelize.QueryTypes.INSERT,
       }).then(async (res) => {

       })
          }
        
                  
        }


     //this.UpdateDBfunction("Update krph_insurance_upload_file_master set Status='Operational'  where FileMasterID = " + datareturn[i].FileMasterID + " ;");             
     sequelize.query("Update krph_insurance_upload_file_master set Status='Operational'  where FileMasterID = " + datareturn[i].FileMasterID + " ;", {
        replacements: {
              
        },
           type: sequelize.QueryTypes.Update,
       }).then(async (res) => {

       })              
       


        }

       

        }

        })
     
    })

    cron.schedule('*/20 * * * *', async function () {
        
        let datareturn=[];
      await sequelize.query("SELECT * FROM krph_insurance_upload_file_master WHERE STATUS ='Operational'", {
        replacements: {                                          
        },
           type: sequelize.QueryTypes.SELECT,
       }).then( async (res,error) => {
     datareturn=res;
    
 console.log('datareturn',datareturn);
       
      if(datareturn.length>0)
      {
        for (let i = 0; i < datareturn.length; i++)
                    
            {
        await sequelize.query(`CALL support_ticket_upload_ticket_status(
            :SPFileID,
            @rcode, @rmessage)`, {
       replacements: {
         SPFileID: datareturn[i].FileMasterID,            
       },
       type: sequelize.QueryTypes.RAW,
   }).then(async (res1) => {

    await sequelize.query(`select @rcode AS code, @rmessage AS message`).then(async (result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
    })
  

   })
     
}
    }

   })

    })

    
 

    cron.schedule('*/50 * * * *', async function () {
        let datareturn=[];
        await sequelize.query("SELECT * FROM krph_insurance_upload_file_master WHERE STATUS ='InProcess'", {
          replacements: {                                          
          },
             type: sequelize.QueryTypes.SELECT,
         }).then( async (res,error) => {
       datareturn=res;
      
   console.log('datareturn',datareturn);
         
        if(datareturn.length>0)
        {
     for (let i = 0; i < datareturn.length; i++)
                  
                  {
          const   objCom={    insertedUserID: datareturn[i].InsertUserID,
              insertedTime: 'Now()',
                  insertedIPAddress: datareturn[i].InsertIPAddress};
        let requestjson={
       //   fileMasterID: datareturn[i].FileMasterID,
       fileMasterID: 1,
          viewMode: "SMSLIST",
          objCommon: {
            insertedUserID: datareturn[i].InsertUserID,
            insertedIPAddress: datareturn[i].InsertIPAddress,
            dateShort: "string",
            dateLong: "string"
          }
        }
  let SmsData= await this.uploadTicketSelect(requestjson);
  let apibody={};
  console.log('SmsData',SmsData);
  
  if(SmsData && SmsData.data){
       if(SmsData.data.length > 0)
          {
              let body='';
              for (let i = 0; i < SmsData.data.length; i++) {
  
       //           farmermobilenumber = SmsData.data[i].RequestorMobileNo;
         //         ticketnumber= SmsData.data[i].SupportTicketNo;
                
              if(SmsData.data[i].Template!=='')
              {
  
                  apibody={
                      templateID:SmsData.data[i].Template,
                      supportTicketNo:SmsData.data[i].SupportTicketNo,
                      mobileNO:SmsData.data[i].RequestorMobileNo,
                          objCommon: {
                          insertedUserID: datareturn[i].InsertUserID,
                          insertedIPAddress: datareturn[i].InsertIPAddress,
                          dateShort: "string",
                          dateLong: "string"
                        }
                    
                  }
                  console.log('apibody',apibody);
           //       let farmerSMS= this.sendSMSToFarmer(apibody);
                  let updateResponse = this.UpdateDBfunction("Update krph_insurance_upload_ticket_master set SentMessage=1 where FileTicketMasterID = " + SmsData.data[i].FileTicketMasterID  + " ;");             
                     
                     if(updateResponse.rcode=1) 
                     {
  
                     }
  
  
  
                     let message = '';
                   }
          }
        
  //        message = data[0].message;
      
      }
    //let finalUpdate=  this.UpdateDBfunction("Update krph_insurance_upload_file_master set Status='Finish' where FileMasterID = " + datareturn[i].FileMasterID + ";")             ;
  
      }
  }
      }
      })
    })
} 
    async fetchClaimDetail(body) {
        let data = [];
        let data1 = [];
        let message = '';
 
let loginToken =appCache.get("PMFBYToken");

if(loginToken===undefined) {
  //  if(appCache.has('PMFBYToken'))   
  loggingApi.logger.info('fetchToken From URL in Fetch Detail ' );
            
            const url = `${constant.PM_API_HTTPS}user/user/login`;
            console.log('ur',url);
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
                      loggingApi.logger.info('SET Token in Fetch Detail ' + '----' + body);
                       
                    }
                } else {
                    throw new Error(res.data.error);
                }
            }).catch((err) => {
                throw new Error(err);
            })

            }
            else
            {
                loggingApi.logger.info('GET Token in Fetch Detail FROM Cache' + '----' + body);
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
                  
    
    async getFarmerTicketsList(body, user, SP) {
        let items = {};
        let message = '';
        console.log("body",body);
        await sequelize.query(`CALL ${SP}(
       :SPViewTYP,
       :SPSupportTicketTypeID,
       :SPRequestorMobileNo,
       :SPSupportTicketID,
       :SPTicketHeaderID,
       :SPSupportTicketNo,
       :SPTicketSourceID,
       :SPTicketCategoryID,
       :SPStatusID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
       :SPSchemeID,
       :SPInsuranceCompanyID,
       :SPStateID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewTYP: body.viewTYP,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || "",
                SPSupportTicketID: +body.supportTicketID,
                SPTicketHeaderID: +body.ticketHeaderID,
                SPSupportTicketNo: body.supportTicketNo,
                SPTicketSourceID: +body.ticketSourceID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPStatusID: +body.statusID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID,
                SPSchemeID: +body.schemeID,
                SPInsuranceCompanyID: +body.insuranceCompanyID,
                SPStateID: body.stateID,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                console.log("result", result)
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
    
    async getOfflineSupportTicket(body) {
        let items = {};
        let message = '';
        console.log("body",body);
             await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_OFFLINE_GENERATE_SELECT}(
        :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
       :SPInsuranceCompanyID,
       :SPStateID,
        :SPPageIndex,
	   :SPPageSize,
       @SPRecordCount, 	
        @rcode, @rmessage)`, {
            replacements: {
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: +body.objCommon.insertedUserID,
                 SPInsuranceCompanyID: +body.insuranceCompanyID,
                SPStateID: body.stateID,
                SPPageIndex: body.pageIndex, 
                SPPageSize: body.pageSize, 
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
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

    
    async aggregrationSupportTicketReport(body) {
        let items = {};
        let message = '';
        console.log("body",body);
             await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGGREGRATION_REPORT}(
        :SPFROMDATE,
       :SPTODATE,
        @rcode, @rmessage)`, {
            replacements: {
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                const status = Object.values(res[0]).map((el) => el);
                
                items = {status}
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error('Something Went Wrong!')
        })
        return {data: items, message};
    }
    async getTicketsList(body, user, SP) {
        let items = {};
        let message = '';
        console.log("user",user);
        await sequelize.query(`CALL ${SP}(
       :SPViewTYP,
       :SPSupportTicketTypeID,
       :SPRequestorMobileNo,
       :SPSupportTicketID,
       :SPTicketHeaderID,
       :SPSupportTicketNo,
       :SPTicketSourceID,
       :SPTicketCategoryID,
       :SPStatusID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
       :SPSchemeID,
       :SPInsuranceCompanyID,
       :SPStateID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewTYP: body.viewTYP,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || "",
                SPSupportTicketID: +body.supportTicketID,
                SPTicketHeaderID: +body.ticketHeaderID,
                SPSupportTicketNo: body.supportTicketNo,
                SPTicketSourceID: +body.ticketSourceID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPStatusID: +body.statusID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID,
                SPSchemeID: +body.schemeID,
                SPInsuranceCompanyID: +body.insuranceCompanyID,
                SPStateID: body.stateID,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
          //  console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
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
    
   /* async getTicketsListIndex(body, user, SP) {
        let items = {};
        let message = '';
        console.log("user",user);
        await sequelize.query(`CALL ${SP}(
       :SPViewTYP,
       :SPSupportTicketTypeID,
       :SPRequestorMobileNo,
       :SPSupportTicketID,
       :SPTicketHeaderID,
       :SPSupportTicketNo,
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
        */
   
 async uploadFileExcel(body,fileName)
{
console.log('body_uploadFileExcel',body);
const jsonObject = JSON.parse(body);
console.log('body_uploadFileExcel_ImageName',jsonObject.ImageName); 
   let items = {};

    let message = '';
    await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_INSURANCE_UPLOAD_FILE_MASTER_INSERT}(
   @SPFileMasterID,
   :SPFileName,
   :SPInsertUserID,
   :SPInsertIPAddress,
    @rcode, @rmessage)`, {
        replacements: {
            SPFileName:jsonObject.ImageName,
            SPInsertUserID: jsonObject.insertedUserID,
            SPInsertIPAddress: jsonObject.insertedIPAddress,
        },
        type: sequelize.QueryTypes.INSERT,
    }).then(async (res) => {
        await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
            items= flatMap(result);
console.log('body_uploadFileExcel_dATA',data); 
            if (+items[0].code === 0) {
             message=items[0].message;
               // throw new Error(items[0].message)
             return {data: items,message};
            }

            items = res
            message = items[0].message;
        })
    }).catch((err) => {
        //console.log(err);
// throw new Error(err);

 //   return {data: items, message};
    })
    return items;
}

async uploadTicketSelect(body) {
    let items = {};
    let message = '';
    
     await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_INSURANCE_UPLOAD_FILE_MASTER_SELECT}(
   :SPViewMode,
   :SPFileMasterID,
   :SPInsertUserID,   	
    @rcode, @rmessage)`, {
        replacements: {
            
            SPViewMode: body.viewMode ,
            SPFileMasterID: body.fileMasterID,
            SPInsertUserID:body.objCommon.insertedUserID,
           
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
       console.log("res", res);
        await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
            
            const data = flatMap(result);
            console.log("result", data)
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            
           
            items = res;
            console.log(items);
            message = data[0].message;
        })
    }).catch((err) => {
        console.log(err);
        throw new Error(err)
    })
    return {data: items, message};
}

    async getTicketsListIndex(body, user, SP) {
        let items = {};
        let message = '';
        console.log("user",user);
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
       :SPDistrictID,
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
                SPDistrictID:body.districtID,
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
  
    async getBulkTicketsList(body, user, SP) {
        let items = {};
        let message = '';
        console.log("user",user);
        await sequelize.query(`CALL ${SP}(
            :SPViewTYP,
            :SPSupportTicketTypeID,
            :SPTicketHeaderID,
            :SPTicketCategoryID,
            :SPStatusID,
            :SPUserID,
            @rcode, @rmessage)`,{
            replacements: {
                SPViewTYP:body.viewTYP,
                SPSupportTicketTypeID:body.supportTicketTypeID,
                SPTicketHeaderID: +body.ticketHeaderID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPStatusID: +body.statusID,
                SPUserID: body.objCommon.insertedUserID,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
          //  console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
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
            throw new Error(err)
        })
        return {data: items, message};
    }
    
    async getExcelBulkTicketsList(body, user, SP) {
       
        let items = {};
        let senditemsjson = {};
        let senddata=[];
        let errordata=[];
        let apibody;
        let objerror={};
        let responsevoiceCall=0;
        let message = '';
        const   objCom={    insertedUserID:  body.objCommon.insertedUserID,
            insertedIPAddress: body.objCommon.insertedIPAddress};
        console.log("user",user);
        
                     for (let key in body.tickets) 
                      {
                        console.log('key',key);
                        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_HISTORY_EXCEL_INSERT}(
                            :SPSupportTicketNo,
                            :SPAgentUserID,
                            :SPTicketStatusID,
                            :SPTicketDescription,
                            :SPInsertUserID,
                            :SPInsertIPAddress)`, {
                                 replacements: {
                                    SPSupportTicketNo: body.tickets[key].supportTicketNo,
                                     SPAgentUserID: body.agentUserID,
                                     SPTicketStatusID: body.tickets[key].ticketStatusID,
                                     SPTicketDescription: body.tickets[key].ticketDescription,
                                     SPInsertUserID: body.objCommon.insertedUserID,
                                     SPInsertIPAddress: body.objCommon.insertedIPAddress
                                 },
                                 type: sequelize.QueryTypes.INSERT,
                             }).then(async (res) => {
                           //     await sequelize.query('select @rcode AS code, @rmessage AS message').then(async (result) => {
                           
                                    const response = res['0'];
                                    console.log('response',response)
                                        if ((res['0'].ResponseCode  === '0') ||(res['0'].ResponseCode  === '4')) 
                                          {  
                                            objerror={error:res['0'].ResponseMessage,TicketNo:body.tickets[key].supportTicketNo}
                                        errordata[key]=objerror;
                                     console.log('errordata',errordata);
                                        }     
                                  else
                                  {                             
                                      console.log('res',res);
                                    if (res['0'].ResponseCode === '1') {                               
                                                                      
                                        objerror={error:res['0'].ResponseMessage,TicketNo:body.tickets[key].supportTicketNo}
                                        if(body.tickets[key].ticketStatusID===109303)
                                        {
                                        senditemsjson={Number:res['0'].RequestorMobileNo,Name:res['0'].FarmerName,TicketNumber:res['0'].SupportTicketNo}
                                        senddata[key]=senditemsjson;
                                        }
                                        errordata[key]=objerror;
                                             if(res['0'].Template!=='')
                                             {
             
                                                 apibody={
                                                     templateID:res['0'].Template,
                                                     supportTicketNo:res['0'].SupportTicketNo,
                                                     mobileNO:res['0'].RequestorMobileNo,
                                                     objCommon:objCom
                                                   
                                                 }
                                                 // this.sendSMSToFarmer(apibody);
                                                    let message = '';
                                                  }
                                         }
                                         
                                     }
                                    
                             })
                            // })
                          
                  
                    
                 
                 
                }
                if(senddata.length>0)
                {
 // responsevoiceCall = await this.callVoiceCallAPI(senddata);
                }
        return {data: errordata, message,ResponseCall:responsevoiceCall};
    }
    async callVoiceCallAPI(Data)  {
        console.log('requestCallData',Data);
     //   let data = [];
        let data1 = [];
        let message = '';
        let payload = {};
        let request = {};
        let result = {};
        let body = {};        
        let returnresponse = 0;
        let tokenPayload = {};
        let token = {};
       // https://<URL>/voxbot_placeCalls/<campaign-name>?INPUT_TYPE=json

        const url = `${constant.VOICE_URL}/voxbot_placeCalls/${constant.VOICE_CAMPAIGN_NAME}?INPUT_TYPE=json`;
       
        let  BotSettings= {
            "UserId" : constant.VOICE_USER_ID,
            "Campaign" : constant.VOICE_CAMPAIGN_NAME,
            "RetryCount" : 0,
            "RetryDelay" : 30,
            "Language" : constant.VOICE_LANGUAGE,
            "Voice" : constant.VOICE_BY,
            "DNDStart" : "21:00", //Optional Field
            "DNDStop" : "09:00", //Optional Field
            "Schedule" : "", //Optional Field
            "CallBackURL" : "http://14.141.50.211:8021/FGMS/PushVoiceAPIResponse", //Optional Field
            "CallBackURLHeader" : {},
        };
                  
          let requestjsonData = {
            "BotSettings": BotSettings,Data
          };
console.log('requestjsonData',requestjsonData);
console.log('url',url);
               await axios.post(url, {
                 BotSettings ,Data
                },{
                    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                }).then(async (res) => {
console.log('resress',res.data);
returnresponse=res.data.status;    
          
        
            }).catch((error) => {
              //  console.log('errrrroorr',error);
                throw new Error(error)
            })
          
return returnresponse;        
    
    }

 async aggregrationStateSupportTicketReport(body) {
        let items = {};
        let message = '';
        console.log("body",body);
             await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGGREGRATION_STATE_REPORT}(
        :SPFROMDATE,
       :SPTODATE,
       :SPTicketStatusID,
        @rcode, @rmessage)`, {
            replacements: {
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPTicketStatusID: body.ticketStatusID || 0,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                const status = Object.values(res[0]).map((el) => el);
                
                items = {status}
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error(err)
        })
        return {data: items, message};
    }
  async getFarmerCropTicketList(body, user, SP) {
        let items = {};
        let message = '';
        console.log("body",body);
        await sequelize.query(`CALL ${SP}(:SPViewTYP,:SPRequestorMobileNo,:SPFROMDATE,:SPTODATE,:SPUserID,:SPStateID,@rcode, @rmessage)`,
             {
            replacements: {
                SPViewTYP: body.viewTYP,
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || "",
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID,
                SPStateID: body.stateID,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                console.log("result", result)
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
       async getCropTicketList(body, user, SP) {
        let items = {};
        let message = '';
        console.log("body",body);
        await sequelize.query(`CALL ${SP}(
       :SPViewTYP,
       :SPSupportTicketTypeID,
       :SPRequestorMobileNo,
       :SPSupportTicketID,
      :SPSupportTicketNo,
        :SPTicketCategoryID,
       :SPStatusID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
       :SPStateID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewTYP: body.viewTYP,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPRequestorMobileNo: body.requestorMobileNo || body.RequestorMobileNo || "",
                SPSupportTicketID: +body.supportTicketID,
               SPSupportTicketNo: body.supportTicketNo,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPStatusID: +body.statusID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID,
                SPStateID: body.stateID,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log("res", res);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                console.log("result", result)
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
/*
    async addSupportTicket(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_INSERT}(
        @SPSupportTicketID,
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
       :SPTicketHeaderID,
       :SPRequestYear,
       :SPRequestSeason,
       :SPTicketSourceID,
       :SPTicketDescription,
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
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPTicketRequestorID: body.ticketRequestorID,
                SPVillageRequestorID: body.villageRequestorID,
                SPStateCodeAlpha: body.stateCodeAlpha,
                SPDistrictRequestorID: body.districtRequestorID,
                SPRequestorName: body.requestorName,
                SPRequestorMobileNo: body.requestorMobileNo,
                SPRequestorAccountNo: body.requestorAccountNo,
                SPRequestorAadharNo: body.requestorAadharNo,
                SPTicketCategoryID: body.ticketCategoryID,
                SPTicketHeaderID: body.ticketHeaderID,
                SPRequestYear: body.requestYear,
                SPRequestSeason: body.requestSeason,
                SPTicketSourceID: body.ticketSourceID,
                SPTicketDescription: body.ticketDescription,
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
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select 
            @SPSupportTicketID AS ticketId, 
            @SPSupportTicketNo AS ticketNo, 
            @SPInsuranceCompanyID AS insComId,
            @rcode AS code, 
            @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {
                    InsuranceCompany: data[0].insComId,
                    SupportTicketID: data[0].ticketId,
                    SupportTicketNo: data[0].ticketNo
                };
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

 
*/
async addSupportTicket(req) {
    let body=req.body;    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
    let varheaderID = body.ticketHeaderID.toString();
    let categoryMapID=0;
    await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_INSERT}(
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
    :SPRelation,
    :SPRelativeName,
    :SPDistrictName,
    :SPSubDistrictID,
    :SPSubDistrictName,
    :SPPolicyPremium ,
    :SPPolicyArea,
    :SPPolicyType,
    :SPLandSurveyNumber,
    :SPLandDivisionNumber,
    :SPPlotVillageName,
    :SPPlotDistrictName,
    :SPPlotStateName,
     :SPPlotDistrictRequestorID,
    :SPApplicationSource,
    :SPCropShare,
    :SPIFSCCode,
    :SPFarmerShare,
    :SPSowingDate,
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
            SPAttachmentPath: body.attachmentPath,
            SPCropName: body.cropName,
            SPApplicationCropName: body.applicationCropName,
            SPArea: body.area,
            SPVillageName: body.villageName,
            SPRelation: body.relation,
            SPRelativeName: body.relativeName,
            SPDistrictName: body.districtName,
            SPSubDistrictID: body.subDistrictID,
            SPSubDistrictName: body.subDistrictName,
            SPPolicyPremium : body.policyPremium,
            SPPolicyArea: body.policyArea,
            SPSubDistrictID: body.subDistrictID,
            SPSubDistrictName: body.subDistrictName,
            SPPolicyPremium : body.policyPremium,
            SPPolicyArea: body.policyArea,
            SPPolicyType: body.policyType,
            SPLandSurveyNumber: body.landSurveyNumber,
            SPLandDivisionNumber: body.landDivisionNumber,
            SPPlotVillageName: body.plotVillageName,
            SPPlotDistrictName: body.plotDistrictName,
            SPPlotStateName: body.plotStateName,
            SPPlotDistrictRequestorID: body.plotDistrictRequestorID,
            SPApplicationSource: body.applicationSource,
            SPCropShare: body.cropShare,
            SPIFSCCode: body.iFSCCode,
            SPFarmerShare: body.farmerShare,
            SPApplicationSource: body.applicationSource,
            SPCropShare: body.cropShare,
            SPIFSCCode: body.iFSCCode,
            SPFarmerShare: body.farmerShare,
            SPSowingDate:body.sowingDate,
            SPInsertUserID: body.objCommon.insertedUserID,
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
            
            loggingApi.logger.info(data);
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
            if ((varheaderID ===4)||(varheaderID ==="4"))
                {
                      const d = new Date(body.lossDate);
                      
                      let cropStatusAtIncidence="Standing Crop";
                      
                      if(body.cropStageMasterID===7)
                        {
                            cropStatusAtIncidence= "Harvested";
                        }
                        
                    let claimrequest={
                "applicationNo" : body.applicationNo.toString(),
                "cropStatusAtIncidence":cropStatusAtIncidence,
                "dateOfIncidence": dateFormat(d, "yyyy-mm-dd h:MM:ss"),
                "typeOfIncidence":body.subCategoryName.toString(),  
                "dateOfIntimation":dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                "source":"7",
                "sourceOrigin": "11",
                "estimatedLossPercentage":0,
                "remarks": body.ticketDescription.toString(),
                "ticketNo": data[0].ticketNo.toString(),
                "callerMobileNo": body.callerContactNumber.toString()
               }
               
                 
               let loginToken =appCache.get("PMFBYToken");
               
               if(loginToken===undefined) {
                
                    const url1 = `${constant.PM_API_HTTPS}user/user/login`;
      /*  let requestDataProduction = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                     "mobile": "9899499022"
                };       
        */       
               let requestData =     {
                "deviceType": "android",
                "password":"a84a580af378e74710493df99d272299d42fc35d97ff68f1c4a8ca7de525ff27e076ff121590b66d4b86552c82456b1b83f28f2eff662229cef8db1eae19198d",
                "mobile": "7018401424",
                "otp": 123456
                }                  
                       console.log('url1',url1);
                       await  axios.post(url1,requestData,  {
                        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    }).then(async (res) => {
      
                    if (res.data.status) {
                           
                        const result = res.data;
                        
                        loggingApi.logger.info('SET TOKEN At GENERATE TICKET');
                        appCache.set("PMFBYToken",result.token,Number(result.sessionTTL));
                        
                        tokenvalue=result.token;
            }
        }).catch(async error => {
            console.log('error',error);
         let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

        
             message = 'SUCCESS'
           
             
             await sequelize.query(sqlstring, {
                 replacements: {
                       
                 },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async (res) => {
     
                })
     
                 
          throw new Error(error );
            throw new Error(error);
           
                  });
                  
                }
               else
               {        
                 tokenvalue = loginToken;
                loggingApi.logger.info('get token from cache in CreateTicket '+ tokenvalue);
                    
               }
                 let  headers= {
                        "Content-Type": "application/json",
                     //    token : "617ae351487e8a19ad01b6fe10acab76801c68f2c74e8cbb1dd6219b0592137e"
                    token : tokenvalue
                };
                    console.log('tokenvalue',tokenvalue);
                    console.log('varheaderID',varheaderID);
                    if ((varheaderID ===4)||(varheaderID ==="4"))
                {
               
             const url = `${constant.PM_API_STAGING}`;
             loggingApi.logger.info(url);
             
           await  axios.post(url,claimrequest,  {
            headers: headers
          }).then(async (res) => {
            loggingApi.logger.info('//////////////////////////////////////////////////');
            loggingApi.logger.info(res);
               console.log('Claim res',res);
            
            loggingApi.logger.info(res.data);
            if (res.data.status===true) 
            {
                   apiResult = res.data.data;
          
            
             let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportNo,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','`"  + res.data.data.cropLossReportNo + "`','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
      
             }
             else
             { 
                apiResult=res.data.error;
                console.log("converted Sting",apiResult.replace(/\'/gi,''));
                apiResult = apiResult.replace(/\'/gi,'');
                
              
                let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','"  + apiResult + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
      
                
             }
            }).catch(async error => {
                console.log('error',error);
                let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
                
                console.log('error In FetchToken for Claim Intimation',error);
          //      throw new Error(error );

              });
        
            }
          
    message = data[0].message;
    }
} 
         })
     
       
  
})
return {data: items, ticketmessage,apiResult:apiResult};

}
async kRPHfarmerSelect(body) {
    let items = {};
    let message = '';
    
     await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_FARMERS_MASTER_SELECT}(
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
async addKRPHSupportTicketMain(req) {
    let body=req.body;    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
    let varheaderID = body.ticketHeaderID.toString();
    let categoryMapID=0;
    await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_SUPPORT_TICKET_INSERT}(
    @SPSupportTicketID,
    :SPCallingMasterID,
    :SPCreationMode,
    @SPSupportTicketNo,
   :SPCallerContactNumber,
   :SPTicketRequestorID,
   :SPStateCodeAlpha,
   :SPDistrictRequestorID,
   :SPVillageRequestorID,
   :SPRequestorUniqueNo,
   :SPRequestorName,
   :SPRequestorMobileNo,
   :SPRequestorAccountNo,
   :SPRequestorAadharNo,
   :SPTicketCategoryID,
   :SPCropCategoryOthers,
   :SPCropStageMaster,
   :SPCropStageMasterID,
   :SPTicketHeaderID,
   :SPRequestYear,
   :SPRequestSeason,
   :SPTicketSourceID,
   :SPTicketDescription,
   :SPLossDate,
   :SPLossTime,
   :SPOnTimeIntimationFlag,
   :SPVillageName,
   :SPApplicationCropName,
   :SPCropName,
	:SPArea,
   :SPPostHarvestDate,
   :SPApplicationNo,
   :SPInsuranceCompanyCode,
   :SPInsurancePolicyNo,
   :SPInsurancePolicyDate,
   :SPInsuranceExpiryDate,
   :SPBankName,
   :SPBrancName,
    :SPAgentUserID,
   :SPSchemeID,
   :SPAttachmentPath,
   :SPHasDocument,
   :SPRelation,
    :SPRelativeName,
    :SPSubDistrictID,
    :SPSubDistrictName,
    :SPPolicyPremium ,
    :SPPolicyArea,
    :SPPolicyType,
    :SPLandSurveyNumber,
    :SPLandDivisionNumber,
    :SPPlotVillageName,
    :SPPlotStateName,
    :SPPlotDistrictName,    
    :SPApplicationSource,
    :SPCropShare,
    :SPIFSCCode,
    :SPFarmerShare,
    :SPSowingDate,
   :SPCropSeasonName,
	:SPTicketSourceName,
	:SPTicketCategoryName,
    :SPTicketSubCategoryID,
	:SPTicketSubCategoryName,
	:SPTicketStatusID,
    :SPTicketStatus,
	:SPInsuranceCompany,
	:SPStateMasterName,
	:SPDistrictMasterName,
	:SPTicketHeadName,
	:SPNyayPanchayatID, 
    :SPNyayPanchayat,        
	:SPGramPanchayatID,
    :SPGramPanchayat,
	:SPBusinessRelationName,
	:SPSchemeName,
	:SPAgentName,
	:SPInsertUserID,
	:SPCreatedOn,
	:SPCreatedBY,
	:SPInsertIPAddress,
	:SPCallStatus,
	:SPFarmerName,
    :SPCropLossDetailID,
	:SPCropStage,
    @rcode, @rmessage)`, {
        replacements: {
            SPCallingMasterID: (body.callingMasterID && body.callingMasterID) ? body.callingMasterID : 0,//78
            SPCreationMode: (body.creationMode && body.creationMode) ? body.creationMode : "",
            SPCallerContactNumber: (body.callerContactNumber && body.callerContactNumber) ? body.callerContactNumber : "",
           SPTicketRequestorID: (body.ticketRequestorID && body.ticketRequestorID) ? body.ticketRequestorID : "",
           SPStateCodeAlpha: (body.stateCodeAlpha && body.stateCodeAlpha) ? body.stateCodeAlpha : "",
           SPDistrictRequestorID: (body.districtRequestorID && body.districtRequestorID) ? body.districtRequestorID : "",
           SPVillageRequestorID: (body.villageRequestorID && body.villageRequestorID) ? body.villageRequestorID : "",
           SPRequestorUniqueNo: (body.requestorUniqueNo && body.requestorUniqueNo) ? body.requestorUniqueNo : "",
           SPRequestorName: (body.requestorName && body.requestorName) ? body.requestorName : "",
           SPRequestorMobileNo: (body.requestorMobileNo && body.requestorMobileNo) ? body.requestorMobileNo : "",
           SPRequestorAccountNo: (body.requestorAccountNo && body.requestorAccountNo) ? body.requestorAccountNo : "",
           SPRequestorAadharNo: (body.requestorAadharNo && body.requestorAadharNo) ? body.requestorAadharNo : "",
           SPTicketCategoryID: (body.ticketCategoryID && body.ticketCategoryID) ? body.ticketCategoryID : 0,
           SPCropCategoryOthers: (body.cropCategoryOthers && body.cropCategoryOthers) ? body.cropCategoryOthers : "",
          
           SPCropStageMaster:(body.cropStageMaster && body.cropStageMaster) ? body.cropStageMaster : "",
           SPCropStageMasterID: (body.cropStageMasterID && body.cropStageMasterID) ? body.cropStageMasterID : 0,
           SPTicketHeaderID: (body.ticketHeaderID && body.ticketHeaderID) ? body.ticketHeaderID : 0,
           SPRequestYear: (body.requestYear && body.requestYear) ? body.requestYear : "",
           SPRequestSeason: (body.requestSeason && body.requestSeason) ? body.requestSeason : "",
           SPTicketSourceID: (body.ticketSourceID && body.ticketSourceID) ? body.ticketSourceID : 0,//60
           SPTicketDescription: (body.ticketDescription && body.ticketDescription) ? body.ticketDescription : "",
           SPLossDate: (body.lossDate && body.lossDate) ? body.lossDate : null,
           SPLossTime: (body.lossTime && body.lossTime) ? body.lossTime : null,
           SPOnTimeIntimationFlag: (body.onTimeIntimationFlag && body.onTimeIntimationFlag) ? body.onTimeIntimationFlag : "",
           SPVillageName: (body.villageName && body.villageName) ? body.villageName : "",
           SPApplicationCropName: (body.applicationCropName && body.applicationCropName) ? body.applicationCropName : "",
           SPCropName: (body.cropName && body.cropName) ? body.cropName : "",
            SPArea: (body.area && body.area) ? body.area : 0,
           SPPostHarvestDate: (body.postHarvestDate && body.postHarvestDate) ? body.postHarvestDate : null,
           SPApplicationNo: (body.applicationNo && body.applicationNo) ? body.applicationNo : "",
           SPInsuranceCompanyCode: (body.insuranceCompanyCode && body.insuranceCompanyCode) ? body.insuranceCompanyCode : 0,
           SPInsurancePolicyNo:(body.insurancePolicyNo && body.insurancePolicyNo) ? body.insurancePolicyNo : "",
           SPInsurancePolicyDate:(body.insurancePolicyDate && body.insurancePolicyDate) ? body.insurancePolicyDate : null,
           SPInsuranceExpiryDate:(body.insuranceExpiryDate && body.insuranceExpiryDate) ? body.insuranceExpiryDate : null,
           SPBankName:(body.bankName && body.bankName) ? body.bankName : "",
           SPBrancName:(body.branchName && body.branchName) ? body.branchName : "",
            SPAgentUserID:(body.agentUserID && body.agentUserID) ? body.agentUserID : 0,
           SPSchemeID:(body.schemeID && body.schemeID) ? body.schemeID : 0,
           SPAttachmentPath: (body.attachmentPath && body.attachmentPath) ? body.attachmentPath : "",
           SPHasDocument: (body.hasDocument && body.hasDocument) ? body.hasDocument : 0,
           SPRelation: (body.relation && body.relation) ? body.relation : "",
            SPRelativeName: (body.relativeName && body.relativeName) ? body.relativeName : "",
            SPSubDistrictID: (body.subDistrictID && body.subDistrictID) ? body.subDistrictID : "",
            SPSubDistrictName: (body.subDistrictName && body.subDistrictName) ? body.subDistrictName : "",
            SPPolicyPremium : (body.policyPremium && body.policyPremium) ? body.policyPremium : "",
            SPPolicyArea: (body.policyArea && body.policyArea) ? body.policyArea : "",
            SPPolicyType: (body.policyType && body.policyType) ? body.policyType : "",
            SPLandSurveyNumber: (body.landSurveyNumber && body.landSurveyNumber) ? body.landSurveyNumber : "",
            SPLandDivisionNumber: (body.landDivisionNumber && body.landDivisionNumber) ? body.landDivisionNumber : "",
            SPPlotVillageName: (body.plotVillageName && body.plotVillageName) ? body.plotVillageName : "",
            SPPlotStateName: (body.plotStateName && body.plotStateName) ? body.plotStateName : "",
            SPPlotDistrictName: (body.plotDistrictName && body.plotDistrictName) ? body.plotDistrictName : "",
            SPApplicationSource:(body.applicationSource && body.applicationSource) ? body.applicationSource : "",
            SPCropShare:(body.cropShare && body.cropShare) ? body.cropShare : "",
            SPIFSCCode:(body.iFSCCode && body.iFSCCode) ? body.iFSCCode : "",
           SPFarmerShare:(body.farmerShare && body.farmerShare) ? body.farmerShare : "", 
            SPSowingDate:(body.sowingDate && body.sowingDate) ? body.sowingDate : null,
           SPCropSeasonName:(body.cropSeasonName && body.cropSeasonName) ? body.cropSeasonName : "",
            SPTicketSourceName:(body.ticketSourceName && body.ticketSourceName) ? body.ticketSourceName : "",
            SPTicketCategoryName:(body.ticketCategoryName && body.ticketCategoryName) ? body.ticketCategoryName : "",
            SPTicketSubCategoryID:(body.ticketSubCategoryID && body.ticketSubCategoryID) ? body.ticketSubCategoryID : 0,
            SPTicketSubCategoryName:(body.ticketSubCategoryName && body.ticketSubCategoryName) ? body.ticketSubCategoryName : "",
            SPTicketStatusID:(body.ticketStatusID && body.ticketStatusID) ? body.ticketStatusID : 0,
            SPTicketStatus:(body.ticketStatus && body.ticketStatus) ? body.ticketStatus : "",
            SPInsuranceCompany:(body.insuranceCompany && body.insuranceCompany) ? body.insuranceCompany : "",
            SPStateMasterName:(body.stateMasterName && body.stateMasterName) ? body.stateMasterName : "",
            SPDistrictMasterName:(body.districtMasterName && body.districtMasterName) ? body.districtMasterName : "",
            SPTicketHeadName:(body.ticketHeadName && body.ticketHeadName) ? body.ticketHeadName : "",
            SPNyayPanchayatID:(body.nyayPanchayatID && body.nyayPanchayatID) ? body.nyayPanchayatID : "",
             SPNyayPanchayat:(body.nyayPanchayat && body.nyayPanchayat) ? body.nyayPanchayat : "",
            SPGramPanchayatID:(body.gramPanchayatID && body.gramPanchayatID) ? body.gramPanchayatID : "",
            SPGramPanchayat:(body.gramPanchayat && body.gramPanchayat) ? body.gramPanchayat : "",
             SPBusinessRelationName:(body.businessRelationName && body.businessRelationName) ? body.businessRelationName : "",
            SPSchemeName:(body.schemeName && body.schemeName) ? body.schemeName : "",
            SPAgentName:(body.agentName && body.agentName) ? body.agentName : "",
            SPInsertUserID: ( body.objCommon.insertedUserID && body.objCommon.insertedUserID) ? body.objCommon.insertedUserID:0,
            SPCreatedOn:(body.createdOn && body.createdOn) ? body.createdOn : null,
            SPCreatedBY:(body.createdBY && body.createdBY) ? body.createdBY : "",
            SPInsertIPAddress:( body.objCommon.insertedIPAddress && body.objCommon.insertedIPAddress) ? body.objCommon.insertedIPAddress:"",
            SPCallStatus:(body.callStatus && body.callStatus) ? body.callStatus : "",
            SPFarmerName:(body.farmerName && body.farmerName) ? body.farmerName : "",   
            SPCropLossDetailID:(body.cropLossDetailID && body.cropLossDetailID) ? body.cropLossDetailID : 0, 
            SPCropStage:(body.cropStage && body.cropStage) ? body.cropStage : "", 
          
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
        await sequelize.query(`select 
        @SPSupportTicketID AS ticketId, 
        @SPSupportTicketNo AS ticketNo,
        @rcode AS code, 
        @rmessage AS message`).then(async(result) => {
            const data = flatMap(result);
            
            loggingApi.logger.info(data);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            else{
           
            message=data[0].message;
            ticketmessage=data[0].message;
            items = {
           
                SupportTicketID: data[0].ticketId,
                SupportTicketNo: data[0].ticketNo
            };
            if ((varheaderID ===4)||(varheaderID ==="4"))
                {
                      const d = new Date(body.lossDate);
                      
                      let cropStatusAtIncidence="Standing Crop";
                      
                      if(body.cropStageMasterID===7)
                        {
                            cropStatusAtIncidence= "Harvested";
                        }
                       
                    let claimrequest={
                "applicationNo" : body.applicationNo.toString(),
                "cropStatusAtIncidence":cropStatusAtIncidence,
                "dateOfIncidence": dateFormat(d, "yyyy-mm-dd h:MM:ss"),
                "typeOfIncidence": (body.cropCategoryOthers && body.cropCategoryOthers) ? body.cropCategoryOthers : body.ticketSubCategoryName,  
                "dateOfIntimation":dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                "source":"7",
                "sourceOrigin": "11",
                "estimatedLossPercentage":0,
                "remarks": body.ticketDescription.toString(),
                "ticketNo": data[0].ticketNo.toString(),
                "callerMobileNo": body.callerContactNumber.toString()
               }
               
               
                 
               let loginToken =appCache.get("PMFBYToken");
               
               if(loginToken===undefined) {
                
                    const url1 = `${constant.PM_API_HTTPS}user/user/login`;
        let requestData = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               };                         
                       console.log('url1',url1);
                       await  axios.post(url1,requestData,  {
                        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    }).then(async (res) => {
      
                    if (res.data.status) {
                           
                        const result = res.data;
                        
                        loggingApi.logger.info('SET TOKEN At GENERATE TICKET');
                        appCache.set("PMFBYToken",result.token,Number(result.sessionTTL));
                        
                        tokenvalue=result.token;
            }
        }).catch(async error => {
            console.log('error',error);
         let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

        
             message = 'SUCCESS'
           
             
             await sequelize.query(sqlstring, {
                 replacements: {
                       
                 },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async (res) => {
     
                })
     
                 
        //     throw new Error(error );
          //  throw new Error(error);
           
                  });
                  
                }
               else
               {        
                 tokenvalue = loginToken;
                loggingApi.logger.info('get token from cache in CreateTicket '+ tokenvalue);
                    
               }
                 let  headers= {
                        "Content-Type": "application/json",
                     //    token : "617ae351487e8a19ad01b6fe10acab76801c68f2c74e8cbb1dd6219b0592137e"
                    token : tokenvalue
                };
                    
                if ((varheaderID ===4)||(varheaderID ==="4"))
                {
               
             const url = `${constant.BOT_API}`;
             loggingApi.logger.info(url);
             
           await  axios.post(url,claimrequest,  {
            headers: headers
          }).then(async (res) => {

            loggingApi.logger.info(res.data);
            if (res.data.status===true) 
            {
                   apiResult = res.data.data;
          
            
             let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportNo,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','`"  + res.data.data.cropLossReportNo + "`','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
      
             }
             else
             { 
                apiResult=res.data.error;
                console.log("converted Sting",apiResult.replace(/\'/gi,''));
                apiResult = apiResult.replace(/\'/gi,'');
                
              
                let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','"  + apiResult + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
      
                
             }
            }).catch(async error => {
              //  console.log('error',error);
                let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                     await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
              
                      console.log('error In FetchToken for Claim Intimation',error);
                      //      throw new Error(error );
            
                          });
                    
                        }
                      
                message = data[0].message;
                }
            } 
                     })
                 
                   
              
            })
            return {data: items, ticketmessage,apiResult:apiResult};
            
            }
async addKRPHSupportTicket(req) {
    let body=req.body;    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
    let varheaderID = body.ticketHeaderID.toString();
    let categoryMapID=0;
    await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_SUPPORT_TICKET_INSERT}(
    @SPSupportTicketID,
    :SPCallingMasterID,
    :SPCreationMode,
    @SPSupportTicketNo,
   :SPCallerContactNumber,
   :SPTicketRequestorID,
   :SPStateCodeAlpha,
   :SPDistrictRequestorID,
   :SPVillageRequestorID,
   :SPRequestorUniqueNo,
   :SPRequestorName,
   :SPRequestorMobileNo,
   :SPRequestorAccountNo,
   :SPRequestorAadharNo,
   :SPTicketCategoryID,
   :SPCropCategoryOthers,
   :SPCropStageMaster,
   :SPCropStageMasterID,
   :SPTicketHeaderID,
   :SPRequestYear,
   :SPRequestSeason,
   :SPTicketSourceID,
   :SPTicketDescription,
   :SPLossDate,
   :SPLossTime,
   :SPOnTimeIntimationFlag,
   :SPVillageName,
   :SPApplicationCropName,
   :SPCropName,
   :SPArea,
   :SPPostHarvestDate,
   :SPApplicationNo,
   :SPInsuranceCompanyCode,
   :SPInsurancePolicyNo,
   :SPInsurancePolicyDate,
   :SPInsuranceExpiryDate,
   :SPBankName,
   :SPBrancName,
    :SPAgentUserID,
   :SPSchemeID,
   :SPAttachmentPath,
   :SPHasDocument,
   :SPRelation,
    :SPRelativeName,
    :SPSubDistrictID,
    :SPSubDistrictName,
    :SPPolicyPremium ,
    :SPPolicyArea,
    :SPPolicyType,
    :SPLandSurveyNumber,
    :SPLandDivisionNumber,
    :SPPlotVillageName,
    :SPPlotStateName,
    :SPPlotDistrictName,    
    :SPPlotDistrictRequestorID,
    :SPApplicationSource,
    :SPCropShare,
    :SPIFSCCode,
    :SPFarmerShare,
    :SPSowingDate,
   :SPCropSeasonName,
	:SPTicketSourceName,
	:SPTicketCategoryName,
    :SPTicketSubCategoryID,
	:SPTicketSubCategoryName,
	:SPTicketStatusID,
    :SPTicketStatus,
	:SPInsuranceCompany,
	:SPStateMasterName,
	:SPDistrictMasterName,
	:SPTicketHeadName,
	:SPNyayPanchayatID, 
    :SPNyayPanchayat,        
	:SPGramPanchayatID,
    :SPGramPanchayat,
	:SPBusinessRelationName,
	:SPSchemeName,
	:SPAgentName,
	:SPInsertUserID,
	:SPCreatedOn,
	:SPCreatedBY,
	:SPInsertIPAddress,
	:SPCallStatus,
	:SPFarmerName,
    :SPCropLossDetailID,
	:SPCropStage,
    @rcode, @rmessage)`, {
        replacements: {
            SPCallingMasterID: (body.callingMasterID && body.callingMasterID) ? body.callingMasterID : 0,//78
            SPCreationMode: (body.creationMode && body.creationMode) ? body.creationMode : "",
            SPCallerContactNumber: (body.callerContactNumber && body.callerContactNumber) ? body.callerContactNumber : "",
           SPTicketRequestorID: (body.ticketRequestorID && body.ticketRequestorID) ? body.ticketRequestorID : "",
           SPStateCodeAlpha: (body.stateCodeAlpha && body.stateCodeAlpha) ? body.stateCodeAlpha : "",
           SPDistrictRequestorID: (body.districtRequestorID && body.districtRequestorID) ? body.districtRequestorID : "",
           SPVillageRequestorID: (body.villageRequestorID && body.villageRequestorID) ? body.villageRequestorID : "",
           SPRequestorUniqueNo: (body.requestorUniqueNo && body.requestorUniqueNo) ? body.requestorUniqueNo : "",
           SPRequestorName: (body.requestorName && body.requestorName) ? body.requestorName : "",
           SPRequestorMobileNo: (body.requestorMobileNo && body.requestorMobileNo) ? body.requestorMobileNo : "",
           SPRequestorAccountNo: (body.requestorAccountNo && body.requestorAccountNo) ? body.requestorAccountNo : "",
           SPRequestorAadharNo: (body.requestorAadharNo && body.requestorAadharNo) ? body.requestorAadharNo : "",
           SPTicketCategoryID: (body.ticketCategoryID && body.ticketCategoryID) ? body.ticketCategoryID : 0,
           SPCropCategoryOthers: (body.cropCategoryOthers && body.cropCategoryOthers) ? body.cropCategoryOthers : "",
          
           SPCropStageMaster:(body.cropStageMaster && body.cropStageMaster) ? body.cropStageMaster : "",
           SPCropStageMasterID: (body.cropStageMasterID && body.cropStageMasterID) ? body.cropStageMasterID : 0,
           SPTicketHeaderID: (body.ticketHeaderID && body.ticketHeaderID) ? body.ticketHeaderID : 0,
           SPRequestYear: (body.requestYear && body.requestYear) ? body.requestYear : "",
           SPRequestSeason: (body.requestSeason && body.requestSeason) ? body.requestSeason : "",
           SPTicketSourceID: (body.ticketSourceID && body.ticketSourceID) ? body.ticketSourceID : 0,//60
           SPTicketDescription: (body.ticketDescription && body.ticketDescription) ? body.ticketDescription : "",
           SPLossDate: (body.lossDate && body.lossDate) ? body.lossDate : null,
           SPLossTime: (body.lossTime && body.lossTime) ? body.lossTime : null,
           SPOnTimeIntimationFlag: (body.onTimeIntimationFlag && body.onTimeIntimationFlag) ? body.onTimeIntimationFlag : "",
           SPVillageName: (body.villageName && body.villageName) ? body.villageName : "",
           SPApplicationCropName: (body.applicationCropName && body.applicationCropName) ? body.applicationCropName : "",
           SPCropName: (body.cropName && body.cropName) ? body.cropName : "",
            SPArea: (body.area && body.area) ? body.area : 0,
           SPPostHarvestDate: (body.postHarvestDate && body.postHarvestDate) ? body.postHarvestDate : null,
           SPApplicationNo: (body.applicationNo && body.applicationNo) ? body.applicationNo : "",
           SPInsuranceCompanyCode: (body.insuranceCompanyCode && body.insuranceCompanyCode) ? body.insuranceCompanyCode : 0,
           SPInsurancePolicyNo:(body.insurancePolicyNo && body.insurancePolicyNo) ? body.insurancePolicyNo : "",
           SPInsurancePolicyDate:(body.insurancePolicyDate && body.insurancePolicyDate) ? body.insurancePolicyDate : null,
           SPInsuranceExpiryDate:(body.insuranceExpiryDate && body.insuranceExpiryDate) ? body.insuranceExpiryDate : null,
           SPBankName:(body.bankName && body.bankName) ? body.bankName : "",
           SPBrancName:(body.branchName && body.branchName) ? body.branchName : "",
            SPAgentUserID:(body.agentUserID && body.agentUserID) ? body.agentUserID : 0,
           SPSchemeID:(body.schemeID && body.schemeID) ? body.schemeID : 0,
           SPAttachmentPath: (body.attachmentPath && body.attachmentPath) ? body.attachmentPath : "",
           SPHasDocument: (body.hasDocument && body.hasDocument) ? body.hasDocument : 0,
           SPRelation: (body.relation && body.relation) ? body.relation : "",
            SPRelativeName: (body.relativeName && body.relativeName) ? body.relativeName : "",
            SPSubDistrictID: (body.subDistrictID && body.subDistrictID) ? body.subDistrictID : "",
            SPSubDistrictName: (body.subDistrictName && body.subDistrictName) ? body.subDistrictName : "",
            SPPolicyPremium : (body.policyPremium && body.policyPremium) ? body.policyPremium : "",
            SPPolicyArea: (body.policyArea && body.policyArea) ? body.policyArea : "",
            SPPolicyType: (body.policyType && body.policyType) ? body.policyType : "",
            SPLandSurveyNumber: (body.landSurveyNumber && body.landSurveyNumber) ? body.landSurveyNumber : "",
            SPLandDivisionNumber: (body.landDivisionNumber && body.landDivisionNumber) ? body.landDivisionNumber : "",
            SPPlotVillageName: (body.plotVillageName && body.plotVillageName) ? body.plotVillageName : "",
            SPPlotStateName: (body.plotStateName && body.plotStateName) ? body.plotStateName : "",
            SPPlotDistrictName: (body.plotDistrictName && body.plotDistrictName) ? body.plotDistrictName : "",
             SPPlotDistrictRequestorID: (body.plotDistrictRequestorID && body.plotDistrictRequestorID) ? body.plotDistrictRequestorID : "",
            SPApplicationSource:(body.applicationSource && body.applicationSource) ? body.applicationSource : "",
            SPCropShare:(body.cropShare && body.cropShare) ? body.cropShare : "",
            SPIFSCCode:(body.iFSCCode && body.iFSCCode) ? body.iFSCCode : "",
           SPFarmerShare:(body.farmerShare && body.farmerShare) ? body.farmerShare : "", 
            SPSowingDate:(body.sowingDate && body.sowingDate) ? body.sowingDate : null,
           SPCropSeasonName:(body.cropSeasonName && body.cropSeasonName) ? body.cropSeasonName : "",
            SPTicketSourceName:(body.ticketSourceName && body.ticketSourceName) ? body.ticketSourceName : "",
            SPTicketCategoryName:(body.ticketCategoryName && body.ticketCategoryName) ? body.ticketCategoryName : "",
            SPTicketSubCategoryID:(body.ticketSubCategoryID && body.ticketSubCategoryID) ? body.ticketSubCategoryID : 0,
            SPTicketSubCategoryName:(body.ticketSubCategoryName && body.ticketSubCategoryName) ? body.ticketSubCategoryName : "",
            SPTicketStatusID:(body.ticketStatusID && body.ticketStatusID) ? body.ticketStatusID : 0,
            SPTicketStatus:(body.ticketStatus && body.ticketStatus) ? body.ticketStatus : "",
            SPInsuranceCompany:(body.insuranceCompany && body.insuranceCompany) ? body.insuranceCompany : "",
            SPStateMasterName:(body.stateMasterName && body.stateMasterName) ? body.stateMasterName : "",
            SPDistrictMasterName:(body.districtMasterName && body.districtMasterName) ? body.districtMasterName : "",
            SPTicketHeadName:(body.ticketHeadName && body.ticketHeadName) ? body.ticketHeadName : "",
            SPNyayPanchayatID:(body.nyayPanchayatID && body.nyayPanchayatID) ? body.nyayPanchayatID : "",
             SPNyayPanchayat:(body.nyayPanchayat && body.nyayPanchayat) ? body.nyayPanchayat : "",
            SPGramPanchayatID:(body.gramPanchayatID && body.gramPanchayatID) ? body.gramPanchayatID : "",
            SPGramPanchayat:(body.gramPanchayat && body.gramPanchayat) ? body.gramPanchayat : "",
             SPBusinessRelationName:(body.businessRelationName && body.businessRelationName) ? body.businessRelationName : "",
            SPSchemeName:(body.schemeName && body.schemeName) ? body.schemeName : "",
            SPAgentName:(body.agentName && body.agentName) ? body.agentName : "",
            SPInsertUserID: ( body.objCommon.insertedUserID && body.objCommon.insertedUserID) ? body.objCommon.insertedUserID:0,
            SPCreatedOn:(body.createdOn && body.createdOn) ? body.createdOn : null,
            SPCreatedBY:(body.createdBY && body.createdBY) ? body.createdBY : "",
            SPInsertIPAddress:( body.objCommon.insertedIPAddress && body.objCommon.insertedIPAddress) ? body.objCommon.insertedIPAddress:"",
            SPCallStatus:(body.callStatus && body.callStatus) ? body.callStatus : "",
            SPFarmerName:(body.farmerName && body.farmerName) ? body.farmerName : "",   
            SPCropLossDetailID:(body.cropLossDetailID && body.cropLossDetailID) ? body.cropLossDetailID : 0, 
            SPCropStage:(body.cropStage && body.cropStage) ? body.cropStage : "", 
          
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
        await sequelize.query(`select 
        @SPSupportTicketID AS ticketId, 
        @SPSupportTicketNo AS ticketNo,
        @rcode AS code, 
        @rmessage AS message`).then(async(result) => {
            const data = flatMap(result);
            
            loggingApi.logger.info(data);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            else{
           
            message=data[0].message;
            ticketmessage=data[0].message;
            items = {
           
                SupportTicketID: data[0].ticketId,
                SupportTicketNo: data[0].ticketNo
            };
            if ((varheaderID ===4)||(varheaderID ==="4"))
                {
                      const d = new Date(body.lossDate);
                      
                      let cropStatusAtIncidence="Standing Crop";
                      
                      if(body.cropStageMasterID===7)
                        {
                            cropStatusAtIncidence= "Harvested";
                        }
                       
                    let claimrequest={
                "applicationNo" : body.applicationNo.toString(),
                "cropStatusAtIncidence":cropStatusAtIncidence,
                "dateOfIncidence": dateFormat(d, "yyyy-mm-dd h:MM:ss"),
                "typeOfIncidence": (body.cropCategoryOthers && body.cropCategoryOthers) ? body.cropCategoryOthers : body.ticketSubCategoryName,  
                "dateOfIntimation":dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                "source":"7",
                "sourceOrigin": "11",
                "estimatedLossPercentage":0,
                "remarks": body.ticketDescription.toString(),
                "ticketNo": data[0].ticketNo.toString(),
                "callerMobileNo": body.callerContactNumber.toString()
               }
               
                 
               let loginToken =appCache.get("PMFBYToken");
               
               if(loginToken===undefined) {
                
                    const url1 = `${constant.PM_API_HTTPS}user/user/login`;
      /*  let requestDataProduction = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                     "mobile": "9899499022"
                };       
        */       
               let requestData =     {
                "deviceType": "android",
                "password":"a84a580af378e74710493df99d272299d42fc35d97ff68f1c4a8ca7de525ff27e076ff121590b66d4b86552c82456b1b83f28f2eff662229cef8db1eae19198d",
                "mobile": "7018401424",
                "otp": 123456
                }                  
                       console.log('url1',url1);
                       await  axios.post(url1,requestData,  {
                        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    }).then(async (res) => {
      
                    if (res.data.status) {
                           
                        const result = res.data;
                        
                        loggingApi.logger.info('SET TOKEN At GENERATE TICKET');
                        appCache.set("PMFBYToken",result.token,Number(result.sessionTTL));
                        
                        tokenvalue=result.token;
            }
        }).catch(async error => {
            console.log('error',error);
         let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

        
             message = 'SUCCESS'
           
             
             await sequelize.query(sqlstring, {
                 replacements: {
                       
                 },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async (res) => {
     
                })
     
                 
          throw new Error(error );
            throw new Error(error);
           
                  });
                  
                }
               else
               {        
                 tokenvalue = loginToken;
                loggingApi.logger.info('get token from cache in CreateTicket '+ tokenvalue);
                    
               }
                 let  headers= {
                        "Content-Type": "application/json",
                     //    token : "617ae351487e8a19ad01b6fe10acab76801c68f2c74e8cbb1dd6219b0592137e"
                    token : tokenvalue
                };
                    console.log('tokenvalue',tokenvalue);
                    console.log('varheaderID',varheaderID);
                    if ((varheaderID ===4)||(varheaderID ==="4"))
                {
               
             const url = `${constant.PM_API_STAGING}`;
             loggingApi.logger.info(url);
             
           await  axios.post(url,claimrequest,  {
            headers: headers
          }).then(async (res) => {
            loggingApi.logger.info('//////////////////////////////////////////////////');
            loggingApi.logger.info(res);
               console.log('Claim res',res);
            
            loggingApi.logger.info(res.data);
            if (res.data.status===true) 
            {
                   apiResult = res.data.data;
          
            
             let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportNo,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','`"  + res.data.data.cropLossReportNo + "`','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
      
             }
             else
             { 
                apiResult=res.data.error;
                console.log("converted Sting",apiResult.replace(/\'/gi,''));
                apiResult = apiResult.replace(/\'/gi,'');
                
              
                let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','"  + apiResult + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
      
                
             }
            }).catch(async error => {
                console.log('error',error);
                let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
                
                console.log('error In FetchToken for Claim Intimation',error);
          //      throw new Error(error );

              });
        
            }
          
    message = data[0].message;
    }
} 
         })
     
       
  
})
return {data: items, ticketmessage,apiResult:apiResult};

}

async addKRPHFarmerSupportTicket(req) {
    let body=req.body;
    console.log('body',body);    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
    let varheaderID = body.ticketHeaderID.toString();
    let categoryMapID=0;
    await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_FARMER_SUPPORT_TICKET_INSERT}(
    @SPFarmerSupportTicketID,
    :SPCallingMasterID,
    @SPFarmerSupportTicketNo,
   :SPCallerContactNumber,
   :SPFarmerRequestorID,
   :SPStateCodeAlpha,
   :SPDistrictRequestorID,
   :SPVillageRequestorID,
   :SPPinCode,
   :SPAddress,
   :SPRequestorName,
   :SPRequestorMobileNo,
   :SPRequestorAccountNo,
   :SPRequestorAadharNo,
   :SPTicketCategoryID,
   :SPCropCategoryOthers,
   :SPCropStageMaster,
   :SPCropStageMasterID,
   :SPTicketHeaderID,
   :SPRequestYear,
   :SPRequestSeason,
   :SPTicketSourceID,
   :SPTicketDescription,
   :SPLossDate,
   :SPLossTime,
   :SPOnTimeIntimationFlag,
   :SPVillageName,
   :SPApplicationCropName,
   :SPCropName,
   :SPCropID,
	:SPArea,
   :SPPostHarvestDate,
   :SPApplicationNo,
   :SPInsuranceCompanyCode,
   :SPInsurancePolicyNo,
    :SPAgentUserID,
   :SPSchemeID,
   :SPRelation,
    :SPRelativeName,
    :SPSubDistrictID,
    :SPSubDistrictName,
    :SPCalculatedPremium,
    :SPPolicyPremium ,
    :SPPolicyArea,
    :SPPolicyType,
    :SPLandSurveyNumber,
    :SPCropSeasonName,
	:SPTicketSourceName,
	:SPTicketCategoryName,
    :SPTicketSubCategoryID,
	:SPTicketSubCategoryName,
	:SPTicketStatusID,
    :SPTicketStatus,
	:SPInsuranceCompany,
	:SPStateMasterName,
	:SPDistrictMasterName,
	:SPTicketHeadName,
	:SPNyayPanchayatID, 
    :SPNyayPanchayat,        
	:SPGramPanchayatID,
    :SPGramPanchayat,          
	:SPBusinessRelationName,
	:SPSchemeName,
	:SPAgentName,
	:SPInsertUserID,
	:SPCreatedOn,
	:SPCreatedBY,
	:SPInsertIPAddress,
	:SPCallStatus,
	:SPFarmerName,
    @rcode, @rmessage)`, {
        replacements: {
            SPCallingMasterID: (body.callingMasterID && body.callingMasterID) ? body.callingMasterID : "",//78
             SPCallerContactNumber: (body.callerContactNumber && body.callerContactNumber) ? body.callerContactNumber : "",
           SPFarmerRequestorID: (body.ticketRequestorID && body.ticketRequestorID) ? body.ticketRequestorID : "",
           SPStateCodeAlpha: (body.stateCodeAlpha && body.stateCodeAlpha) ? body.stateCodeAlpha : "",
           SPDistrictRequestorID: (body.districtRequestorID && body.districtRequestorID) ? body.districtRequestorID : "",
           SPVillageRequestorID: (body.villageRequestorID && body.villageRequestorID) ? body.villageRequestorID : "",
           SPPinCode: (body.pinCode && body.pinCode) ? body.pinCode : "",
           SPAddress: (body.address && body.address) ? body.address : "",
           SPRequestorName: (body.requestorName && body.requestorName) ? body.requestorName : "",
           SPRequestorMobileNo: (body.requestorMobileNo && body.requestorMobileNo) ? body.requestorMobileNo : "",
           SPRequestorAccountNo: (body.requestorAccountNo && body.requestorAccountNo) ? body.requestorAccountNo : "",
           SPRequestorAadharNo: (body.requestorAadharNo && body.requestorAadharNo) ? body.requestorAadharNo : "",
           SPTicketCategoryID: (body.ticketCategoryID && body.ticketCategoryID) ? body.ticketCategoryID : 0,
           SPCropCategoryOthers: (body.cropCategoryOthers && body.cropCategoryOthers) ? body.cropCategoryOthers : "",
           SPCropStageMaster: (body.cropStageMaster && body.cropStageMaster) ? body.cropStageMaster : "",
           SPCropStageMasterID: (body.cropStageMasterID && body.cropStageMasterID) ? body.cropStageMasterID : 0,
           SPTicketHeaderID: (body.ticketHeaderID && body.ticketHeaderID) ? body.ticketHeaderID : 0,
           SPRequestYear: (body.requestYear && body.requestYear) ? body.requestYear : "",
           SPRequestSeason: (body.requestSeason && body.requestSeason) ? body.requestSeason : "",
           SPTicketSourceID: (body.ticketSourceID && body.ticketSourceID) ? body.ticketSourceID : 0,//60
           SPTicketDescription: (body.ticketDescription && body.ticketDescription) ? body.ticketDescription : "",
           SPLossDate: (body.lossDate && body.lossDate) ? body.lossDate : null,
           SPLossTime: (body.lossTime && body.lossTime) ? body.lossTime : null,
           SPOnTimeIntimationFlag: (body.onTimeIntimationFlag && body.onTimeIntimationFlag) ? body.onTimeIntimationFlag : "",
           SPVillageName: (body.villageName && body.villageName) ? body.villageName : "",
           SPApplicationCropName: (body.applicationCropName && body.applicationCropName) ? body.applicationCropName : "",
           SPCropName: (body.cropName && body.cropName) ? body.cropName : "",
           SPCropID: (body.cropID && body.cropID) ? body.cropID : "",
            SPArea: (body.area && body.area) ? body.area : 0,
           SPPostHarvestDate: (body.postHarvestDate && body.postHarvestDate) ? body.postHarvestDate : null,
           SPApplicationNo: (body.applicationNo && body.applicationNo) ? body.applicationNo : "",
           SPInsuranceCompanyCode: (body.insuranceCompanyCode && body.insuranceCompanyCode) ? body.insuranceCompanyCode : 0,
           SPInsurancePolicyNo:(body.insurancePolicyNo && body.insurancePolicyNo) ? body.insurancePolicyNo : "",
            SPAgentUserID:(body.agentUserID && body.agentUserID) ? body.agentUserID : 0,
           SPSchemeID:(body.schemeID && body.schemeID) ? body.schemeID : 0,
           SPRelation: (body.relation && body.relation) ? body.relation : "",
            SPRelativeName: (body.relativeName && body.relativeName) ? body.relativeName : "",
            SPSubDistrictID: (body.subDistrictID && body.subDistrictID) ? body.subDistrictID : "",
            SPSubDistrictName: (body.subDistrictName && body.subDistrictName) ? body.subDistrictName : "",
           SPCalculatedPremium: (body.calculatedPremium && body.calculatedPremium) ? body.calculatedPremium : 0,
            SPPolicyPremium : (body.policyPremium && body.policyPremium) ? body.policyPremium : "",
            SPPolicyArea: (body.policyArea && body.policyArea) ? body.policyArea : "",
            SPPolicyType: (body.policyType && body.policyType) ? body.policyType : "",
            SPLandSurveyNumber: (body.landSurveyNumber && body.landSurveyNumber) ? body.landSurveyNumber : "",
           SPCropSeasonName:(body.cropSeasonName && body.cropSeasonName) ? body.cropSeasonName : "",
            SPTicketSourceName:(body.ticketSourceName && body.ticketSourceName) ? body.ticketSourceName : "",
            SPTicketCategoryName:(body.ticketCategoryName && body.ticketCategoryName) ? body.ticketCategoryName : "",
            SPTicketSubCategoryID:(body.ticketSubCategoryID && body.ticketSubCategoryID) ? body.ticketSubCategoryID : 0,
            SPTicketSubCategoryName:(body.ticketSubCategoryName && body.ticketSubCategoryName) ? body.ticketSubCategoryName : "",
            SPTicketStatusID:(body.ticketStatusID && body.ticketStatusID) ? body.ticketStatusID : 0,
            SPTicketStatus:(body.ticketStatus && body.ticketStatus) ? body.ticketStatus : "",
            SPInsuranceCompany:(body.insuranceCompany && body.insuranceCompany) ? body.insuranceCompany : "",
            SPStateMasterName:(body.stateMasterName && body.stateMasterName) ? body.stateMasterName : "",
            SPDistrictMasterName:(body.districtMasterName && body.districtMasterName) ? body.districtMasterName : "",
            SPTicketHeadName:(body.ticketHeadName && body.ticketHeadName) ? body.ticketHeadName : "",
            SPNyayPanchayatID:(body.nyayPanchayatID && body.nyayPanchayatID) ? body.nyayPanchayatID : "",
            SPNyayPanchayat:(body.nyayPanchayat && body.nyayPanchayat) ? body.nyayPanchayat : "",
           SPGramPanchayatID:(body.gramPanchayatID && body.gramPanchayatID) ? body.gramPanchayatID : "",
           SPGramPanchayat:(body.gramPanchayat && body.gramPanchayat) ? body.gramPanchayat : "",        
            SPBusinessRelationName:(body.businessRelationName && body.businessRelationName) ? body.businessRelationName : "",
            SPSchemeName:(body.schemeName && body.schemeName) ? body.schemeName : "",
            SPAgentName:(body.agentName && body.agentName) ? body.agentName : "",
            SPInsertUserID: ( body.objCommon.insertedUserID && body.objCommon.insertedUserID) ? body.objCommon.insertedUserID:0,
            SPCreatedOn:(body.createdOn && body.createdOn) ? body.createdOn : null,
            SPCreatedBY:(body.createdBY && body.createdBY) ? body.createdBY : "",
            SPInsertIPAddress:( body.objCommon.insertedIPAddress && body.objCommon.insertedIPAddress) ? body.objCommon.insertedIPAddress:"",
            SPCallStatus:(body.callStatus && body.callStatus) ? body.callStatus : "",
            SPFarmerName:(body.farmerName && body.farmerName) ? body.farmerName : "",     
          
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
        await sequelize.query(`select 
        @SPFarmerSupportTicketID AS ticketId, 
        @SPFarmerSupportTicketNo AS ticketNo, 
     
        @rcode AS code, 
        @rmessage AS message`).then(async(result) => {
            const data = flatMap(result);
            
            loggingApi.logger.info(data);
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
return {data: items, ticketmessage,apiResult:apiResult};

}

async farmerSelectCallingHistory(body) {
    let items = {};
    let message = '';
    
     await sequelize.query(`CALL ${STORE_PROCEDURE.FARMERS_CALLING_MASTER_SELECT}(
   :SPFROMDATE,
   :SPTODATE,
   :SPStateCodeAlpha,           	
    @rcode, @rmessage)`, {
        replacements: {
            
            SPFROMDATE: body.fromDate ,
            SPTODATE: body.toDate,
            SPStateCodeAlpha: body.stateCodeAlpha,
           
        },
        type: sequelize.QueryTypes.SELECT,
    }).then(async (res) => {
      //  console.log("res", res);
        await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
          //  console.log("result", result)
            const data = flatMap(result);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            const report = Object.values(res[0]).map((el) => el);
           
            items = {report}
            message = data[0].message;
        })
    }).catch((err) => {
        console.log(err);
        throw new Error(err)
    })
    return {data: items, message};
}

async getTicketsListIndex1(body, user, SP) {
    let items = {};
    let message = '';
    console.log("user",user);
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
   :SPDistrictID,
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
            SPDistrictID:body.districtID,
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

async addFarmerSupportTicket(body) {
    let items = {};
    let message = '';
    await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_FARMERS_SUPPORT_TICKET_INSERT}(
    @SPFarmerSupportTicketID,
   :SPCallerContactNumber,
   :SPFarmerTicketRequestorID,
   :SPVillageRequestorID,
   :SPStateCodeAlpha,
   :SPDistrictRequestorID,
   @SPFarmerSupportTicketNo,
   :SPRequestorName,
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
   :SPInsertUserID,
   :SPInsertIPAddress,
    @rcode, @rmessage)`, {
        replacements: {
            SPCallerContactNumber: body.callerContactNumber,
            SPFarmerTicketRequestorID: body.farmerTicketRequestorID,
            SPVillageRequestorID: body.villageRequestorID,
            SPStateCodeAlpha: body.stateCodeAlpha,
            SPDistrictRequestorID: body.districtRequestorID,
            SPRequestorName: body.requestorName,
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
            SPInsertIPAddress: body.objCommon.insertedIPAddress
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
        await sequelize.query(`select 
        @SPFarmerSupportTicketID AS ticketId, 
        @SPFarmerSupportTicketNo AS ticketNo, 
        @SPInsuranceCompanyID AS insComId,
        @rcode AS code, 
        @rmessage AS message`).then((result) => {
            const data = flatMap(result);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            items = {
                InsuranceCompany: data[0].insComId,
                SupportTicketID: data[0].ticketId,
                SupportTicketNo: data[0].ticketNo
            };
            message = data[0].message;
        })
    })
    return {data: items, message};
}


async generateOfflineSupportTicket(req) {
    let body=req.body;    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
      let categoryMapID=0;
          await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_OFFLINE_GENERATE_INSERT}(
     @SPOfflineSupportTicketID,
    :SPStateMasterID,
   :SPDistrictRequestorID,
   :SPRequestorName,
   :SPRequestorMobileNo,
   :SPTicketCategoryID,
   :SPCropCategoryOthers,
   :SPCropStageMasterID,   
   :SPRequestYear,
   :SPRequestSeason,
   :SPTicketDescription,
   :SPLossDate,
   :SPLossTime,
   :SPPostHarvestDate,
   :SPApplicationNo,
   :SPInsuranceCompanyID,
   :SPInsurancePolicyNo,
   :SPSchemeID,
   :SPCropName,
   :SPOnTimeIntimationFlag,
   @SPCategoryMapID,
   :SPInsertUserID,
   :SPInsertIPAddress,
    @rcode, @rmessage)`, {
        replacements: {
            SPStateMasterID: body.stateMasterID,
            SPDistrictRequestorID: body.districtRequestorID,
            SPRequestorName: body.requestorName,
            SPRequestorMobileNo: body.requestorMobileNo,
            SPTicketCategoryID: body.ticketCategoryID,
             SPCropCategoryOthers: body.cropCategoryOthers,
            SPCropStageMasterID: body.cropStageMasterID,
            SPRequestYear: body.requestYear,
            SPRequestSeason: body.requestSeason,
             SPTicketDescription: body.ticketDescription,
            SPLossDate: body.lossDate,
            SPLossTime: body.lossTime,
            SPPostHarvestDate: body.postHarvestDate,
            SPApplicationNo: body.applicationNo,
            SPInsuranceCompanyID:body.insuranceCompanyID,
            SPInsurancePolicyNo: body.insurancePolicyNo,
            SPSchemeID: body.schemeID,
            SPCropName: body.cropName,
            SPHasDocument: body.hasDocument,
            SPCompanyCode: body.companyCode,
            SPCompanyName: body.companyName,
            SPCategoryMapID: categoryMapID,  // this is the new field, to store the map ID for the category map
            SPOnTimeIntimationFlag: body.onTimeIntimationFlag,
            SPInsertUserID: body.objCommon.insertedUserID,
            SPInsertIPAddress: body.objCommon.insertedIPAddress,
        },
        type: sequelize.QueryTypes.RAW,
                   
    }).then(async (res) => {
        await sequelize.query(`select 
        @SPSPOfflineSupportTicketID AS ticketId, 
        @rcode AS code, 
        @rmessage AS message`).then(async(result) => {
            const data = flatMap(result);
            
            loggingApi.logger.info(data);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            else{
                        
            ticketmessage=data[0].message;
            items = {
               
                SupportTicketID: data[0].ticketId
           
            };
            
} 
         })
     
       
  
})
return {data: items, ticketmessage};

}
async generateSupportTicket(req) {
    let body=req.body;    
    let items = {};
    let tokenvalue =undefined;
    let message = '';
    let ticketmessage = '';
    let apiResult='';
    let varheaderID = body.ticketHeaderID.toString();
    let categoryMapID=0;
    await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_INSERT}(
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
        :SPRelation,
        :SPRelativeName,
        :SPDistrictName,
        :SPSubDistrictID,
        :SPSubDistrictName,
        :SPPolicyPremium ,
        :SPPolicyArea,
        :SPPolicyType,
        :SPLandSurveyNumber,
        :SPLandDivisionNumber,
        :SPPlotVillageName,
        :SPPlotDistrictName,
        :SPPlotStateName,
        :SPApplicationSource,
        :SPCropShare,
        :SPIFSCCode,
        :SPFarmerShare,
        :SPSowingDate,
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
                SPAttachmentPath: body.attachmentPath,
                SPCropName: body.cropName,
                SPApplicationCropName: body.applicationCropName,
                SPArea: body.area,
                SPVillageName: body.villageName,
                SPRelation: body.relation,
                SPRelativeName: body.relativeName,
                SPDistrictName: body.districtName,
                SPSubDistrictID: body.subDistrictID,
                SPSubDistrictName: body.subDistrictName,
                SPPolicyPremium : body.policyPremium,
                SPPolicyArea: body.policyArea,
                SPSubDistrictID: body.subDistrictID,
                SPSubDistrictName: body.subDistrictName,
                SPPolicyPremium : body.policyPremium,
                SPPolicyArea: body.policyArea,
                SPPolicyType: body.policyType,
                SPLandSurveyNumber: body.landSurveyNumber,
                SPLandDivisionNumber: body.landDivisionNumber,
                SPPlotVillageName: body.plotVillageName,
                SPPlotDistrictName: body.plotDistrictName,
                SPPlotStateName: body.plotStateName,
                SPApplicationSource: body.applicationSource,
                SPCropShare: body.cropShare,
                SPIFSCCode: body.iFSCCode,
                SPFarmerShare: body.farmerShare,
                SPApplicationSource: body.applicationSource,
                SPCropShare: body.cropShare,
                SPIFSCCode: body.iFSCCode,
                SPFarmerShare: body.farmerShare,
                SPSowingDate:body.sowingDate,
                SPInsertUserID: body.objCommon.insertedUserID,
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
            
            loggingApi.logger.info(data);
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
            if ((varheaderID ===4)||(varheaderID ==="4"))
                {
                      const d = new Date(body.lossDate);
                      let cropStatusAtIncidence="Standing Crop";
                      
                      if(body.cropStageMasterID===7)
                        {
                            cropStatusAtIncidence= "Harvested";
                        }
                        
                    let claimrequest={
                "applicationNo" : body.applicationNo.toString(),
                "cropStatusAtIncidence":cropStatusAtIncidence,
                "dateOfIncidence": dateFormat(d, "yyyy-mm-dd h:MM:ss"),
                "typeOfIncidence":categoryMapID.toString(),  
                "dateOfIntimation":dateFormat(new Date(), "yyyy-mm-dd h:MM:ss"),
                "source":"11",
                "sourceOrigin": "7",
                "estimatedLossPercentage":0,
                "remarks": body.ticketDescription.toString(),
                "ticketNo": data[0].ticketNo.toString(),
                "callerMobileNo": body.callerContactNumber.toString()
               }
               
                 
               let loginToken =appCache.get("PMFBYToken");
               
               if(loginToken===undefined) {
                
                    const url1 = `${constant.PM_API_HTTPS}user/user/login`;
        let requestDataProduction = {
                    "deviceType": "android",
                    "otp": 123456,
                    "password": "af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                    "mobile": "9899499022"
               };       
               let requestData =     {
                "deviceType": "android",
                "password":"af0ea0b9a3da1d35cae98df93385c49c0dc5185573b005041e973ee3683d20d91ec9a089f4647ab47287753278580adf3501828c5ef9047c1f168a707fa40f8c",
                "mobile": "7018401424",
                "otp": 123456
                }                  
                       console.log('url1',url1);
                       await  axios.post(url1,requestData,  {
                        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                    }).then(async (res) => {
      
                    if (res.data.status) {
                           
                        const result = res.data;
                        
                        loggingApi.logger.info('SET TOKEN At GENERATE TICKET');
                        appCache.set("PMFBYToken",result.token,Number(result.sessionTTL));
                        
                        tokenvalue=result.token;
            }
        }).catch(async error => {
            console.log('error',error);
         let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

        
             message = 'SUCCESS'
           
             
             await sequelize.query(sqlstring, {
                 replacements: {
                       
                 },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async (res) => {
     
                })
     
                 
          throw new Error(error );
            throw new Error(error);
           
                  });
                  
                }
               else
               {        
                 tokenvalue = loginToken;
                loggingApi.logger.info('get token from cache in CreateTicket '+ tokenvalue);
                    
               }
                 let  headers= {
                        "Content-Type": "application/json",
                     //    token : "617ae351487e8a19ad01b6fe10acab76801c68f2c74e8cbb1dd6219b0592137e"
                    token : tokenvalue
                };
                    console.log('tokenvalue',tokenvalue);
                    console.log('varheaderID',varheaderID);
                    if ((varheaderID ===4)||(varheaderID ==="4"))
                {
               
             const url = `${constant.PM_API_STAGING}`;
             loggingApi.logger.info(url);
             
           await  axios.post(url,claimrequest,  {
            headers: headers
          }).then(async (res) => {
            loggingApi.logger.info('//////////////////////////////////////////////////');
            loggingApi.logger.info(res);
               console.log('Claim res',res);
            
            loggingApi.logger.info(res.data);
            if (res.data.status===true) 
            {
                   apiResult = res.data.data;
          
            
             let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportNo,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','`"  + res.data.data.cropLossReportNo + "`','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
      
             }
             else
             { 
                apiResult=res.data.error;
                console.log("converted Sting",apiResult.replace(/\'/gi,''));
                apiResult = apiResult.replace(/\'/gi,'');
                
              
                let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
                sqlstring +="('"  + data[0].ticketNo + "','"  + apiResult + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
      
                
             }
            }).catch(async error => {
                console.log('error',error);
                let errormsg=error + '( In FetchToken for Claim Intimation)';
          //  console.error('Request failed with status code:', error  + " ( In FetchToken for Claim Intimation ");
          let   sqlstring =" INSERT INTO  support_ticket_claim_intimation_report_history(SupportTicketNo,ClaimReportError,RequestJson,InsertUserID,InsertIPAddress) VALUES";
          sqlstring +="('"  + data[0].ticketNo + "','"  + errormsg + "','"  + JSON.stringify(claimrequest) + "',"  + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "');";

              
                   message = 'SUCCESS'
                 
                   console.log('sqlstring',sqlstring);
                   await sequelize.query(sqlstring, {
                       replacements: {
                             
                       },
                          type: sequelize.QueryTypes.INSERT,
                      }).then(async (res) => {
           
                      })
           
                
                console.log('error In FetchToken for Claim Intimation',error);
          //      throw new Error(error );

              });
        
            }
          
    message = data[0].message;
    }
} 
         })
     
       
  
})
return {data: items, ticketmessage,apiResult:apiResult};

}


 async updateTicketStatus(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_STATUS_UPDATE}(
       :SPSupportTicketID,
       :SPTicketStatusID,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: body.supportTicketID,
                SPTicketStatusID: body.ticketStatusID,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
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
        return {data: items, message};
    }
     async addBulkSupportTicketReview(body) {
        console.log('body',body);
        console.log(' body.objCommon.insertedUserID', body.objCommon.insertedUserID);
                let items = {};
                let senditemsjson = {};
                const   objCom={    insertedUserID:  body.objCommon.insertedUserID,
                    insertedIPAddress: body.objCommon.insertedIPAddress};
                let message = '';
                let farmermobilenumber;
                let ticketnumber;
                
                let apibody;
                await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_BULK_TICKET_HISTORY_INSERT}(
               @SPTicketHistoryID,
               :SPSupportTicketID,
               :SPAgentUserID,
               :SPTicketStatusID,
               :SPTicketDescription,
               :SPHasDocument,
               :SPInsertUserID,
               :SPInsertIPAddress,
                @rcode, @rmessage)`, {
                    replacements: {
                        SPSupportTicketID: body.supportTicketID,
                        SPAgentUserID: body.agentUserID,
                        SPTicketStatusID: body.ticketStatusID,
                        SPTicketDescription: body.ticketDescription,
                        SPHasDocument: body.hasDocument,
                       SPInsertUserID: body.objCommon.insertedUserID,
                        SPInsertIPAddress: body.objCommon.insertedIPAddress,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async (res) => {
                    await sequelize.query(`select @SPTicketHistoryID AS TicketHistoryID, @rcode AS code, @rmessage AS message`).then((result) => {
                        const data = flatMap(result);
                        if (+data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        items = {TicketHistoryID: data[0].TicketHistoryID}
                        message = data[0].message;
                        console.log('res',res);
                       if (+data[0].code === 1) {
                            const ticketdetail = Object.values(res).map((el) => el);
                           if(ticketdetail.length > 0)
                            {
                                let body='';
                                for (let i = 0; i < ticketdetail.length; i++) {
 
                                    farmermobilenumber = res[i].RequestorMobileNo;
                                    ticketnumber= res[i].SupportTicketNo;
                                  
                                if(res[i].Template!=='')
                                {

                                    apibody={
                                        templateID:res[i].Template,
                                        supportTicketNo:res[i].SupportTicketNo,
                                        mobileNO:res[i].RequestorMobileNo,
                                        objCommon:objCom
                                      
                                    }
                                     this.sendSMSToFarmer(apibody);
                                       let message = '';
                                     }
                            }
                            items = {TicketHistoryID: data[0].TicketHistoryID,Ticketdetail:ticketdetail}
                            message = data[0].message;
                            senditemsjson={Number:res[i].RequestorMobileNo,Name:ticketdetail,TicketNumber:res[i].SupportTicketNo}
                        }
                        else
                        {
                            items = {TicketHistoryID: data[0].TicketHistoryID}
                            message = data[0].message;
                        }
                    }
                })
                })
                return {data: items, message};
    }

      async krphFarmerCallingHistory(body) {
        console.log('body: ', body);
        let items = {};
let message='';
let url ="https://fgms.smartping.io/api/crm_details";
        await sequelize.query(`CALL ${STORE_PROCEDURE.KRPH_FARMERS_CALLING_MASTER_INSERT}(
      @SPCallingMasterID,
       @SPTraverseID,
    :SPCallingIDD,
    :SPCallingUniqueID,
    :SPCallerMobileNumber,
    :SPFarmerMobileNumber,
    :SPFarmerName,
    :SPCallStatus,
    :SPReason,
    :SPStateCodeAlpha,
    :SPDistrictCodeAlpha,
    :SPIsRegistered,
    :SPInsertUserID,
    :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {                
                SPCallingIDD:body.CallingMasterID,
                SPCallingUniqueID: body.callingUniqueID,
                SPCallerMobileNumber: body.callerMobileNumber,
                SPFarmerMobileNumber: body.farmerMobileNumber,
                SPFarmerName: body.farmerName,
                SPCallStatus: body.callStatus,
                SPCallerMobileNumber: body.callerMobileNumber,
                SPFarmerMobileNumber: body.farmerMobileNumber,
                SPFarmerName: body.farmerName,
                SPCallStatus: body.callStatus,
                SPReason: body.reason,
                SPStateCodeAlpha: body.stateCodeAlpha,
                SPDistrictCodeAlpha: body.districtCodeAlpha,
                SPIsRegistered: body.isRegistered,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async () => {
            await sequelize.query(`select @SPCallingMasterID AS CallingMasterID,@SPTraverseID As TraverseID, @rcode AS code, @rmessage AS message`).then(async (result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
              if (body.SPCallingMasterID =0)
            {              
               let requestData =   {
                "uniqueid": body.callingUniqueID,
                  "user": body.user,    
                  "ticket_id": data[0].TraverseID, 
                  "event_time": ""
                };
               console.log('url',url);
               console.log('requestData',requestData);
       await  axios.post(url,requestData,  {
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            }).then(async (res) => {
console.log('resress',res);
            if (res.message) {
            }})
        }
            items = {CallingMasterID: data[0].CallingMasterID}
            message = data[0].message;
        }).catch((err) => {
            console.log(err);
            throw new Error('Something Went Wrong!')
        })
               
            })
        
        return {data: items, message};
    }
    
    async farmerCallingHistory(body) {
                console.log('body: ', body);
                let items = {};
        let message='';
                await sequelize.query(`CALL ${STORE_PROCEDURE.FARMERS_CALLING_MASTER_INSERT}(
               @SPCallingMasterID,
            :SPCallerMobileNumber,
            :SPFarmerMobileNumber,
            :SPFarmerName,
            :SPCallStatus,
	        :SPReason,
            :SPStateCodeAlpha,
            :SPDistrictCodeAlpha,
            :SPIsRegistered,
            :SPInsertUserID,
            :SPInsertIPAddress,
                @rcode, @rmessage)`, {
                    replacements: {
                        SPCallerMobileNumber: body.callerMobileNumber,
                        SPFarmerMobileNumber: body.farmerMobileNumber,
                        SPFarmerName: body.farmerName,
                        SPCallStatus: body.callStatus,
                        SPReason: body.reason,
                        SPStateCodeAlpha: body.stateCodeAlpha,
                        SPDistrictCodeAlpha: body.districtCodeAlpha,
                        SPIsRegistered: body.isRegistered,
                        SPInsertUserID: body.objCommon.insertedUserID,
                        SPInsertIPAddress: body.objCommon.insertedIPAddress,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async () => {
                    await sequelize.query(`select @SPCallingMasterID AS CallingMasterID, @rcode AS code, @rmessage AS message`).then((result) => {
                        const data = flatMap(result);
                        if (+data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        items = {CallingMasterID: data[0].CallingMasterID}
                        message = data[0].message;
                    })
                })
                return {data: items, message};
            }
    async updateTicketStatus(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_STATUS_UPDATE}(
       :SPSupportTicketID,
       :SPTicketStatusID,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: body.supportTicketID,
                SPTicketStatusID: body.ticketStatusID,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }

                items = res
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error(err)
        })
        return {data: items, message};
    }
    async updateFarmerTicketStatus(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FARMER_SUPPORT_TICKET_STATUS_UPDATE}(
       :SPFarmerSupportTicketID,
       :SPTicketStatusID,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPFarmerSupportTicketID: body.farmerSupportTicketID,
                SPTicketStatusID: body.ticketStatusID,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }

                items = res
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);
            throw new Error(err)
        })
        return {data: items, message};
    }
    async getSupportTicketReview(body) {
        let items = {};
        let message = '';
        let data=[];
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_HISTORY_SELECT}(
       :SPSupportTicketID,
       :SPPageIndex,
       :SPPageSize,
       @SPRecordCount,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: +body.supportTicketID,
                SPPageIndex: +body.pageIndex,
                SPPageSize: +body.pageSize,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @SPRecordCount AS recordCount, @rcode AS code, @rmessage AS message`).then((result) => {
                 data = flatMap(result);
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
        return {data: {supportTicket: items,recordCount: data[0].recordCount}, message};
    }
   
    async addCSCSupportTicketReview(body) {
        let items = {};
        let message = '';
    
       
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_CSC_REVIEW_INSERT}(
       @SPTicketReviewHistoryID,
       :SPSupportTicketID,
       :SPAgentUserID,
       :SPTicketStatusID,
       :SPTicketDescription,
       :SPHasDocument,
       :SPAttachmentPath,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: body.supportTicketID,
                SPAgentUserID: body.agentUserID,
                SPTicketStatusID: body.ticketStatusID,
                SPTicketDescription: body.ticketDescription,
                SPHasDocument: body.hasDocument,
                SPAttachmentPath:body.attachmentPath,
              SPInsertUserID: body.objCommon.insertedUserID,
               SPInsertIPAddress: body.objCommon.insertedIPAddress
            
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async () => {
            await sequelize.query(`select @SPTicketReviewHistoryID AS TicketHistoryID, @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {TicketReviewHistoryID: data[0].TicketHistoryID}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async addSupportTicketReview(body) {
        let items = {};
        let message = '';
        
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_HISTORY_INSERT}(
       @SPTicketHistoryID,
       :SPSupportTicketID,
       :SPAgentUserID,
       :SPTicketStatusID,
       :SPTicketDescription,
       :SPHasDocument,

       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: body.supportTicketID,
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
    async editSupportTicketReview(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_COMMENT_HISTORY_INSERT}(
       @SPTicketCommentHistoryID,
       :SPSupportTicketID,
       :SPTicketHistoryID,
       :SPTicketDescription,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPSupportTicketID: body.supportTicketID,
                SPTicketHistoryID: body.ticketHistoryID,
                SPTicketDescription: body.ticketDescription,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async () => {
            await sequelize.query(`select @SPTicketCommentHistoryID AS TicketCommentHistoryID, @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {TicketCommentHistoryID: data[0].TicketCommentHistoryID}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async addFarmerSupportTicketReview(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FARMERS_SUPPORT_TICKET_HISTORY_INSERT}(
       @SPTicketHistoryID,
       :SPFarmerSupportTicketID,
       :SPAgentUserID,
       :SPTicketStatusID,
       :SPTicketDescription,
       :SPHasDocument,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPFarmerSupportTicketID: body.farmerSupportTicketID,
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
    
    async sendSMSToFarmer(body) {
        let templateIDD = '';
        let customTemplate = '';
        let whatsApptemplateIDD = '';
        let items = {};
        let message = '';
console.log('sendSMSToFarmer',body)
        if (toUpper(body.templateID) === 'C') {
            templateIDD = "1707165813914061059";
            customTemplate = `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपकी शिकायत - ${body.supportTicketNo} का समाधान कर दिया गया है । यदि आप संतुष्ट नहीं है तो कृपया 14447 पे कॉल करे । आपका दिन शुभ हो । PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥`;
        } else if (toUpper(body.templateID) === 'I') {
            templateIDD = "1707165813910966584";
            customTemplate = "प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपका दिन शुभ हो । PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥";
        } else if (toUpper(body.templateID) === 'G') {
            templateIDD = "1707165813908017352";
            whatsApptemplateIDD ="7110953";
            customTemplate = `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपके द्वारा दर्ज करायी गयी शिकायत का क्रमांक है - ${body.supportTicketNo} "PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥`;
        } else if (toUpper(body.templateID) === 'R') {
            templateIDD = "1707165829414696601";
             whatsApptemplateIDD ="7110980";
            customTemplate = `प्रियकिसान , प्रधानमंत्री फसलबीमा योजनाकीसहायकसेवासेसम्पर्ककरनेकेलिएआपकाधन्यवाद। आपकीशिकायत - ${body.supportTicketNo} को पुनःजाँचएवंविचारकेलिएभेजदियागयाहै। आपकादिनशुभहो। PMFBY सुरक्षितफसल, निश्चिंतकिसान।फसलबीमाहैसबकासमाधान॥`;
        } else {
            throw new Error('Invalid Template');
        }
/*
        const customTemplateEncode = this.utilService.GetSingleUnicodeHex(customTemplate);
        if (templateIDD === '', customTemplate === '') {
            throw new Error('Invalid Template');
        } else {
            const response = await axios.post(`https://bulksmsapi.vispl.in/?username=cscetrnapi3&password=csce_123&messageType=unicode&mobile=${body.mobileNO}&senderId=CSCSPV&ContentID=${templateIDD}&EntityID=1301157363501533886&message=${customTemplateEncode}`);
            
            if (response.status === 200) {
                const val = response.data.split('#');
                if (val.length < 0) {
                    throw new Error('Could not send Message');
                }
                await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_SMS_HISTORY_INSERT}(
            @SPSMSHistoryID,
            :SPSupportTicketNo,
            :SPSMSReferenceNo,
            :SPWhatsAppReferenceNo,
            :SPTemplateID,
            :SPMobileNo,
            :SPInsertUserID,
            :SPInsertIPAddress,
             @rcode, @rmessage)`, {
                    replacements: {
                        SPSupportTicketNo: body.supportTicketNo,
                        SPSMSReferenceNo: val[2],
                        SPWhatsAppReferenceNo: '',
                        SPTemplateID: templateIDD,
                        SPMobileNo: body.mobileNO,
                        SPInsertUserID: body.objCommon.insertedUserID,
                        SPInsertIPAddress: body.objCommon.insertedIPAddress,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async () => {
                    await sequelize.query(`select @SPSMSHistoryID AS historyID, @rcode AS code, @rmessage AS message`).then((result) => {
                        const data = flatMap(result);
                        if (+data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        items= {SMSHistoryID: data[0].historyID}
                        message = val[1].toString();
                    })
                })
            }
        }
*/
        // ------------------ WhatsApp message ----------------
        if (whatsApptemplateIDD !== '')
            {
               if ((toUpper(body.templateID) === 'G')  ||   (toUpper(body.templateID) === 'R'))
                    {
               const response = await axios.get(`https://media.smsgupshup.com/GatewayAPI/rest?method=SENDMESSAGE&msg_type=TEXT&userid=2000242118&auth_scheme=plain&password=WyLfH*RR&format=text&data_encoding=TEXT&send_to=${body.mobileNO}&v=1.1&format=Text&isHSM=true&template_id=${whatsApptemplateIDD}&var1=${body.supportTicketNo}`);
               console.log('WhatsApiURL',`https://media.smsgupshup.com/GatewayAPI/rest?method=SENDMESSAGE&msg_type=TEXT&userid=2000242118&auth_scheme=plain&password=WyLfH*RR&format=text&data_encoding=TEXT&send_to=${body.mobileNO}&v=1.1&format=Text&isHSM=true&template_id=${whatsApptemplateIDD}&var1=${body.supportTicketNo}`);
               console.log('whatsapp response',response.data);
                  if (response.status === 200) {
                   const valresponse = response.data.split('|');
                  if (valresponse.length < 0) {
                       throw new Error('Could not send Message');
                   }
                   await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_SMS_HISTORY_INSERT}(
               @SPSMSHistoryID,
               :SPSupportTicketNo,
               :SPSMSReferenceNo,
               :SPWhatsAppReferenceNo,
               :SPTemplateID,
               :SPMobileNo,
               :SPInsertUserID,
               :SPInsertIPAddress,
                @rcode, @rmessage)`, {
                       replacements: {
                           SPSupportTicketNo: body.supportTicketNo,
                           SPSMSReferenceNo: '',
                           SPWhatsAppReferenceNo: valresponse[2],
                           SPTemplateID: whatsApptemplateIDD,
                           SPMobileNo: body.mobileNO,
                           SPInsertUserID: body.objCommon.insertedUserID,
                           SPInsertIPAddress: body.objCommon.insertedIPAddress,
                              },
                       type: sequelize.QueryTypes.INSERT,
                   }).then(async () => {
                       await sequelize.query(`select @SPSMSHistoryID AS historyID, @rcode AS code, @rmessage AS message`).then((result) => {
                           const data = flatMap(result);
                           if (+data[0].code === 0) {
                               throw new Error(data[0].message)
                           }
                           items= {SMSHistoryID: data[0].historyID}
                           message = valresponse[0].toString();
                       })
                   })
               }
           }
       }
           message="SMS Sent Successfully";
           return {data: items, message};
       }
    async sendSMSToNewFarmer(body) {
        let templateIDD = '';
        let customTemplate = '';
        let items = {};
        let message = '';

        if (toUpper(body.templateID) === 'C') {
            templateIDD = "1707165813914061059";
            customTemplate = `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपकी शिकायत - ${body.supportTicketNo} का समाधान कर दिया गया है । यदि आप संतुष्ट नहीं है तो कृपया 14447 पे कॉल करे । आपका दिन शुभ हो । PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥`;
        } else if (toUpper(body.templateID) === 'I') {
            templateIDD = "1707165813910966584";
            customTemplate = "प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपका दिन शुभ हो । PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥";
        } else if (toUpper(body.templateID) === 'G') {
            templateIDD = "1707165813908017352";
            customTemplate = `प्रिय किसान , प्रधानमंत्री फसल बीमा योजना की सहायक सेवा से सम्पर्क करने के लिए आपका धन्यवाद । आपके द्वारा दर्ज करायी गयी शिकायत का क्रमांक है - ${body.supportTicketNo} "PMFBY सुरक्षित फसल, निश्चिंत किसान । फसल बीमा है सबका समाधान ॥`;
        } else if (toUpper(body.templateID) === 'R') {
            templateIDD = "1707165829414696601";
            customTemplate = `प्रियकिसान , प्रधानमंत्री फसलबीमा योजनाकीसहायकसेवासेसम्पर्ककरनेकेलिएआपकाधन्यवाद। आपकीशिकायत - ${body.supportTicketNo} को पुनःजाँचएवंविचारकेलिएभेजदियागयाहै। आपकादिनशुभहो। PMFBY सुरक्षितफसल, निश्चिंतकिसान।फसलबीमाहैसबकासमाधान॥`;
        } else {
            throw new Error('Invalid Template');
        }

        const customTemplateEncode = this.utilService.GetSingleUnicodeHex(customTemplate);
        if (templateIDD === '', customTemplate === '') {
            throw new Error('Invalid Template');
        } else {
            const response = await axios.post(`https://bulksmsapi.vispl.in/?username=cscetrnapi3&password=csce_123&messageType=unicode&mobile=${body.mobileNO}&senderId=CSCSPV&ContentID=${templateIDD}&EntityID=1301157363501533886&message=${customTemplateEncode}`);
            if (response.status === 200) {
                const val = response.data.split('#');
                if (val.length < 0) {
                    throw new Error('Could not send Message');
                }
                await sequelize.query(`CALL ${STORE_PROCEDURE.FARMER_SUPPORT_SMS_HISTORY_INSERT}(
            @SPSMSHistoryID,
            :SPFarmerSupportTicketNo,
            :SPSMSReferenceNo,
            :SPTemplateID,
            :SPMobileNo,
            :SPInsertUserID,
            :SPInsertIPAddress,
             @rcode, @rmessage)`, {
                    replacements: {
                        SPFarmerSupportTicketNo: body.farmerSupportTicketNo,
                        SPSMSReferenceNo: val[2],
                        SPTemplateID: templateIDD,
                        SPMobileNo: body.mobileNO,
                        SPInsertUserID: body.objCommon.insertedUserID,
                        SPInsertIPAddress: body.objCommon.insertedIPAddress,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }).then(async () => {
                    await sequelize.query(`select @SPSMSHistoryID AS historyID, @rcode AS code, @rmessage AS message`).then((result) => {
                        const data = flatMap(result);
                        if (+data[0].code === 0) {
                            throw new Error(data[0].message)
                        }
                        items= {SMSHistoryID: data[0].historyID}
                        message = val[1].toString();
                    })
                }).catch(error => {
                    console.log(error.response)
                    console.log(error);
                    throw new Error(error)
                  });
            }
        }

        return {data: items, message};
    }
    async getSupportTicketCategoryReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_CAT_REPORT}(
       :SPTicketHeaderID,
       :SPSupportTicketTypeID,
       :SPTicketCategoryID,
       :SPInsuranceCompanyID,
       :SPStateID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPTicketHeaderID: +body.ticketHeaderID,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPInsuranceCompanyID: +body.insuranceCompanyID,
                SPStateID: +body.stateID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: +body.objCommon.insertedUserID || 0,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    
     async supportTicketHistoryReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_HISTRORY_REPORT}(
       :SPTicketHeaderID,
       :SPSupportTicketTypeID,
       :SPTicketCategoryID,
       :SPInsuranceCompanyID,
       :SPStateID,
       :SPFROMDATE,
       :SPTODATE,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPTicketHeaderID: +body.ticketHeaderID,
                SPSupportTicketTypeID: +body.supportTicketTypeID,
                SPTicketCategoryID: +body.ticketCategoryID,
                SPInsuranceCompanyID: body.insuranceCompanyID,
                SPStateID: body.stateID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: +body.objCommon.insertedUserID || 0,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    async getSupportAgeingReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGEING_REPORT}(
       :SPViewMode,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUserID: +body.objCommon.insertedUserID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    
   
    async getSupportAgeingReportDetail(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGEING_REPORT_DETAIL}(
       :SPViewMode,
       :SPUserID,
       :SPStateID,
       :SPInsuranceCompanyID,
       :SPCategoryID,
       :SPTicketStatusID,
       :SPAgeingPeriodsID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUserID: +body.objCommon.insertedUserID,
                SPStateID:+body.stateID,
       SPInsuranceCompanyID:+body.insuranceCompanyID,
       SPCategoryID:+body.categoryID,
       SPTicketStatusID:+body.ticketStatusID,
       SPAgeingPeriodsID:body.ageingPeriodsID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                console.log('data',res);
                console.log('data',res.length);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getSupportCropAgeingReport(body) {
        console.log('body',body);
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGEING_CROP_REPORT}(
       :SPViewMode,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUserID: +body.objCommon.insertedUserID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getSupportCropAgeingReportDetail(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_AGEING_CROP_REPORT_DETAIL}(
       :SPViewMode,
       :SPUserID,
       :SPStateID,
       :SPInsuranceCompanyID,
       :SPCategoryID,
       :SPTicketStatusID,
       :SPAgeingPeriodsID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUserID: +body.objCommon.insertedUserID,
                SPStateID:+body.stateID,
       SPInsuranceCompanyID:+body.insuranceCompanyID,
       SPCategoryID:+body.categoryID,
       SPTicketStatusID:+body.ticketStatusID,
       SPAgeingPeriodsID:body.ageingPeriodsID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                console.log('data',res);
                console.log('data',res.length);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async complaintMailReport(body)
    { 
        let items = {};
    let message = '';
    await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_SEND_ESCALATION_MAIL_COMPLAINT_SELECT}(
   :SPFROMDATE,
   :SPTODATE,
   @rcode, @rmessage)`, {
        replacements: {
           
            SPFROMDATE: body.fromdate || null,
            SPTODATE: body.toDate || null,
            
        },
        type: sequelize.QueryTypes.RAW,
    }).then(async (res) => {
        await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
            const data = flatMap(result);
            if (+data[0].code === 0) {
                throw new Error(data[0].message)
            }
            items = {supportTicket: res}
            message = data[0].message;
        })
    })
    return {data: items, message};

    }
    
    async getSupportTicketReopenDetailReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_REOPEN_DETAIL_REPORT}(
       :SPFROMDATE,
       :SPTODATE,
       :SPInsuranceCompanyID,
       :SPStateID,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceCompanyID: body.insuranceCompanyID,
                SPStateID: body.stateID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: +body.objCommon.insertedUserID || 0,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getSupportTicketDetailReport(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.SUPPORT_TICKET_DETAIL_REPORT}(
       :SPFROMDATE,
       :SPTODATE,
       :SPInsuranceCompanyID,
       :SPStateID,
       :SPTicketHeaderID,
       :SPUserID,
        @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceCompanyID: body.insuranceCompanyID,
                SPStateID: body.stateID,
                SPTicketHeaderID: body.ticketHeaderID,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: +body.objCommon.insertedUserID || 0,
              
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {supportTicket: res}
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async storagedestination(req, res) {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const DIR = './krph_documents/';
                //constmulter.diskStorage dirpath ='./krph_documents/' + req.body.ImgPath;
                const dirpath ='./krph_documents/';
        fs.access(dirpath, (error) => { 
        
            // To check if given directory  
            // already exists or not 
            if (error) { 
              // If current directory does not exist then create it 
              fs.mkdir(dirpath, { recursive: true }, (error) => { 
                if (error) { 
                  console.log(error); 
                } else { 
                  console.log("New Directory created successfully !!"); 
                } 
              }); s
            } else { 
              console.log("Given Directory already exists !!"); 
            } 
          });
        
          console.log('dirpath1111111', dirpath);
                cb(null, './krph_documents/' + req.body.ImgPath);
            },
            filename: (req, file, cb) => {
              setTimeout(() => {
                const fileName = file.originalname.toLowerCase().split(' ').join('-');
                console.log('fileName',fileName);
               // cb(null,  fileName)
               console.log()
               cb(null,  req.body.ImageName)
               
              }, 1000);
               
            }
        });
     
        return storage;
    }
    async uploaddestination(storage,req, res) {
        
        const upload = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                console.log ('file.mimetype',file.mimetype);
                if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
                    cb(null, true);
                } else {
                    cb(null, false);
                    return cb(new Error('Only .png, .jpg and .jpeg ,.pdf format allowed!'));
                }
            }
        });
    
        return upload;
    }
    async uploadDocument (req, res) {
        let upload ='';
        return upload;
    }
    async uploadDocument (req, res) {
     //   console.log('uploadDocument',req, res,err)
        let items = {};
        let message = '';
 /*       const storage = multer.diskStorage({
            destination: (req, file, cb)=> {
                // Uploads is the Upload_folder_name
                cb(null, "./krph_documents/");
                console.log('./krph_documents/');
            },
            filename: (req, file, cb)=> {
                cb(null, file.fieldname + "-" + Date.now() + ".jpg");
                console.log('file.fieldname',file.fieldname);
            },
        });
       
        // Define the maximum size for uploading
        // picture i.e. 1 MB. it is optional
        const maxSize = 1 * 1000 * 1000;
         
        const upload = multer({
            storage: storage,
            limits: { fileSize: maxSize },
            fileFilter: (req, file, cb) =>{
                // Set the filetypes, it is optional
                var filetypes = /jpeg|jpg|png/;
                console.log('filefilefilefilefile',file);
                var mimetype = filetypes.test(file.mimetype);
         
                var extname = filetypes.test(
                    path.extname(file.originalname).toLowerCase()
                );
                console.log('lines 10122222222');
                if (mimetype && extname) {
                    return cb(null, true);
                }
         
                cb(
                    "Error: File upload only supports the " +
                        "following filetypes - " +
                        filetypes
                );
            },
         
            // mypic is the name of file attribute
        });
        
   */
  
        const storage =this.storagedestination(req, res);
       // console.log ('getFilename',storage.getFilename());
        const upload1 = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                console.log ('file.mimetype',file.mimetype);
                if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
                    cb(null, true);
                } else {
                    cb(null, false);
                    return cb(new Error('Only .png, .jpg and .jpeg ,.pdf format allowed!'));
                }
            }
        });
        const upload= multer({ dest: "./krph_documents/" });
    
              upload.single('file');
      
        console.log('upload',upload);
        return {data: {}, message:'upload Successfully'};
    }

    async  insuranceUserAssignTicket(body) {
        let item = {};
        let message = '';
        let failedRecords = '';
        let existingRecords = '';
    
        try {
            // Call the stored procedure
            await sequelize.query(`
                CALL ${STORE_PROCEDURE.INSURANCE_USER_ASSIGN_TICKET}(
                    :SPViewMode,
                    :SPAppAccessID,
                    :SPInsuranceCompanyID,
                    :SPInsertUserId,
                    :SPInsertIPAddress,
                    :SupportTicketIds,
                    @rcode,
                    @rmessage,
                    @failed_records,
                    @existing_records
                )
            `, {
                replacements: {
                    SPViewMode:body.viewMode,
                    SPAppAccessID:body.AppAccessId,
                    SPInsuranceCompanyID:body.InsuranceCompanyId,
                    SPInsertUserId:+body.objCommon.insertedUserID || 0,
                    SPInsertIPAddress:body.objCommon.insertedIPAddress || '',
                    SupportTicketIds:body.supportTickets,
                },
                type: sequelize.QueryTypes.RAW,
            });
            const [result] = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message, @failed_records AS failed_records, @existing_records AS existing_records
            `, {
                type: sequelize.QueryTypes.SELECT
            });
            const data = result;
            console.log(data, "testing data");
            if (+data.code !== 0) {
                throw new Error(data.message);
            }
            item = {};
            message = data.message;
            failedRecords = data.failed_records;
            existingRecords = data.existing_records;
            
        } catch (err) {
            console.error(err);
            message = err.message;
        }
 
        return  { item, message, failedRecords, existingRecords } 
        
    }


    async insuranceUserUnassignTicket(body) {
        let item = {};
        let message = '';
        let failedRecords = '';
    
        try {
            await sequelize.query(`
                CALL ${STORE_PROCEDURE.INSURANCE_USER_UNASSIGN_TICKET}(
                    :SPViewMode,
                    :SPAppAccessID,
                    @rcode,
                    @rmessage
                )
            `, {
                replacements: {
                    SPViewMode: body.viewMode,
                    SPAppAccessID: body.AppAccessId,
                },
                type: sequelize.QueryTypes.RAW,
            });
    
            const [result] = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message
            `);
    
            const data = result[0];
            console.log(data);
    
            if (+data.code === 0) {
                message = data.message;
            } else {
                message = data.message;
                item = { supportTicket: 'Unassign operation was successful.' };
            }
        } catch (err) {
            console.error(err);
            message = err.message;
        }
    
        return { item, message, failedRecords };
    }

    async agentListAndTicketCount(body){
        try{
            let items = {};
            let message = '';
            await sequelize.query(`CALL ${STORE_PROCEDURE.AGENT_LIST_TICKET_COUNT}(
                :SPUserID,
                :SPStateID,
                 @rcode, @rmessage)`, {
                     replacements: {
                        SPUserID: body.userId,
                        SPStateID:body.stateId
                     },
                     type: sequelize.QueryTypes.RAW,
                 }).then(async (res) => {
                     await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result) => {
                         const data = flatMap(result);
                         console.log(data)
                         if (+data[0].code === 0) {
                             throw new Error(data[0].message)
                         }
                         items = {agentList: res}
                         message = data[0].message;
                     })
                 })
                 return {data: items, message};
        }catch(err){
            console.log(err)
            throw err;
        }
    }
    async allUnassignedTicketsList(body) {
        let item = {};
        let message = '';
        try {
            await sequelize.query(`
                CALL ${STORE_PROCEDURE.ALL_TICKET_LISTING_UNASSIGNED}(
                    :SPViewTYP,
                    :SPSupportTicketTypeID,
                    :SPRequestorMobileNo,
                    :SPSupportTicketID,
                    :SPTicketHeaderID,
                    :SPSupportTicketNo,
                    :SPTicketSourceID,
                    :SPTicketCategoryID,
                    :SPStatusID,
                    :SPFROMDATE,
                    :SPTODATE,
                    :SPUserID,
                    :SPSchemeID,
                    :SPInsuranceCompanyID,
                    :SPStateID,
                    @rcode,
                    @rmessage
                )
            `, {
                replacements: {
                SPViewTYP: body.viewTYP || '',
                SPSupportTicketTypeID: body.supportTicketTypeID || 0,
                SPRequestorMobileNo: body.requestorMobileNo || '',
                SPSupportTicketID: body.supportTicketID || 0,
                SPTicketHeaderID: body.ticketHeaderID || 0,
                SPSupportTicketNo: body.supportTicketNo || '',
                SPTicketSourceID: body.ticketSourceID || 0,
                SPTicketCategoryID: body.ticketCategoryID || 0,
                SPStatusID: body.statusID || 0,
                SPFROMDATE: body.fromdate || null,
                SPTODATE: body.toDate || null,
                SPUserID: body.objCommon.insertedUserID || 0,
                SPSchemeID: body.schemeID || 0,
                SPInsuranceCompanyID: body.insuranceCompanyID || 0,
                SPStateID: body.stateID || ''
                },
                type: sequelize.QueryTypes.RAW,
            }).then(async(res)=>{
                await sequelize.query(`select @rcode AS code, @rmessage AS message`).then((result)=>{
                    const data = flatMap(result);
                    if (+data[0].code === 0) {
                        throw new Error(data[0].message)
                    }
                    item = {ticketList: res}
                    message = data[0].message;
                })
            })
            return {data: item, message};
        } catch (err) {
            console.error(err);
            message = err.message;
            return { data: item, message };
        }
    }
    
    async userWiseListTickets(body) {
        try {
            let items = {};
            let message = '';
            
            if (!body.userId) {
                throw new Error('User ID is required');
            }
            await sequelize.query(`CALL ${STORE_PROCEDURE.AGENT_WISE_TICKET_LIST}(
                :SPAppAccessId,
                :SPPageSize,
                :SPOffset,
                @rcode, @rmessage
            )`, {
                replacements: {
                    SPAppAccessId: body.userId,
                    SPPageSize: body.pageSize,
                    SPOffset: body.skip,
                },
                type: sequelize.QueryTypes.RAW,
            }).then(async (res) => {
                console.log(res)
                await sequelize.query(`SELECT @rcode AS code, @rmessage AS message`).then((result) => {
                    const data = result[0];
                    if(data[0].code === 0){
                        items = { ticketList: res };
                        message = data.message;
                    }else{
                        throw new Error(data.message);

                    }
                  
                });
            });
            
            return { data: items, message };
        } catch (err) {
            console.error(err);
            return { error: err.message };
        }
    }
    async userAssignedTicketListing(body) {
        let message = '';
        let items = {};
        try {
                      
           
            await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_USER_ASSIGNED_TICKET_LIST}(
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
                @rcode, 
                @rmessage)`, {
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
            }).then(async(res)=>{
                await sequelize.query('select @rcode AS code, @rmessage AS rmessage,@SPRecordCount').then((result) => {
                      
                    const data = flatMap(result);
                    console.log('result',result);
                      if (+data[0].code === 0) {
                          throw new Error(data[0].rmessage)
                      }
                      
                      const status = Object.values(res[0]).map((el) => el);
                      const supportTicket = Object.values(res[1]).map((el) => el);
                      items = {status, supportTicket}
                      message = data[0].rmessage;
                     
                  })
            }).catch((err)=>{
                console.log(err);
                throw new Error('Something Went Wrong!')
            })
            
            return {data: items, message};
            
    
        } catch (err) {
            console.log(err);
            throw err; 
        }
    }
    
    


 
   /* async uploadDocument(req, res,next) {
        console.log('bodyyyyy',req.body);
    const DIR = './krph_documents/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log('file',file);
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null,   fileName)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"  || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})
upload.single('files');
    };*/
    
}
