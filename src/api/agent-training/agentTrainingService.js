
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
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
        
        try {
            const result = await sequelize.query(`
                CALL ${STORE_PROCEDURE.FGMS_UPDATE_AGENT} (
                    :SPUserRefId, :SPDOB, :SPMobileNumber, :SPQualification, :SPExperience,
                    :SPDesignation, :SPGender, :SPEmail, @rcode, @rmessage
                )`, {
                replacements: {
                    SPUserRefId: body.SPUserRefId,
                    SPDOB: body.SPDOB,
                    SPMobileNumber: body.SPMobileNumber,
                    SPQualification: body.SPQualification,
                    SPExperience: body.SPExperience,
                    SPDesignation: body.SPDesignation,
                    SPGender: body.SPGender,
                    SPEmail: body.SPEmail,  
                },
                type: sequelize.QueryTypes.RAW,
            });
    
            const outputResult = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message
            `, {
                type: sequelize.QueryTypes.SELECT
            });
    
            const data = outputResult[0];
            rcode = +data.code;
            rmessage = data.message;
    
            if (rcode !== 1) {
                throw new Error(rmessage);
            }
    
            items = data;
    
        } catch (err) {
            console.error(err);
            throw new Error('Something Went Wrong!');
        }
    
        return { data: items, message: rmessage };
    }
    
    

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
    
            // First, call the stored procedure to get the result
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
    
            // Now, query the output parameters
            const result = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message, @totalPages AS totalPages
            `, {
                type: sequelize.QueryTypes.RAW
            });
    
            // Extract output parameter values
            const data = result[0][0];  // Assuming the first row contains the output values
            rcode = +data.code;
            rmessage = data.message;
            totalPages = data.totalPages;
    
            // If procedure failed, return the error message
            if (rcode !== 1) {
                throw new Error(rmessage);
            }
    
            // Prepare the response data
            newItem = {
                traineeList: res,  // res[0] contains the result set from the procedure
                totalPages: totalPages
            };
            items = newItem;
    
        } catch (err) {
            console.error(err);
            throw new Error('Something Went Wrong!');
        }
    
        return { data: items, message: rmessage };
    }


    async updateStatus(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
        
        try {
            const result = await sequelize.query(`
                CALL ${STORE_PROCEDURE.FGMS_STATUS_UPDATE} (
                    :SPUserRefId, :SPStatus, @rcode, @rmessage
                )`, {
                replacements: {
                    SPUserRefId: body.SPUserRefId,
                    SPStatus: body.SPStatus  
                },
                type: sequelize.QueryTypes.RAW,
            });
    
            const outputResult = await sequelize.query(`
                SELECT @rcode AS code, @rmessage AS message
            `, {
                type: sequelize.QueryTypes.SELECT
            });
    
            const data = outputResult[0];
            rcode = +data.code;
            rmessage = data.message;
    
            if (rcode !== 1) {
                throw new Error(rmessage);
            }
    
            items = data;
    
        } catch (err) {
            console.error(err);
            throw new Error('Something Went Wrong!');
        }
    
        return { data: items, message: rmessage };
    }
    

    // async CreateTraining(body) {
    //     console.log(body, "test");
    //     let items = {};
    //     let rcode = 0;
    //     let rmessage = '';
    
    //     const {
    //         TrainingHeaderName,
    //         StartDate,
    //         EndDate,
    //         InsertedUserId,
    //         UpdateBy,
    //         InsertIPAddress,
    //     } = body;
    
    //     if (!TrainingHeaderName) {
    //         throw new Error('TrainingHeaderName is required');
    //     }
    
    //     if (!StartDate) {
    //         throw new Error('StartDate is required');
    //     }
    
    //     if (!EndDate) {
    //         throw new Error('EndDate is required');
    //     }
    
    //     if (!InsertedUserId) {
    //         throw new Error('InsertedUserId is required');
    //     }
    
    //     if (!InsertIPAddress) {
    //         throw new Error('InsertIPAddress is required');
    //     }
    
    //     if (new Date(StartDate) >= new Date(EndDate)) {
    //         throw new Error('StartDate must be before EndDate');
    //     }
    
    //     try {
    //         const query = `
    //             INSERT INTO csc_training_master (
    //                 TrainingHeaderName,
    //                 StartDate,
    //                 EndDate,
    //                 InsertedUserId,
    //                 UpdateBy,
    //                 UpdateDateTime,
    //                 InsertedDateTime,
    //                 InsertIPAddress
    //             ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)
    //         `;
    
    //         const [result] = await sequelize.query(query, {
    //             replacements: [
    //                 TrainingHeaderName,
    //                 StartDate,
    //                 EndDate,
    //                 InsertedUserId,
    //                 UpdateBy || null,
    //                 InsertIPAddress,
    //             ],
    //         });
    
    //         rcode = 1;
    //         rmessage = 'Training created successfully';
    //         items = { insertId: result.insertId };
    
    //     } catch (error) {
    //         console.error('Error creating training:', error.message);
    //         rcode = 0;
    //         rmessage = error.message || 'Something Went Wrong!';
    //         throw new Error(rmessage);
    //     }
    
    //     return { data: items, message: rmessage };
    // }

    async CreateTraining(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
    
        const {
            TrainingTypeID,
            TrainingDate,  // Renamed from StartDate
            StartTime,
            EndTime,
            InsertedUserId,
            UpdateBy,
            InsertIPAddress,
        } = body;
    
        if (!TrainingTypeID) {
            throw new Error('TrainingTypeID is required');
        }
    
        if (!TrainingDate) {
            throw new Error('TrainingDate is required');
        }
    
        if (!InsertedUserId) {
            throw new Error('InsertedUserId is required');
        }
    
        if (!InsertIPAddress) {
            throw new Error('InsertIPAddress is required');
        }
    
        // Validate that StartTime is before EndTime if both are provided
        if (StartTime && EndTime && new Date(`1970-01-01T${StartTime}Z`) >= new Date(`1970-01-01T${EndTime}Z`)) {
            throw new Error('StartTime must be before EndTime');
        }
    
        try {
            // Insert training record into the database
            const query = `
                INSERT INTO csc_training_master (
                    TrainingTypeID,
                    TrainingDate,  -- Use the new TrainingDate column
                    StartTime,
                    EndTime,
                    InsertedUserId,
                    UpdateBy,
                    UpdateDateTime,
                    InsertedDateTime,
                    InsertIPAddress
                ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
            `;
    
            const [result] = await sequelize.query(query, {
                replacements: [
                    TrainingTypeID,
                    TrainingDate,
                    StartTime || null,
                    EndTime || null,
                    InsertedUserId,
                    UpdateBy || null,
                    InsertIPAddress,
                ],
            });
    
            rcode = 1;
            rmessage = 'Training created successfully';
            items = { insertId: result.insertId };
    
        } catch (error) {
            console.error('Error creating training:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something went wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    }
    




    async assignTrainingToUsers(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
    
        const { TrainingMasterId, UserIds, InsertedIPAddress } = body;
    
        if (!TrainingMasterId) {
            throw new Error('TrainingMasterId is required');
        }
    
        if (!UserIds) {
            throw new Error('UserIds is required');
        }
    
        const userIdsArray = UserIds.split(',').map(userId => userId.trim());
    
        if (userIdsArray.length === 0) {
            throw new Error('UserIds cannot be empty');
        }
    
        if (!InsertedIPAddress) {
            throw new Error('InsertedIPAddress is required');
        }
    
        try {
            const query = `
                INSERT INTO csc_training_assigment (
                    TrainingMasterId,
                    UserId,
                    InsertedDateTime,
                    InsertedIPAddress
                ) VALUES ?
            `;
    
            const values = userIdsArray.map(userId => [
                TrainingMasterId,
                userId,
                new Date(),
                InsertedIPAddress,
            ]);
    
            const [result] = await sequelize.query(query, {
                replacements: [values],
            });
    
            rcode = 1;
            rmessage = 'Training assigned to users successfully';
            items = { affectedRows: result.affectedRows };
    
        } catch (error) {
            console.error('Error assigning training to users:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something Went Wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    }

    async UpdateTraining(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
        const {
            TrainingMasterId,
            StartDate,
            EndDate,
            UpdateBy,
        } = body;
    
        // Check if required fields are provided
        if (!TrainingMasterId) {
            throw new Error('TrainingMasterId is required for update');
        }
        if (!StartDate) {
            throw new Error('StartDate is required');
        }
        if (!EndDate) {
            throw new Error('EndDate is required');
        }
    
        // Ensure StartDate is before EndDate
        if (new Date(StartDate) >= new Date(EndDate)) {
            throw new Error('StartDate must be before EndDate');
        }
    
        try {
            // Check if the training exists in the database
            const checkQuery = `
                SELECT 1 FROM csc_training_master WHERE TrainingMasterId = ?
            `;
            const [checkResult] = await sequelize.query(checkQuery, {
                replacements: [TrainingMasterId],
            });
    
            // If no record is found with the given TrainingMasterId
            if (checkResult.length === 0) {
                rcode = 0;
                rmessage = 'No training found with the provided TrainingMasterId';
                return { data: items, message: rmessage };
            }
    
            // Proceed to update the training record if it exists
            const query = `
                UPDATE csc_training_master
                SET StartDateTime = ?, EndDateTime = ?, UpdateBy = ?, UpdateDateTime = NOW()
                WHERE TrainingMasterId = ?
            `;
    
            const [result] = await sequelize.query(query, {
                replacements: [
                    StartDate,
                    EndDate,
                    UpdateBy || null,
                    TrainingMasterId,
                ],
            });
    
            // Check if the update was successful
            if (result.affectedRows > 0) {
                rcode = 1;
                rmessage = 'Training updated successfully';
            } else {
                rcode = 0;
                rmessage = 'No training found to update';
            }
        } catch (error) {
            console.error('Error updating training:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something went wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    }

    async GetTrainingType(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
        const { MODE, TrainingID } = body;
    
        // Check if MODE is provided
        if (!MODE) {
            throw new Error('MODE is required');
        }
    
        try {
            if (MODE === '#ALL') {
                // If MODE is #ALL, fetch all training records
                const query = `
                    SELECT * FROM csc_training_type_master
                `;
                const [result] = await sequelize.query(query);
    
                if (result.length > 0) {
                    items = result;
                    rcode = 1;
                    rmessage = 'All training details retrieved successfully';
                } else {
                    rcode = 0;
                    rmessage = 'No training records found';
                }
            } else if (MODE === 'BYID') {
                // If MODE is BYID, check if TrainingID is provided
                if (!TrainingID) {
                    throw new Error('TrainingID is required when MODE is BYID');
                }
    
                // Check if the training exists in the database by TrainingID
                const checkQuery = `
                    SELECT 1 FROM csc_training_type_master WHERE TrainingID = ?
                `;
                const [checkResult] = await sequelize.query(checkQuery, {
                    replacements: [TrainingID],
                });
    
                // If no record is found with the given TrainingID
                if (checkResult.length === 0) {
                    rcode = 0;
                    rmessage = 'No training found with the provided TrainingID';
                    return { data: items, message: rmessage };
                }
    
                // Retrieve the specific training details from the database by TrainingID
                const query = `
                    SELECT * FROM csc_training_type_master WHERE TrainingID = ?
                `;
                const [result] = await sequelize.query(query, {
                    replacements: [TrainingID],
                });
    
                if (result.length > 0) {
                    items = result[0];  // Return only the first record
                    rcode = 1;
                    rmessage = 'Training details retrieved successfully';
                } else {
                    rcode = 0;
                    rmessage = 'No data found for the provided TrainingID';
                }
            } else {
                throw new Error('Invalid MODE. Allowed values are #ALL and BYID');
            }
        } catch (error) {
            console.error('Error retrieving training type:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something went wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    }

    async GetTrainingList(body) {
        console.log(body, "test");
        let items = {};
        let rcode = 0;
        let rmessage = '';
        const { TrainingMasterId, page, pageSize } = body;
    
        const currentPage = page || 1;
        const size = pageSize || 10;
    
        try {
            if (TrainingMasterId) {
                const checkQuery = `
                    SELECT 1 FROM csc_training_master WHERE TrainingMasterId = ?
                `;
                const [checkResult] = await sequelize.query(checkQuery, {
                    replacements: [TrainingMasterId],
                });
    
                if (checkResult.length === 0) {
                    rcode = 0;
                    rmessage = 'No training found with the provided TrainingMasterId';
                    return { data: items, message: rmessage };
                }
    
                const query = `
                    SELECT 
                        ctm.TrainingMasterId,
                        ctm.TrainingTypeID,
                        ctm.TrainingDate,
                        ctm.InsertedUserId,
                        ctm.UpdateBy,
                        ctm.UpdateDateTime,
                        ctm.InsertedDateTime,
                        ctm.InsertIPAddress,
                        cttm.TrainingName,
                        cttm.TrainingCode,
                        ctm.StartTime,
                        ctm.EndTime
                    FROM 
                        fgms_spiral_node.csc_training_master AS ctm
                    INNER JOIN 
                        fgms_spiral_node.csc_training_type_master AS cttm
                        ON ctm.TrainingTypeID = cttm.TrainingID
                    WHERE 
                        ctm.TrainingMasterId = ?
                `;
    
                const [result] = await sequelize.query(query, {
                    replacements: [TrainingMasterId],
                });
    
                if (result.length > 0) {
                    items = result[0]; 
                    rcode = 1;
                    rmessage = 'Training details retrieved successfully';
                } else {
                    rcode = 0;
                    rmessage = 'No data found for the provided TrainingMasterId';
                }
            } else {
                
                const query = `
                    SELECT 
                        ctm.TrainingMasterId,
                        ctm.TrainingTypeID,
                        ctm.TrainingDate,
                        ctm.InsertedUserId,
                        ctm.UpdateBy,
                        ctm.UpdateDateTime,
                        ctm.InsertedDateTime,
                        ctm.InsertIPAddress,
                        cttm.TrainingName,
                        cttm.TrainingCode,
                        ctm.StartTime,
                        ctm.EndTime
                    FROM 
                        fgms_spiral_node.csc_training_master AS ctm
                    INNER JOIN 
                        fgms_spiral_node.csc_training_type_master AS cttm
                        ON ctm.TrainingTypeID = cttm.TrainingID
                    WHERE
                        ctm.TrainingTypeID IS NOT NULL
                        AND cttm.TrainingID IS NOT NULL
                    ORDER BY
                        ctm.TrainingMasterId ASC
                    LIMIT ? OFFSET ?;
                `;
                const offset = (currentPage - 1) * size;
    
                const [result] = await sequelize.query(query, {
                    replacements: [size, offset],
                });
    
                if (result.length > 0) {
                    items = result;
                    rcode = 1;
                    rmessage = 'Training list retrieved successfully';
                } else {
                    rcode = 0;
                    rmessage = 'No training records found';
                }
            }
        } catch (error) {
            console.error('Error retrieving training list:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something went wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    }
    
    


    
    
    
    
    
    
    
    
    
    
}