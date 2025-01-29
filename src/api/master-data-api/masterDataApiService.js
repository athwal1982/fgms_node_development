import {sequelize} from "../../database/index.js";
import {STORE_PROCEDURE} from "../../constants/db_tables.js";
import flatMap from "lodash/flatMap";
import {UtilService} from "../../helper/utilService.js";
import {constant} from "../../constants/constant.js";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import https from "https";
export class MasterDataApiService {

    constructor() {
        this.utilService = new UtilService();
    }
    
    async getLocationHierarchy(params, errorMsg) {
        let data = {};
        let message = '';
      
        const urld = 'levelHierarchy?sssyID='+ params.sssyID;


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
     //   await axios(config).then(res => {
            if (res.data && res.data.status && !isEmpty(res.data.data)) {
                console.log('res',res.data);
                data = res.data;
                message = 'SUCCESS'
            } else {
                if(res.data.error === '')  throw new Error(errorMsg);
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
    
} 

async getLevel3(params, errorMsg) {
    let data = {};
    let message = '';
  
    const urld = 'locationHierarchy?parentLocationIDs={"2":"' + params.level2 + '"}&format=tree&parentLevelID=' + params.level2 +'&parentLevel=2&from=3&level=3';


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
 //   await axios(config).then(res => {
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            console.log('res',res.data);
            data = res.data;
            message = 'SUCCESS'
        } else {
            if(res.data.error === '')  throw new Error(errorMsg);
            throw new Error(res.data.error);
        }
    }).catch((err) => {
        throw new Error(err);
    })
    return {data, message}

}
async getLevel4(params, errorMsg) {
    let data = {};
    let message = '';
  
    const urld = 'locationHierarchy?parentLocationIDs={"3":"' + params.level3 + '"}&format=tree&parentLevelID=' + params.level3 +'&parentLevel=3&from=4&level=4';


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
 //   await axios(config).then(res => {
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            console.log('res',res.data);
            data = res.data;
            message = 'SUCCESS'
        } else {
            if(res.data.error === '')  throw new Error(errorMsg);
            throw new Error(res.data.error);
        }
    }).catch((err) => {
        throw new Error(err);
    })
    return {data, message}

}


async getLevel5(params, errorMsg) {
    let data = {};
    let message = '';
  
    const urld = 'locationHierarchy?parentLocationIDs={"3":"' + params.districtID + '","4":"'+  params.subDistrictID + '"}&format=tree&parentLevelID=' + params.subDistrictID +'&parentLevel=4&from=5&level=5';


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
 //   await axios(config).then(res => {
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            console.log('res',res.data);
            data = res.data;
            message = 'SUCCESS'
        } else {
            if(res.data.error === '')  throw new Error(errorMsg);
            throw new Error(res.data.error);
        }
    }).catch((err) => {
        throw new Error(err);
    })
    return {data, message}

}
async getLevel6(params, errorMsg) {
    let data = {};
    let message = '';
  
    const urld = 'locationHierarchy?parentLocationIDs={"3":"' + params.level3 + '","4":"'+  params.level4 + '","5":"'+  params.level5 + '"}&format=tree&parentLevelID=' + params.level5 +'&parentLevel=5&from=6&level=6';


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
 //   await axios(config).then(res => {
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            console.log('res',res.data);
            data = res.data;
            message = 'SUCCESS'
        } else {
            if(res.data.error === '')  throw new Error(errorMsg);
            throw new Error(res.data.error);
        }
    }).catch((err) => {
        throw new Error(err);
    })
    return {data, message}

}
async getLevel7(params, errorMsg) {
    let data = {};
    let message = '';
  
    const urld = 'locationHierarchy?parentLocationIDs={"3":"' + params.level3 + '","4":"'+  params.level4 + '","5":"'+  params.level5 + '","6":"'+  params.level6 + '"}&format=tree&parentLevelID=' + params.level6 +'&parentLevel=6&from=7&level=7';


const url11 =`${constant.PM_API_HTTPS_LOCATION}${urld}`;
console.log('url11',url11);
await  axios.get(url11, {
httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}).then(async (res) => {
 //   await axios(config).then(res => {
        if (res.data && res.data.status && !isEmpty(res.data.data)) {
            console.log('res',res.data);
            data = res.data;
            message = 'SUCCESS'
        } else {
            if(res.data.error === '')  throw new Error(errorMsg);
            throw new Error(res.data.error);
        }
    }).catch((err) => {
        throw new Error(err);
    })
    return {data, message}

}
    async getMasterAPI(params, payload, API, errorMsg) {
        let data = {};
        let message = '';
        const url = `${constant.PM_API_HTTPS}${API}`;
        const config = {
            method: "GET",
            url,
            params,
            data: payload,
        }

        console.log('url',url);

        await axios(config).then(res => {
            if (res.data && res.data.status && !isEmpty(res.data.data)) {
                data = res.data;
                message = 'SUCCESS'
            } else {
                if(res.data.error === '')  throw new Error(errorMsg);
                throw new Error(res.data.error);
            }
        }).catch((err) => {
            throw new Error(err);
        })
        return {data, message}
    }
}
