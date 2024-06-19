import 'dotenv/config';
import mongoose from 'mongoose';
import _ from 'lodash';
const env = (envKey, defaultVal = null) => process.env[envKey] || defaultVal;

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const formatDate = (date, addTime = null) => {
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + (date.getMinutes() + (addTime ? 1 : 0))).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);

  return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
};

const countConnect = () => mongoose.connections.length;

module.exports = {
  env,
  pick,
  formatDate,
  countConnect,
};
