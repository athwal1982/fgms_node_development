import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";

export class SupportTicketCateService {

    constructor() {
        this.utilService = new UtilService();
    }

    async getUserProfile(body, SP) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${SP}(
       :SPUserProfileID,
       :SPBRHeadTypeID,
       :SPViewMode,
       :SPSearchText,
        @rcode, @rmessage)`, {
            replacements: {
                SPUserProfileID: body.userProfileID,
                SPBRHeadTypeID: body.brHeadTypeID,
                SPViewMode: body.viewMode,
                SPSearchText: body.searchText,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
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
        return {data: {UserProfileMaster: items}, message};
    }

    async addUserProfile(body, SP) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${SP}(
       @SPUserProfileID,
       :SPBRHeadTypeID,
       :SPProfileName,
       :SPProfileDescription,
       :SPActiveStatus,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPBRHeadTypeID: body.brHeadTypeID,
                SPProfileName: body.profileName,
                SPProfileDescription: body.profileDescription,
                SPActiveStatus: "Y",
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserProfileID AS id, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                items = data[0]
                message = data[0].message;
            })
        }).catch((err) => {
            console.log(err);               
            throw new Error(err)
        })
        return {data: items, message};
    }

    async manageUserProfileAssign(body, SP) {
        let items = [];
        let message = '';
        await sequelize.query(`CALL ${SP}(
       :SPAction,
       :SPProfileID,
       @SPProfileAssignID,
       :SPUserAccessID,
       @SPAccessID,
       :SPUserProfileID,
       :SPUserProfileType,
       :SPInsertUserID,
       :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPAction: body.action,
                SPProfileID: body.profileAssignID,
                SPUserAccessID: body.accessID,
                SPUserProfileID: +body.userProfileID,
                SPUserProfileType: body.userProfileType,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPProfileAssignID AS profileAssignID, @SPAccessID AS accessID, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.action === 'ASSIGN') {
                    items = {ProfileAssignID: data[0].profileAssignID, AccessID: data[0].accessID}
                } else {
                    items = {UserProfileAssignMaster: res}
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

}
