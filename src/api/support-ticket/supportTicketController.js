import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {SupportTicketService} from "./supportTicketService.js";
import {UtilService} from "../../helper/utilService.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import util from "util";
export class SupportTicketController {
    constructor() {
        this.utilService = new UtilService()
        this.supportTicketService = new SupportTicketService()
    }
  
    getFarmerTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_FARMERTICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getTicketsListIndex = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getTicketsListIndex1(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_CSC_INDEX)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getBulkTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getBulkTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_BULK_TICKET_VIEW_CSC)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
      aggregrationStateSupportTicketReport= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.aggregrationStateSupportTicketReport(req.body, req.user)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

uploadTicketSelect= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.uploadTicketSelect(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getExcelBulkTicketsList = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getExcelBulkTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_HISTORY_EXCEL_INSERT)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    supportTicketViewInsurance = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerTicketsList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_VIEW_INSURANCE)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
      
    supportTicketFarmerCropLossView = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerCropTicketList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_FARMER_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

  uploadexcel = async (req, res) => {
                try {
        
                    let {data, message} = await this.supportTicketService.uploadFileExcel(req)
        
                    // compress
                    if(data) data = await this.utilService.GZip(data);
        
                    // return response
                    return jsonResponseHandler(data, message, req, res, () => {})
                } catch (err) {
                    return jsonErrorHandler(err, req, res, () => {
                    })
                }
            }
    supportTicketCropLossView = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getCropTicketList(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
   
    farmerSelectCallingHistory= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.farmerSelectCallingHistory(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    farmerCallingHistory= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.farmerCallingHistory(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
  
    complaintMailReport= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.complaintMailReport(req.body, req.user)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    supportTicketHistoryReport= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.supportTicketHistoryReport(req.body, req.user)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
   
     aggregrationSupportTicketReport= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.aggregrationSupportTicketReport(req.body, req.user)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    krphFarmerCallingHistory= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.krphFarmerCallingHistory(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
     kRPHfarmerSelect= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.kRPHfarmerSelect(req.body, req.user, STORE_PROCEDURE.SUPPORT_TICKET_CROP_LOSS_DETAIL)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addKRPHFarmerSupportTicket= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addKRPHFarmerSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addKRPHSupportTicket= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addKRPHSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addFarmerSupportTicket= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addFarmerSupportTicket(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    generateSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.generateSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    generateOfflineSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.generateOfflineSupportTicket(req)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getOfflineSupportTicket = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getOfflineSupportTicket(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    addCSCSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addCSCSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    updateTicketStatus = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.updateTicketStatus(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    callVoiceCallAPI= async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.callVoiceCallAPI()

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addBulkSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addBulkSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
   
    updateFarmerTicketStatus = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.updateFarmerTicketStatus(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addFarmerSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addFarmerSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getFarmerSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getFarmerSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    addSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.addSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    editSupportTicketReview = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.editSupportTicketReview(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    sendSMSToFarmer = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.sendSMSToFarmer(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    sendSMSToNewFarmer = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.sendSMSToNewFarmer(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getSupportTicketCategoryReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketCategoryReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getSupportAgeingReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportAgeingReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
 
    getSupportCropAgeingReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportCropAgeingReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getSupportCropAgeingReportDetail = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportCropAgeingReportDetail(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getSupportAgeingReportDetail = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportAgeingReportDetail(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getSupportTicketReopenDetailReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketReopenDetailReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getSupportTicketDetailReport = async (req, res) => {
        try {

            let {data, message} = await this.supportTicketService.getSupportTicketDetailReport(req.body)

            // compress
            if(data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {})
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    uploadDocument = async (req, res) => {
        try {
            console.log('req.file',req.data);
              //  await uploadFile(req, res,next);
                        if (req.file == undefined) {
                  return res.status(400).send({ message: "Please upload a file!" });
                }
            
                res.status(200).send({
                  message: "Uploaded the file successfully: " + req.file.originalname,
                });
              } catch (err) {
                console.log(err);
            
          /*      if (err.code == "LIMIT_FILE_SIZE") {
                  return res.status(500).send({
                    message: "File size cannot be larger than 2MB!",
                  });
                }
            */
                res.status(500).send({
                  message: `Could not upload the file: ${req.file.originalname}. ${err}`,
                });
              }
            };

            UserAssignedTicketsList = async (req, res)=>{
                try{    
                    let {data, message}  = await this.supportTicketService.userAssignedTicketListing(req.body)
                    if(data) data = await this.utilService.GZip(data);
                    return jsonResponseHandler(data, message, req, res, () => {})
                }catch(err){
                    return jsonErrorHandler(err, req, res, () => {
                    })
                }
             }  

            insuranceAssignTickets = async (req, res)=>{
                try{
                    let { item, message, failedRecords, existingRecords } = await this.supportTicketService.insuranceUserAssignTicket(req.body);
                    let data = {
                        item :item,
                        message:message,
                        failedRecords:failedRecords,
                        existingRecords:existingRecords
                    }
                    if(data) data = await this.utilService.GZip(data);
            
                    console.log(data)
                    return jsonResponseHandler(data, message, req, res, () => {})
            
                   }catch(err){
                    return jsonErrorHandler(err, req, res, () => {
                    })
                   }
            }
            
            
            
            
            
            
            
                        userWiseTicketList = async(req,res)=>{
                            try{
                                let {data, message} = await this.supportTicketService.userWiseListTickets(req.body)
                                // let data = await this.supportTicketService.userWiseListTickets(req.body)
                                if(data) data = await this.utilService.GZip(data);
                                return jsonResponseHandler(data, message, req, res, () => {})
                    
                            }catch(err){
                                console.log(err)
                                return jsonErrorHandler(err, req, res, () => {
                                })
                            }
                        }
            
            
            
            
                        insuranceUnassignTickets = async (req, res)=>{
                            try{
                             let {data , message } = await this.supportTicketService.insuranceUserUnassignTicket(req.body);
                             if(data) data = await this.utilService.GZip(data);
                             return jsonResponseHandler(data, message, req, res, () => {})
                     
                            }catch(err){
                             return jsonErrorHandler(err, req, res, () => {
                             })
                            }
                         }
            
      
    allUnassignedTickets = async (req, res)=>{
        try{
            let {data, message} = await this.supportTicketService.allUnassignedTicketsList(req.body)
            // let data = await this.supportTicketService.userWiseListTickets(req.body)
            if(data) data = await this.utilService.GZip(data);
            return jsonResponseHandler(data, message, req, res, () => {})

        }catch(err){
            console.log(err)
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
            
            
                         agentListAndCount = async (req,res)=>{
                            try{
                                console.log(req.body);
                                let {data, message} = await this.supportTicketService.agentListAndTicketCount(req.body)
                                if(data) data = await this.utilService.GZip(data);
                                return jsonResponseHandler(data, message, req, res, () => {})
                            }catch(error){
                                return jsonErrorHandler(error, req, res, () => {
                                })
                            }
                        }
            
            



        }

