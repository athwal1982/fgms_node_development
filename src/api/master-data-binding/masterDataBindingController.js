import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {MasterDataBindingService} from "./masterDataBindingService.js";
import {UtilService} from "../../helper/utilService.js";

export class MasterDataBindingController {
    constructor() {
        this.utilService = new UtilService()
        this.menuMasterService = new MasterDataBindingService()
    }
    
  
    masterDataBinding = async (req, res) => {
        try {

            let {data, message} = await this.menuMasterService.krphmasterDataBinding(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    ticketDataBinding= async (req, res) => {
        try {

            let {data, message} = await this.menuMasterService.ticketDataBinding(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    uploadInvoiceData= async (req, res) => {
        try {

            let {data, message} = await this.menuMasterService.uploadInvoiceData(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getUploadedInvoiceData = async (req, res) => {
        try {
console.log("req.body",req.body);
            let {data, message} = await this.menuMasterService.getUploadedInvoiceData(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    locationmasterDataBinding = async (req, res) => {
        try {

            let {data, message} = await this.menuMasterService.locationmasterDataBinding(req.body)

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
