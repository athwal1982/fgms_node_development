import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";

export class MasterDataBindingService {
    constructor() {
        this.utilService = new UtilService();
    }

    async masterDataBinding(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.MASTER_DATA_BINDING}(
       :SPFilterID,
       :SPFilterID1,
       :SPMasterName,
       :SPSearchText,
       :SPSearchCriteria,
        @rcode, @rmessage)`, {
            replacements: {
                SPFilterID: +body.filterID,
                SPFilterID1: +body.filterID1,
                SPMasterName: body.masterName,
                SPSearchText: body.searchText,
                SPSearchCriteria: body.searchCriteria,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;
                message = data[0].message;
            })
        })
        return {data: {masterdatabinding: items}, message};
    }
    async krphmasterDataBinding(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.MASTER_DATA_BINDING}(
       :SPFilterID,
       :SPFilterID1,
       :SPMasterName,
       :SPSearchText,
       :SPSearchCriteria
        )`, {
            replacements: {
                SPFilterID: +body.filterID,
                SPFilterID1: +body.filterID1,
               SPMasterName: body.masterName,
                SPSearchText: body.searchText,
                SPSearchCriteria: body.searchCriteria,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
                   
            const response = res['0'];
            
                if (response['0'].ResponseCode  === '0') {
                    
                    throw new Error(response['0'].ResponseMessage)
                }
                items = Object.values(res['1']).map(el => el);                
                message = response['0'].ResponseMessage;
            
        })
        return {data: {masterdatabinding: items}, message};
    }
    async ticketDataBinding(body) {
        let items = [];
        let TCKCGZ,CRPTYP,CRPDTL,CRPSTG,CRPOTH;
        let binding = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.TICKET_BINDING_SELECT}(
              )`, {
              type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
           //        console.log('res',res);
            const response = res['0'];
           
                if (response['0'].rcode  === '0') {
                    
                    throw new Error(response['0'].rmessage)
                }
                
                 TCKCGZ = Object.values(res['1']).map(el => el);    
               console.log('TCKCGZ',TCKCGZ);       
                 CRPTYP = Object.values(res['2']).map((el) => el);
           //     console.log('CRPTYP',CRPTYP); 
                 CRPDTL = Object.values(res['3']).map((el) => el);
            //    console.log('CRPDTL',CRPDTL); 
                 CRPSTG = Object.values(res['4']).map((el) => el);  
                 CRPOTH = Object.values(res['5']).map((el) => el);  
             
                message = response['0'].rmessage;
                 
             
             
        })
        //return {data:{TCKCGZ: TCKCGZ,CRPTYP:CRPTYP,CRPDTL:CRPDTL,CRPSTG:CRPSTG}, message};
        return {data: {TCKCGZ: TCKCGZ,CRPTYP:CRPTYP,CRPDTL:CRPDTL,CRPSTG:CRPSTG,CRPOTH:CRPOTH}, message};
    }
    async uploadInvoiceData(body) {
        let items = [];
         let objerror={};
         let column = '';
         let values = '';
         let recordCount=0;
        let responsevoiceCall=0;
        let message = '';
        const   objCom={    insertedUserID:  body.objCommon.insertedUserID,
            insertedIPAddress: body.objCommon.insertedIPAddress};
            if(body.customers.length !==0)
                {recordCount=body.customers.length;
                    console.log('recordcount',recordCount);
                    column = 'CustomerNumber,Campaign,STATUS, AgentID,Agent,Circle,TicketNumber,Source,CallStartTime,CallEndTime,AgentCallStartTime,AgentCallEndTime,CustomerCallSec,QueueSeconds,AgentTalkTime, UniqueID, TransferStatus,CustomerPulse,DATE, ICName, ICStatus,InsertUserID,InsertIPAddress';
                    for (let i in Object.keys(body.customers))
                        {
                            
                            values +="('" +   body.customers[i].customerNumber  + "','" + body.customers[i].campaign  + "','" + body.customers[i].status +  "','"  + body.customers[i].agentID  + "','" + body.customers[i].agent  + "','" + body.customers[i].circle  + "','" + body.customers[i].ticketNumber  + "','" + body.customers[i].source  + "','" + body.customers[i].callStartTime  + "','" + body.customers[i].callEndTime  + "','" +   body.customers[i].agentCallStartTime  + "','" + body.customers[i].agentCallEndTime  + "','" + body.customers[i].customerCallSec +  "','"  + body.customers[i].queueSeconds  + "','" + body.customers[i].agentTalkTime  + "','" + body.customers[i].uniqueID  + "','" +   body.customers[i].transferStatus  + "','" + body.customers[i].customerPulse  + "','" + body.customers[i].date +  "','"  + body.customers[i].iCName  + "','" + body.customers[i].iCStatus  + "'," + body.objCommon.insertedUserID + ",'"  + body.objCommon.insertedIPAddress + "'),";
                        } 
                        values = values.substring(0,values.length-1);
               if(values!==''){
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_UPLOAD_INVOICE_DATA_INSERT}(
        :SPColumn,
       :SPValue,
       :SPRecordCount,
       @rcode, @rmessage
        )`, {
            replacements: {
                SPColumn:column,
                SPValue: values,
                SPRecordCount: recordCount,
             
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
              
                message = data[0].message;
            })
        })
    }
    else
    {
        message='No data found for insert'
    }
    }
    else
    {
        message = 'Provide Data for Upload'
    }
        return { message};
    }
    async locationmasterDataBinding(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.LOCATION_MASTER_DATA_BINDING}(
       :SPLevel,
       :SPFilterID,
       :SPUserID,
       :SPSearchText,
       :SPSearchCriteria,
        @rcode, @rmessage)`, {
            replacements: {
                SPLevel: +body.level,
                SPFilterID: body.filterID,
                SPUserID: +body.userID,
                SPSearchText: body.searchText,
                SPSearchCriteria: body.searchCriteria,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;
                message = data[0].message;
            })
        })
        return {data: {locationmasterdatabinding: items}, message};
    }
   
    async getUploadedInvoiceData(body) {
       
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_UPLOAD_INVOICE_DATA_SELECT}(
        :SPFromDate,
        :SPToDate,
        @rcode, @rmessage)`, {
            replacements: {
                SPFromDate: body.fromdate,
                SPToDate: body.todate,
            },
            type: sequelize.QueryTypes.SELECT,
        }).then(async (res) => {
            console.log('body: ' + body.fromdate);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;
                message = data[0].message;
            })
        })
        return {data: {invoicedata: items}, message};
    }
}
