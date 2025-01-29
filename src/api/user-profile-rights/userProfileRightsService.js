import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {ResponseStatus} from "../../constants/constant.js";

export class UserProfileRightsService {

    constructor() {
        this.utilService = new UtilService();
    }

    async getUserProfileRight(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_PROFILE_RIGHTS_SELECT}(
       :SPViewMode,
       :SPUserProfileID,
       :SPMenuMasterID,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUserProfileID: +body.userProfileID,
                SPMenuMasterID: +body.menuMasterID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {UserProfileRight: res};
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    async getUserProfileRightAssign(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_PROFILE_RIGHTS_MANAGE}(
        :SPProfileID,
        @SPProfileRightID,
       :SPUserProfileID,
       :SPViewMode,
       :SPRightID,
       @SPRightMasterID,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPProfileID: body.profileRightID,
                SPUserProfileID: +body.userProfileID,
                SPViewMode: body.viewMode,
                SPRightID: body.rightMasterID,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query(`select @SPProfileRightID AS profileRightID, @SPRightMasterID AS rightMasterID, @rcode AS code, @rmessage AS message`).then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGNRIGHTS' || body.viewMode === 'UNASSIGNRIGHTS') {
                    items = {ProfileRightID: data[0].profileRightID, RightMasterID: data[0].rightMasterID}
                } else {
                    items = {UserProfileRight: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    async getUserRight(body) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_PROFILE_RIGHTS}(
       :SPUserID,
       :SPMenuMasterID,
        @rcode, @rmessage)`, {
            replacements: {
                SPUserID: +body.userID,
                SPMenuMasterID: +body.menuMasterID,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = {UserProfileRight: res};
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

}
