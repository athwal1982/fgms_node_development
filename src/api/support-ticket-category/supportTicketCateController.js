import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {SupportTicketCateService} from "./supportTicketCateService.js";
import {UtilService} from "../../helper/utilService.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";

export class SupportTicketCateController {
    constructor() {
        this.utilService = new UtilService()
        this.supportTicketCateService = new SupportTicketCateService()
    }

    getUserProfile = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketCateService.getUserProfile(req.body, STORE_PROCEDURE.USER_PROFILE_MASTER_SELECT)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addUserProfile = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketCateService.addUserProfile(req.body, STORE_PROCEDURE.ADD_PROFILE_MASTER_SELECT)

            // compress
            if(data) data = await this.utilService.GZip(data);
console.log(data);
            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    manageUserProfileAssign = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketCateService.manageUserProfileAssign(req.body, STORE_PROCEDURE.USER_PROFILE_ASSIGN_MANAGE)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
}
