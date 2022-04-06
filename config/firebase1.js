//import firebase from "firebase";
// const firebase = require('firebase');
// const admin = require('firebase-admin');
require("firebase/auth");
//import "firebase/database";
require("firebase/firestore");
//import "firebase/functions";
require("firebase/storage");
//import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyBsVPIiTB-Mw9ePANHn37mjJkX9mz9IN0Y",
	authDomain: "tapnhire-67b12.firebaseapp.com",
	projectId: "tapnhire-67b12",
	storageBucket: "tapnhire-67b12.appspot.com",
	messagingSenderId: "763365539023",
	appId: "1:763365539023:web:3cf60a4c70ef1341c14bba",
};

const {
	initializeApp,
	applicationDefault,
	cert,
} = require("firebase-admin/app");
const {
	getFirestore,
	Timestamp,
	FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./tapnhire-67b12-firebase-adminsdk-t0tqd-66572da272.json");

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();

// let app;
// if (firebase.apps.length === 0) {
// 	app = firebase.initializeApp(firebaseConfig);
// } else {
// 	app = firebase.app();
// }
// app.firestore().settings({ persistence: false });
// const db = app.firestore();

// const auth = firebase.auth();
// const storage = firebase.storage();

module.exports = { db };
