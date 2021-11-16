import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCaeT5KHqea1MdidAqppJ2RBbnnALlnV7g",
  authDomain: "chatto-3e870.firebaseapp.com",
  projectId: "chatto-3e870",
  storageBucket: "chatto-3e870.appspot.com",
  messagingSenderId: "658078784528",
  appId: "1:658078784528:web:122fad8e8930fbe1da7e95"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = app.auth()
const db = app.firestore()
const storage = app.storage()

export {auth, db, storage}