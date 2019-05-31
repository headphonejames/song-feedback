import React from 'react';

// social media
export const social_media = {
    facebook: "http://www.facebook.com/generalfuzz",
    insta: "http://www.instagram.com/generalfuzz.music/",
    github: "http://www.github.com/generalfuzz",
    twitter: "http://www.twitter.com/generalfuzz",
    soundcloud: "https://soundcloud.com/generalfuzz",
    spotify: "https://open.spotify.com/artist/6GmYm47Zgk3tvoCeJbsH5r"
};

export const welcome_video_id = "j8HbpN_IYWc";

// number of tracks a user to listen to
export const numTracks = 2;
export const autoPlay = true;

// aws config
export const db_root = process.env.REACT_APP_DB_ROOT_PATH;
export const awsS3Bucket = process.env.REACT_APP_AWS_S3_BUCKET;
export const awsKey =  process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const awsSecret = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const awsRegion = process.env.REACT_APP_AWS_REGION;

// max number of magnets to give out
export const maxRewards = 100;

// millis to wait before allow rating
// export const millisToWaitBeforeRatingEnabled = 0;
export const millisToWaitBeforeRatingEnabled = 10000;
export const signedUrlExpireSeconds = 60 * 120;

// export const showSplashPage = false;
export const showSplashPage = true;
// export const showWalkthrough = false;
export const showWalkthrough = true;
export const showAdminWalkthrough = false;
export const mobileWidth = 1000;
export const ratingWarningDisplayTime = 4000;
export const savedPromptDisplayTime = 1000;

export const unratedModalWaitTime = 10000;

// poll configuration
export const poll_question = <span>When do you listen to <span className="generalfuzz">general fuzz</span>?</span>;
export const poll_other = "other";
export const poll_answers = "answers";
export const poll_options = ["in transit", "while working", "setting room vibe", "inner work", "that was my first time", poll_other];
export const poll_other_placeholder = "When do you listen?";

// admin
export const actionFinishedDisplayTime = 6000;

// cloudfront + cf auth

export const cf_publicKey = "";
export const cf_domainName = "";
export const cf_privateKey = "";

/*
export const cf_domainName = "dsmjvg9fkc1u1";

export const cf_publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAixVG/nui8gQIAhbrvt5c\n" +
    "HyypY6tFUG2uTSX+Cc8kwhw5A9CXi+xRF9UNdKLM3yUKpahEW9HUQ+DPoYVGFahu\n" +
    "ckiMAxgmFJ6j83HvfOb+RlIsnkD3QHXUS6MTLglM+h6/mlC1eZ7xkmIjRdc0Zl/T\n" +
    "FGywMvCem1HaX+fbaXVD34Z3b4/v5kQlfuFc9xFVu1QM1x/UC15i330SWMBOrDgC\n" +
    "6PwM70TZiMkBIiKuDFLsQXaoVFMExlKwPkrkxa3dMAPjaYHz/cYNi4CFUmkIW+M4\n" +
    "RWhy1MxeB9kvVelWIfCyYwchV0n7rBqkG1UW7QgbeJbUTryp0JAw2LXiLjqZKeEd\n" +
    "4wIDAQAB\n" +
    "-----END PUBLIC KEY-----\n";
export const cf_privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIEogIBAAKCAQEAixVG/nui8gQIAhbrvt5cHyypY6tFUG2uTSX+Cc8kwhw5A9CX\n" +
    "i+xRF9UNdKLM3yUKpahEW9HUQ+DPoYVGFahuckiMAxgmFJ6j83HvfOb+RlIsnkD3\n" +
    "QHXUS6MTLglM+h6/mlC1eZ7xkmIjRdc0Zl/TFGywMvCem1HaX+fbaXVD34Z3b4/v\n" +
    "5kQlfuFc9xFVu1QM1x/UC15i330SWMBOrDgC6PwM70TZiMkBIiKuDFLsQXaoVFME\n" +
    "xlKwPkrkxa3dMAPjaYHz/cYNi4CFUmkIW+M4RWhy1MxeB9kvVelWIfCyYwchV0n7\n" +
    "rBqkG1UW7QgbeJbUTryp0JAw2LXiLjqZKeEd4wIDAQABAoIBADzkeumuDcAx3aO0\n" +
    "j1BIoEKR1jOp57X330ktqhR3WZuWqauu5rq/Ix3xDGwVXucPm6K9kfg1XN6/DYil\n" +
    "BfMzg++LLampJ/r9HcDXEEg6BfeZwKkkvlu9es4Gvr34Gnijf7W7QkjWOuOhDdpl\n" +
    "By8PIyYdE+Opj3dnFdnJdDmuuqGg41skFGq5oKDJBqoX16jQEwLO9wBDBxvocfQ1\n" +
    "qYqHIqhd+I8KZL8VevciYUTawmczc5y8u7sGKtHX+NTDPiIBgfTHrGRmBgXdJgW5\n" +
    "QG+36uzH1t8A5ceWKD9QENfJXTBUv0TcCMpHyRDfgv5IpmPqFS17c758Hi4dp2h/\n" +
    "Q++f0TECgYEAwlGc5lFlfDi4wL1Nr9aKrJs+DHdKlOdyx3SCG0JDuAw3O6q/u31n\n" +
    "pI77p44AxSbmWFmAXbllSssdQWngI7FTW3miTYNq/el4nNk7PChiBsFeVwXI6urd\n" +
    "XtOFjV2YZC4RkhImW5RptHGEJNA9Tm6mZ2et2QABVfu4YgsDRfJDVBkCgYEAtzsz\n" +
    "afM/JmALZ4fxi5FeMnJzCDUn0oLDli3F3NUupBHATbZNmzmsvAtGkfFaO9tVpIzR\n" +
    "6rDMnj0Tr9M3KojtJc0LmUXPZElF32aZzCgnFYMfZAr4vHmM42bqgW/FZ4V7LfzZ\n" +
    "oQ2mEzGmKCeytt8XYNEs6F6SQdkldSmACSpTIVsCgYBdV4jP1f+y6ShOZWDA+4TH\n" +
    "nxbyNAdeecNX7i5lW7Jd4XhSsBXDwVyc3pYiCYNzMNlrTSrtWpY+lEzsVCh33MFW\n" +
    "6pm9NEibyZ/HcE4U+q0D47Umhj/aIJHP8DlyC6idTsff69oDGcqhA/pfGKyqVVqX\n" +
    "x2TqHSeHHxCWAAZFfjc7WQKBgB/erS+lfntnQzSLwaib7T1rCLUJwdZspiZN6ddi\n" +
    "QQ2KhN8/cTopivDeKTUjPKWinb/UOoLOo5h2WSFA5JyCWnUzt+u957eywvN7fg6z\n" +
    "gTDNsL0O53qozaeT8//1d+lsnyM9koDfxd4ayaK8XOpP3Voap+v23wuTAF/jiwCN\n" +
    "Gw53AoGAdXOhzD4uEG9p8nSvpjV30U60caJSSjeHzUd75raDFnCBOD2TQreeCwhB\n" +
    "VMgq1dut/kVt7qb5vB7s+aF0I6rJ8q5ByxYJRamY4nQqdl4eL/LQvxyRbhtMvV7S\n" +
    "lOjVtlfDfmTFoamhRYVkHeOomJJQ7cQeZRzh42cQg6f1GS7Ayqk=\n" +
    "-----END RSA PRIVATE KEY-----\n";
*/