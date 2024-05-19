const ACCESS_TOKEN_EXPIRY = "20m";
const REFRESH_TOKEN_EXPIRY = "60m";
const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const constants = {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    validEmail
}

module.exports = constants