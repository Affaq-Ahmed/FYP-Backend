require("firebase/firestore");
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
const {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} = require("firebase-admin/storage");

const serviceAccount = require("./tapnhire-67b12-firebase-adminsdk-t0tqd-66572da272.json");

const firebaseConfig = {
	apiKey: "AIzaSyBsVPIiTB-Mw9ePANHn37mjJkX9mz9IN0Y",
	authDomain: "tapnhire-67b12.firebaseapp.com",
	projectId: "tapnhire-67b12",
	storageBucket: "tapnhire-67b12.appspot.com",
	messagingSenderId: "763365539023",
	appId: "1:763365539023:web:3cf60a4c70ef1341c14bba",
};

initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();
const storage = getStorage();

module.exports = { db, storage, ref, uploadBytesResumable, getDownloadURL };
