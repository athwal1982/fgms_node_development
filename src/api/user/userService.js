import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";
import {AuthHelpers} from "../../helper/authHelper.js";
import toUpper from "lodash/toUpper";

export class UserService {

    constructor() {
        this.utilService = new UtilService();
    }

    async getUsers(body) {
        let users = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_LIST}(
        :SPAppAccessID,
        :SPViewMode,
        :SPUserRelationType,
        :SPUserType,
        :SPSearchText,
        @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessID: body.appAccessID,
                SPViewMode: constant.ViewMode[toUpper(body.viewMode)],
                SPUserRelationType: body.userRelationType || '#ALL',
                SPUserType: body.userType || 0,
                SPSearchText: body.searchText || '#ALL',
            }
        }).then(async (res) => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                users = res;
                message = data[0].message;
            })
        })
        return {data: {user: users}, message};
    }
  
    async addUsers(body) {
        let payload = {};
        let message = '';
        const hashPassword = await AuthHelpers.decryptData(body.appAccessUserName);
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_CREATE_NODE}(
        @SPAppAccessID,
        :SPUserDisplayName,
        :SPAppAccessUserName,
        :SPAppAccessPWD,
        :SPAppAccessTypeID,
        :SPAppAccessLevel,
        :SPEmailAddress,
        :SPUserMobileNumber,
        :SPWeb_App,
        :SPWindow_App,
        :SPMobile_App,
        :SPWeb_API,
        :SPActiveStatus,
        :SPUserRelationType,
        :SPBRHeadTypeID,
        :SPUserRelationID,
        :SPLocationTypeID,
        :SPIPAllowed,
        :SPIMEIAllowed,
        :SPMacAddAllowed,
        :SPMobileAllowed,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPUserDisplayName: body.userDisplayName,
                SPAppAccessUserName: hashPassword,
                SPAppAccessPWD: body.appAccessPWD,
                SPAppAccessTypeID: +body.appAccessTypeID || '',
                SPAppAccessLevel: body.appAccessLevel,
                SPEmailAddress: body.emailAddress || '',
                SPUserMobileNumber: body.userMobileNumber,
                SPWeb_App: body.web_App || 0,
                SPWindow_App: body.window_App || 0,
                SPMobile_App: body.mobile_App || 0,
                SPWeb_API: body.web_API || 0,
                SPActiveStatus: body.activeStatus || 'Y',
                SPUserRelationType: body.userRelationType,
                SPBRHeadTypeID: +body.brHeadTypeID,
                SPUserRelationID: +body.userRelationID || 0,
                SPLocationTypeID:+body.locationTypeID || 0,
                SPIPAllowed: +body.ipAllowed || 0,
                SPIMEIAllowed: +body.imeiAllowed || 0,
                SPMacAddAllowed: +body.macAddAllowed || 0,
                SPMobileAllowed: +body.mobileAllowed || 0,
                SPInsertUserID: +body.objCommon?.insertedUserID,
                SPInsertIPAddress: body.objCommon?.insertedIPAddress,
            },
            type: sequelize.QueryTypes.UPSERT,
        }).then(async () => {
            await sequelize.query('select @SPAppAccessID AS id, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                payload = {AppAccessID: data[0].id};
                message = data[0].message;
            })
        })
        return {data: payload, message};
    }

    async updateUserStatus(body) {
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_STATUS_UPDATE}(
        :SPAppAccessID,
        :SPIsActive,
        @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessID: body.appAccessID,
                SPIsActive: body.isActive,
            },
            type: sequelize.QueryTypes.UPDATE,
        }).then(async () => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                message = data[0].message;
            })
        })
        return {data: null, message};
    }

    async resetUserPassword(body) {
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.BM_USER_PASSWORD_RESET}(
        :SPAppAccessID,
        :SPOldPassword,
        :SPNewPassword,
        :SPResetPasswordBy,
        @rcode, @rmessage)`, {
            replacements: {
                SPAppAccessID: +body.appAccessID,
                SPOldPassword: body.oldPassword,
                SPNewPassword: body.newPassword,
                SPResetPasswordBy: body.resetPasswordBy,
            },
            type: sequelize.QueryTypes.UPDATE,
        }).then(async () => {
            await sequelize.query('select @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                message = data[0].message;
            })
        })
        return {data: null, message};
    }

    async getUserStateAssignManage(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_STATE_ASSIGN}(
        :SPViewMode,
        :SPUStateID,
        @SPUserStateID,
        :SPAppAccessID,
        :SPStateID,
        @SPStateMasterID,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUStateID: body.userStateID,
                SPStateID: body.stateMasterID,
                SPAppAccessID: +body.appAccessID,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserStateID AS UserStateID,  @SPStateMasterID AS StateMasterID, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserStateID: data[0].UserStateID, StateMasterID: data[0].StateMasterID};
                } else {
                    items = {UserStateAssignManage: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getUserDistrictAssignManage(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_DISTRICT_ASSIGN}(
        :SPViewMode,
        :SPUDistrictID,
        @SPUserDistrictID,
        :SPAppAccessID,
        :SPStateMasterID,
        :SPDistrictCode,
        @SPDistrictMasterCode,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUDistrictID: body.uDistrictID,
                SPUserDistrictID: body.userDistrictID,
                SPAppAccessID: +body.appAccessID,
                SPStateMasterID: +body.stateMasterID,
                SPDistrictCode: body.districtCode,
                SPDistrictMasterCode: body.districtMasterCode,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserDistrictID AS UserDistrictID,  @SPDistrictMasterCode AS DistrictMasterCode, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserDistrictID: data[0].UserDistrictID, DistrictMasterCode: data[0].DistrictMasterCode};
                } else {
                    items = {UserDistrictAssignManage: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getUserSubDistrictAssignManage(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_SUBDISTRICT_ASSIGN}(
        :SPViewMode,
        :SPUSubDistrictID,
        @SPUserSubDistrictID,
        :SPAppAccessID,
        :SPDistrictMasterCode,
        :SPSubDistrictCode,
        @SPSubDistrictMasterCode,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUSubDistrictID: body.uSubDistrictID,
                SPUserSubDistrictID: body.userSubDistrictID,
                SPAppAccessID: +body.appAccessID,
                SPDistrictMasterCode: body.districtMasterCode,
                SPSubDistrictCode: body.subDistrictCode,
                SPSubDistrictMasterCode: body.subDistrictMasterCode,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserSubDistrictID AS UserSubDistrictID,  @SPSubDistrictMasterCode AS SubDistrictMasterCode, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserSubDistrictID: data[0].UserSubDistrictID, SubDistrictMasterCode: data[0].SubDistrictMasterCode};
                } else {
                    items = {UserSubDistrictAssignManage: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    async getUserBlockAssignManage(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_BLOCK_ASSIGN}(
        :SPViewMode,
        :SPUBlockID,
        @SPUserBlockID,
        :SPAppAccessID,
        :SPSubDistrictMasterCode,
        :SPBlockCode,
        @SPBlockMasterCode,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUBlockID: body.uBlockID,
                SPUserBlockID: body.userBlockID,
                SPAppAccessID: +body.appAccessID,
                SPSubDistrictMasterCode: body.subDistrictMasterCode,
                SPBlockCode: body.blockCode,
                SPBlockMasterCode: body.blockMasterCode,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserBlockID AS UserBlockID,  @SPBlockMasterCode AS BlockMasterCode, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserBlockID: data[0].UserBlockID, BlockMasterCode: data[0].BlockMasterCode};
                } else {
                    items = {UserBlockAssignManage: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }
    
    async getUserInsuranceAssignManage(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_INSURANCE_ASSIGN_MANAGE}(
        :SPViewMode,
        :SPUInsuranceID,
        @SPUserInsuranceID,
        :SPAppAccessID,
        :SPInsuranceID,
        @SPInsuranceCompanyID,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUInsuranceID: body.userInsuranceID,
                SPInsuranceID: body.insuranceCompanyID,
                SPAppAccessID: +body.appAccessID,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.RAW,
        }).then(async (res) => {
            await sequelize.query('select @SPUserInsuranceID AS UserInsuranceID, @SPInsuranceCompanyID AS InsuranceCompanyID, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserInsuranceID: data[0].UserInsuranceID, InsuranceCompanyID: data[0].InsuranceCompanyID}
                } else {
                    items = {UserStateAssignManage: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    async userProfileMenuAssign(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_PROFILE_MENU_ASSIGN_MANAGE}(
       :SPProfileID,
       @SPProfileMenuID,
       :SPUserProfileID,
        :SPViewMode,
        :SPModuleCode,
        :SPMenuMasterID,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPProfileID: +body.profileMenuID,
                SPUserProfileID: +body.userProfileID,
                SPViewMode: body.viewMode,
                SPModuleCode: +body.moduleCode,
                SPMenuMasterID: +body.menuMasterID,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.UPSERT,
        }).then(async (res) => {
            await sequelize.query('select @SPProfileMenuID AS ProfileMenuID, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'AssignMenu' || body.viewMode === 'UNAssignMenu') {
                    items = {ProfileMenuID: data[0].ProfileMenuID}
                } else {
                    items = {UserProfileMenu: res};
                }
                message = data[0].message;
            })
        })
        return {data: items, message};
    }

    async userCategoryAssignManageNode(body) {
        let items = {};
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.USER_CATEGORY_ASSIGN_MANAGE}(
       :SPViewMode,
       :SPUCategoryID,
       @SPUserCategoryID,
       :SPAppAccessID,
        :SPSupportTicketTypeID,
        :SPTCategoryID,
        @SPTicketCategoryID,
        :SPInsertUserID,
        :SPInsertIPAddress,
        @rcode, @rmessage)`, {
            replacements: {
                SPViewMode: body.viewMode,
                SPUCategoryID: +body.uCategoryId,
                SPAppAccessID: +body.appAccessId,
                SPSupportTicketTypeID: +body.supportTicketTypeId,
                SPTCategoryID: body.tCategoryId,
                SPInsertUserID: +body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
            },
            type: sequelize.QueryTypes.INSERT,
        }).then(async (res) => {
            await sequelize.query('select @SPUserCategoryID AS UserCategoryID, @SPTicketCategoryID as TicketCategoryID, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                if (body.viewMode === 'ASSIGN') {
                    items = {UserCategoryID: data[0].UserCategoryID, TicketCategoryID: data[0].TicketCategoryID}
                } else {
                    items = {UserCategoryAssign: res};
                }

                message = data[0].message;
            })
        })
        return {data: items, message};
    }
}
