import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
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
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXCscaVnTgLenIBWZ_nVInd-w2Xeps25s",
  authDomain: "fir-authentication-35cb0.firebaseapp.com",
  projectId: "fir-authentication-35cb0",
  storageBucket: "fir-authentication-35cb0.appspot.com",
  messagingSenderId: "400158249389",
  appId: "1:400158249389:web:7ab4d0984111008bedd124",
  measurementId: "G-MZMMQEYQ0S",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let registerForm = document.getElementById("sign-up-form");
let loginform = document.getElementById("log-in-form");
let loginContainer = document.getElementById('loginContainer');
// let loginContainer = document.getElementById('loginContainer');
let logoutBtn = document.getElementById("logoutBtn");
let logOutLoader = document.getElementById("logOutLoader");
let maincontainer = document.getElementById("maincontainer");
let blogappbtnContainer = document.getElementById("blogappbtn-container");
let todoappContainer = document.getElementById("todoapp-container");
let todosmaincontainer = document.getElementById("todos-maincontainer");
let blogContainer = document.getElementById("blog-container-outer");
let todoBtn = document.getElementById("todo-btn");
let todoIput = document.getElementById("todo-iput");
let todoDataContainer = document.getElementById("tododatacontainer");
let PublishBlogBtn = document.getElementById("PublishBlogBtn");
let blogWriteInput = document.getElementById("blogwrite");
let blogtitle = document.getElementById("blogtitle");
let filtermaindiv = document.getElementById("filter-main-div");
let filters = document.getElementsByName("filters");
let filterBtn = document.getElementById("filterBtn");
let getBlogdiv = document.getElementById("getBlogdiv");
let chatappContainer=document.getElementById("chatapp-container");
let userProfile =document.getElementById('userProfile');
let uid = "";

//User Authentication State Changing ----

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    gettodos();
    getBlogs();
  } else {
    console.log("User is logged out");
    // window.location.href='login.html'
  }
});
// Firebase registration/sign up Authentication ----

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(e);
  const suserInfo = {
    sfullname: e.target[0].value,
    email: e.target[1].value,
    password: e.target[2].value,
  };
  createUserWithEmailAndPassword(auth, suserInfo.email, suserInfo.password)
    .then(async (userCredential) => {
      // console.log(userCredential)
      const user = userCredential.user;
      console.log("user-->", user);
      uid = user.uid;
      // console.log(uid);
      // console.log(suserInfo);

      await setDoc(doc(db, "users", uid), suserInfo);
      alert("You have successfully registered");
      window.location.href = "login.html";
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Read this error-->", errorMessage);
      alert(errorMessage);
    });
});

//Firebase Login/sign in Authentication ----

loginform?.addEventListener("submit", (e) => {
  e.preventDefault();
  // console.log(e)

  const userInfo2 = {
    lfullname: e.target[0].value,
    lemail: e.target[1].value,
    lpassword: e.target[2].value,
  };
  signInWithEmailAndPassword(auth, userInfo2.lemail, userInfo2.lpassword)
    .then((userCredential) => {
      const user = userCredential.user;
      // console.log(user)
      if (logOutLoader) {
        logOutLoader.style.display = "block"
        loginContainer.style.display = 'none'
      }
      setTimeout(function () {

        window.location.href = "appcollection.html";
        // Add your logout logic here (e.g., redirect to login page)
        console.log("Logout successful!");
      }, 1000); // Adjust the timeout value based on your needs

      // window.location.href = "appcollection.html";
      gettodos();
    })

    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("user is not found ---> ", errorMessage);
      alert("User is not found");
    });
});

// User Signout Authentication ----

logoutBtn?.addEventListener("click", () => {
  if (maincontainer) {
    maincontainer.style.display = "none";
  }
  if (todosmaincontainer) {
    todosmaincontainer.style.display = "none";
  }
  if (blogContainer) {
    blogContainer.style.display = "none";
  }
  if (getBlogdiv && filtermaindiv) {
    getBlogdiv.style.display = "none";
    filtermaindiv.style.display = "none";
  }
  logOutLoader.style.display = "block";
  setTimeout(function () {
    window.location.href = "login.html";

    // User Signout Authentication function is here

    signOut(auth)
      .then(() => { })
      .catch((error) => { });

    // Add your logout logic here (e.g., redirect to login page)
    console.log("Logout successful!");
  }, 2000); // Adjust the timeout value based on your needs
});

// Todo App ----
todoBtn?.addEventListener("click", async () => {
  // console.log('clicked')
  if (!todoIput.value) return alert("please add an value first");
  const todosCollection = collection(db, "todos");
  try {
    const docRef = await addDoc(todosCollection, {
      test: todoIput.value,
      user: uid,
    });
    todoIput.value = "";
    gettodos();
    console.log("Document written with ID: ", docRef.id, docRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

async function gettodos() {
  if (!todoDataContainer) {
    // console.log("todoDataContainer is null");
    return;
  }
  todoDataContainer.innerHTML = null;

  const querySnapshot = await getDocs(collection(db, "todos"));
  querySnapshot.forEach((tododoc) => {
    // console.log(tododoc.data());
    const todoData = tododoc.data();

    const div = document.createElement("div");
    div.className = "todiv";
    const span = document.createElement("span");
    span.className = "tospan";
    span.innerText = todoData.test;
    const btn = document.createElement("button");
    btn.className = "deletebtn";
    btn.innerText = "delete";
    btn.id = tododoc.id;
    btn.addEventListener("click", async function () {
      console.log(this);
      await deleteDoc(doc(db, "todos", this.id));
      gettodos();
    });
    div.appendChild(span);
    div.appendChild(btn);
    todoDataContainer.appendChild(div);
  });
}

todoappContainer?.addEventListener("click", () => {
  console.log();
  window.location.href = "todos.html";
});
// Blog App ----
blogappbtnContainer?.addEventListener("click", () => {
  window.location.href = "blog.html";
  getBlogs();
});

PublishBlogBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  if (!blogWriteInput.value || !blogtitle.value)
    return alert("please write title or blog first");
  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      blogtitle: blogtitle.value,
      blog: blogWriteInput.value,
      words: wordcount(blogWriteInput.value),
      user: uid,
    });
    blogtitle.value = "";
    blogWriteInput.value = "";
    getBlogs();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

async function getBlogs(
  que = query(collection(db, 'blogs'))
) {
  if (!getBlogdiv) {
    // console.log("getBlogdiv is null");
    return;
  }
  getBlogdiv.innerHTML = null;
  const querySnapshot = await getDocs(que);
  // console.log(querySnapshot)
  querySnapshot.forEach(async (blogdoc) => {
    const bloginfo = blogdoc.data();
    // console.log("bloginfo-->", bloginfo);

    if (bloginfo.user) {
      const userRef = doc(db, "users", bloginfo.user);
      const userinfo = await getDoc(userRef);
      // console.log("userInfo--->", userinfo);
      if (userinfo.exists()) {
        // console.log("data--->", userinfo.data());
        bloginfo.userinfo = userinfo.data();
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    let { blog, blogtitle, user, userinfo } = bloginfo;

    const bdiv = document.createElement("div");
    bdiv.className = "blogdiv";
    const titlediv = document.createElement("div");
    titlediv.className = "titlediv";
    titlediv.innerText = blogtitle;
    const namediv = document.createElement("div");
    namediv.className = "namediv";
    namediv.innerText = "Published by :" + userinfo?.sfullname;
    const btextdiv = document.createElement("div");
    btextdiv.className = "btextdiv";
    btextdiv.innerText = blog;
    const bdeletbtn = document.createElement("button");
    bdeletbtn.className = "bdeletbtn";
    bdeletbtn.innerText = "delete";
    bdeletbtn.id = blogdoc.id;
    bdeletbtn?.addEventListener("click", async () => {
      await deleteDoc(doc(db, "blogs", bdeletbtn.id));
      getBlogs();
    });

    bdiv.appendChild(titlediv);
    bdiv.appendChild(namediv);
    bdiv.appendChild(btextdiv);
    bdiv.appendChild(bdeletbtn);

    getBlogdiv.appendChild(bdiv);
  });
}
// Blog filtration -----
filterBtn?.addEventListener("click", () => {
  let filtered;
  let q;
  filters.forEach((data) => {
    if (data.checked) {
      filtered = data.value;
    }
  });


  if (filtered == 50) {
    q = query(collection(db, "blogs"), where("words", "<=", 50));
  }
  if (filtered == 100) {
    q = query(collection(db, "blogs"), where("words", "<=", 100));
  }
  if (filtered == 150) {
    q = query(collection(db, "blogs"), where("words", "<=", 150));
  }
  if (filtered == 'userblogs') {
    q = query(collection(db, "blogs"), where("user", "==", uid));
  }
  if (filtered == 'All') {
    q = query(collection(db, "blogs"))
  }
  getBlogs(q);
  console.log('filter....', filtered)
  console.log('q....', q)
});

function wordcount(string) {
  const numberOfWords = string.split(/\s+/).length;
  return numberOfWords;
}
// chat App -----
chatappContainer?.addEventListener('click' , ()=>{
  alert("Chat App is under construction. Stay tuned for updates!")
})
//User Profile ----
userProfile?.addEventListener('click', ()=>{
  alert("We're working on enhancing your profile experience. This feature is coming soon!")
})