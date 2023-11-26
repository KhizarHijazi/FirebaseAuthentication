
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
  addDoc,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  setDoc,
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
let loginContainer = document.getElementById('loginContainer');
let logoutBtn = document.getElementById('logoutBtn');
let logOutLoader = document.getElementById('logOutLoader');
let maincontainer = document.getElementById('maincontainer');
let blogappbtnContainer=document.getElementById('blogappbtn-container');
let todoappContainer= document.getElementById('todoapp-container');
let todosmaincontainer =document.getElementById('todos-maincontainer');
let blogContainer = document.getElementById('blog-container-outer');
let todoBtn = document.getElementById('todo-btn');
let todoIput = document.getElementById('todo-iput');
let todoDataContainer = document.getElementById('tododatacontainer');
let PublishBlogBtn =document.getElementById('PublishBlogBtn');
let blogWriteInput =document.getElementById('blogwrite');
let blogtitle =document.getElementById('blogtitle');
let getBlogdiv =document.getElementById('getBlogdiv');
let uid = '';



  //User Authentication State Changing

  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid
      gettodos()
      getBlogs ()
      
    } else {
      console.log('User is logged out')
      // window.location.href='login.html'
    }
  })
// Firebase registration/sign up Authentication 

registerForm?.addEventListener("submit", e => {
  e.preventDefault()
  console.log(e)
  const suserInfo = {
    sfullname: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value,
  }
  createUserWithEmailAndPassword(auth, suserInfo.email, suserInfo.password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log('user-->', user)
    uid =user.uid
    console.log(uid)
    console.log(suserInfo)

    await setDoc(doc(db, "users", uid),suserInfo);
    alert('You have successfully registered')
    window.location.href = 'login.html'
  })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Read this error-->', errorMessage)
      alert(errorMessage)
    })

})

//Firebase Login/sign in Authentication

loginform?.addEventListener('submit', e => {
  e.preventDefault()
  // console.log(e)
  const userInfo2 = {
    lfullname: e.target[0].value,
    lemail: e.target[1].value,
    lpassword: e.target[2].value
  }
  signInWithEmailAndPassword(auth, userInfo2.lemail, userInfo2.lpassword)
    .then((userCredential) => {
      const user = userCredential.user;
      // console.log(user)

      window.location.href='appcollection.html'
      gettodos()
    })
   
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('user is not found ---> ', errorMessage)
      alert('User is not found')
    });

})




// User Signout Authentication

logoutBtn?.addEventListener('click', () => {
if(maincontainer){
  maincontainer.style.display = 'none'
}
if(todosmaincontainer){
  todosmaincontainer.style.display = 'none'
}
if(blogContainer){
  blogContainer.style.display = 'none'
}
if(getBlogdiv){
  getBlogdiv.style.display = 'none'
}
  logOutLoader.style.display = "block";
  setTimeout(function () {
    window.location.href='login.html'

    // User Signout Authentication function is here

    signOut(auth).then(() => {

    }).catch((error) => {

    });

    // Add your logout logic here (e.g., redirect to login page)
    console.log("Logout successful!");
  }, 2000); // Adjust the timeout value based on your needs

})

todoBtn?.addEventListener('click', async () => {
  // console.log('clicked')
  if (!todoIput.value) return alert('please add an value first')
  const todosCollection = collection(db, 'todos')
  try {

    const docRef = await addDoc(todosCollection, {
      test: todoIput.value,
      user : uid
    });
    todoIput.value = ''
    gettodos()
    console.log("Document written with ID: ", docRef.id, docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

})

async function gettodos() {
  if (!todoDataContainer) {
    // console.log("todoDataContainer is null");
    return;
  }
  todoDataContainer.innerHTML = null

  const querySnapshot = await getDocs(collection(db, 'todos'));
  querySnapshot.forEach((tododoc) => {
    // console.log(tododoc.data());
    const todoData = tododoc.data()

    const div = document.createElement('div')
    div.className = 'todiv';
    const span = document.createElement('span') 
    span.className = 'tospan';
    span.innerText = todoData.test
    const btn = document.createElement('button')
    btn.className = 'deletebtn';
    btn.innerText = 'delete'
    btn.id = tododoc.id
    btn.addEventListener('click', async function () {
      console.log(this)
      await deleteDoc(doc(db, 'todos', this.id));
      gettodos()
    })
    div.appendChild(span)
    div.appendChild(btn)
    todoDataContainer.appendChild(div)
  });

}

todoappContainer?.addEventListener('click' , ()=>{
  console.log();
  window.location.href='todos.html'
})

blogappbtnContainer?.addEventListener('click' , ()=>{
  window.location.href='blog.html'
  getBlogs ()

})

PublishBlogBtn?.addEventListener('click', async(e)=>{
  e.preventDefault()
 
  if (!blogWriteInput.value || !blogtitle.value) return alert('please write title or blog first')
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      blogtitle : blogtitle.value,
      blog : blogWriteInput.value,
      user : uid
    });
    blogtitle.value= ''
    blogWriteInput.value = ''
    getBlogs ()
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
})

async function getBlogs (){
  if (!getBlogdiv) {
    // console.log("getBlogdiv is null");
    return;
  }
  getBlogdiv.innerHTML = null;
  const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach(async(blogdoc) => {
  const bloginfo =blogdoc.data()
  console.log('bloginfo-->' ,bloginfo)
  // console.log(`${blogdoc.id} => ${blogdoc.data()}`);
  const userRef = doc(db, "users", bloginfo.user);
  const userinfo = await getDoc(userRef);
  console.log('userinfo-->' ,userinfo.data())
  bloginfo.userinfo = userinfo.data()
  
  let {blog , blogtitle , user , userinfo:{sfullname}} = bloginfo

  const bdiv =document.createElement("div");
  bdiv.className='blogdiv'
  const titlediv =document.createElement('div');
  titlediv.className ='titlediv'
  titlediv.innerText=blogtitle
  const namediv =document.createElement('div');
  namediv.className='namediv'
  namediv.innerText='Published by :'+sfullname
  const btextdiv =document.createElement('div');
  btextdiv.className='btextdiv'
  btextdiv.innerText =blog
  const bdeletbtn =document.createElement('button');
  bdeletbtn.className='bdeletbtn'
  bdeletbtn.innerText ='delete'
  bdeletbtn.id=blogdoc.id
  bdeletbtn?.addEventListener('click', async()=>{
    // console.log(event.target.id)
    // console.log(event)
    await deleteDoc(doc(db, "blogs", bdeletbtn.id));
    getBlogs()
  })

  bdiv.appendChild(titlediv)
  bdiv.appendChild(namediv)
  bdiv.appendChild(btextdiv)
  bdiv.appendChild(bdeletbtn)

  getBlogdiv.appendChild(bdiv)

});

}




