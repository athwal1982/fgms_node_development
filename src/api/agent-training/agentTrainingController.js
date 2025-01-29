

import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {AgentTrainingService} from "./agentTrainingService.js";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";

export class AgentTrainingController {

    constructor() {
        this.utilService = new UtilService()
        this.agentTrainingService = new AgentTrainingService()
    }

   

    getAgentRegion = async (req, res) => {
        try {

            let {data, message} = await this.agentTrainingService.getAgentRegion(req.body)
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
}