import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {RegionalOfficeService} from "./regionalOfficeService.js";
import {UtilService} from "../../helper/utilService.js";

export class RegionalOfficeController {
    constructor() {
        this.utilService = new UtilService()
        this.regionalOfficeService = new RegionalOfficeService()
    }

    getRegionalOfficeMaster = async (req, res) => {
        try {

            let {data, message} = await this.regionalOfficeService.getRegionalOfficeMaster(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addRegionalOfficeMaster = async (req, res) => {
        try {

            let {data, message} = await this.regionalOfficeService.addRegionalOfficeMaster(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getRegionalStateAssignmentManage = async (req, res) => {
        try {

            let {data, message} = await this.regionalOfficeService.getRegionalStateAssignmentManage(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    userRegionalAssignmentManage = async (req, res) => {
        try {

            let {data, message} = await this.regionalOfficeService.userRegionalAssignmentManage(req.body)

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
