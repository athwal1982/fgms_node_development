import {jsonErrorHandler, jsonResponseHandler} from "../../helper/errorHandler";
import {MasterDataApiService} from "./masterDataApiService.js";
import {constant, ResponseStatus} from "../../constants/constant.js";
import {UtilService} from "../../helper/utilService.js";

export class MasterDataApiController {
    constructor() {
        this.utilService = new UtilService()
        this.masterDataApiService = new MasterDataApiService()
    }

    getDistrictByState = async (req, res) => {
        try {

            const payload = {
                level: 3,
                format: 'tree',
                parentLevel: 2,
                parentLevelID: req.body.stateAlphaCode,
                parentLocationIDs: '',
                from: 3,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'locations/locations/locationHierarchy',
                'District Not Exists With this State'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getBankByDistrict = async (req, res) => {
        try {

            const payload = {
                addressType: 'DISTRICT',
                addressValue: req.body.districtAlphaCode,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'banks/banks/districtBanks',
                'Bank Not Exists With this District'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getBranchByBankANDDistrict = async (req, res) => {
        try {

            const payload = {
                addressType: 'BANK',
                addressValue: req.body.bankAlphaCode,
                districtID: req.body.districtAlphaCode,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'banks/banks/districtBanks',
                'Branch Not Exists With this Bank'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getSubDistrictByStateANDDistrict = async (req, res) => {
        try {

            const payload = {
                stateID: req.body.stateAlphaCode,
                districtID: req.body.districtAlphaCode,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'locations/locations/tehsil',
                'Sub Districts not Exists'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    
    getLocationHierarchy = async (req, res) => {        
        try {

            const payload = {
                sssyID: req.body.sssyID
                
            }

            let {data, message} = await this.masterDataApiService.getLocationHierarchy(
                payload,
               'No Village found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getLevel3 = async (req, res) => {        
        try {

            const payload = {
                level2: req.body.level2,
               
            }

            let {data, message} = await this.masterDataApiService.getLevel3(
                payload,
               'No Data found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getLevel4 = async (req, res) => {        
        try {

            const payload = {
                level3: req.body.level3,
        
            }

            let {data, message} = await this.masterDataApiService.getLevel4(
                payload,
               'No Data found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }
    getLevel5 = async (req, res) => {        
            try {
    
                const payload = {
                    subDistrictID: req.body.subDistrictAlphaCode,
                    districtID: req.body.districtAlphaCode,
                }
    
                let {data, message} = await this.masterDataApiService.getLevel5(
                    payload,
                   'No Village found with this record'
                )
    
                // compress
                if (data) data = await this.utilService.GZip(data);
    
                // return response
                return jsonResponseHandler(data, message, req, res, () => {
                })
            } catch (err) {
                return jsonErrorHandler(err, req, res, () => {
                })
            }
        }
        getLevel6 = async (req, res) => {        
            try {
    
                const payload = {
                    level3: req.body.level3,
                    level4: req.body.level4,
                    level5: req.body.level5
                }
    
                let {data, message} = await this.masterDataApiService.getLevel6(
                    payload,
                   'No Village found with this record'
                )
    
                // compress
                if (data) data = await this.utilService.GZip(data);
    
                // return response
                return jsonResponseHandler(data, message, req, res, () => {
                })
            } catch (err) {
                return jsonErrorHandler(err, req, res, () => {
                })
            }
        }
        getLevel7 = async (req, res) => {        
            try {
    
                const payload = {
                    level3: req.body.level3,
                    level4: req.body.level4,
                    level5: req.body.level5,
                    level6: req.body.level6
                }
    
                let {data, message} = await this.masterDataApiService.getLevel7(
                    payload,
                   'No Village found with this record'
                )
    
                // compress
                if (data) data = await this.utilService.GZip(data);
    
                // return response
                return jsonResponseHandler(data, message, req, res, () => {
                })
            } catch (err) {
                return jsonErrorHandler(err, req, res, () => {
                })
            }
        }
    getPolicyByVillageID = async (req, res) => {
        try {

            const payload = {
                districtID: req.body.districtAlphaCode,
                villageID: req.body.villageAlphaCode,
                seasonCode: req.body.seasonCode,
                year: req.body.yearCode,
                listType: 'VILLAGE_POLICY',
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'policy/policy/policyListOfaVillageOrAFarmer',
                'No farmer found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getFarmerPolicyDetail = async (req, res) => {
        try {

            const payload = {
                farmerID: req.body.farmerID,
                seasonCode: req.body.seasonID,
                year: req.body.year,
                listType: 'FARMER_POLICY',
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'policy/policy/policyListOfaVillageOrAFarmer',
                'No farmer policy found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getVillageListBYSubDistrictAndDistrict = async (req, res) => {
        try {

            const payload = {
                subDistrictID: req.body.subDistrictAlphaCode,
                districtID: req.body.districtAlphaCode,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'locations/locations/villageList',
                'No Village found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    getNotificationCropListVillageWise = async (req, res) => {
        try {

            const payload = {
                villageID: req.body.villageAlphaCode,
                mobile: req.body.mobileNo,
                sssyID: req.body.sssyID,
                authToken: constant.PM_API_TOKEN,
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'masters/masters/notfiedCropListVillageWise',
                'No farmer found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

    searchPolicy = async (req, res) => {
        try {

            const payload = {
                policyID: req.body.policyID,
                seasonCode: req.body.seasonCode,
                year: req.body.yearCode,
                listType: 'SINGLE_POLICY',
            }

            let {data, message} = await this.masterDataApiService.getMasterAPI(
                payload,
                null,
                'policy/policy/policyListOfaVillageOrAFarmer',
                'No farmer found with this record'
            )

            // compress
            if (data) data = await this.utilService.GZip(data);

            // return response
            return jsonResponseHandler(data, message, req, res, () => {
            })
        } catch (err) {
            return jsonErrorHandler(err, req, res, () => {
            })
        }
    }

}
