import * as aws from "./aws-obj";
import {getTableName, encodeEmptyStr, decodeEmptyStr} from "./util";

export const init = () => {
};

export const getItems = async (tableName) => {
    let params = {
        TableName: getTableName(tableName),
        ReturnConsumedCapacity: "TOTAL"
    };
    let result = await aws.docClient.scan(params).promise();
    return decodeEmptyStr(result.Items);
};

export const getItem = async (tableName, id, attributesToGet) => {
    let params = {
        TableName: getTableName(tableName),
        Key: {id: id},
    };

    if (attributesToGet) {
        params = {AttributesToGet: [attributesToGet], ...params};
    }
    try {
        let result = await aws.docClient.get(params).promise();
        if (result) {
            return decodeEmptyStr(result.Item);
        }
    } catch (error) {
        // ignore
    }
    return undefined;
};

export const setItem = async (tableName, id, data) => {
    let params = {
        TableName: getTableName(tableName),
        Item: encodeEmptyStr({id: id, ...data})
    };
    return await aws.docClient.put(params).promise();
};


export const updateItem = async (tableName, id, updateExpression, expressionAttributeNames, expressionAttributeValues, conditionalExpression) => {
    let params = {
        TableName: getTableName(tableName),
        Key: {id: id}
    };

    if (updateExpression) {
        params = {UpdateExpression: updateExpression, ...params};
    }
    if (expressionAttributeNames) {
        params = {ExpressionAttributeNames: expressionAttributeNames, ...params};
    }
    if (expressionAttributeValues) {
        params = {ExpressionAttributeValues: expressionAttributeValues, ...params};
    }

    if (conditionalExpression) {
        params = {ConditionalExpression: conditionalExpression, ...params};
    }
    try {
        return await aws.docClient.update(params).promise();
    } catch (error) {
        console.log(error);
        // ignore
    }
};

export const deleteItem = async (id, tableName) => {
    let params = {
        TableName: getTableName(tableName),
        Key: {
            id: id,
        },
        "ReturnValues": "ALL_OLD"
    };
    await aws.docClient.delete(params).promise();
};


