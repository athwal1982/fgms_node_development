export const ResponseStatus = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    NOT_FOUND: "No Data Found!",
}

const ViewMode = {
    SELECT: 'SELECT',
    MENU_ACCESS: 'MENUACCESS',
    VIEW: 'VIEW',
    EDIT: 'EDIT',
}

const PM_API = process.env.PM_API;
const PM_API_TOKEN = process.env.PM_API_TOKEN;
const PM_API_HTTPS = process.env.PM_API_HTTPS;
const PM_API_HTTPS_LOCATION = process.env.PM_API_HTTPS_LOCATION;
const BOT_API = process.env.BOT_API;
const CIPHER_ALGO = process.env.CIPHER_ALGO;
const CIPHER_SECRET_KEY = process.env.CIPHER_SECRET_KEY;
const VOICE_USER_ID = process.env.VOICE_USER_ID;
const VOICE_CAMPAIGN_NAME = process.env.VOICE_CAMPAIGN_NAME;
const VOICE_API_KEY= process.env.VOICE_API_KEY;
const VOICE_URL= process.env.VOICE_URL;
const VOICE_LANGUAGE= process.env.VOICE_LANGUAGE;
const VOICE_BY= process.env.VOICE_BY;
export const constant = {
    ResponseStatus,
    ViewMode,
    PM_API,
    PM_API_TOKEN,
    PM_API_HTTPS,
    PM_API_HTTPS_LOCATION,
    CIPHER_ALGO,
    CIPHER_SECRET_KEY,
    BOT_API,
    VOICE_USER_ID,
    VOICE_CAMPAIGN_NAME,
    VOICE_API_KEY,
    VOICE_URL,
    VOICE_LANGUAGE,
    VOICE_BY
}
