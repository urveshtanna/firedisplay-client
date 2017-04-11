'use strict';

// Initializes the Product.
function App() {
  document.addEventListener('DOMContentLoaded', function() {
    this.fabButton = document.getElementById('view-source');
    this.tvMain = document.getElementById('text-main');
    this.content = document.getElementById('main-content');
    this.iconAccount = document.getElementById('icon-account');
    this.pushKey = null;

    this.content.style.background = 'black';
    this.tvMain.style.color = 'white';
    this.fabButton.addEventListener('click',function(){
      if(this.pushKey == null){
        this.pushKey = firebase.database().ref(`connected`).push().key;
        firebase.database().ref(`connected/${this.pushKey}`).update({
          backgroundColor: "#000000",
          connected: true,
          deviceId: `${this.pushKey}`,
          display: "Welcome to fireDisplay",
          textColor: "#FFFFFF"
        });
        this.listenToData();
        this.iconAccount.innerHTML = 'pause';
      }else{
        //logout
        this.iconAccount.innerHTML = 'play_arrow';
        firebase.database().ref(`connected/${this.pushKey}`).update({
          backgroundColor: null,
          connected: null,
          deviceId: null,
          display: null,
          textColor: null
        });
        this.tvMain.innerHTML = 'Welcome back!'
        this.pushKey = null;
      }
    }.bind(this));

  }.bind(this));
};

App.prototype.listenToData = function(){

  var connection = firebase.database().ref(`connected/`);
  connection.once('value', function(snapshot) {
    console.log(snapshot.val());
    if(snapshot.val()){
      this.tvMain.innerHTML = `Your device is ${snapshot.numChildren()}`;
    }
  }.bind(this));

  var ref = firebase.database().ref(`connected/${this.pushKey}`);

  var connected = firebase.database().ref('connected/').orderByChild('deviceId').equalTo(`${this.pushKey}`);
  connected.on('child_added', function(snapshot) {
    if(snapshot.val()){
      this.content.style.background = snapshot.val().backgroundColor;
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

    this.listenToData();
    this.currentUid = user.uid;
    this.iconAccount.innerHTML = 'pause';
  } else {
    this.iconAccount.innerHTML = 'play_arrow';
  }
};

// Load the demo.
window.app = new App();
