import * as aws from "../aws-obj";
import {getTableName} from "../util";

export const init = () => {
    // do nothing
};

const createTableSchema = name => {
    return {
        TableName: getTableName(name),
        KeySchema: [
            {AttributeName: "id", KeyType: "HASH"},  //Partition key
        ],
        AttributeDefinitions: [
            {AttributeName: "id", AttributeType: "S"},
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10, /* required */
            WriteCapacityUnits: 10 /* required */
        },
    };
};

export const createTableIfNotExist = async (name) => {
    const params = createTableSchema(name);
    let data = await aws.db.listTables({}).promise();
    const exists = data.TableNames.filter(name => {
        return name === params.TableName;
    }).length > 0;

    if (!exists) {
        await aws.db.createTable(params).promise();
        await aws.db.waitFor('tableExists', {TableName: params.TableName}).promise();
    }
};

export const putItem = async (item, tableName) => {
    let params = {
        Item: item,
        TableName: getTableName(tableName),
        ConditionExpression: "attribute_not_exists(id)"
    };
    try {
        return await aws.docClient.put(params).promise();
    } catch (err) {
        if (err.message === "The conditional request failed") {
            // ignore
        } else {
            throw err;
        }
    }
};

export const getItems = async (tableName) => {
    let params = {
        TableName: getTableName(tableName),
        ReturnConsumedCapacity: "TOTAL"
    };
    await aws.docClient.scan(params).promise();
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