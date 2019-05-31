import React from 'react';

export const trackNav = {
    title: <h3><i>Track Navigation</i></h3>,
    content: <div>Either swipe or use the previous/next buttons to navigate between tracks.</div>,
    target: '.swipe-step',
    placement: "bottom",
    disableBeacon: true
};

export const addNotes = {
    title: <h3><i>Adding Notes</i></h3>,
    content: <div>Here you can optionally add any notes you may have about the track.</div>,
    target: '.note-button-step',
    placement: "top",
    disableBeacon: true
};