import * as config from "./config";
import * as constants from "./constants";
import cf from "aws-cloudfront-sign";
import defaultImg from "./images/default.jpg";
import * as util from "./util";

let AWS = require('aws-sdk');

export const awsConfigData = {
    accessKeyId: config.awsKey,
    secretAccessKey: config.awsSecret,
    region: config.awsRegion,
};

AWS.config.update(awsConfigData);

const endpoint = "https://dynamodb." + config.awsRegion + ".amazonaws.com";

export const s3 = new AWS.S3(awsConfigData);
export const docClient = new AWS.DynamoDB.DocumentClient({
    endpoint: endpoint, ...awsConfigData
});

export const db = new AWS.DynamoDB({
    endpoint: endpoint, ...awsConfigData
});

//https://read.acloud.guru/using-the-dynamodb-document-client-with-dynamodb-streams-from-aws-lambda-6957b6c81112

export const getUrl = async key => {
    if (config.cf_privateKey !== "") {
        return await getUrlCloudFront(key);
    }

    if (util.endsWithAny(key.toLowerCase(), constants.image_extensions)){
        return await getImgUrlS3(key);
    }

    return await getUrlS3(key);
};


export const getUrlCloudFront = async key => {
    let options = {keypairId: config.cf_publicKey, privateKeyString: config.cf_privateKey};
    return await cf.getSignedUrl("http://" + config.cf_domainName + ".cloudfront.net/" + key, options);
};

export const getUrlS3 = async key => {
    return await s3.getSignedUrl('getObject', {
        Bucket: config.awsS3Bucket,
        Key: key,
        Expires: config.signedUrlExpireSeconds
    })
};

export const getImgUrlS3 = async key => {
    const params = {
        Bucket: config.awsS3Bucket,
        Key: key
    };
    try {
        // see if image exists
        await s3.headObject(params).promise();
        return await s3.getSignedUrl('getObject', {
            Expires: config.signedUrlExpireSeconds, ...params
        });
    } catch (headErr) {
        return defaultImg;
    }

};

export const generateUrls = async userData => {
    let imgUrlsPromises = await userData.playlist.map(async song => {
        return await getUrl(song.image);
    });

    let songUrlsPromises = await userData.playlist.map(async song => {
        return await getUrl(song.filename);
    });

    let imgUrls = await Promise.all(imgUrlsPromises);
    let songUrls = await Promise.all(songUrlsPromises);

    // force preload imgs
    imgUrls.forEach(url =>
    {
        const img = new Image();
        img.src = url;
    });

    return {
        ...userData,
        playlist: userData.playlist.map((song, index) => {
            return {...song, artwork_url: imgUrls[index], song_url: songUrls[index]};
        })
    };
};
