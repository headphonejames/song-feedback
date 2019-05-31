## Song Feedback web-app

A React web-app for collecting feedback on music. 

Some possible use cases:
* Get feedback on unfinished tracks to determine what to invest in
* Determine which songs to make videos for 
* Determine which track of a group to submit to Spotify for potential playlist inclusion
* A/B song testing tool 

[Demo](http://song-feedback.s3-website-us-east-1.amazonaws.com/#/) and [Analytics Demo](http://song-feedback.s3-website-us-east-1.amazonaws.com/#/admin/) (uses cached data to not incur DB costs)

UI Design by [Eric Johnson](https://www.linkedin.com/in/eric-johnsohn/)

Core functionality:
* An elegant way to get feedback on music. It's especially useful if you have multiple tracks you want feedback on.  
* Intelligently distributes tracks to listeners, ensuring all songs receive equal amount of rating data. 
* Intelligent looping of unrated tracks to a listener in the case when a listener stops paying attention to the web-app.
* Simple and intuitive app for listeners, with optional tutorial. Optional reward system if you want to have give aways (I gave away magnets in return for rating two tracks).
* Simple but useful data analytics for collected feedback data. Drill down into specific track metadata.
* Easily deployed on AWS. Uses AWS to privately host app, a dynamo database to store feedback data, and a storage bucket to host audio files. AWS has a free tier which will suffice in most scenarios.

In my case, I had [10 complete tracks](http://www.generalfuzz.net) I wanted feedback on. The app was configured to serve a listener 2 tracks at a time.  This enabled me to get quality feedback across all 10 of my tracks.
To install there are two parts. There's [AWS](https://console.aws.amazon.com) setup and then React build / config.

**AWS Setup**
 
* Create a [AWS](https://console.aws.amazon.com) account. 
* Create the required group + user in [IAM](https://console.aws.amazon.com/iam/home).
  * Create a **group** in [IAM](https://console.aws.amazon.com/iam/home).
I named it _admin_. Grant it _AdministratorAccess_ permissions
  * Create **user** in [IAM](https://console.aws.amazon.com/iam/home).
I named it _song-feedback_. Grant it _Programmatic access_. Add it to the _admin_ group. Copy down this users _Access key ID_ and _Secret access key_, which will be used in the React app configuration.
 
* Create a [AWS S3 bucket](https://s3.console.aws.amazon.com/s3) bucket for the music + art and upload song files (.wav/.mp3). 
  * If you want to have art associated with a song, upload a .jpg/.gif/.png/.tif with the same file name. For example, if you uploaded _"smile.mp3"_ then upload _"smile.jpg"_ in the same bucket. The image size should be 250 × 250 pixels.
 
  * Use the following permission for CORS configuration of the song bucket:
  ```
    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>HEAD</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
    </CORSConfiguration>
    
   ```
* create a [AWS S3 bucket](https://s3.console.aws.amazon.com/s3) to host the react app, and [configure the bucket to host a static site](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html). 
  * Set the Permissions/Public access settings so that **all checkboxes** are **unchecked**: 
    * _"Block new public ACLs and uploading public objects"_
    * _"Remove public access granted through public ACLs"_
    * _"Block new public bucket policies"_
    * _"Block public and cross-account access if bucket has public policies"_  
  * Set the Permissions/Bucket Policy for the bucket to be open:
  ```
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Sid": "PublicReadGetObject",
              "Effect": "Allow",
              "Principal": "*",
              "Action": "s3:GetObject",
              "Resource": "arn:aws:s3:::[bucket name]/*"
          }
      ]
  }
  ```
* Install the [AWS CLI](https://aws.amazon.com/cli/) and configure for your account.

**React setup / install**

* Make sure you have [npm](https://www.npmjs.com/get-npm) installed.
* Clone this repo:
 `git clone https://generalfuzz@bitbucket.org/generalfuzz/song-feedback.git`
* Checkout the aws branch: `git checkout aws-polling`

* Configure the .env file in the root directory with your AWS configuration.
 
  The DB_ROOT_PATH is used to define the prefix for all db table names. You can leave it as _"song-feedback"_.
    ```
    REACT_APP_AWS_ACCESS_KEY_ID=[IAM access key]
    REACT_APP_AWS_SECRET_ACCESS_KEY=[IAM secret access key]
    REACT_APP_AWS_S3_BUCKET=[song files bucket name]
    REACT_APP_AWS_REGION=[your region - mine was "us-east-1"]
    REACT_APP_DB_ROOT_PATH=song-feedback
    ```
* All configurion for the app is set in _./src/config.js_. You can configure a 'welcome video', along with your social media here.
    ```javascript
    export const social_media = {
         facebook: "http://www.facebook.com/generalfuzz",
         insta: "http://www.instagram.com/generalfuzz.music/",
         github: "http://www.github.com/generalfuzz",
         twitter: "http://www.twitter.com/generalfuzz"
     };
     export const welcome_video = "https://www.youtube.com/embed/j8HbpN_IYWc?rel=0";
    ```
    * A default image for all songs can be put in _./images/default.jpg_
* Install the app: `npm install`
* Start the app locally: `npm start`
   open the admin panel:  <http://localhost:3000/#/admin/admin>
   
  under the *"options"* section, click "Update tracks in db from AWS S3" button. A success response should eventually appear - if not, check web console for what went wrong. 
* Test the app: <http://localhost:3000/#/>
 
* Build the app: `npm run build` and deploy the build/ dir to your webside 
   
    *or*
   
  Build and deploy the app to S3 bucket with:
  `npm run build && aws s3 sync build/ s3://[bucket-name]`


* Share URL of app to social media, requesting music feedback. 