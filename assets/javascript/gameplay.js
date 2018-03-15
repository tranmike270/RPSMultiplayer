userID = sessionStorage.getItem("userID");
userInGameName = sessionStorage.getItem("userInGameName");
userLossNum = parseInt(sessionStorage.getItem("userLossNum"));
userWinNum = parseInt(sessionStorage.getItem("userWinNum"));
userEmail = sessionStorage.getItem("userEmail");


$("#send-message").on('click', function(e){
    event.preventDefault();
    var message = $("#user-chat").val().trim();
    if (message !== ""){
       console.log(message);
       database.ref('homeChat/').push({
         message: userInGameName + ": " + message
       })
      

    }
    $("#user-chat").val("");
});


function player1Sit(){
    database.ref('room1/players/player1/').set({
        loss : userLossNum,
        username : userInGameName,
        wins : userWinNum
      });
      database.ref('room1/seats/Seat1/').set({
        choice : false,  
        seated : userInGameName
      });
      database.ref('room1/players/ready/p1ready').set({
        ready : true
      });
      var rock = $("<button>").attr({
          class : "btn btn-primary choice-btn",
          id : "rock-btn",
          value: "rock"
      }).prop('disabled', true).text("Rock");
      var paper = $("<button>").attr({
        class : "btn btn-primary choice-btn",
        id : "paper-btn",
        value: "paper"
      }).prop('disabled', true).text("Paper");
      var scissors = $("<button>").attr({
        class : "btn btn-primary choice-btn",
        id : "scissors-btn",
        value: "scissors"
      }).prop('disabled', true).text("Scissors");

      $("#p1-choices").append(rock, paper, scissors);

      userSeatNum = 1;
};

function player2Sit(){
      database.ref('room1/players/player2/').set({
        loss : userLossNum,
        username : userInGameName,
        wins : userWinNum
      });
      database.ref('room1/seats/Seat2/').set({
        choice : false,  
        seated : userInGameName
      });
      database.ref('room1/players/ready/p2ready').set({
        ready : true
      });
      var rock = $("<button>").attr({
        class : "btn btn-primary choice-btn",
        id : "rock-btn",
        value: "rock"
      }).prop('disabled', true).text("Rock");
      var paper = $("<button>").attr({
        class : "btn btn-primary choice-btn",
        id : "paper-btn",
        value: "paper"
      }).prop('disabled', true).text("Paper");
      var scissors = $("<button>").attr({
        class : "btn btn-primary choice-btn",
        id : "scissors-btn",
        value: "scissors"
      }).prop('disabled', true).text("Scissors");

      $("#p2-choices").append(rock, paper, scissors);

      userSeatNum = 2;
};

function startGame(userSeatNum){

    $(".choice-btn").prop('disabled', false);

    $(".choice-btn").on('click', function(){
       
        playerChoice = $(this).val();
        
        if (userSeatNum === 1){
            database.ref('room1/seats/Seat1/').set({
                choice : playerChoice,
                seated : userInGameName
            });
        };
        if (userSeatNum === 2){
            database.ref('room1/seats/Seat2/').set({
                choice : playerChoice,
                seated : userInGameName
            });
        };

        
    });
    
    

};

function gameRuling(p1Choice, p2Choice){
    var winner;
    if (p1Choice === 'rock' && p2Choice === 'paper'){
        winner = "P2";
   

    }else if (p1Choice == 'rock' && p2Choice === 'scissors'){

        winner = "P1";
        

    }else if (p1Choice === 'paper' && p2Choice === 'rock'){

        winner = "P1";
        

    }else if (p1Choice === 'paper' && p2Choice === 'scissors'){
        winner = "P2";
   

    }else if (p1Choice === 'scissors' && p2Choice === 'rock'){
        winner = "P2";
   

    }else if (p1Choice === 'scissors' && p2Choice === 'paper'){

        winner = "P1";
        

    }else {
        winner = "Tie";
        

    };
    database.ref('room1/players/round/').set({
        round : 1
    });

return winner;
    // startGame(userSeatNum);
};

function displayReplay(){
    $(".choice-btn").prop('disabled', true);
    if (userSeatNum === 1){
        var playAgain = $("<button>").attr({
            class : "btn btn-primary replay-btn",
            id : "p1-replay-btn",
        }).text("Play Again");
        $("#p1-replay-holder").append(playAgain);
        var leaveBtn = $("<button>").attr({
            class : "btn btn-primary leave-btn",
            id : "p1-leave-btn"
        }).text("")
        $("#p1-replay-btn").on('click', function(){
            database.ref('room1/seats/Seat1/').set({
                choice : false,
                seated : userInGameName
            }); 

            database.ref('room1/players/ready/p1ready').set({
                ready : true
              });
            $("#p1-replay-btn").remove();
        });
    };
    if (userSeatNum === 2){
        var playAgain = $("<button>").attr({
            class : "btn btn-primary replay-btn",
            id : "p2-replay-btn",
        }).text("Play Again");
        $("#p2-replay-holder").append(playAgain);

        $("#p2-replay-btn").on('click', function(){
            database.ref('room1/seats/Seat2/').set({
                choice : false,
                seated : userInGameName
            }); 
            database.ref('room1/players/ready/p2ready').set({
                ready : true
              });
            $("#p2-replay-btn").remove();
        });     
    };
    

};
$(window).on('beforeunload' ,function(){
    var user1;
    var user2;
    database.ref('room1/players/').once('value', function(snapshot){
        user1 = snapshot.val().player1.username;
        user2 = snapshot.val().player2.username;
    });
    if (userInGameName === user1){  
        database.ref('room1/players/player1/').set({
            loss : 0,
            username : "currentlynoone",
            wins : 0
        });
        database.ref('room1/seats/Seat1/').set({
            choice : false,
            seated : false
        }); 
        database.ref('room1/players/ready/p1ready').set({
            ready : false
          });
        $("#p1-choices").empty();
    };
    if (userInGameName === user2){  
        database.ref('room1/players/player2/').set({
            loss : 0,
            username : "currentlynoone",
            wins : 0
        });
        database.ref('room1/seats/Seat2/').set({
            choice : false,
            seated : false
        }); 
        database.ref('room1/players/ready/p1ready').set({
            ready : false
          });
        $("#p2-choices").empty();
    };
    
});