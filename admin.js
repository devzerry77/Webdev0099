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

const ADMIN_EMAIL = "zerryfun@gmail.com";

/***********************
 ADMIN LOGIN
***********************/
function adminLogin() {
  auth.signInWithEmailAndPassword(adminEmail.value, adminPass.value)
    .then(res => {
      if (res.user.email !== ADMIN_EMAIL) {
        alert("❌ Not admin");
        auth.signOut();
        return;
      }
      document.querySelector(".card").classList.add("hidden");
      adminPanel.classList.remove("hidden");
    })
    .catch(err => alert(err.message));
}

/***********************
 ADD MONEY
***********************/
function addMoney() {
  db.collection("users").doc(uidMoney.value).update({
    wallet: firebase.firestore.FieldValue.increment(Number(amount.value))
  }).then(() => alert("✅ Money added"));
}

/***********************
 BAN / UNBAN
***********************/
function banUser() {
  db.collection("users").doc(uidBan.value).update({ banned: true })
    .then(() => alert("🚫 User banned"));
}

function unbanUser() {
  db.collection("users").doc(uidBan.value).update({ banned: false })
    .then(() => alert("✅ User unbanned"));
}

/***********************
 CREATE USER
***********************/
function createUser() {
  auth.createUserWithEmailAndPassword(newEmail.value, newPass.value)
    .then(res => {
      return db.collection("users").doc(res.user.uid).set({
        email: newEmail.value,
        wallet: 0,
        banned: false
      });
    })
    .then(() => alert("✅ User created"))
    .catch(err => alert(err.message));
}
