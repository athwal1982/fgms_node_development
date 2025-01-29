import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler.js"
import {FarmerloginService} from "./farmerloginService.js";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";

export class FarmerloginController {
	constructor() {
		this.farmerloginService = new FarmerloginService()
		this.utilService = new UtilService()
	}
	farmerLoginByMobileNumber = async (req, res) => {
        try {

            let {data, message} = await this.farmerloginService.farmerLoginByMobileNumber(req.body)
            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	getFarmerTicketsListIndex = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerTicketsListIndex(req.body, STORE_PROCEDURE.FARMER_LOGIN_SUPPORT_TICKET_VIEW_CSC_INDEX)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	farmerGenerateSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.farmerloginService.farmerGenerateSupportTicket(req)

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
