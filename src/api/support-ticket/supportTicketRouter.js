import express from 'express'
import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {SupportTicketController} from './supportTicketController.js'
import {createValidator} from "express-joi-validation";
import {authMiddleware} from "../middleware/authMiddleware.js";
import stream from 'stream';
// import path from 'path';
import multer from 'multer';
//import {uploadFileMiddleware} from "../middleware/uploadFileMiddleware.js"
//import {uploadHelpers} from "../../helper/uploadHelpers.js";
import util from "util";
import fs from 'fs';
const pipeline = util.promisify(stream.pipeline)
import {UtilService} from "../../helper/utilService.js";
import {SupportTicketService} from "./supportTicketService.js";
const supportTicketController = new SupportTicketController();
const supportTicketService = new SupportTicketService();
 const utilService = new UtilService();

export const supportTicketRouter = express.Router()
const CHUNKS_DIR = './chunk/';
const excelstoragetest = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    console.log('reqreq', file);
  console.log('reqreq.body', req.body);
  
 let filePath ='./krph_excel/' + file.originalname;
 
  const dirpath ='./krph_excel/';
  console.log('dirpath', dirpath);
   if (file) { 

 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
console.log('yesss',filePath);
if (fs.existsSync(filePath)) 
{
console.log('yesss',filePath);
let message='Same File Name Exists.!';
     return cb(new Error('Same File Name Exists.!'));
  } 
else
{
console.log('noo',filePath);

 //let data =  supportTicketService.uploadFileExcel(JSON.stringify(req.body),file.originalname);
//console.log('dataaaaa',data);
//let message=data[0].message;
cb(null, './krph_excel/');
//     return cb(new Error('Same File Name Exists.!'));
//console.log('dataaaaa',data);
//if(data) data =  utilService.GZip(data);


//return cb(new Error('Same File Name Exists.!'));
}
 
/*new Promise ((resolve, reject) => {}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})
*/
  }
}, 
  filename: (req, file, cb) => { 
    const fileName = `${file.originalname}`; 
    cb(null, file.originalname );
  }, 
}); 


const excelstorage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    console.log('reqreq', file);
  console.log('reqreq.body', req.body);
  
 let filePath ='./krph_excel/' + file.originalname;
 
  const dirpath ='./krph_excel/';
  console.log('dirpath', dirpath);
   if (file) { 
new Promise ((resolve, reject) => {
 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
console.log('yesss',filePath);
if (fs.existsSync(filePath)) 
{
console.log('yesss',filePath);
let message='Same File Name Exists.!';
     return cb(new Error('Same File Name Exists.!'));
  } 
else
{
console.log('noo',filePath);

// let data =  supportTicketService.uploadFileExcel(JSON.stringify(req.body),file.originalname);
cb(null, './krph_excel/');

//console.log('dataaaaa',data);
//if(data) data =  utilService.GZip(data);
// return jsonResponseHandler(data , message, req, res, () => {})}

//return cb(new Error('Same File Name Exists.!'));
}
 
}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})

  }
}, 
  filename: (req, file, cb) => { 
    const fileName = `${file.originalname}`; 
    cb(null, file.originalname );
  }, 
}); 
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    console.log('reqreq', file);
  console.log('reqreq.body', req.body);
  
  let filePath ='./krph_documents/' + file.filename;
  const dirpath ='./krph_documents/';
  console.log('dirpath', dirpath);
  
  
   // const mediaFolder = __dirname+'/testFiles'; // Change as per your Location
 if (file) { 
new Promise ((resolve, reject) => {
 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
 
}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})
cb(null, './krph_documents/');
  }
}, 
  filename: (req, file, cb) => { 
    const fileName = `${Date.now()}-${file.originalname}`; 
    const uploadedfilename= req.body.ImageName  ;
    cb(null, uploadedfilename);
  }, 
}); 
  

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      console.log ('file.mimetype',file.mimetype);
     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
        cb(null, true);
     } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg ,.pdf format allowed!'));
      }
  }
});

const excelupload = multer({
  storage: excelstoragetest,
  fileFilter: (req, file, cb) => {
      console.log ('file.mimetype',file.mimetype);
//console.log('extension',path.extname(file.originalname).toLowerCase());
   // if (file.mimetype == ".XLSX" ||  file.mimetype == ".XLS") {
         cb(null, true);
     //} else {
       //   cb(null, false);
      //   return cb(new Error('Only .xlsx,.xls allowed!'));
    // }
  }
});
var type = upload.single('files');
var exceltype = excelupload.single('files');
supportTicketRouter.post('/FarmerCallingHistory', authMiddleware, supportTicketController.farmerCallingHistory)
supportTicketRouter.post('/FarmerSelectCallingHistory', authMiddleware, supportTicketController.farmerSelectCallingHistory)

supportTicketRouter.post('/GetSupportTicketView_CSC', authMiddleware, supportTicketController.getTicketsList)
supportTicketRouter.post('/GetSupportTicketView_CSC_Index', authMiddleware, supportTicketController.getTicketsListIndex)
supportTicketRouter.post('/GetFarmerSupportTicketView_CSC', authMiddleware, supportTicketController.getFarmerTicketsList)
supportTicketRouter.post('/GetSupportTicketCropLossView', authMiddleware, supportTicketController.supportTicketCropLossView)


supportTicketRouter.post('/GetSupportTicketView_Insurance', authMiddleware, supportTicketController.supportTicketViewInsurance)

supportTicketRouter.post('/GetBulkTicketsList', authMiddleware, supportTicketController.getBulkTicketsList)
supportTicketRouter.post('/GetExcelBulkTicketsList', authMiddleware, supportTicketController.getExcelBulkTicketsList)
supportTicketRouter.post('/AddSupportTicket', authMiddleware, supportTicketController.addSupportTicket)
supportTicketRouter.post('/CallVoiceCallAPI',  supportTicketController.callVoiceCallAPI)

supportTicketRouter.post('/AddFarmerSupportTicket', authMiddleware, supportTicketController.addFarmerSupportTicket)
supportTicketRouter.post('/GenerateSupportTicket', authMiddleware, supportTicketController.generateSupportTicket)
supportTicketRouter.post('/GenerateOfflineSupportTicket', authMiddleware, supportTicketController.generateOfflineSupportTicket)
supportTicketRouter.post('/GetOfflineSupportTicket', authMiddleware, supportTicketController.getOfflineSupportTicket)
supportTicketRouter.post('/AddCSCSupportTicketReview', authMiddleware, supportTicketController.addCSCSupportTicketReview)
supportTicketRouter.post('/GetSupportFarmerTicketCropLossView', authMiddleware, supportTicketController.supportTicketFarmerCropLossView)
supportTicketRouter.post('/TicketStatusUpdate', authMiddleware, supportTicketController.updateTicketStatus)
supportTicketRouter.post('/AddBulkSupportTicketReview', authMiddleware, supportTicketController.addBulkSupportTicketReview)
supportTicketRouter.post('/UnassignedTicketListing',authMiddleware, supportTicketController.allUnassignedTickets)
supportTicketRouter.post('/GetAssignedTicketList', authMiddleware, supportTicketController.UserAssignedTicketsList)
supportTicketRouter.post('/AssignSupportTicketAgent',authMiddleware,supportTicketController.insuranceAssignTickets)
supportTicketRouter.post('/AgentListAndTicketCount',authMiddleware,supportTicketController.agentListAndCount)
supportTicketRouter.post('/UserWiseTicketList',authMiddleware,supportTicketController.userWiseTicketList)
supportTicketRouter.post('/UnassignSupportTicketAgent',authMiddleware,supportTicketController.insuranceUnassignTickets)

supportTicketRouter.post('/FarmerTicketStatusUpdate', authMiddleware, supportTicketController.updateFarmerTicketStatus)


supportTicketRouter.post('/GetSupportTicketHistoryReport', authMiddleware, supportTicketController.supportTicketHistoryReport)
supportTicketRouter.post('/GetSupportTicketReview', authMiddleware, supportTicketController.getSupportTicketReview)
supportTicketRouter.post('/AddSupportTicketReview', authMiddleware, supportTicketController.addSupportTicketReview)
supportTicketRouter.post('/EditSupportTicketReview', authMiddleware, supportTicketController.editSupportTicketReview)
supportTicketRouter.post('/AddKRPHSupportTicket', authMiddleware, supportTicketController.addKRPHSupportTicket)
supportTicketRouter.post('/AddKRPHFarmerSupportTicket', authMiddleware, supportTicketController.addKRPHFarmerSupportTicket)
supportTicketRouter.post('/KrphfarmerCallingHistory', authMiddleware, supportTicketController.krphFarmerCallingHistory)

supportTicketRouter.post('/KRPHFarmerSelect', authMiddleware, supportTicketController.kRPHfarmerSelect)
supportTicketRouter.post('/AggregrationStateSupportTicketReport', authMiddleware, supportTicketController.aggregrationStateSupportTicketReport)

supportTicketRouter.post('/GetFarmerSupportTicketReview', authMiddleware, supportTicketController.getFarmerSupportTicketReview)
supportTicketRouter.post('/AddFarmerSupportTicketReview', authMiddleware, supportTicketController.addFarmerSupportTicketReview)
supportTicketRouter.post('/SendSMSToFarmer', authMiddleware, supportTicketController.sendSMSToFarmer)
supportTicketRouter.post('/SendSMSToNewFarmer', authMiddleware, supportTicketController.sendSMSToNewFarmer)
supportTicketRouter.post('/GetSupportTicketCategoryReport', authMiddleware, supportTicketController.getSupportTicketCategoryReport)
supportTicketRouter.post('/GetSupportAgeingReport', authMiddleware, supportTicketController.getSupportAgeingReport)
supportTicketRouter.post('/GetSupportAgeingReportDetail', authMiddleware, supportTicketController.getSupportAgeingReportDetail)
supportTicketRouter.post('/GetSupportCropAgeingReport', authMiddleware, supportTicketController.getSupportCropAgeingReport)
supportTicketRouter.post('/GetSupportCropAgeingReportDetail', authMiddleware, supportTicketController.getSupportCropAgeingReportDetail)

supportTicketRouter.post('/GetSupportTicketDetailReport', authMiddleware, supportTicketController.getSupportTicketDetailReport)
supportTicketRouter.post('/GetSupportTicketReopenDetailReport', authMiddleware, supportTicketController.getSupportTicketReopenDetailReport)


supportTicketRouter.post('/ComplaintMailReport', authMiddleware, supportTicketController.complaintMailReport)
supportTicketRouter.post('/AggregrationSupportTicketReport', authMiddleware, supportTicketController.aggregrationSupportTicketReport)
supportTicketRouter.post('/UploadTicketSelect', authMiddleware, supportTicketController.uploadTicketSelect)
supportTicketRouter.post('/UploadDocument2',authMiddleware, upload.single("files"), (req, res, next) => {

  res.status(200).send('Error uploading chunk');
})
/*supportTicketRouter.post('/UploadDocument',authMiddleware, upload.single("file"), (req, res, next) => {
  console.log('req',req);
  const { file, body: { totalChunks, currentChunk } } = req;
  const chunkFilename = `${file.originalname}.${currentChunk}`;
  const chunkPath = `${CHUNKS_DIR}/${chunkFilename}`;
  console.log('chunkPath',chunkPath);
  fs.rename(file.path, chunkPath, (err) => {
    if (err) {
      console.error('Error moving chunk file:', err);
      res.status(500).send('Error uploading chunk');
    } else {
      if (+currentChunk === +totalChunks) {
        console.log('file.originalname',file.originalname);
        // All chunks have been uploaded, assemble them into a single file
        assembleChunks(file.originalname, totalChunks)
          .then(() => res.send('File uploaded successfully'))
          .catch((err) => {
            console.error('Error assembling chunks:', err);
            res.status(500).send('Error assembling chunks');
          });
      } else {
        res.send('Chunk uploaded successfully');
      }
    }
  });
});
async function assembleChunks(filename, totalChunks) {
  const writer = fs.createWriteStream(`./krph_documents/${filename}`);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = `${CHUNKS_DIR}/${filename}.${i}`;
    await pipeline(pump(fs.createReadStream(chunkPath)), pump(writer));
    fs.unlink(chunkPath, (err) => {
      if (err) {
        console.error('Error deleting chunk file:', err);
      }
    });
  }
}
  */

//supportTicketRouter.post('/UploadDocument', authMiddleware, supportTicketController.uploadDocument)
//supportTicketRouter.post('/UploadDocument',authMiddleware,uploadHelpers.uploadedFile, (req, res, next) => {
//supportTicketRouter.post('/UploadDocument', authMiddleware, supportTicketController.uploadDocument)
supportTicketRouter.post('/UploadDocument',authMiddleware, type, (req, res,next) => {
  try {

  let message = '';
  let fileoploadMessage = {};
  
  console.log('reqreq', req.file);
  console.log('reqreq.body', req.body);
  const mediaFolder ='./krph_documents/ABCD/';
  let filePath ='./krph_documents/' + req.file.filename;
 // const dirpath ='./krph_documents/' + req.body.ImgPath;
// const dirpath ='./krph_documents/';
 // console.log('dirpath', dirpath);
  //console.log('mediaFolder', mediaFolder);
  
   // const mediaFolder = __dirname+'/testFiles'; // Change as per your Location
   /*
 if (req.file) { 
new Promise ((resolve, reject) => {
 if (!fs.existsSync(dirpath)) {
   try {
     fs.mkdirSync(dirpath,{ recursive: true });
   } catch (error) {
     reject(error.message)
   }
 }
 /*  fs.access(dirpath, (error) => { 

    // To check if given directory  
    // already exists or not 
    if (error) { 
      // If current directory does not exist then create it 
      fs.mkdir(dirpath, { recursive: true }, (error) => { 
        if (error) { 
          console.log(error); 
        } else { 
          console.log("New Directory created successfully !!"); 
        } 
      }); 
    } else { 
      console.log("Given Directory already exists !!"); 
    } 
  });

 let readStream = fs.createReadStream(req.file.originalname);
 readStream.once('error', (err) => {
   console.log(err);
        reject(error.message)
 });
 readStream.once('end', () => {
   console.log('done copying');
        resolve('done copying')
 });
 try {
  readStream.pipe(fs.createWriteStream(dirpath + '/' + req.file.filename));

 } catch (error) {
   reject(error.message)
 }
}).then((data) => {
 console.log(`Successfully Uploaded Document`);
}).catch((error) => {
 console.log(`Error occured at time of doc upload ${error.message}`);
})

 
 }*/
 
 message ='File uploaded successfully';


 return jsonResponseHandler(fileoploadMessage, message, req, res, () => {})

} catch (err) {
    return jsonErrorHandler(err, req, res, () => {
    })
}

})

supportTicketRouter.post('/ExcelUpload',authMiddleware, exceltype, (req, res,next) => {
  try {

  let message = '';
  let fileoploadMessage = {};
  
  console.log('reqreq', req.file);
  console.log('reqreq.body', req.body);
  
  let filePath ='./krph_excel/' + req.file.filename;
 
 message ='File uploaded successfully';

 let {data, message1} =  supportTicketService.uploadFileExcel(JSON.stringify(req.body), res);
console.log('data',data);
 if(data) data =  this.utilService.GZip(data);

 return jsonResponseHandler(data , message1, req, res, () => {})

} catch (err) {
    return jsonErrorHandler(err, req, res, () => {
    })
}

})



/*
supportTicketRouter.post('/UploadDocument',authMiddleware, uploads.single('file'), (req, res) => {
  console.log("req.body",req.body);
  const { file, body: { totalChunks, currentChunk ,attachmentName,attachmentDirPath} } = req;
  console.log('reqreq', req.file);
  console.log('reqreq.body', req.body);
  const chunkFilename = `${file.originalname}.${currentChunk}`;
  const chunkPath = `${CHUNKS_DIR}/${chunkFilename}`;
  fs.rename(file.path, chunkPath, (err) => {
    if (err) {
      console.error('Error moving chunk file:', err);
      res.status(500).send('Error uploading chunk');
    } else {
      if (+currentChunk === +totalChunks) {
        // All chunks have been uploaded, assemble them into a single file
        assembleChunks(file.originalname, totalChunks)
          .then(() => res.send('File uploaded successfully'))
          .catch((err) => {
            console.error('Error assembling chunks:', err);
            res.status(500).send('Error assembling chunks');
          });
      } else {
        res.send('Chunk uploaded successfully');
      }
    }
  });
});
async function assembleChunks(filename, totalChunks) {
  const writer = fs.createWriteStream(`./krph_documents/${filename}`);
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = `${CHUNKS_DIR}/${filename}.${i}`;
    await pipeline((fs.createReadStream(chunkPath)), (writer));
    fs.unlink(chunkPath, (err) => {
      if (err) {
        console.error('Error deleting chunk file:', err);
      }
    });
  }
}
*/