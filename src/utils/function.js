import 'dotenv/config';
import mongoose from "mongoose";
import _ from 'lodash';
const env = (envKey, defaultVal = null) => process.env[envKey] || defaultVal;
const getDataInFields = ({ fields = [], object = {} }) => _.pick(object, fields)
const formatDate = (date, addTime = null) => {
    // Get individual date components
    const day = ("0" + date.getDate()).slice(-2); // Add leading zero if single digit
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if single digit
    const year = date.getFullYear().toString().slice(-2); // Extract last two digits of year
    const hour = ("0" + date.getHours()).slice(-2); // Add leading zero if single digit
    const minute = ("0" + (date.getMinutes() + (addTime ? 1 : 0))).slice(-2); // Add leading zero if single digit. addTime: time for network delay
    // Concatenate components with desired format
    return `${day}-${month}-${year}-${hour}-${minute}`;
}
const countConnect = () => mongoose.connections.length;
module.exports = {
    env,
    getDataInFields,
    formatDate,
    countConnect
}