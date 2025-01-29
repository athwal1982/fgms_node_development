import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {UserProfileRightsService} from "./userProfileRightsService.js";
import {UtilService} from "../../helper/utilService.js";

export class UserProfileRightsController {
    constructor() {
        this.utilService = new UtilService()
        this.userRightService = new UserProfileRightsService()
    }

    getUserProfileRight = async (req, res) => {
        try {

            let {data, message} = await this.userRightService.getUserProfileRight(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getUserProfileRightAssign = async (req, res) => {
        try {

            let {data, message} = await this.userRightService.getUserProfileRightAssign(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getUserRight = async (req, res) => {
        try {

            let {data, message} = await this.userRightService.getUserRight(req.body)

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
