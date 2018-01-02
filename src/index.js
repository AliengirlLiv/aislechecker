import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';

 // Initialize Firebase
var config = {
  apiKey: "AIzaSyBMbooCW9LSMZgAgA3VGOVBVnCRO1_0v2I",
  authDomain: "aislechecker-3d363.firebaseapp.com",
  databaseURL: "https://aislechecker-3d363.firebaseio.com",
  projectId: "aislechecker-3d363",
  storageBucket: "",
  messagingSenderId: "1095924234727"
};
firebase.initializeApp(config);
console.log("ITS WORKING");

ReactDOM.render(
	(<App />),
	document.getElementById('root')
); 
registerServiceWorker();
