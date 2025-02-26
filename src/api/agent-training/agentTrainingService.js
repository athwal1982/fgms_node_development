
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
            const { page_size, page_number, searchQuery, viewMode, userId, centerMasterID } = body;
    
            if (!page_size || !page_number || page_size <= 0 || page_number <= 0) {
                throw new Error("Invalid pagination parameters");
            }
    
            if (viewMode === 'BYID' && (!userId || userId === '')) {
                throw new Error("UserID is required for viewMode 'BYID'");
            }
    
            const res = await sequelize.query(`
                CALL ${STORE_PROCEDURE.CSC_TRAINING_AGENTS}(
                    :page_size,
                    :page_number,
                    :searchQuery,
                    :viewMode,
                    :userId,
                    :centerMasterID,
                    @rcode,
                    @rmessage,
                    @totalPages
                );
            `, {
                replacements: { page_size, page_number, searchQuery, viewMode, userId, centerMasterID },
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
    



   /*  async CreateTraining(body) {
        let items = {};
        let rcode = 0;
        let rmessage = '';
    
        console.log(body);
        let {
            TrainingTypeID,
            TrainingDate,
            StartTime,
            EndTime,
            Duration,         
            TrainingTitle,     
            objCommon: { insertedUserID, insertedIPAddress },
            UpdateBy = null,
        } = body;
    
        console.log(insertedIPAddress);
    
        if (!TrainingTypeID) {
            throw new Error('TrainingTypeID is required');
        }
    
        if (!TrainingDate) {
            throw new Error('TrainingDate is required');
        }
    
        if (!insertedUserID) {
            throw new Error('InsertedUserId is required');
        }
    
        if (!insertedIPAddress) {
            throw new Error('InsertIPAddress is required');
        }
    
        if (StartTime && EndTime) {
            const start = new Date(`1970-01-01T${StartTime}Z`);
            const end = new Date(`1970-01-01T${EndTime}Z`);
            if (start >= end) {
                throw new Error('StartTime must be before EndTime');
            }
        }
    
        if (!TrainingTitle) {
            throw new Error('TrainingTitle is required');
        }
    
        if (!Duration) {
            throw new Error('Duration is required');
        }
    
        try {
            const query = `
                INSERT INTO csc_training_master (
                    TrainingTypeID,
                    TrainingDate,
                    StartTime,
                    EndTime,
                    Duration,             
                    TrainingTitle,         
                    InsertedUserId,
                    UpdateBy,
                    UpdateDateTime,
                    InsertedDateTime,
                    InsertIPAddress
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
            `;
    
            console.log(query);
    
            const [result] = await sequelize.query(query, {
                replacements: [
                    TrainingTypeID,         
                    TrainingDate,            
                    StartTime || null,       
                    EndTime || null,         
                    Duration,                
                    TrainingTitle,          
                    insertedUserID,          
                    UpdateBy,                
                    insertedIPAddress,      
                ],
            });
    
            rcode = 1;
            rmessage = 'Training created successfully';
            items = { insertId: result.insertId };  
    
        } catch (error) {
            console.log(error);
            // Handle error if something goes wrong
            console.error('Error creating training:', error.message);
            rcode = 0;
            rmessage = error.message || 'Something went wrong!';
            throw new Error(rmessage);
        }
    
        return { data: items, message: rmessage };
    } */
    
       
        
        


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
    
        if (!MODE) {
            throw new Error('MODE is required');
        }
    
        try {
            if (MODE === '#ALL') {
                
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
                if (!TrainingID) {
                    throw new Error('TrainingID is required when MODE is BYID');
                }
    
                const checkQuery = `
                    SELECT 1 FROM csc_training_type_master WHERE TrainingID = ?
                `;
                const [checkResult] = await sequelize.query(checkQuery, {
                    replacements: [TrainingID],
                });
    
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
                    items = result[0]; 
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

 
    
       /*  async GetTrainingList(body) {
            let items = {};
            let rcode = 0;
            let rmessage = '';
            const { TrainingMasterId, page, pageSize, startDate, endDate } = body;
        
            const currentPage = page || 1;
            const size = pageSize || 10;
        
            try {
                let query = `
                    SELECT 
                        training_master.TrainingMasterId,
                        training_master.TrainingTypeID,
                        training_master.TrainingDate,
                        training_master.InsertedUserId,
                        training_master.UpdateBy,
                        training_master.UpdateDateTime,
                        training_master.InsertedDateTime,
                        training_master.InsertIPAddress,
                        training_type_master.TrainingName,
                        training_type_master.TrainingCode,
                        training_master.StartTime,
                        training_master.EndTime,
                        app_access_created.UserDisplayName as CreatedBy,  
                        app_access_updated.UserDisplayName as UpdatedBy  
                    FROM 
                        fgms_spiral_node.csc_training_master AS training_master
                    INNER JOIN 
                        fgms_spiral_node.csc_training_type_master AS training_type_master
                        ON training_master.TrainingTypeID = training_type_master.TrainingID
                    LEFT JOIN
                        fgms_spiral_node.bm_app_access AS app_access_created
                        ON training_master.InsertedUserId = app_access_created.AppAccessID  -- Join for CreatedBy
                    LEFT JOIN
                        fgms_spiral_node.bm_app_access AS app_access_updated
                        ON training_master.UpdateBy = app_access_updated.AppAccessID  -- Join for UpdatedBy
                    WHERE
                        training_master.TrainingTypeID IS NOT NULL
                        AND training_type_master.TrainingID IS NOT NULL
                `;
        
                if (TrainingMasterId) {
                    query += ` AND training_master.TrainingMasterId = ?`;
                }
        
                // If date filters are provided, add them to the WHERE clause
                if (startDate && endDate) {
                    query += ` AND training_master.TrainingDate BETWEEN ? AND ?`;
                } else if (startDate) {
                    query += ` AND training_master.TrainingDate >= ?`;
                } else if (endDate) {
                    query += ` AND training_master.TrainingDate <= ?`;
                }
        
                query += ` ORDER BY training_master.TrainingMasterId ASC LIMIT ? OFFSET ?;`;
        
                const replacements = [];
                
                // Add replacements for filters
                if (TrainingMasterId) replacements.push(TrainingMasterId);
                if (startDate) replacements.push(startDate);
                if (endDate) replacements.push(endDate);
                replacements.push(size, (currentPage - 1) * size);
        
                const [result] = await sequelize.query(query, {
                    replacements: replacements,
                });
        
                if (result.length > 0) {
                    items = result;
                    rcode = 1;
                    rmessage = 'Training list retrieved successfully';
                } else {
                    rcode = 0;
                    rmessage = 'No training records found';
                }
        
            } catch (error) {
                console.error('Error retrieving training list:', error.message);
                rcode = 0;
                rmessage = error.message || 'Something went wrong!';
                throw new Error(rmessage);
            }
        
            return { data: items, message: rmessage };
        } */


            async GetTrainingList(body) {
                let items = {};
                let rcode = 0;
                let rmessage = '';
                const { TrainingMasterId, page, pageSize, startDate, endDate } = body;
            
                const currentPage = page || 1;
                const size = pageSize || 10;
            
                try {
                    let query = `
                        SELECT 
                            training_master.TrainingMasterId,
                            training_master.TrainingTypeID,
                            training_master.TrainingDate,
                            training_master.InsertedUserId,
                            training_master.UpdateBy,
                            training_master.UpdateDateTime,
                            training_master.InsertedDateTime,
                            training_master.InsertIPAddress,
                            training_type_master.TrainingName,
                            training_type_master.TrainingCode,
                            training_master.StartTime,
                            training_master.EndTime,
                            app_access_created.UserDisplayName as CreatedBy,  
                            app_access_updated.UserDisplayName as UpdatedBy,
                            CASE
                                WHEN tua.TrainingUserAssignmentID IS NOT NULL THEN 1
                                ELSE 0
                            END AS Assigned
                        FROM 
                            fgms_spiral_node.csc_training_master AS training_master
                        INNER JOIN 
                            fgms_spiral_node.csc_training_type_master AS training_type_master
                            ON training_master.TrainingTypeID = training_type_master.TrainingID
                        LEFT JOIN
                            fgms_spiral_node.bm_app_access AS app_access_created
                            ON training_master.InsertedUserId = app_access_created.AppAccessID
                        LEFT JOIN
                            fgms_spiral_node.bm_app_access AS app_access_updated
                            ON training_master.UpdateBy = app_access_updated.AppAccessID
                        LEFT JOIN
                            fgms_spiral_node.csc_training_user_assigment AS tua
                            ON training_master.TrainingMasterId = tua.TrainingMasterID
                        WHERE
                            training_master.TrainingTypeID IS NOT NULL
                            AND training_type_master.TrainingID IS NOT NULL
                    `;
            
                    if (TrainingMasterId) {
                        query += ` AND training_master.TrainingMasterId = ?`;
                    }
            
                    if (startDate && endDate) {
                        query += ` AND training_master.TrainingDate BETWEEN ? AND ?`;
                    } else if (startDate) {
                        query += ` AND training_master.TrainingDate >= ?`;
                    } else if (endDate) {
                        query += ` AND training_master.TrainingDate <= ?`;
                    }
            
                    query += ` ORDER BY training_master.TrainingMasterId ASC LIMIT ? OFFSET ?;`;
            
                    const replacements = [];
            
                    if (TrainingMasterId) replacements.push(TrainingMasterId);
                    if (startDate) replacements.push(startDate);
                    if (endDate) replacements.push(endDate);
                    replacements.push(size, (currentPage - 1) * size);
            
                    const [result] = await sequelize.query(query, {
                        replacements: replacements,
                    });
            
                    if (result.length > 0) {
                        items = result;
                        rcode = 1;
                        rmessage = 'Training list retrieved successfully';
                    } else {
                        rcode = 0;
                        rmessage = 'No training records found';
                    }
            
                } catch (error) {
                    console.error('Error retrieving training list:', error.message);
                    rcode = 0;
                    rmessage = error.message || 'Something went wrong!';
                    throw new Error(rmessage);
                }
            
                return { data: items, message: rmessage };
            }
            


        async CenterList(body) {
            console.log(body, "test");
            let items = {};
            let rcode = 0;
            let rmessage = '';
            let result
            
            try {
                 result = await sequelize.query(`
                    CALL ${STORE_PROCEDURE.FGMS_TRAINING_CENTER_LIST} (
                         @rcode, @rmessage
                    )`, {
                    replacements: {},
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
        
            return { data: result, message: rmessage };
        }

        async UpcomingTrainingList(body) {
            console.log(body, "test");
            let items = {};
            let rcode = 0;
            let rmessage = '';
            let result
            
            try {
                 result = await sequelize.query(`
                    CALL ${STORE_PROCEDURE.FGMS_TRAINING_UPCOMINT} (
                         @rcode, @rmessage
                    )`, {
                    replacements: {},
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
        
            return { data: result, message: rmessage };
        }
        

        async CscTrainingDataBinding(body) {
            console.log(body, "test");
            let items = {};
            let rcode = 0;
            let rmessage = '';
            let result;
            try {
                // Calling the stored procedure with input parameters
                result = await sequelize.query(`
                    CALL csc_training_data_binding(
                        :SPMODE, :SPCenterID, @rcode, @rmessage
                    )`, {
                    replacements: {
                        SPMODE: body.SPMODE,
                        SPCenterID: body.SPCenterID
                    },
                    type: sequelize.QueryTypes.RAW,
                });
        
                // Fetching the output parameters (rcode and rmessage)
                const outputResult = await sequelize.query(`
                    SELECT @rcode AS code, @rmessage AS message
                `, {
                    type: sequelize.QueryTypes.SELECT
                });
        
                const data = outputResult[0];
                rcode = +data.code;
                rmessage = data.message;
        
                console.log(data);
        
                // If rcode is not 1, return an empty result with the message
                if (rcode !== 1) {
                    return { data: [], message: rmessage };
                }
        
                // Otherwise, return the result from the procedure
                items = result;
        
            } catch (err) {
                console.error(err);
                throw new Error('Something Went Wrong!');
            }
        
            // Return the final result with data and message
            return { data: items, message: rmessage };
        }
        
        

        async cscUserTrainingAssignManage(body) {
            let items = {};
            let message = '';
            await sequelize.query(`CALL ${STORE_PROCEDURE.CSC_TRAINING_USER_ASSIGN_MANAGE}(
            :SPViewMode,
            :SPTrainingUserAssignmentID,
            :SPCenterID
            :SPCSCAppAccessTypeID,
            @SPUnUserID,
            :SPTrainingMasterID,
            :SPUserID,
            @SPUUserID,
            :SPInsertUserID,
            :SPInsertIPAddress,
            @rcode, @rmessage)`, {
                replacements: {
                    SPViewMode: body.viewMode,
                    SPTrainingUserAssignmentID: body.trainingUserAssignmentID,
                    SPCenterID:body.centerID,
                    SPCSCAppAccessTypeID:body.cSCAppAccessTypeID,
                    SPTrainingMasterID: body.trainingMasterID,
                    SPUserID: +body.userID,                    
                    SPInsertUserID: +body.objCommon.insertedUserID,
                    SPInsertIPAddress: body.objCommon.insertedIPAddress,
                },
                type: sequelize.QueryTypes.RAW,
            }).then(async (res) => {
                await sequelize.query('select @SPUnUserID AS UnAssignUserID,  @SPUUserID AS AssignUserID, @rcode AS code, @rmessage AS message').then((result) => {
                    const data = flatMap(result);
                    if (+data[0].code === 0) {
                        throw new Error(data[0].message)
                    }
                    if (body.viewMode === 'ASSIGN') {
                        items = {UnAssignuser: data[0].UnAssignUserID, AssignedID: data[0].AssignUserID};
                    } else {
                        items = {CscAssignManage: res};
                    }
                    message = data[0].message;
                })
            })
            return {data: items, message};
        }

        
        // async CreateTraining(body) {
        //     let items = {};
        //     let rcode = 0;
        //     let rmessage = '';
        //     let {
        //         TrainingTypeID,
        //         TrainingDate,
        //         StartTime,
        //         EndTime,
        //         Duration,         
        //         TrainingTitle,  
        //         TrainingLink,  
        //         objCommon: { insertedUserID, insertedIPAddress },
        //         UpdateBy = null,
        //     } = body;
        
        //     if (!TrainingTypeID) {
        //         throw new Error('TrainingTypeID is required');
        //     }
        //     if (!TrainingDate) {
        //         throw new Error('TrainingDate is required');
        //     }
        //     if (!insertedUserID) {
        //         throw new Error('InsertedUserId is required');
        //     }
        //     if (!insertedIPAddress) {
        //         throw new Error('InsertIPAddress is required');
        //     }
        //     if (!TrainingTitle) {
        //         throw new Error('TrainingTitle is required');
        //     }
        //     if (!Duration) {
        //         throw new Error('Duration is required');
        //     }
        
        //     if (StartTime && EndTime) {
        //         const start = new Date(`1970-01-01T${StartTime}Z`);
        //         const end = new Date(`1970-01-01T${EndTime}Z`);
        //         if (start >= end) {
        //             throw new Error('StartTime must be before EndTime');
        //         }
        //     }
        
        //     const indianTime = new Date(TrainingDate);
        //     indianTime.setHours(indianTime.getHours() + 5); 
        //     indianTime.setMinutes(indianTime.getMinutes() + 30); 
        
        //     if (TrainingLink && !isValidUrl(TrainingLink)) {
        //         throw new Error('TrainingLink must be a valid URL');
        //     }
        
        //     try {
        //         const query = `
        //             INSERT INTO csc_training_master (
        //                 TrainingTypeID,
        //                 TrainingDate,
        //                 StartTime,
        //                 EndTime,
        //                 Duration,             
        //                 TrainingTitle,  
        //                 TrainingLink,       
        //                 InsertedUserId,
        //                 UpdateBy,
        //                 UpdateDateTime,
        //                 InsertedDateTime,
        //                 InsertIPAddress
        //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
        //         `;
        
        //         const [result] = await sequelize.query(query, {
        //             replacements: [
        //                 TrainingTypeID,         
        //                 indianTime,            
        //                 StartTime || null,       
        //                 EndTime || null,         
        //                 Duration,                
        //                 TrainingTitle,  
        //                 TrainingLink || null,    
        //                 insertedUserID,          
        //                 UpdateBy,                
        //                 insertedIPAddress,      
        //             ],
        //         });
        
        //         rcode = 1;
        //         rmessage = 'Training created successfully';
        //         items = { insertId: result.insertId };  
        
        //     } catch (error) {
        //         console.log(error);
        //         rcode = 0;
        //         rmessage = error.message || 'Something went wrong!';
        //         throw new Error(rmessage);
        //     }
        
        //     return { data: items, message: rmessage };
        // }
        
        //  isValidUrl(url) {
        //     try {
        //         const parsedUrl = new URL(url);
        //         return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
        //     } catch (error) {
        //         return false;
        //     }
        // }
    
        


        /* New Changes in the api  */
        async CreateTraining(body) {
            let items = {};
            let rcode = 0;
            let rmessage = '';
            let result;
        console.log(body);
            const {
                TrainingTypeID,
                TrainingDate,
                StartTime,
                EndTime,
                Duration,         
                TrainingTitle,  
                TrainingLink,  
                objCommon,
            } = body;
        
            try {
                // Check if objCommon exists and has the required properties
                if (!objCommon || !objCommon.insertedUserID || !objCommon.insertedIPAddress) {
                    throw new Error('Missing required user information in objCommon.');
                }
                const formattedTrainingDate = new Date(TrainingDate).toISOString().slice(0, 19).replace('T', ' ');
        
                result = await sequelize.query(`
                    CALL ${STORE_PROCEDURE.CSC_TRAINING_CREATE}(
                        :SPTrainingTypeID, 
                        :SPTrainingDate, 
                        :SPStartTime, 
                        :SPEndTime, 
                        :SPDuration, 
                        :SPTrainingTitle, 
                        :SPTrainingLink, 
                        :SPInsertUserID, 
                        :SPInsertIPAddress, 
                        @rcode, 
                        @rmessage
                    )
                `, {
                    replacements: {
                        SPTrainingTypeID: TrainingTypeID,           // Correct replacement for :SPTrainingTypeID
                        SPTrainingDate: formattedTrainingDate,               // Correct replacement for :SPTrainingDate
                        SPStartTime: StartTime,                     // Correct replacement for :SPStartTime
                        SPEndTime: EndTime,                         // Correct replacement for :SPEndTime
                        SPDuration: Duration,                       // Correct replacement for :SPDuration
                        SPTrainingTitle: TrainingTitle,             // Correct replacement for :SPTrainingTitle
                        SPTrainingLink: TrainingLink,               // Correct replacement for :SPTrainingLink
                        SPInsertUserID: objCommon.insertedUserID,   // Correct replacement for :SPInsertUserID
                        SPInsertIPAddress: objCommon.insertedIPAddress, // Correct replacement for :SPInsertIPAddress
                    },
                    type: sequelize.QueryTypes.RAW
                });
        
                const outputResult = await sequelize.query(`
                    SELECT @rcode AS code, @rmessage AS message
                `, {
                    type: sequelize.QueryTypes.SELECT
                });
        
                console.log(outputResult, "outputResult");
                const data = outputResult[0];
                rcode = +data.code;
                rmessage = data.message;
        
                if (rcode !== 1) {
                    return { data: [], message: rmessage };
                }
        
                items = { insertedTrainingID: result[0].InsertedTrainingID };
        
            } catch (err) {
                console.error(err);
                throw new Error('Something Went Wrong!');
            }
        
            return { data: items, message: rmessage };
        }
        
        
        
  
}

