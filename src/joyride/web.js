import * as config from "../config";
import React from 'react';

export const trackTitle = {
    title: <h3><i>Song Name</i></h3>,
    content: <div>This is the current song name. <br/> There are {config.numTracks } tracks to listen to.</div>,
    disableBeacon: true,
    target: ".first-step",
    placement: "top"
};


export const rateTracks = {
    title: <h3><i>Rate tracks</i></h3>,
    content: <div>Rate each track from 1 to 5 stars by clicking the corresponding star.</div>,
    target: '.second-step',
    disableBeacon: true,
    placement: "top"
};

export const trackListing = {
    title: <h3><i>Track Listing</i></h3>,
    content: <div>The track listing displays which tracks have been rated and what you rated them. You can also click on a track name to return to it.</div>,
    target: '.third-step',
    position: 'left',
    disableBeacon: true,

};

export const addNotes = {
    title: <h3><i>Adding Notes</i></h3>,
    content: <div>Here you can optionally add any notes you may have about the track.</div>,
    target: '.fourth-step',
    position: 'left',
    disableBeacon: true,
};

export const transport = {
    title: <h3><i>Transport</i></h3>,
    content: <div>You can also use the previous/next buttons to navigate between tracks.</div>,
    target: '.swipe-step',
    position: 'bottom',
    disableBeacon: true,
};
