const createBtn=document.getElementById("create-team-button"),createContestBtn=document.getElementById("create-contest-button"),contestCards=document.querySelectorAll("#money-to-join-contest"),contestJoinDisablebutton=document.querySelectorAll("#money-to-join-contest-disabled"),backgrnd=document.getElementById("container"),allContainers=document.querySelectorAll(".extra-contanier"),myTeamBtn=document.getElementById("team-display-button"),scoreBtn=document.getElementById("score-btn-div");let contestId,matchId,diffTime=scoreBtn.getAttribute("data-diff-time"),matchTime=scoreBtn.getAttribute("data-match-date"),isLeaderboardVisible=!1;if(diffTime<=0&&(isLeaderboardVisible=!0),diffTime>0)var myVar=setInterval((function(){let e=new Date;diffTime<=0?(isLeaderboardVisible=!0,clearInterval(myVar),alert("Match has started"),location.reload()):diffTime=matchTime-e}),1e3);function closeContainers(){for(let e=0;e<allContainers.length;e++)allContainers[e].style.display="none"}createBtn&&createBtn.addEventListener("click",(function(){console.log("Create team button clicked"),alert("Select the players according to the followings rule :\r\n1. Select 4-7 players from each team.\r\n2. Select 3-6 batsman\r\n3. Select 3-6 bowlers.\r\n4. Select 1-3 wicket-keeper(s).\r\n5. Select 1-3 all-rounder(s).");const e=document.getElementById("select-players-parent");closeContainers(),backgrnd.style.opacity="0.5",e.style.display="block"})),createContestBtn&&createContestBtn.addEventListener("click",(function(){console.log("Create contest button clicked");const e=document.getElementById("create-contest-parent");closeContainers(),backgrnd.style.opacity="0.5",e.style.display="block"}));for(let e=0;e<contestCards.length;e++)contestCards[e].addEventListener("click",(function(t){console.log("Contest card clicked"),t.stopPropagation(),closeContainers(),contestId=contestCards[e].getAttribute("data-contest-id"),console.log(contestId),matchId=contestCards[e].getAttribute("data-match-id");const n=Number(contestCards[e].getAttribute("data-wallet")),o=Number(contestCards[e].getAttribute("data-price"));if(o>n)return void alert(`Not enough balance. Add ₹${o-n} in wallet`);const a=document.getElementById("join-contest");backgrnd.style.opacity="0.5",a.style.display="block"}));for(let e=0;e<contestJoinDisablebutton.length;e++)contestJoinDisablebutton[e].addEventListener("click",(function(e){e.stopPropagation(),alert("Match has already started")}));const winningBreakup=document.querySelectorAll(".contest-prize-pool");for(let e=0;e<winningBreakup.length;e++)winningBreakup[e].addEventListener("click",(function(t){t.stopPropagation(),closeContainers();const n=winningBreakup[e].getAttribute("data-count"),o=document.querySelectorAll(".winnings-breakdown-container");backgrnd.style.opacity="1";for(let e=0;e<o.length;e++)o[e].style.display="none";o[n].style.display="block"}));const closeBreakup=document.querySelectorAll(".close-breakup");for(let e=0;e<closeBreakup.length;e++)closeBreakup[e].addEventListener("click",(function(){const e=document.querySelectorAll(".winnings-breakdown-container");backgrnd.style.opacity="1";for(let t=0;t<e.length;t++)e[t].style.display="none"}));const scorecard=document.getElementById("scoreCard"),scorecardContainer=document.getElementById("scorecard-container");scorecard.addEventListener("click",(function(){closeContainers(),backgrnd.style.opacity="0.5",scorecardContainer.style.display="block"}));const closeScorecard=document.getElementById("close-scorecard");closeScorecard.addEventListener("click",(function(){backgrnd.style.opacity="1",scorecardContainer.style.display="none"}));const noButton=document.getElementById("no-contest-join-button");noButton.addEventListener("click",(function(){backgrnd.style.opacity="1";document.getElementById("join-contest").style.display="none"}));const addPlayer=document.querySelectorAll(".player-block");var addedPlayers=[];let wkCount=0,batCount=0,bowlCount=0,allRCount=0,team1=0,team2=0;for(let e=0;e<addPlayer.length;e++){let t=addPlayer[e];t.addEventListener("click",(function(){const e=t.getAttribute("data-player-name"),n=t.getAttribute("data-player-id"),o=t.getAttribute("data-player-position"),a=t.getAttribute("data-team");let c=t.children[2].children[0].children[0],l=t.children[3].children[0].children[0];const r=t.getAttribute("data-player-position");console.log(r),matchId=t.getAttribute("data-match-id");let d={playerName:e,playerId:n,position:r};console.log(d);let i=addedPlayers.find((e=>e.playerName===d.playerName));const s=addedPlayers.indexOf(i);if(console.log(s),s>-1)addedPlayers.splice(s,1),"0"==a?team1--:team2--,"batsman"==o?batCount--:"bowler"==o?bowlCount--:"wicketkeeper"==o?wkCount--:allRCount--,c.disabled=!0,l.disabled=!0,c.checked=!1,l.checked=!1,t.style.backgroundColor="rgba(255, 255, 255, 0.8)";else{if(11==addedPlayers.length)return void alert("Cannot Add more than 11 players");if("0"==a?team1++:team2++,team1>7||team2>7)return alert("Cannot add more than 7 players form one team."),void("0"==a?team1--:team2--);if("batsman"==o?batCount++:"bowler"==o?bowlCount++:"wicketkeeper"==o?wkCount++:allRCount++,wkCount>3)return alert("Cannot Add more than 3 Wicket-Keepers"),void wkCount--;if(batCount>6)return alert("Cannot Add more than 6 Batsman"),void batCount--;if(bowlCount>6)return alert("Cannot Add more than 6 Bowlers"),void bowlCount--;if(allRCount>3)return alert("Cannot Add more than 3 All-Rounder"),void allRCount--;if(wkCount+batCount>7)return alert("Cannot Add more Wicket-Keeper / Batsman"),void("batsman"==o?batCount--:"wicketkeeper"==o&&wkCount--);if(allRCount+bowlCount>7)return alert("Cannot Add more All-Rounder / Bowler"),void("bowler"==o?bowlCount--:allRCount--);c.disabled=!1,l.disabled=!1,addedPlayers.push(d),t.style.backgroundColor="#00b137"}console.log(addedPlayers)}))}myTeamBtn&&myTeamBtn.addEventListener("click",(function(){closeContainers();const e=document.getElementsByClassName("user-team")[0];if("false"==e.getAttribute("data-team"))return alert("Create Team First!!"),void(backgrnd.style.opacity="1");backgrnd.style.opacity="0.5",e.style.display="block"}));const closeTeam=document.getElementsByClassName("close-team")[0];closeTeam.addEventListener("click",(function(){document.getElementsByClassName("user-team")[0].style.display="none",backgrnd.style.opacity="1"}));const captainBtn=document.querySelectorAll(".radio-btn-captain-label");for(let e=0;e<captainBtn.length;e++)captainBtn[e].addEventListener("click",(function(t){t.stopPropagation();let n=captainBtn[e].parentElement.nextElementSibling;if(n)n.children[0].children[0].checked=!1;else{captainBtn[e].parentElement.previousElementSibling.children[0].children[0].checked=!1}}));const yesButton=document.getElementById("yes-contest-join-button");yesButton.addEventListener("click",(function(){window.location.href=`http://localhost:8000/match/contest/join?matchId=${matchId}&contestId=${contestId}`}));const saveButton=document.getElementById("select-player-save");saveButton.addEventListener("click",(function(){if(console.log("Save button clicked"),wkCount<1)return void alert("Select 1-3 wicketkeepr");if(batCount<3)return void alert("Select 3-6 batsman");if(bowlCount<3)return void alert("Select 3-6 bowler");if(allRCount<1)return void alert("Select 1-3 all-rounder");let e,t,n=document.querySelectorAll('input[name="captain-radio"]'),o=document.querySelectorAll('input[name="vice-captain-radio"]');for(let t=0;t<n.length;t++)1==n[t].checked&&(e=n[t].getAttribute("value"));for(let e=0;e<o.length;e++)1==o[e].checked&&(t=o[e].getAttribute("value"));if(e&&t)if(console.log("*************"+e+"*******//////////////"+t),11==addedPlayers.length){alert("Team saved successfully!!");document.getElementById("select-players-parent").style.display="none",backgrnd.style.opacity="1";let n=JSON.stringify(addedPlayers);window.location.href=`http://localhost:8000/match/contest/team?id=${matchId}&teamArray=${n}&captainId=${e}&viceCaptainId=${t}`}else alert("Please select 11 players to create a team!!");else alert("Plaease add captain and vice captain!!")}));const cancelButton=document.getElementById("select-player-cancel");cancelButton.addEventListener("click",(function(){console.log("Cancel button clicked");const e=document.getElementsByClassName("player-block");for(let t=0;t<e.length;t++)e[t].style.backgroundColor="rgba(255, 255, 255, 0.8)";backgrnd.style.opacity="1";document.getElementById("select-players-parent").style.display="none",addedPlayers=[],wkCount=0,batCount=0,bowlCount=0,allRCount=0,team1=0,team2=0;let t=document.querySelectorAll('input[name="captain-radio"]'),n=document.querySelectorAll('input[name="vice-captain-radio"]');for(let e=0;e<t.length;e++)t[e].checked=!1,t[e].disabled=!0;for(let e=0;e<n.length;e++)n[e].checked=!1,n[e].disabled=!0}));const contestCard=document.querySelectorAll(".contest-card");for(let e=0;e<contestCard.length;e++){let t=contestCard[e].getAttribute("data-contest-id"),n=contestCard[e].getAttribute("data-match-id");contestCard[e].addEventListener("click",(function(){isLeaderboardVisible?(console.log(t),window.location.href=`http://localhost:8000/match/contest/leaderboard?matchId=${n}&contestId=${t}`):alert("Leaderboard will be visible after match starts")}))}const createContestSaveButton=document.getElementById("create-contest-save");createContestSaveButton.addEventListener("click",(function(){const e=Number(document.getElementById("entry").value),t=document.getElementById("spots").value,n=document.getElementById("winners").value,o=Number(createContestSaveButton.getAttribute("data-wallet")),a=createContestSaveButton.getAttribute("data-match-id");console.log(e+" "+t+" "+n),e<10?alert("Entry Amount cannot be less than 10"):t<2||t>100?alert("Spots cannot be greater than 100 and less than 2"):n<1||n>t-1||n>5?n>t-1?alert("winners cannot be greater than "+(t-1)):n>5?alert("winners cannot be greater than 5"):alert("winners cannot be less than 1"):o<e?alert(`Not enough balance. Add ₹${e-o} in wallet`):window.location.href=`http://localhost:8000/match/contest/create-contest?entryAmount=${e}&spots=${t}&winners=${n}&matchId=${a}`}));const joinContestSaveButton=document.getElementById("join-contest-save");joinContestSaveButton.addEventListener("click",(function(){const e=joinContestSaveButton.getAttribute("data-match-id"),t=document.getElementById("join-code").value;console.log(e+" **************************//////////"+t),window.location.href=`http://localhost:8000/match/contest/join-contest?joinCode=${t}&matchId=${e}`}));const codeCopyBtn=document.querySelectorAll("#contest-code-copy");for(let e=0;e<codeCopyBtn.length;e++)codeCopyBtn[e].addEventListener("click",(async function(t){t.stopPropagation(),console.log("copy button has been clicked***********");const n=codeCopyBtn[e].getAttribute("data-contest-code");try{await navigator.clipboard.writeText(n),console.log("Page URL copied to clipboard")}catch(e){console.error("Failed to copy: ",e)}alert("Copied the text: "+n)}));const cancelBtn=document.querySelectorAll(".cancel-btn");for(let e of cancelBtn)console.log("Cancel button clicked"),e.addEventListener("click",(function(){backgrnd.style.opacity="1",closeContainers()}));const createDiv=document.getElementById("create-div"),joinDiv=document.getElementById("join-div"),contestcreateContainer=document.getElementsByClassName("create-contest-container")[0],contestjoinContainer=document.getElementsByClassName("join-contest-container")[0],createDivBtn=document.getElementById("create-div"),joinDivBtn=document.getElementById("join-div");createDiv.addEventListener("click",(function(){console.log("create contest"),contestjoinContainer.style.display="none",contestcreateContainer.style.display="block",createDivBtn.style.borderBottom="solid 2px white",joinDivBtn.style.borderBottom="none"})),joinDiv.addEventListener("click",(function(){contestjoinContainer.style.display="block",contestcreateContainer.style.display="none",createDivBtn.style.borderBottom="none",joinDivBtn.style.borderBottom="solid 2px white"}));