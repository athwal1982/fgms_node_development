import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {ResponseStatus} from "../../constants/constant.js";

export class InsuranceMasterService {

    constructor() {
        this.utilService = new UtilService();
    }

    async getInsuranceMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.INSURANCE_COMPANY_MASTER_SELECT}(
       :SPInsuranceMasterID,
       :SPInsuranceMasterName,
        @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceMasterID: +body.insuranceMasterID,
                SPInsuranceMasterName: body.insuranceMasterName,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            if (res?.length === 0) throw new Error(ResponseStatus.NOT_FOUND);
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = res;
                message = data[0].message;
            })
        })
        return {data: {InsuranceMaster: items}, message};
    }

    async addInsuranceMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.INSURANCE_COMPANY_MASTER_INSERT}(
       @SPInsuranceMasterID,
       @SPInsuranceCompanyCode,
       :SPInsuranceMasterName,
       :SPInsuranceShortCode,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceMasterName: body.insuranceMasterName,
                SPInsuranceShortCode: body.insuranceShortCode,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select @SPInsuranceMasterID AS InsuranceMasterID, @SPInsuranceCompanyCode AS InsuranceCompanyCode, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                console.log('data',data);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = data[0];
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async updateInsuranceMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.INSURANCE_COMPANY_MASTER_UPDATE}(
       :SPInsuranceMasterID,
       :SPInsuranceMasterName,
       :SPInsuranceShortCode,
         @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceMasterID: body.insuranceMasterID,
                SPInsuranceMasterName: body.insuranceMasterName,
                SPInsuranceShortCode: body.insuranceShortCode,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select  @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                console.log('data',data);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }

                items = res
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async isActiveInsuranceMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.INSURANCE_COMPANY_MASTER_ISACTIVE}(
       :SPInsuranceMasterID,
       :SPActiveStatus,
         @rcode, @rmessage)`, {
            replacements: {
                SPInsuranceMasterID: body.insuranceMasterID,
                SPActiveStatus: body.activeStatus,
                
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select  @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                console.log('data',data);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }

                items = res
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    
    

}
