import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {InsuranceMasterService} from "./insuranceMasterService.js";
import {UtilService} from "../../helper/utilService.js";

export class InsuranceMasterController {
    constructor() {
        this.utilService = new UtilService()
        this.insuranceMasterService = new InsuranceMasterService()
    }

    getInsuranceMaster = async (req, res) => {
        try {

            let {data, message} = await this.insuranceMasterService.getInsuranceMaster(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addInsuranceMaster = async (req, res) => {
        try {

            let {data, message} = await this.insuranceMasterService.addInsuranceMaster(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
updateInsuranceMaster = async (req, res) => {
        try {

            let {data, message} = await this.insuranceMasterService.updateInsuranceMaster(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    isActiveInsuranceMaster = async (req, res) => {
        try {

            let {data, message} = await this.insuranceMasterService.isActiveInsuranceMaster(req.body)

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
