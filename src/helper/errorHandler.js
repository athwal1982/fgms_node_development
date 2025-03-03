import replace from "lodash/replace.js";
import {constant} from "../constants/constant.js";

export const jsonErrorHandler = (err, req, res, next) => {
	if (typeof err.code === 'string' && (err.code.startsWith('42') || err.code.startsWith('22'))) {
		err.message = 'Internal server error: Database error during request'
	}
	const message = err.message.replace('Error: ', '');


	return res.json({
		responseObject: null,
		responseDynamic: null,
		responseCode: "0",
		responseMessage: message,
		jsonString: null,
		recordCount: 0
	})
}

export const joiErrorHandler = (error) => {
	let errors = [];
	if (error && error.details.length !== 0) {
		error.details.map((err) => {
			const message = replace(err.message, new RegExp("\"", "g"), '');
			const key = err.context.key;
			errors.push({
				field: key,
				message: message
			})
		})
	}
	return errors;
}

export const jsonResponseHandler = (data, message, req, res, next) => {
	const messages = message?.msg || message;
	res.status(200).send({
		responseObject: null,
		responseDynamic: data || null,
		responseCode: message?.code || "1",
		responseMessage:  messages || constant.ResponseStatus.SUCCESS,
		jsonString: null,
		recordCount: 0
	})
}

export const jsonResponseHandlerOther = (data, totalPages, message, req, res, next) => {
	console.log(data)
    const messages = message?.msg || message;
	let newData = data
	
   
    res.status(200).send({
        responseObject: null,
        responseDynamic: newData || null,
        responseCode: message?.code || "1",
        responseMessage: messages || constant.ResponseStatus.SUCCESS,
        jsonString: null,
        totalPages: totalPages,      
    });
};

