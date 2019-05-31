// load in json data
import counts from './data/190411/sfb-website-counts';
import poll from './data/190411/sfb-website-poll';
import pollOther from './data/190411/sfb-website-poll-other';
import ratings from './data/190411/sfb-website-ratings';
import tracks from './data/190411/sfb-website-tracks';
import users from './data/190411/sfb-website-users.json';

import {decodeEmptyStr} from "../util";

let AWS = require('aws-sdk');


const addDyanamoDBToLocalStorage = (key, data) => {
    if (localStorage.getItem(key) !== undefined) {
        let newTableData = {};
        data.forEach(dataItem => {
            const newDataItem = AWS.DynamoDB.Converter.unmarshall(dataItem);
            newTableData[newDataItem["id"]] = newDataItem;
        });
        setJsonToLocalStorage(key, newTableData);
    }
};

const getJsonFromLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
};

const setJsonToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const getItemFromData = (key, id) => {
    return getJsonFromLocalStorage(key)[id];
};

export const init = () => {
    addDyanamoDBToLocalStorage("counts", counts);
    addDyanamoDBToLocalStorage("poll", poll);
    addDyanamoDBToLocalStorage("poll-other", pollOther);
    addDyanamoDBToLocalStorage("ratings", ratings);
    addDyanamoDBToLocalStorage("tracks", tracks);
    addDyanamoDBToLocalStorage("users", users);
};

export const encodeEmptyStr = (obj) => {
    return obj;
};

export const getItems = async (tableName) => {
    const data = getJsonFromLocalStorage(tableName);
    let dataArr = [];
    for (let [key, value] of Object.entries(data)) {
        dataArr.push(value);
    }
    return decodeEmptyStr(dataArr);
};

export const getItem = async (tableName, id, attributesToGet = undefined) => {
    if (attributesToGet === undefined) {
        return getItemFromData(tableName, id);
    } else {
        return getItemFromData(tableName, id)[attributesToGet];
    }
};

export const setItem = async (tableName, id, data) => {
    let table = getJsonFromLocalStorage(tableName);
    table[id] = data;
    setJsonToLocalStorage(tableName, table);
};

export const updateItem = async (tableName, id, subIndex, data) => {
    let tableData = getJsonFromLocalStorage(tableName);
    tableData[id][subIndex] = data;
    setJsonToLocalStorage(tableName, tableData);
};


export const deleteItem = async (id, tableName) => {
    console.log("deleteItem");
    let tableData = getJsonFromLocalStorage(tableName);
    tableData[id] = {};
    setJsonToLocalStorage(tableName, tableData);
};
