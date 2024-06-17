import CryptoJS from "crypto-js";

const AUTH_SECRET_KEY = "MEDIMANAGE-AUTH"

const getSecretKey = (type: string) => {
    switch (type) {
        case 'AUTH':
            return AUTH_SECRET_KEY
        default:
            return "";
    }
}

const encryptBody = (object: any, type: string) => {
    return CryptoJS.AES.encrypt(JSON.stringify(object), getSecretKey(type)).toString();
}

const decryptBody = (object: any, type: string) => {
    const bytes = CryptoJS.AES.decrypt(object, getSecretKey(type));
    const originalBody = bytes.toString(CryptoJS.enc.Utf8);
    return originalBody;
}


export {encryptBody, decryptBody}