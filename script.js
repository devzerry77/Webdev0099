// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyASkQmNYVqZLqdKwJXIPyNooOQMjCxYgr0",
  authDomain: "ff-esports-6e22d.firebaseapp.com",
  projectId: "ff-esports-6e22d",
  storageBucket: "ff-esports-6e22d.firebasestorage.app",
  messagingSenderId: "908587749122",
  appId: "1:908587749122:web:d473ff973bcb67e2bf7c1b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.firestore();

// Register user
function register() {
  const email = document.getElementById("regEmail").value;
  const pass = document.getElementById("regPass").value;

  auth.createUserWithEmailAndPassword(email, pass)
    .then(res => {
      db.collection("users").doc(res.user.uid).set({
        wallet: 50
      });
      alert("Account created! Wallet = 50 BDT");
    })
    .catch(err => alert(err.message));
}

// Login user
function login() {
  const email = document.getElementById("logEmail").value;
  const pass = document.getElementById("logPass").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => alert("Login successful"))
    .catch(err => alert(err.message));
}

// Join matches
function joinBR() { pay(5, "BR"); }
function joinCS() { pay(20, "CS"); }

function pay(amount, mode) {
  const user = auth.currentUser;
  if (!user) return alert("Login first");

  const ref = db.collection("users").doc(user.uid);

  ref.get().then(doc => {
    let wallet = doc.data().wallet;
    if (wallet < amount) {
      document.getElementById("msg").innerText = "❌ Not enough balance";
    } else {
      ref.update({ wallet: wallet - amount });
      document.getElementById("msg").innerText =
        "✅ Joined " + mode + " match!";
    }
  });
}
