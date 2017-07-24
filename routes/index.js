/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/**
* This sample shows how to:
*    - Get the current user's metadata
*    - Get the current user's profile photo
*    - Attach the photo as a file attachment to an email message
*    - Upload the photo to the user's root drive
*    - Get a sharing link for the file and add it to the message
*    - Send the email
*/
const express = require('express');
const router = express.Router();
const graphHelper = require('../utils/graphHelper.js');
// const emailer = require('../utils/emailer.js');
const passport = require('passport');
// ////const fs = require('fs');
// ////const path = require('path');

// Get the home page.
router.get('/', (req, res) => {
  // check if user is authenticated
  if (!req.isAuthenticated()) {
    res.render('login');
  } else {
    res.redirect('/contacts');
  }
});

// Authentication request.
router.get('/login',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

// Authentication callback.
// After we have an access token, get user data and load the sendMail page.
router.get('/token',
  passport.authenticate('azuread-openidconnect', { failureRedirect: '/' }),
  (req, res) => {
    graphHelper.getUserData(req.user.accessToken, (err, user) => {
      if (!err) {
        req.user.profile.displayName = user.body.displayName;
        res.redirect('/');
      } else {
        renderError(err, res);
      }
    });
  });

// router.get('/contacts',
//   (req, res) => {
//     const name = req.user.profile.displayName;
//     graphHelper.getUserContact(req.user.accessToken, (err, contacts) => {
//       console.log('People!');
//       //  console.log(contacts.body.value);

//     graphHelper.getUserEvent(req.user.accessToken, (err, events) => {
//       console.log('Event!');
      
//       res.render('contacts', { contacts: contacts.body.value, name: name , events: events.body.value});
//       // res.render('contacts', { events: events.body.value, name: name });
      
//     });     
//     });   
//   });

router.get('/contacts',
  (req, res) => {
    const name = req.user.profile.displayName;
     const info = {
    "attendees": [{
        "type": "required", // First Attendee
        "emailAddress": {
            "name": "Pathompong Chaisri",
            "address": "T00400@g-able.com"
        }
    },  {
        "type": "required", // Third Attendee
        "emailAddress": {
            "name": "Artima C",
            "address": "Artima.C@g-able.com"
        }
    }],
    "locationConstraint": {
        "isRequired": "false",
        "suggestLocation": "true",
        "locations": [{
            "resolveAvailability": "false",
            "displayName": "KX Building Floor 13"
        }]
    },
    "timeConstraint": {
        "activityDomain": "work",
        "timeslots": [{
            "start": {
                "dateTime": "2017-08-22T09:00:00",
                "timeZone": "SE Asia Standard Time"
            },
            "end": {
                "dateTime": "2017-08-22T17:00:00",
                "timeZone": "SE Asia Standard Time"
            }
        }]
    },
    "meetingDuration": "PT2H",
    "returnSuggestionReasons": "true",
    "minimumAttendeePercentage": "100"
}

    graphHelper.getUserContact(req.user.accessToken, (err, contacts) => {
      console.log('People!');
      //  console.log(contacts.body.value);

    graphHelper.postfindMeetingTimes(req.user.accessToken,info, (err, events) => {
     

      console.log('postToMeetingAPI');
      // console.log(events.body)
      // console.log(events.body.meetingTimeSuggestions[0].meetingTimeSlot)
      // console.log(events.body.meetingTimeSuggestions[1].meetingTimeSlot)
      // console.log(events.body.meetingTimeSuggestions[2].meetingTimeSlot)
      // console.log(events.body.meetingTimeSuggestions[0].attendeeAvailability)
      console.log(events.body.meetingTimeSuggestions[0].locations)
           console.log(events.body.meetingTimeSuggestions[1].locations)
                console.log(events.body.meetingTimeSuggestions[2].locations)
      // console.log(events.body.meetingTimeSuggestions[1].meetingTimeSlot)
      // console.log(events.body.meetingTimeSuggestions[2].meetingTimeSlot)
      
      // res.render('contacts', { contacts: contacts.body.value, name: name , events: events.body.value});

      
    });     
    });   
  });


  

router.get('/disconnect', (req, res) => {
  req.session.destroy(() => {
    req.logOut();
    res.clearCookie('graphNodeCookie');
    res.status(200);
    res.redirect('/');
  });
});

// helpers
function hasAccessTokenExpired(e) {
  let expired;
  if (!e.innerError) {
    expired = false;
  } else {
    expired = e.forbidden &&
      e.message === 'InvalidAuthenticationToken' &&
      e.response.error.message === 'Access token has expired.';
  }
  return expired;
}

function renderError(e, res) {
  e.innerError = (e.response) ? e.response.text : '';
  res.render('error', {
    error: e
  });
}

module.exports = router;
