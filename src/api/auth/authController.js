import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler.js"
import {AuthService} from "./authService";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";

export class AuthController {
	constructor() {
		this.authService = new AuthService()
		this.utilService = new UtilService()
	}
	cscInboundVoiceApi= async (req, res) => {
		try {
			const user = await this.authService.cscInboundVoiceApi(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	cscInboundVoiceSelectApi= async (req, res) => {
		try {
			const user = await this.authService.cscInboundVoiceSelectApi(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	getTicketStatusChatBot = async (req, res) => {
        try {

            let {data, message} = await this.authService.getTicketStatusChatBot(req.body)

            // compress
         //   if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
			console.log('errrement',err);
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
   
	diffUsersLogin= async (req, res) => {
		try {
			const user = await this.authService.diffUsersLogin(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	cSCAgentLogin= async (req, res) => {
		try {
			const user = await this.authService.cSCAgentLogin(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	getTime = async (req, res) => {
		try {
			const user = await this.authService.getTime(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	supportTicketMongoDBSYNC = async (req, res) => {
        try {
console.log('req',req);
            let {data, message} = await this.authService.supportTicketMongoDBSYNC(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	getSupportTicketUserDetail = async (req, res) => {
		try {
			const user = await this.authService.getSupportTicketUserDetail(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	prepareDBByMobileNumber = async (req, res) => {
		try {
			const user = await this.authService.prepareDBByMobileNumber(req.body)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	logIn = async (req, res) => {
		console.log('reqlogin',req.body);
		const username = req.body.appAccessUID
		const password = req.body.appAccessPWD
		const insertedIPAddress = req.body.objCommon.insertedIPAddress
		try {
			const user = await this.authService.login(username, password,insertedIPAddress)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	intial= async (req, res) => {
        try {

            let {data, message} = await this.authService.intial(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	logOut= async (req, res) => {
        try {

            let {data, message} = await this.authService.logOut(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	forget = async (req, res) => {
		
		const username = req.body.appAccessUserName
		
		try {
			const user = await this.authService.forget(username)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}

	resetForgetPassword = async (req, res) => {
        try {

            let {data, message} = await this.authService.resetForgetPassword(req.body)

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
	otpValidate = async (req, res) => {
		const username = req.body.appAccessUserName
		const otp = req.body.otp
		try {
			const user = await this.authService.otpValidate(username,otp)

			// compress
			const data = await this.utilService.GZip(user);

			// return response
			return jsonResponseHandler(data, constant.ResponseStatus.SUCCESS, req, res, () => {})
		} catch (err) {
			return jsonErrorHandler(err, req, res, () => {})
		}
	}
	
	addCSCUser= async (req, res) => {
		console.log('reqreq',req);
        try { 	
console.log('reqreq',req);
            let {data, message} = await this.authService.addCSCUser(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
	}
	pushVoiceAPIResponse= async (req, res) => {
		console.log('reqreq',req);
        try { 	
console.log('reqreq',req);
            let {data, message} = await this.authService.pushVoiceAPIResponse(req.body)

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
