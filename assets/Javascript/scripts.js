// Initialize Firebase

var config = {
  apiKey: "AIzaSyBiHchHuAwCLJ3m6gDNclStSKadNne48IQ",
  authDomain: "rps-multiplayer-6f022.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-6f022.firebaseio.com",
  projectId: "rps-multiplayer-6f022",
  storageBucket: "rps-multiplayer-6f022.appspot.com",
  messagingSenderId: "486925903227"
};
firebase.initializeApp(config);

// Initialize Firebase
// Decarlaring global varibales
var user;
var names = [];
var namesTotal;
var displayName;

// Setting the firebase database equal to variable database
var database = firebase.database();
var authenticate = firebase.auth();
var dbRef = database.ref();
var dbRefUsernames = database.ref('usernames/');
var snaps; 
dbRefUsernames.on('child_added', function(snapshot){
  snaps = snapshot.val();
  var userCount = Object.keys(snaps).length;
  for (var i = 0; i < userCount; i++)
  {
    var keys = Object.keys(snaps);
    var usernameTxt = keys[i];

    namesTotal = names.push(usernameTxt);
  };
}), function (error){
  console.log(error);
};

// Controlers
var signIn = false;


// Event listener for users signup
$("#sign-up-btn").on("click", function(e) {
  event.preventDefault();
  $(".error-message").remove();
  // Setting all the input values to its appropriate variables
  var email = $("#email").val().trim();
  var password = $("#password").val().trim();
  var passwordAuth = $("#password-auth").val().trim();

  var correct = authenticateInfo("signUp", email, password, passwordAuth);
  console.log(correct);
  // Checking if the email is incorrect
  if (correct === true){ 
        errorSignUp = false;
        authenticate.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        errorSignUp = true;
        var errorCode = error.code;
        var errorMessage = error.message;
        var errorDisplay = $("<p>").attr({
          class: "error-message"
        }).text(errorMessage);
        $("#sign-in-box").prepend(errorDisplay);
        console.log(errorMessage);
        console.log("There was an Error");
        // ...
        
      });
      //Set timeout to give time for error callback
      setTimeout(function(){ 
        if (errorSignUp === false){
        goToSignIn();
        };
       }, 1000);
    
  };
});
// });


// Event listener for clicking the sign in button
$("#sign-in-btn").on("click",function(e){
  event.preventDefault();
  if(signIn === false){
    goToSignIn();   
  }else {
    signInUser();
  };
});




// Function that takes user to the sign in page
function goToSignIn(){
  $(".lead").text("Sign in to continue your climb as the Rock, Paper Scissors Master!");
  $("#password-auth-lb, #password-auth, #sign-up-btn, #sign-in-btn-lb, #password-error").remove();
  $("#email, #password").val("");
  signIn = true;
};

//Function that happens when user signs in
function signInUser(){
    $("p.error-message").remove();
    var email = $("#email").val().trim();
    var password = $("#password").val().trim();
    var correct = authenticateInfo("signIn",email, password, password)
    var signInUser = true;
    if (correct === true){
        authenticate.signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        var errorDisplay = $("<p>").attr({
          class: "error-message"
          }).text(errorMessage);
        $("#sign-in-box").prepend(errorDisplay);
        console.log("There was an Error");
        signInUser = false;
        // ...
      });
      // If the user does not yet have a display name send user to page to create a display name
      
       setTimeout(function(){ 
        if (signInUser === true){

       
          user = authenticate.currentUser;
          firebase.auth().onAuthStateChanged(function(user) {
  
            // var username = usernameTxt.value;
          
            if (user) {
              
  
          
              console.log("User is signed in.");
            } else {
              console.log("No user is signed in.");
          
            }
          });
          if (user.displayName === null){
  
            setDisplayName();
          }else{
            displayGameHome();
          };
        };
       }, 1000);
       console.log(signInUser);
 
  };
};


function authenticateInfo(string, email, password, passwordAuth){

   if (email.indexOf("@") === -1 || email.indexOf(".com") === -1){
      var errorDisplay = $("<p>").attr({
        class: "error-message"
        }).text("Your email is incorrect");
         console.log(errorDisplay);
        $("#sign-in-box").prepend(errorDisplay);
        return false;
      }else if (string === "signUp"){
    // Making sure the passwords match and is at least 6 characters
      if (password !== passwordAuth || password.length < 6) {
      //Displays an error if password criteria is not bet
      var errorDisplay = $("<p>").attr({
        class: "error-message"
      }).text("Your password either, does not match, or is not at least 6 characters.");
      console.log(errorDisplay);
      $("#sign-in-box").prepend(errorDisplay);
      return false;
      }
    }else{
      console.log("true");
    return true;
    };
};
// Function that allows users to set their display name
function setDisplayName(){
  $("#front-page-title").remove();
  $("#begin-form").empty();

  $("p.lead").text("You're almost there! Create a display name for yourself!");

  var input = $("<input>").attr({
    type: "text",
    id : "display-name-input",
    class: "form-control",
    placeholder: "Your display name!"
  });
  $("#begin-form").append(input);

  var btn = $("<button>").attr({
    type: "button",
    id : "display-name-input-btn",
    class: "btn btn-primary btn-lg",
  }).text("Continue");
  $("#begin-form").append(btn);
  //Event listener for user to input their display name
  $("#display-name-input-btn").on("click", function(e){

   

    displayName = $("#display-name-input").val().trim();
    if(names.includes(displayName) === true){
      $("p.lead").text("Unfortunately that username has been taken! Please choose a new one.");
    }else{
      database.ref('users/' + user.uid).set({
        email: user.email,
        uid: user.uid,
        username: displayName,
        winCount : 0,
        lossCount: 0
      }),(function(error){
        console.log(error);
        console.log(error.message);
      });
      database.ref('usernames/'+ displayName).set(user.uid),(function(error){
        console.log(error);
        console.log(error.message);
      });
      
      user.updateProfile({
        displayName: displayName
      });
      
      displayGameHome();
    };
});
};
function displayGameHome(){
  $("#sign-in-box").remove();
  $("#game-home-page").css("visibility", "visible");
  

};