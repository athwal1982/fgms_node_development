import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {CheckFarmerService} from "./checkFarmerService.js";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";
import {SupportTicketService} from "../support-ticket/supportTicketService.js";
export class CheckFarmerController {
    constructor() {
        this.utilService = new UtilService()
        this.checkFarmerService = new CheckFarmerService()
        this.supportTicketService = new SupportTicketService();
    }
    
    checkKRPHFarmerByMobileNumber = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.checkKRPHFarmerByMobileNumber(req.body)
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

    checkFarmerByMobileNumber = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.checkFarmerByMobileNumber(req.body)
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

    checkFarmerByDb = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.checkFarmerByDb(req.body)
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

    checkFarmerAddInDb = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.checkFarmerAddInDb(req.body)
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
    checkFarmerUpdateInDb = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.checkFarmerUpdateInDb(req.body)
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
    
    getEnquiryTicket = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.getEnquiryTicketReview(req.body)
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
    
    calculatedPremiumReport = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.calculatedPremiumReport(req.body)
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
    addEnquiryTicket = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.addEnquiryTicketReview(req.body)
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
    addCalculatedPremium    = async (req, res) => {
        try {

            let {data, message} = await this.checkFarmerService.addCalculatedPremium(req.body)
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
    checkFarmerByAccountNumber = async (req, res) => {
        try {
            const body = {
                accountNumber: req.body.accountNumber,
                branchID: req.body.branchID,
            }
            let {data, message} = await this.checkFarmerService.checkFarmer(body, "account")

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

    checkFarmerByAadharNumber = async (req, res) => {
        try {
            const body = {
                aadharID: req.body.aadharID,
            }
            let {data, message} = await this.checkFarmerService.checkFarmer(body, "aadhar")

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

    checkDistrictCropWise = async (req, res) => {
        console.log('CheckDistrictCropWise',req.body);
        try {
            const params = {
                mobile: req.body.mobilenumber,
                districtID: req.body.disctrictID,
                authToken: constant.PM_API_TOKEN,
            }
            let {
                data,
                message
            } = await this.checkFarmerService.checkDistrictCropWise(params, 'fetchCropDetailsByDistrict')

            if (req.body.sssyID) {
                data = data.data.result.filter((el) => el.sssyID === req.body.sssyID)
                console.log(data);
            } else {
                data = data.data;
            }

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

    checkSSSYIDBYDistrict = async (req, res) => {
        const params = {
            mobile: req.body.mobilenumber,
            districtID: req.body.disctrictID,
            authToken: constant.PM_API_TOKEN,
        }
        try {
            let {data, message} = await this.checkFarmerService.checkDistrictCropWise(params, 'fetchsssyIDList')

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

    fetchFarmerApplicationDetail = async (req, res) => {
        try {
            // const yearStr = String(req.body.yearID).slice(-2);
            const payload = {
                mobile: req.body.mobilenumber,
                farmerID: req.body.farmerID,
                season: req.body.seasonID,
                year: req.body.year,
            }
            let {
                data,
                message
            } = await this.checkFarmerService.fetchFarmerDetail(payload, 'fetchClaimDetailsByIDAndsssyID')

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
    getClaimDetail = async (req, res) => {
        try {
            
            const body = {
                year: req.body.year,
                season: req.body.season,
                searchType: req.body.searchType,
                applicationNumber: req.body.applicationNumber,
                branchID: req.body.branchID,
                bankID: req.body.bankID,
                accountNumber: req.body.accountNumber,
                aadharNumber: req.body.aadharNumber,
            }
            let {data, message} = await this.supportTicketService.fetchClaimDetail(body)

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
    fetchInsuranceDetail = async (req, res) => {
        try {
            const payload = {
                mobile: req.body.mobilenumber,
                farmerID: req.body.farmerID,
                season: req.body.seasonID,
                year: req.body.year,
            }
            let {
                data,
                message
            } = await this.checkFarmerService.fetchFarmerDetail(payload, 'fetchClaimDetailsByIDAndsssyID')

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

}
