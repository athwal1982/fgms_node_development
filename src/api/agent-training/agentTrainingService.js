
import {UtilService} from "../../helper/utilService.js";
import axios from "axios";
import {constant} from "../../constants/constant.js";
import {sequelize} from "../../database";
import flatMap from "lodash/flatMap";
import {STORE_PROCEDURE} from "../../constants/db_tables";
import https from "https";
import {loggingApi} from "../../logger.js";
import('dotenv').config;




export class AgentTrainingService {
    constructor() {
        this.utilService = new UtilService();
    }


    async getAgentRegion(body) {
        let items = {};
        let message = '';
        let rcode = 0; 
        let rmessage = '';
    
        try {
            await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_GET_REGION}(
                
                @rcode, @rmessage,@SPRecordCount
            )`, {
                replacements: {},
                type: sequelize.QueryTypes.RAW,
            }).then(async (res) => {
                await sequelize.query(`SELECT @SPRecordCount AS recordCount, @rcode AS code, @rmessage AS message`).then((result) => {
                    const data = flatMap(result);
                    
                    rcode = +data[0].code;
                    rmessage = data[0].message;
    
                    if (rcode !== 1) {
                        throw new Error(rmessage);
                    }
    
                    items = res;
                });
            });
        } catch (err) {
            console.log(err);
            throw new Error('Something Went Wrong!');
        }
    
        return {
            data: { regions: items },
            message: rmessage,
        };
    }
    
}