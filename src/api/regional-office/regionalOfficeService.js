import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {ResponseStatus} from "../../constants/constant.js";

export class RegionalOfficeService {

    constructor() {
        this.utilService = new UtilService();
    }

    async getRegionalOfficeMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.REGIONAL_OFFICE_SELECT}(
       :SPRegionalOfficeID,
       :SPSearchText,
        @rcode, @rmessage)`, {
            replacements: {
                SPRegionalOfficeID: +body.regionalOfficeID,
                SPSearchText: body.searchText,
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
        return {data: {RegionalOfficeMaster: items}, message};
    }

    async addRegionalOfficeMaster(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.REGIONAL_OFFICE_INSERT}(
       @SPRegionalOfficeID,
       :SPRegionOfficeName,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPRegionOfficeName: body.regionOfficeName,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select @SPRegionalOfficeID AS id, @rcode AS code, @rmessage AS message').then((result) => {
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

    async getRegionalStateAssignmentManage(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.REGIONAL_STATE_ASSIGN_MANAGE}(
       :SPViewMode,
       @SPRegionalStateID,
       :SPRegionalOfficeID,
       @SPStateMasterID,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPRegionalOfficeID: +body.regionalOfficeID,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
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
        return {data: items, message};
    }

    async userRegionalAssignmentManage(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.REGIONAL_STATE_USER_ASSIGN_MANAGE}(
       :SPViewMode,
       :SPAppAccessID,
       :SPRegionalOfficeID,
       :SPBankMasterID,
       :SPUserRelationID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPAppAccessID: +body.appAccessID,
                SPRegionalOfficeID: +body.regionalOfficeID,
                SPBankMasterID: +body.bankMasterID,
                SPUserRelationID: +body.userRelationID,
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
        return {data: items, message};
    }

}
