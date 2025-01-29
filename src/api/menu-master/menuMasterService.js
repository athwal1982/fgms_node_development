import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";

export class MenuMasterService {

    constructor() {
        this.utilService = new UtilService();
    }

    async menuMasterCreate(body) {
        let users = [];
        let message = '';
        await sequelize.query(`CALL ${STORE_PROCEDURE.MENU_MASTER_CREATE}(
        @SPMenuMasterID,
        :SPMenuMasterID,
        :SPMenuName,
        :SPUnderMenuID,
        :SPMenuSequence,
        :SPModuleMasterID,
        :SPMenuType,
        :SPWebURL,
        :SPWinURL,
        :SPAppURL,
        :SPAPIURL,
        :SPWPFURL,
        :SPReactURL,
        :SPInsertUserID,
        :SPInsertIPAddress,
        :SPHasChild,
        @rcode, @rmessage)`, {
            replacements: {
                SPMenuMasterID: body.menuMasterID,
                SPMenuName: body.menuName,
                SPUnderMenuID: body.underMenuID,
                SPMenuSequence: body.menuSequence,
                SPModuleMasterID: body.moduleMasterID,
                SPMenuType: body.menuType,
                SPWebURL: body.webURL,
                SPWinURL: body.winURL,
                SPAppURL: body.appURL,
                SPAPIURL: body.apiurl,
                SPWPFURL: body.wpfurl,
                SPReactURL: body.reactURL,
                SPInsertUserID: body.objCommon.insertedUserID,
                SPInsertIPAddress: body.objCommon.insertedIPAddress,
                SPHasChild: body.hasChild,
            },
            type: sequelize.QueryTypes.UPSERT,
        }).then(async (res) => {
            await sequelize.query('select @SPMenuMasterID AS menuMasterId, @rcode AS code, @rmessage AS message').then((result) => {
                const data = flatMap(result);
                if (+data[0].code === 0) {
                    throw new Error(data[0].message)
                }
                users = res;
                message = data[0].message;
            })
        })
        return {data: users, message};
    }
}
