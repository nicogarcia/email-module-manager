'use strict';

// jQuery
require('jquery');

// Handlebars
require('handlebars');

// Materialize css
require('materialize-css/dist/css/materialize.min.css');
require('materialize-css/dist/js/materialize.min.js');

// Sortable
window.Sortable = require('sortablejs');

// Dropzone
window.Dropzone = require('dropzone');
require('dropzone/dist/min/dropzone.min.css');

// Firebase
var firebase = require('firebase');
var config = require('./config/firebase.config.js');
window.FirebaseApp = firebase.initializeApp(config);
window.FirebaseDb = firebase.database();
window.FirebaseStorage = firebase.storage();
