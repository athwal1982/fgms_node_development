

import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {AgentTrainingService} from "./agentTrainingService.js";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";

export class AgentTrainingController {

    constructor() {
        this.utilService = new UtilService()
        this.agentTrainingService = new AgentTrainingService()
    }

   

    GetAgentRegion = async (req, res) => {
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

    UpdateAgent = async (req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.updateAgent(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    AgentList = async (req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.agentList(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }


    UpdateStatus = async (req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.updateStatus(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    CreateTraining = async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.CreateTraining(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    UpdateTraining = async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.UpdateTraining(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    AssignedTrainingToUsers = async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.assignTrainingToUsers(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    GetTrainingType = async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.GetTrainingType(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    GetTrainingList= async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.GetTrainingList(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    GetCenterList= async(req, res)=>{
        try{
            let {data, message}= await this.agentTrainingService.CenterList(req.body);
            if (data) data = await this.utilService.GZip(data);

            return jsonResponseHandler(data, message, req, res, () => {
            })
        }catch(err){
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }


    




}