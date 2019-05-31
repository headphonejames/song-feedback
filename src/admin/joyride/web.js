import React from 'react';

export const welcome = {
    title: <h3><i>Welcome</i></h3>,
    content: <div>Welcome to the Song Feedback Administration Tools.</div>,
    disableBeacon: true,
    target: ".joyride-welcome",
    placement: "bottom"
};


export const util = {
    title: <h3><i>Utilities</i></h3>,
    content: <div>Here, you can view data collected from your users and export that data.  You can also maintain which tracks are shown to users.</div>,
    target: '.joyride-util',
    disableBeacon: true,
    placement: "top"
};

export const tracks = {
    title: <h3><i>Track Listing</i></h3>,
    content: <div>The track listing displays which tracks have been rated and what you rated them.</div>,
    target: '.joyride-tracks',
    disableBeacon: true,

};

export const users = {
    title: <h3><i>Users</i></h3>,
    content: <div>Data about the users of this application</div>,
    target: '.joyride-users',
    disableBeacon: true,
};
