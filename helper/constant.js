const REGEX_EMAIL = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
const UserRole ={
    ADMIN:"ADMIN",
    PLAYER:"PLAYER"
}
const EXTENSION=".jpg"

module.exports = { REGEX_EMAIL,UserRole,EXTENSION};
//
