import {UserService} from "../user/userService.js";
import jwt from "jsonwebtoken";
import {constant} from "../../constants/constant.js";
import {jsonErrorHandler} from "../../helper/errorHandler.js";
import {AuthHelpers } from "../../helper/authHelper.js";

/*export const authMiddleware = async (req, res, next) => {
    const userService = new UserService();
    try {
        let token = req.headers.authorization;
        if (token) {
            if (!token.startsWith('Bearer ')) {
                token = `Bearer ${token}`
            }
            token = token.split(' ');
             const decodedToken = await verifyJwtToken(token[1]);

            const {data} = await userService.getUsers({appAccessID: +decodedToken.id, viewMode: constant.ViewMode.VIEW})
        console.log('data', data);
          if (data?.user?.length === 0) {
                throw new Error('User not found!')
            } 
            req.user = {...data[0], appAccessID: +decodedToken.id};
          
            return next()
        } else {
            throw new Error('Token required!')
        }
    } catch (err) {
        return jsonErrorHandler(err, req, res, () => {})
    }
}
*/
export const authMiddleware = async (req, res, next) => {
    const userService = new UserService();
    try {
        let token = req.headers.authorization;
        if (token) {
            if (!token.startsWith('Bearer ')) {
                token = `Bearer ${token}`
            }
            token = token.split(' ');
             const decodedToken = await verifyJwtToken(token[1]);
             if(decodedToken.id==='99999'|| decodedToken.id===99999){
            
             }
              else{          const {data} = await userService.getUsers({appAccessID: +decodedToken.id, viewMode: constant.ViewMode.VIEW})
        console.log('data', data);
          if (data?.user?.length === 0) {
                throw new Error('User not found!')
            } 
            req.user = {...data[0], appAccessID: +decodedToken.id};
              }
            return next()
        } else {
            throw new Error('Token required!')
        }
    } catch (err) {
        return jsonErrorHandler(err, req, res, () => {})
    }
}
const verifyJwtToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}
export const authThirdMiddleware = async (req, res, next) => {
    const userService = new UserService();
    try {
        let token = req.headers.authorization;
        if (token) {
            if (!token.startsWith('Bearer ')) {
                token = `Bearer ${token}`
            }
            token = token.split(' ');
            console.log('token',token);
            const date = new Date();
            console.log(date.getHours().toString().padStart(2, '0'),'date');
          const encryptString=  date.getFullYear() + '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' +
        date.getDate().toString().padStart(2, '0') 
      //  + ':' +        date.getHours().toString().padStart(2, '0')
         ;
            const encryptedText = await AuthHelpers.encryptThird(
                'this is the secret information that must be hidden',
                encryptString
              );
              console.log('encryptString',encryptString);
              console.log('encryptedText',encryptedText);
            const decodedToken = await AuthHelpers.decryptThird(token[1],encryptString);
            console.log('decodedToken',decodedToken);
            if (decodedToken=== null) {
                throw new Error('Token is Not Valid!')
            }
            return next()
        } else {
            throw new Error('Token required!')
        }
    } catch (err) {
        return jsonErrorHandler(err, req, res, () => {})
    }
}
const verifyThirdToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}