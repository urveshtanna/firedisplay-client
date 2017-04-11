'use strict';

// Initializes the Product.
function App() {
  document.addEventListener('DOMContentLoaded', function() {
    this.fabButton = document.getElementById('view-source');
    this.tvMain = document.getElementById('text-main');
    this.content = document.getElementById('main-content');
    this.iconAccount = document.getElementById('icon-account');

    this.content.style.background = 'black';
    this.tvMain.style.color = 'white';
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.fabButton.addEventListener('click',function(){
      if(firebase.auth().currentUser){
        //logout
        firebase.auth().signOut();
      }else{
        //login
        var google = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(google);
      }
    })

  }.bind(this));
};

App.prototype.listenToData = function(){
  var connected = firebase.database().ref('connected/').orderByChild('deviceId').equalTo(`${firebase.auth().currentUser.uid}`);
  connected.on('child_added', function(snapshot) {
    if(snapshot.val()){
      this.content.style.background = snapshot.val().backgroundColor;
      this.tvMain.innerHTML = snapshot.val().display;
      this.tvMain.style.color = snapshot.val().textColor;
    }
  }.bind(this));

  connected.on('child_changed', function(snapshot) {
    if(snapshot.val()){
      this.content.style.background = snapshot.val().backgroundColor;
      this.tvMain.innerHTML = snapshot.val().display;
      this.tvMain.style.color = snapshot.val().textColor;
    }
  }.bind(this));
}

// Triggered on Firebase auth state change.
App.prototype.onAuthStateChanged = function(user) {
  // If this is just an ID token refresh we exit.
  if (user && this.currentUid === user.uid) {
    return;
  }

  // Remove all Firebase realtime database listeners.
  if (this.listeners) {
    this.listeners.forEach(function(ref) {
      ref.off();
    });
  }
  this.listeners = [];
  // Adjust UI depending on user state.
  if (user) {

    //this.usersCard.style.display = 'block';
    //Show need to login page for something
    firebase.database().ref(`connected/${user.uid}`).update({
      displayName: user.displayName,
      backgroundColor: "#000000",
      connected: true,
      deviceId: `${user.uid}`,
      display: "Welcome to fireDisplay",
      textColor: "#FFFFFF"
    });
    this.listenToData();
    this.currentUid = user.uid;
    this.iconAccount.innerHTML = 'pause';
  } else {
    this.iconAccount.innerHTML = 'play_arrow';
  }
};

// Load the demo.
window.app = new App();
