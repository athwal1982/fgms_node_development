import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {MenuMasterService} from "./menuMasterService.js";
import {UtilService} from "../../helper/utilService.js";

export class MenuMasterController {
    constructor() {
        this.utilService = new UtilService()
        this.menuMasterService = new MenuMasterService()
    }

    menuMasterCreate = async (req, res) => {
        try {

            let {data, message} = await this.menuMasterService.menuMasterCreate(req.body)

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
