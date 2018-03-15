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

// List of different snaps
var snaps; 
var room1;
var userSnap;
var room1Player1;
var room1Player2;
var msg;

var userID;
var userWinNum;
var userLossNum;
var userInGameName;
var userEmail;
var msgCount = 0;
var msgDelete = 0;
var rm1seat1, rm1seat2;
var userSeatNum;
var playerChoice;
var enemyName;
var enemyChoice;
var winner;

dbRef.on('value', function(snapshot){
  snaps = snapshot.val().usernames;
   room = snapshot.val().room1;

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


// Display buttons to allow players to sit in seat 1 and 2 and remove them after a player sits on it
database.ref('room1/seats/Seat1/').on('value',function(snapshot){
  room1 = snapshot.val();
  rm1seat1 = snapshot.val().seated;
  if(rm1seat1 === false){
    var sitBtn = $("<button>").attr({
      class: "btn btn-primary",
      id : "player-1-sit-r1",
      onclick : "player1Sit()"
    }).text("SIT");
    $("#player-1").append(sitBtn);
    
  }else{
    $("#player-1-sit-r1").remove();
  };
  
}), function (error){
  console.log(error);
};

database.ref('room1/seats/Seat2/').on('value',function(snapshot){
  room1 = snapshot.val();
  rm1seat2 = snapshot.val().seated;
  
  if(rm1seat2 === false){
    var sitBtn = $("<button>").attr({
      class: "btn btn-primary",
      id : "player-2-sit-r1",
      onclick : "player2Sit()"
    }).text("SIT");
    $("#player-2").append(sitBtn);


  }else{
    $("#player-2-sit-r1").remove();
  };
}), function (error){
  console.log(error);
};


// Displays player 1 stats
database.ref('room1/players/player1/').on('value',function(snapshot){
  room1Player1 = snapshot.val();
  var player1 = room1Player1;
  var Name = player1.username;
  var Win = player1.wins;
  var Loss = player1.loss;

  
  if (Name == 'currentlynoone'){
    $("#p1-name, #p1-stats").empty();
  }else{
    $("#p1-name").text(Name);
    $("#p1-stats").text("Wins: " + Win + " Loss: " + Loss);
  };
 
}), function (error){
  console.log(error);
};

database.ref('room1/players/player2/').on('value', function(snapshot){
  room1Player2 = snapshot.val();
  var player2 = room1Player2;
  var Name = player2.username;
  var Win = player2.wins;
  var Loss = player2.loss;
  if (Name == 'currentlynoone'){
    $("#p2-name, #p2-stats").empty();
  }else {
    $("#p2-name").text(Name);
    $("#p2-stats").text("Wins: " + Win + " Loss: " + Loss);
  };
}), function (error){
  console.log(error);
};


database.ref('room1/players/').on('value', function(snapshot){
  var p1 = snapshot.val().player1.username;
  var p2 = snapshot.val().player2.username;
  var p1r = snapshot.val().ready.p1ready.ready;
  var p2r = snapshot.val().ready.p2ready.ready;
  
  if (p1 === 'currentlynoone' && p2 !== 'currentlynoone'){

    $("#p2-wait-status").remove();
    var  waitp1 = $("<div>").attr({
      class : "row player-wait",
      id : "p2-wait-status"
    }).text("Waiting for player 1 to join");
    $("#player-1").append(waitp1);

  }else if (p1 !== 'currentlynoone' && p2 === 'currentlynoone'){

    $("#p1-wait-status").remove();
    var  waitp2 = $("<div>").attr({
      class : "row player-wait",
      id : "p1-wait-status"
    }).text("Waiting for player 2 to join");
    $("#player-2").append(waitp2);

  }else {
    $("#p1-wait-status, #p2-wait-status").remove();
   
    setTimeout(function(){ 
      if (p1r === true && p2r === true){
        startGame(userSeatNum);
      };
      
     }, 2000);

  };

}), function (error){
  console.log(error);
};

database.ref('room1/seats/').on('value', function(snapshot){
  var p1Name = snapshot.val().Seat1.seated;
  var p2Name = snapshot.val().Seat2.seated;
  var p1IsChosen = snapshot.val().Seat1.choice;
  var p2IsChosen = snapshot.val().Seat2.choice;

  if (p1IsChosen !== false && p2IsChosen !== false){
      $(".choice-btn").prop('disabled', true);
      $("#ruling-display").text("Boths players have made their decision");
      setTimeout(function(){
          $("#p1-display").text(p1IsChosen);
          $("#p2-display").text(p2IsChosen); 
        var winner =  gameRuling(p1IsChosen, p2IsChosen);
          if (winner === 'P1'){
            $("#ruling-display").text(p1Name + " has won!");
            if (userInGameName === p1Name){
              userWinNum++;
              updateInfo();
            }else {
              userLossNum++;
              updateInfo();
            }; 
          } else if (winner === 'P2'){
            $("#ruling-display").text(p2Name + " has won!");
            if (userInGameName === p2Name){
              userWinNum++;
              updateInfo();
            }else {
              userLossNum++;
              updateInfo();
            }; 
          } else {
            $("#ruling-display").text("Player 1 and 2 both chose the same choice! It's a Tie!");
          };

          if (userSeatNum === 1){
            database.ref('room1/seats/Seat1/').set({
              choice : false,
              seated : userInGameName
            }); 
          };
          if (userSeatNum === 2){
            database.ref('room1/seats/Seat2/').set({
              choice : false,
              seated : userInGameName
            }); 
          };
         }, 2000);
      setTimeout(function(){

        displayReplay();
      },2500 )   
      

  };
}), function (error){
  console.log(error);
};

database.ref('homeChat/').on('child_added', function(snapshot){
   msg = snapshot.val().message;

  if(msgCount !== 20 && msgDelete === 0){
      displayMsg();
  }else if (msgCount === 20 || msgDelete !== 0){
    if (msgCount === 20){
      msgCount = 0;
    }
    if (msgDelete === 20){
      msgDelete = 0;
    };
    $("#msg-" +  msgDelete).remove();
    displayMsg();
    msgDelete++;
  };

}),function (error){
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
            userID = user.uid;
            database.ref('users/' + userID).on('value', function (snapshot){
              userSnap = snapshot.val();
              userWinNum = parseInt(userSnap.winCount.count);
              userLossNum = parseInt(userSnap.lossCount.count);
              userInGameName = userSnap.username;
              userEmail = userSnap.email;
              
           
            });
            sessionStorage.setItem('userWinNum', userWinNum);
            sessionStorage.setItem('userLossNum', userLossNum);
            sessionStorage.setItem('userInGameName', userInGameName);
            sessionStorage.setItem('userID',userID);
            sessionStorage.setItem('userEmail',userEmail);
            displayGameHome();
          };
        };
       }, 1000);

 
  };
};


function authenticateInfo(string, email, password, passwordAuth){
  console.log(string);
   if (email.indexOf("@") === -1 || email.indexOf(".com") === -1){
      var errorDisplay = $("<p>").attr({
        class: "error-message"
        }).text("Your email is incorrect");
         console.log(errorDisplay);
        $("#sign-in-box").prepend(errorDisplay);
        return false;
      }else if (string = "signUp"){
    // Making sure the passwords match and is at least 6 characters
      if (password !== passwordAuth || password.length < 6) {
      //Displays an error if password criteria is not bet
      var errorDisplay = $("<p>").attr({
        class: "error-message"
      }).text("Your password either, does not match, or is not at least 6 characters.");
      console.log(errorDisplay);
      $("#sign-in-box").prepend(errorDisplay);
      return false;
      }else {
        return true;
      };
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
        winCount : {
          count: 0
        },
        lossCount: {
          count : 0
        } 
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
  
  $("#send-message").on('click', function(e){
    event.preventDefault();
    var message = $("#user-chat").val().trim();
    if (message !== ""){
   
       database.ref('homeChat/').push({
         message: userInGameName + ": " + message
       })
      

    }
    $("#user-chat").val("");
  })

};

function displayMsg(){
  var messageDiv = $("<div>").attr({
    class: "chat-message",
    id : "msg-" + msgCount
     });
    $(messageDiv).append(msg);
    $("#chat-box").prepend(messageDiv);
    msgCount++;
};

function updateInfo(){
  database.ref('users/' + userID).set({
    email : userEmail,
    lossCount : {
        count : parseInt(userLossNum)
    },
    uid : userID,
    username : userInGameName,
    winCount : {
        count : parseInt(userWinNum)
    }
});
  if (userSeatNum === 1){
    database.ref("room1/players/player1/").set({
      loss : parseInt(userLossNum),
      username : userInGameName,
      wins : parseInt(userWinNum)
    });
  };
  if (userSeatNum === 2){
    database.ref("room1/players/player2/").set({
      loss : parseInt(userLossNum),
      username : userInGameName,
      wins : parseInt(userWinNum)
    });
  }
};