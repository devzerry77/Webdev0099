/***********************
 🔥 FIREBASE CONFIG
***********************/
const firebaseConfig = {
  apiKey: "AIzaSyASkQmNYVqZLqdKwJXIPyNooOQMjCxYgr0",
  authDomain: "ff-esports-6e22d.firebaseapp.com",
  projectId: "ff-esports-6e22d",
  storageBucket: "ff-esports-6e22d.firebasestorage.app",
  messagingSenderId: "908587749122",
  appId: "1:908587749122:web:d473ff973bcb67e2bf7c1b",
  measurementId: "G-6SK7604KX2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

/***********************
 📝 REGISTER ACCOUNT
***********************/
function register() {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;
  const msg = document.getElementById("msg");

  if (!email || !pass) {
    msg.innerText = "⚠️ Fill all fields";
    return;
  }

  auth.createUserWithEmailAndPassword(email, pass)
    .then(res => {
      // Create user data
      db.collection("users").doc(res.user.uid).set({
        email: email,
        wallet: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      msg.innerText = "✅ Account created!";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
}

/***********************
 🔐 LOGIN
***********************/
function login() {
  const email = document.getElementById("logEmail").value;
  const pass = document.getElementById("logPass").value;
  const msg = document.getElementById("msg");

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      msg.innerText = "✅ Login success";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
}

/***********************
 👤 AUTH STATE
***********************/
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    // Wallet live update
    db.collection("users").doc(user.uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          document.getElementById("wallet").innerText = "৳" + doc.data().wallet;
        }
      });

    // BR count
    db.collection("br_matches")
      .onSnapshot(snap => {
        document.getElementById("brCount").innerText = snap.size;
      });

    // CS count
    db.collection("cs_matches")
      .onSnapshot(snap => {
        document.getElementById("csCount").innerText = snap.size;
      });
  }
});

/***********************
 🎮 JOIN BR MATCH
***********************/
function joinBR() {
  const user = auth.currentUser;
  if (!user) return alert("Login first");

  const userRef = db.collection("users").doc(user.uid);

  userRef.get().then(doc => {
    if (doc.data().wallet < 5) {
      alert("❌ Not enough balance");
      return;
    }

    // Deduct wallet
    userRef.update({
      wallet: firebase.firestore.FieldValue.increment(-5)
    });

    // Add to BR match
    db.collection("br_matches").add({
      uid: user.uid,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Joined BR Match");
  });
}

/***********************
 ⚔️ JOIN CS MATCH
***********************/
function joinCS() {
  const user = auth.currentUser;
  if (!user) return alert("Login first");

  const userRef = db.collection("users").doc(user.uid);

  userRef.get().then(doc => {
    if (doc.data().wallet < 20) {
      alert("❌ Not enough balance");
      return;
    }

    // Deduct wallet
    userRef.update({
      wallet: firebase.firestore.FieldValue.increment(-20)
    });

    // Add to CS match
    db.collection("cs_matches").add({
      uid: user.uid,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Joined CS Match");
  });
}
