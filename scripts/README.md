* setup ~/.aws/credentials:
```
[default]
aws_access_key_id =
aws_secret_access_key =
```

* install [dyanamodump](https://github.com/mifi/dynamodump)
```
    npm install -g dynamodump
```

* configure and run **setup.sh**
```
export AWS_REGION=us-east-1
export DB_PREFIX=song-feedback
```
* run scripts:
  * download-data.sh
  * upload-data.sh
  * clear-data.sh