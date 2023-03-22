
function isValidBody(data){
    return Object.keys(data).length!=0
}

function isValidstring(value){
    if (typeof value === 'undefined' || value === null )return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}

function isValidEmail(email){
    return (/^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(email))
}

function isValidphone(phone){
    return (/^[6-9]\d{9}$/.test(phone))
}

function isValidPassword(password){
    return (/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))

}

module.exports = {isValidBody, isValidstring, isValidEmail, isValidphone, isValidPassword}