
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

    
    async updateAgent(body) {
        let items = {};
        let rcode = 0;
        let rmessage = '';
        try {
            await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_UPDATE_AGENT} ( 
                :SPUserRefId, :SPDOB, :SPMobileNumber, :SPQualification, :SPExperience,
                :SPDesignation, :SPRegion, :SPState, :SPCity, :SPLocation, 
                @rcode, @rmessage
            )`, {
                replacements: {
                    SPUserRefId: body.SPUserRefId,
                    SPDOB: body.SPDOB,
                    SPMobileNumber: body.SPMobileNumber,
                    SPQualification: body.SPQualification,
                    SPExperience: body.SPExperience,
                    SPDesignation: body.SPDesignation,
                    SPRegion: body.SPRegion,
                    SPState: body.SPState,
                    SPCity: body.SPCity,
                    SPLocation: body.SPLocation
                },
                type: sequelize.QueryTypes.RAW
            }).then(async () => {
                await sequelize.query(`SELECT @rcode AS code, @rmessage AS message`).then((result) => {
                    const data = flatMap(result);
                    rcode = +data[0].code;
                    rmessage = data[0].message;
    
                    if (rcode !== 1) {
                        throw new Error(rmessage);
                    }
    
                    items = data;
                });
            });
        } catch (err) {
            console.error(err);
            throw new Error('Something Went Wrong!');
        }
    
        return { data: items, message: rmessage };
    }


    // async agentList(body) {
    //     let items = {};
    //     let rcode = 0;
    //     let rmessage = '';
    //     try {
    //         await sequelize.query(`CALL
    //              ${STORE_PROCEDURE.FGMS_LIST_AGENT} (  
    //             @rcode, @rmessage
    //         )`, {
    //             replacements: {},
    //             type: sequelize.QueryTypes.RAW
    //         }).then(async () => {
    //             await sequelize.query(`SELECT @rcode AS code, @rmessage AS message`).then((result) => {
    //                 console.log(result)
    //                 const data = flatMap(result);
    //                 rcode = +data[0].code;
    //                 rmessage = data[0].message;
    
    //                 if (rcode !== 1) {
    //                     throw new Error(rmessage);
    //                 }
    
    //                 items = data;
    //             });
    //         });
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Something Went Wrong!');
    //     }
    
    //     return { data: items, message: rmessage };
    // }

    // async agentList(body) {
    //     let items = {};
    //     let rcode = 0;
    //     let rmessage = '';
    //     let newItem = {};
    //     try {
    //         // Destructure pagination params from the body
    //         const { page_size, page_number } = body;
    
    //         // Validate the pagination parameters (optional)
    //         if (!page_size || !page_number || page_size <= 0 || page_number <= 0) {
    //             throw new Error("Invalid pagination parameters");
    //         }
    
    //         // Call the stored procedure with pagination params
    //         const res = await sequelize.query(`CALL ${STORE_PROCEDURE.FGMS_LIST_AGENT}(:page_size, :page_number, @rcode, @rmessage)`, {
    //             replacements: { page_size, page_number },
    //             type: sequelize.QueryTypes.RAW
    //         });
    
    //         // Prepare the result
    //         newItem = {
    //             traineeList: res
    //         };
    
    //         // Fetch the output values (rcode, rmessage)
    //         const result = await sequelize.query(`SELECT @rcode AS code, @rmessage AS message`, {
    //             type: sequelize.QueryTypes.RAW
    //         });
    
    //         // Extract rcode and rmessage
    //         const data = result[0];
    //         rcode = +data.code;
    //         rmessage = data.message;
    
    //         // If the code indicates failure, throw an error
    //         if (rcode !== 1) {
    //             throw new Error(rmessage);
    //         }
    
    //         // Set the response items
    //         items = newItem;
    
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Something Went Wrong!');
    //     }
        
    //     // Return the result along with the message
    //     return { data: items, message: rmessage };
    // }


    // async agentList(body) {
    //     let items = {};
    //     let rcode = 0;
    //     let rmessage = '';
    //     let newItem = {};
    //     try {
    //         const { page_size, page_number } = body;
    
    //         if (!page_size || !page_number || page_size <= 0 || page_number <= 0) {
    //             throw new Error("Invalid pagination parameters");
    //         }
    
    //         const res = await sequelize.query(`
    //             CALL ${STORE_PROCEDURE.FGMS_LIST_AGENT}(
    //                 :page_size,
    //                 :page_number,
    //                 @totalPages
    //                 @rcode,
    //                 @rmessage
    //             )`, {
    //             replacements: { page_size, page_number },
    //             type: sequelize.QueryTypes.RAW
    //         });
    // console.log(res, "res")
    //         const result = await sequelize.query(`
    //             SELECT @rcode AS code, @rmessage AS message
    //         `, {
    //             type: sequelize.QueryTypes.RAW
    //         });
    //         let data = result[0];
    //         data = data[0]
    //         console.log(data, "sss")

    //         rcode = +data.code;
    //         rmessage = data.message;
    //         if (rcode !== 1) {
    //             throw new Error(rmessage);
    //         }
    //         newItem = {
    //             traineeList: res
    //         };
    //         items = newItem;
    
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error('Something Went Wrong!');
    //     }
    
    //     return { data: items, message: rmessage };
    // }
    
    
    async agentList(body) {
        let items = {};
        let rcode = 0;
        let rmessage = '';
        let totalPages = 0;
        let newItem = {};
        
        try {
            const { page_size, page_number, searchQuery, viewMode, userId } = body;
    
            if (!page_size || !page_number || page_size <= 0 || page_number <= 0) {
                throw new Error("Invalid pagination parameters");
            }
    
            if (viewMode === 'BYID' && (!userId || userId === '')) {
                throw new Error("UserID is required for viewMode 'BYID'");
            }
    
            const res = await sequelize.query(`
                CALL krph_agent_list_new(
                    :page_size,
                    :page_number,
                    :searchQuery,
                    :viewMode,
                    :userId,
                    @rcode,
                    @rmessage,
                    @totalPages
                );
            `, {
                replacements: { page_size, page_number, searchQuery, viewMode, userId },
                type: sequelize.QueryTypes.RAW
            });
    
            const result = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message, @totalPages AS totalPages
            `, {
                type: sequelize.QueryTypes.RAW
            });
    
            let data = result[0];
            data = data[0];
    
            rcode = +data.code;
            rmessage = data.message;
            totalPages = data.totalPages;
    
            if (rcode !== 1) {
                throw new Error(rmessage);
            }
    
            newItem = {
                agentList: res,
                totalPages: totalPages
            };
            items = newItem;
    
        } catch (err) {
            console.error(err);
            throw new Error('Something Went Wrong!');
        }
    
        return { data: items, message: rmessage };
    }
    
    
    
    
}