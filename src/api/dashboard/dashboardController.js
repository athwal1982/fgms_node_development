import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {DashboardService} from "./dashboardService.js";
import {UtilService} from "../../helper/utilService.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";

export class DashboardController {
    constructor() {
        this.utilService = new UtilService()
        this.dashboardService = new DashboardService()
    }

    getDashBoard = async (req, res) => {
        try {

            let {data, message} = await this.dashboardService.getDashBoard(req.body, STORE_PROCEDURE.DASHBOARD_SELECT)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            // console.log(err);
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getDashBoardInsurance = async (req, res) => {
        try {

            let {data, message} = await this.dashboardService.getDashBoard(req.body, STORE_PROCEDURE.DASHBOARD_INSURANCE_SELECT)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            console.log("err========>>", err);
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
}
