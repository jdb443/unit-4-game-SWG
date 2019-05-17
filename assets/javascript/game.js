/* Jonathan Behar HW 4 Star Wars Game JS */

var character = [
    createChar("Obi-Wan Kanobi", 120, 8, 10, "obi-wan-kenobi-alec.jpg", "obi_noback.png"),
    createChar("Luke Skywalker", 100, 15, 5, "Luke_Skywalker.jpg", "luke_skywalker_noback.png"),
    createChar("Darth Maul", 150, 7, 20, "Darth_Maul.jpg", "darth_maul_noback.png"),
    createChar("Darth Sidious", 180, 4, 25, "Darth_sidious.jpg", "Darth_Sidious_noback.png")];
    
function createChar(name, hp, ap, counter, pic, jpeg) {
    var details = {
        name: name,
        hp: hp,
        ap: ap,
        counter: counter,
        pic: pic,
        jpeg: jpeg
    };
    return details;
}

$(document).ready(function() {
  
    var allAudio = {
      volume: true,
      hit: new Audio("assets/audio/R2D2_sounds.mp3"),
      music: new Audio("assets/audio/SW_Imperial_March.mp3")
    };
    allAudio.music.loop = true;
  
    $("#volumeButton").on("click", function() {
      if (allAudio.volume) {
        $("#volumeButton").attr("class", "fas fa-volume-off");
        allAudio.hit.muted = true;
        allAudio.music.muted = true;
      }
      else {
        $("#volumeButton").attr("class","fas fa-volume-up");
        allAudio.hit.muted = false;
        allAudio.music.muted = false;
      }
      allAudio.volume = !allAudio.volume;
    });
  
  
    var starWarsRPG = {
      currentPlayer: -1,
      currentOpponent: -1,
      remainingOpponents: [0,1,2,3],
      currentPlayerHealth: 0,
      currentOpponentHealth: 0,
      currentAP: 1,
      opponentDead: false
    }
  
    function addChars(chooseType, displayArea) {
      displayArea.html("");
      for(var i=0;i<starWarsRPG.remainingOpponents.length;i++) {
        var newDiv = $("<div>");
        var innerDiv = $("<div>");
        newDiv.addClass("col-xs-3 character-" + (starWarsRPG.remainingOpponents[i]+1));
        innerDiv.attr("value", starWarsRPG.remainingOpponents[i]);
        innerDiv.attr("name", character[starWarsRPG.remainingOpponents[i]].name);
        innerDiv.addClass("icon " + chooseType);
        displayText(innerDiv, character[starWarsRPG.remainingOpponents[i]].name);
        displayText(innerDiv, "HP: " + character[starWarsRPG.remainingOpponents[i]].hp);
        displayText(innerDiv, "Attack: " + character[starWarsRPG.remainingOpponents[i]].ap);
        displayText(innerDiv, "Counter Attack: " + character[starWarsRPG.remainingOpponents[i]].counter);
        displayImage(innerDiv, "background.jpg")
        innerDiv.append("<br />");
        displayImage(innerDiv, character[starWarsRPG.remainingOpponents[i]].pic);
        displayArea.append(newDiv);
        $(".character-"+(starWarsRPG.remainingOpponents[i]+1)).append(innerDiv);
      }
    }
  
    addChars("choose-character", $("#character-row"));
  
    function displayText(area, item) {
      var newP = $("<p>");
      newP.html(item);
      area.append(newP);
    }
  
    function displayImage(area, item) {
      var newImage = $("<img>");
      newImage.attr("src", "assets/images/" + item);
      area.append(newImage);
    }
  
    $("body").on("click", ".choose-character", function() {
      allAudio.music.play();
      starWarsRPG.currentPlayer = parseInt($(this).attr("value"));
      $("#start-screen").css("visibility", "hidden");
      var i = starWarsRPG.remainingOpponents.indexOf(parseInt(starWarsRPG.currentPlayer));
      starWarsRPG.remainingOpponents.splice(i,1);
      addChars("choose-opponent", $("#opponents"));
      displayImage($("#myChar"), character[starWarsRPG.currentPlayer].jpeg);
      $("#myHP").css("width","200px");
      $("#myHealth").html("<span>" + character[starWarsRPG.currentPlayer].hp + " HP</span>");
      starWarsRPG.currentPlayerHealth = character[starWarsRPG.currentPlayer].hp;
      starWarsRPG.currentAP = character[starWarsRPG.currentPlayer].ap;
      $("#action").html("Attack - Power:" + starWarsRPG.currentAP);
    });
  
    $("body").on("click", ".choose-opponent", function() {
      if((starWarsRPG.currentOpponentHealth > 0) && (starWarsRPG.currentPlayerHealth > 0)) {
        alert("Defeat current opponent first");
      } else {
        starWarsRPG.opponentDead = false;
        $("#result").html("");
        starWarsRPG.currentOpponent = parseInt($(this).attr("value"));
        $("#oppChar").html("");
        $("#start-screen").css("visibility", "hidden");
        var i = starWarsRPG.remainingOpponents.indexOf(parseInt(starWarsRPG.currentOpponent));
        starWarsRPG.remainingOpponents.splice(i,1);
        addChars("choose-opponent", $("#opponents"));
        displayImage($("#oppChar"), character[starWarsRPG.currentOpponent].jpeg);
        $("#opponentHP").css("width","200px");
        $("#opponentHealth").html("<span>" + character[starWarsRPG.currentOpponent].hp + " HP</span>");
        starWarsRPG.currentOpponentHealth = character[starWarsRPG.currentOpponent].hp;
        $("#action").html("Attack - Power:" + starWarsRPG.currentAP);
      }
    });
  
    $("#action").on("click", function() {
      if (starWarsRPG.currentOpponentHealth > 0) {
          console.log($("#myChar"));
        $("#myChar").animate({left:'40%'},100);
        $("#myChar").animate({left:'0%'},100);
        starWarsRPG.currentOpponentHealth -= starWarsRPG.currentAP;
        allAudio.hit.load();
        allAudio.hit.play();
        var resultOfAttack = "<p>" + character[starWarsRPG.currentPlayer].name + " attacks for " + starWarsRPG.currentAP + " damage.</p>"
        var newPercent = starWarsRPG.currentOpponentHealth / character[starWarsRPG.currentOpponent].hp * 100;
        $("#opponentHP").css("width", newPercent + "px");
        $("#opponentHealth").html("<span>" + starWarsRPG.currentOpponentHealth + " HP</span>");
        
        if (starWarsRPG.currentOpponentHealth<=0) {
          $("#opponentHP").css("width", "0px");
          $("#opponentHealth").html("<span>0 HP</span>");
          if (starWarsRPG.remainingOpponents.length === 0) {
            $("#oppChar").html("");
            $("#result").html("You have won all the battles!");
            setTimeout(function() {
              if(confirm("You win! Would you like to start a new game?")) {
                restartGame();
              }
            }, 1000);
          } else {
            if (!starWarsRPG.opponentDead) {
              starWarsRPG.currentAP+=character[starWarsRPG.currentPlayer].ap;
            }
            starWarsRPG.opponentDead = true;
            $("#oppChar").html("");
            $("#result").html("You win, select new opponent");
          }
        }
        else {
          $("#oppChar").animate({right:'20%'},100);
          $("#oppChar").animate({right:'0%'},100);
          starWarsRPG.currentPlayerHealth -= character[starWarsRPG.currentOpponent].counter;
          starWarsRPG.currentAP+=character[starWarsRPG.currentPlayer].ap;
          newPercent = starWarsRPG.currentPlayerHealth / character[starWarsRPG.currentPlayer].hp * 100;
          $("#myHP").css("width", newPercent + "px");
          $("#myHealth").html("<span>" + starWarsRPG.currentPlayerHealth + " HP</span>");
          resultOfAttack+="<p>" + character[starWarsRPG.currentOpponent].name + " attacks for " + character[starWarsRPG.currentOpponent].counter + " damage.</p>"
          $("#result").html(resultOfAttack);
        }
        $("#action").html("Attack - Power:" + starWarsRPG.currentAP);
        if (starWarsRPG.currentPlayerHealth<=0) {
          $("#myHP").css("width", "0%");
          $("#myHealth").html("<span>0 HP</span>"); 
          $("#myChar").html("");
          setTimeout(function() {
            if (confirm("You Lose! Would you like to try again?")) {
              restartGame();
            }
          }, 1500);
        }
      }
    });
  
    function restartGame() {
      starWarsRPG.currentPlayer = -1;
      starWarsRPG.currentOpponent = -1;
      starWarsRPG.remainingOpponents = [0,1,2,3];
      starWarsRPG.currentPlayerHealth = 0;
      starWarsRPG.currentOpponentHealth = 0;
      starWarsRPG.currentAP = 1;
      starWarsRPG.opponentDead = false;
      $("#myChar").html("");
      $("#oppChar").html("");
      $("#result").html("");
      $("#start-screen").css("visibility","visible");
      addChars("choose-character", $("#character-row"));
      $
    }
  
    $("#restart").on("click", function() {
      if(confirm("Are you sure you would like to use the Force to restart? All progress will be lost.")) {
        restartGame();
      }
    });
  
  })
  