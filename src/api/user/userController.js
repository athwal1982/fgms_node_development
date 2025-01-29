import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {UserService} from "./userService.js";
import {constant} from "../../constants/constant.js";
import {UtilService} from "../../helper/utilService.js";

export class UserController {
    constructor() {
        this.utilService = new UtilService()
        this.userService = new UserService()
    }

    getUsers = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUsers(req.body)

            // compress
            data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addUsers = async (req, res) => {
        try {

            let {data, message} = await this.userService.addUsers(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    updateUserStatus = async (req, res) => {
        try {

            let {data, message} = await this.userService.updateUserStatus(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    resetUserPassword = async (req, res) => {
        try {

            let {data, message} = await this.userService.resetUserPassword(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getUserStateAssignManage = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUserStateAssignManage(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getUserDistrictAssignManage = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUserDistrictAssignManage(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getUserSubDistrictAssignManage = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUserSubDistrictAssignManage(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getUserBlockAssignManage = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUserBlockAssignManage(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getUserInsuranceAssignManage = async (req, res) => {
        try {

            let {data, message} = await this.userService.getUserInsuranceAssignManage(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    userProfileMenuAssign = async (req, res) => {
        try {

            let {data, message} = await this.userService.userProfileMenuAssign(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    userCategoryAssignManageNode = async (req, res) => {
        try {
            let {data, message} = await this.userService.userCategoryAssignManageNode(req.body)
            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

}
