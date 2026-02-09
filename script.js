/***********************
 FIREBASE CONFIG
***********************/
const firebaseConfig = {
  apiKey: "AIzaSyASkQmNYVqZLqdKwJXIPyNooOQMjCxYgr0",
  authDomain: "ff-esports-6e22d.firebaseapp.com",
  projectId: "ff-esports-6e22d",
  storageBucket: "ff-esports-6e22d.firebasestorage.app",
  messagingSenderId: "908587749122",
  appId: "1:908587749122:web:d473ff973bcb67e2bf7c1b"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

/***********************
 REGISTER
***********************/
function register() {
  const email = regEmail.value;
  const pass = regPass.value;
  msg.innerText = "Creating account...";

  auth.createUserWithEmailAndPassword(email, pass)
    .then(res => {
      return db.collection("users").doc(res.user.uid).set({
        email: email,
        wallet: 0,
        banned: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => msg.innerText = "✅ Account created")
    .catch(err => msg.innerText = err.message);
}

/***********************
 LOGIN
***********************/
function login() {
  auth.signInWithEmailAndPassword(logEmail.value, logPass.value)
    .catch(err => msg.innerText = err.message);
}

/***********************
 AUTH STATE
***********************/
auth.onAuthStateChanged(user => {
  if (!user) return;

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  // USER DATA
  db.collection("users").doc(user.uid).onSnapshot(doc => {
    if (!doc.exists) return;

    if (doc.data().banned === true) {
      alert("❌ Your account is banned");
      auth.signOut();
      return;
    }

    wallet.innerText = "৳" + doc.data().wallet;
  });

  // BR COUNT
  db.collection("br_matches").onSnapshot(snap => {
    brCount.innerText = snap.size;
  });

  // CS COUNT
  db.collection("cs_matches").onSnapshot(snap => {
    csCount.innerText = snap.size;
  });
});

/***********************
 JOIN BR
***********************/
function joinBR() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = db.collection("users").doc(user.uid);

  userRef.get().then(doc => {
    if (doc.data().wallet < 5) {
      alert("❌ Not enough balance");
      return;
    }

    userRef.update({
      wallet: firebase.firestore.FieldValue.increment(-5)
    });

    db.collection("br_matches").add({
      uid: user.uid,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Joined BR Match");
  });
}

/***********************
 JOIN CS
***********************/
function joinCS() {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = db.collection("users").doc(user.uid);

  userRef.get().then(doc => {
    if (doc.data().wallet < 20) {
      alert("❌ Not enough balance");
      return;
    }

    userRef.update({
      wallet: firebase.firestore.FieldValue.increment(-20)
    });

    db.collection("cs_matches").add({
      uid: user.uid,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Joined CS Match");
  });
}
