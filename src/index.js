import cors from 'cors';
import bodyParser from 'body-parser';
import {joiErrorHandler, jsonErrorHandler} from "./helper/errorHandler.js";
import {authRouter} from "./api/auth/authRouter.js";
import {farmerloginRouter} from "./api/farmerlogin/farmerloginRouter.js";
import express from "express";
import {sequelize} from "./database/index.js";
import swaggerUi from "swagger-ui-express";
import {userRouter} from "./api/user/userRouter.js";
import {readFileSync} from "fs";
import {masterDataApiRouter} from "./api/master-data-api/masterDataApiRouter.js";
import {checkFarmerRouter} from "./api/check-farmer/checkFarmerRouter.js";
import {menuMasterRouter} from "./api/menu-master/menuMasterRouter.js";
import {masterDataBindingRouter} from "./api/master-data-binding/masterDataBindingRouter.js";
import {regionalOfficeRouter} from "./api/regional-office/regionalOfficeRouter.js";
import {insuranceMasterRouter} from "./api/insurance-master/insuranceMasterRouter.js";
import {dashboardRouter} from "./api/dashboard/dashboardRouter.js";
import {userProfileRightsRouter} from "./api/user-profile-rights/userProfileRightsRouter.js";
import {supportTicketRouter} from "./api/support-ticket/supportTicketRouter.js";
import {supportTicketCateRouter} from "./api/support-ticket-category/supportTicketCateRouter.js";
import {agentTrainingRouter} from "./api/agent-training/agentTrainingRouter.js";

import {loggingApi} from "./logger.js";
import nodecache from 'node-cache';
const appCache = new nodecache( { stdTTL: 100, checkperiod: 120 } );
const swaggerDocument =  JSON.parse(readFileSync("./swagger.json"));
import colors from 'colors';
import helmet from 'helmet';
const options = {
	swaggerOptions: {
		filter: true
	}
};

(async function main() {
	const app = express()

	app.use(cors())
	// CORS error fix
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200)
		}
		return next()
	})

	
app.use(bodyParser.json({ limit: '50mb' }));

	const router = express.Router();
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))
	
	app.use("/krph_documents", express.static("krph_documents"));
	app.use("/krph_excel", express.static("krph_excel"));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
	app.use('/FGMS', router);
	router.use('/', authRouter)
	router.use('/', farmerloginRouter)	
	router.use('/', userRouter)
	router.use('/', masterDataApiRouter)
	router.use('/', checkFarmerRouter)
	router.use('/', menuMasterRouter)
	router.use('/', masterDataBindingRouter)
	router.use('/', regionalOfficeRouter)
	router.use('/', insuranceMasterRouter)	
	router.use('/', dashboardRouter)
	router.use('/', userProfileRightsRouter)
	router.use('/', supportTicketRouter)
	router.use('/', supportTicketCateRouter)
	router.use('/', agentTrainingRouter)


	app.use((err, req, res, next) => {
		const error = err;
		if (error.message?.toLowerCase() === "no data found") {
			error.httpStatusCode = 404;
		} else if (error?.errorCode) {
			error.httpStatusCode = +error?.errorCode;
		} else if (err && err.error && err.error.isJoi) {
			const errors = joiErrorHandler(err.error);
			error.httpStatusCode = 412;
			error.message = errors[0].message;
		} else {
			error.httpStatusCode = 500;
		}

		return jsonErrorHandler(err, req, res, () => {});
	});

	app.listen(process.env.PORT, () => {
		console.log(`Server running at port http://localhost:${process.env.PORT}`.blue)
		console.log(`Swagger Docs http://localhost:${process.env.PORT}/api-docs`.blue)
	})

	try {
		await sequelize.authenticate()
		console.log('Database connection has been established successfully.'.blue)
	} catch (error) {
		console.error('Unable to connect to the database:'.red, error)
	}
})().catch(err => {
	console.log('Error starting application $s'.red, err.message)
	process.exit(1)
})
