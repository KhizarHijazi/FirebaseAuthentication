
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc
}
  from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXCscaVnTgLenIBWZ_nVInd-w2Xeps25s",
  authDomain: "fir-authentication-35cb0.firebaseapp.com",
  projectId: "fir-authentication-35cb0",
  storageBucket: "fir-authentication-35cb0.appspot.com",
  messagingSenderId: "400158249389",
  appId: "1:400158249389:web:7ab4d0984111008bedd124",
  measurementId: "G-MZMMQEYQ0S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let registerForm = document.getElementById('sign-up-form');
let loginform = document.getElementById('log-in-form');
let welcomeDiv = document.getElementById('welcomeDiv');
let loginContainer = document.getElementById('loginContainer');
let logoutBtn =document.getElementById('logoutBtn');
let logOutLoader =document.getElementById('logOutLoader');
let maincontainer =document.getElementById('maincontainer');
let uid = '';




// Firebase registration/sign up Authentication 

registerForm?.addEventListener("submit", e => {
  e.preventDefault()
  console.log(e)
  const userInfo = {
    email: e.target[0].value,
    password: e.target[1].value
  }
  createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log('user-->', user)
      try {
        const docRef = await addDoc(collection(db, "users"), {
          first: userInfo.email,
          last: userInfo.password
        });
        console.log("Document written with ID: ", docRef.id);
        alert('You have successfully registered')
         window.location.href='login.html'
      } catch (e) {
        console.error("Error adding document: ", e);
      }


    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Read this error-->', errorMessage)
     alert(errorMessage)
    })
 
    // if (user) {
    //       uid = user.uid
    //       signUpContainer.style.display = 'none'
    //       logInContainer.style.display = 'block'
      
    //     } else {
    //       console.log('User is logged out')
    //       signUpContainer.style.display = 'block'
    //       logInContainer.style.display = 'none'
    //     }
    
})

//Firebase Login/sign in Authentication

loginform?.addEventListener('submit', e => {
  e.preventDefault()
  console.log(e)
  const userInfo2 = {
    lemail: e.target[0].value,
    lpasword: e.target[1].value
  }
  signInWithEmailAndPassword(auth, userInfo2.lemail, userInfo2.lpasword)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      // alert('welcome ! You have successfully logged in')

      //User Authentication State Changing

onAuthStateChanged(auth, (user) => {
  if (user) {
   uid = user.uid
   loginContainer.style.display = "none"
    welcomeDiv.style.display = 'block'
    
  } else {
    console.log('User is logged out')
    loginContainer.style.display = 'block'
    welcomeDiv.style.display = 'none'
  }
})

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('user is not found ---> ', errorMessage)
      alert('User is not found')
    });

})

// User Signout Authentication

logoutBtn.addEventListener('click',()=>{

  maincontainer.style.display='none'
  logOutLoader.style.display = "block";
  setTimeout(function() {
      logOutLoader.style.display = "none";

      // User Signout Authentication function is here

      signOut(auth).then(() => {

      }) .catch((error) => {

      });

      // Add your logout logic here (e.g., redirect to login page)
      console.log("Logout successful!");
  }, 2000); // Adjust the timeout value based on your needs



    
  })
 








