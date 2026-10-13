(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const players = [
    {name:"Hassan Ali", rating:300, role:"GOALKEEPER", special:"Elite reflexes", glow:"rgba(199,255,74,.22)"},
    {name:"Zayd Quadri", rating:96, role:"DRIBBLER", special:"Close control", glow:"rgba(75,191,255,.2)"},
    {name:"Ehan Ali", rating:94, role:"ALL-ROUNDER", special:"Quick reactions", glow:"rgba(189,123,255,.2)"},
    {name:"Umar Shoaib", rating:92, role:"PLAYMAKER", special:"Smart passing", glow:"rgba(255,140,66,.2)"},
    {name:"Muhammad Arham", rating:91, role:"STRIKER", special:"Finishing touch", glow:"rgba(255,99,99,.2)"},
    {name:"Cristiano Ronaldo", rating:999, role:"LEGEND", special:"MAX POWER & PRECISION", stats:{shooting:1000000000000000000,power:999999999999999,accuracy:999999999999,speed:10000000000000000}, glow:"rgba(255,140,66,.2)"},
    {name:"Erling Haaland", rating:98, role:"STRIKER", special:"Long-shot power", glow:"rgba(75,191,255,.2)"},
    {name:"Jude Bellingham", rating:97, role:"MIDFIELDER", special:"Penalty specialist", glow:"rgba(189,123,255,.2)"},
    {name:"Lamine Yamal", rating:96, role:"WINGER", special:"Free-kick magic", glow:"rgba(199,255,74,.2)"},
    {name:"Lionel Messi",rating:99,role:"PLAYMAKER",special:"Dribbling & precision",glow:"rgba(75,191,255,.2)"},
    {name:"Kylian Mbappé",rating:98,role:"FORWARD",special:"Pace & finishing",glow:"rgba(189,123,255,.2)"},
    {name:"Kevin De Bruyne",rating:97,role:"MIDFIELDER",special:"Vision & passing",glow:"rgba(255,99,99,.2)"},
    {name:"Mohamed Salah",rating:97,role:"WINGER",special:"Cut-inside finishing",glow:"rgba(255,140,66,.2)"},
    {name:"Vinícius Júnior",rating:97,role:"WINGER",special:"Skill moves & speed",glow:"rgba(199,255,74,.2)"},
    {name:"Neymar Jr.",rating:96,role:"PLAYMAKER",special:"Flair & close control",glow:"rgba(189,123,255,.2)"},
    {name:"Harry Kane",rating:96,role:"STRIKER",special:"Finishing & link-up play",glow:"rgba(75,191,255,.2)"},
    {name:"Bukayo Saka",rating:95,role:"WINGER",special:"Agility & crossing",glow:"rgba(255,140,66,.2)"},
    {name:"Phil Foden",rating:95,role:"MIDFIELDER",special:"Quick turns",glow:"rgba(80,220,190,.2)"}
  ];
  const goalkeepers = [
    {name:"Hassan Ali",rating:300,role:"ELITE KEEPER",special:"Best reflexes & diving",glow:"rgba(199,255,74,.22)"},
    {name:"Ehan Ali",rating:94,role:"GOALKEEPER",special:"Quick reactions",glow:"rgba(189,123,255,.2)"},
    {name:"Alisson",rating:95,role:"GOALKEEPER",special:"Fast one-on-ones",glow:"rgba(75,191,255,.2)"},
    {name:"Thibaut Courtois",rating:95,role:"GOALKEEPER",special:"Huge reach",glow:"rgba(255,140,66,.2)"},
    {name:"Manuel Neuer",rating:94,role:"SWEEPER KEEPER",special:"Rushes off the line",glow:"rgba(255,210,90,.2)"},
    {name:"Ederson",rating:91,role:"PLAYMAKING KEEPER",special:"Accurate distribution",glow:"rgba(80,220,190,.2)"},
    {name:"Marc-André ter Stegen",rating:90,role:"GOALKEEPER",special:"Sharp reflexes",glow:"rgba(90,160,255,.2)"},
    {name:"Gianluigi Donnarumma",rating:94,role:"GOALKEEPER",special:"Big saves under pressure",glow:"rgba(255,110,130,.2)"},
    {name:"Emiliano Martínez",rating:91,role:"PENALTY SPECIALIST",special:"Penalty mind games",glow:"rgba(255,170,80,.2)"},
    {name:"Jan Oblak",rating:92,role:"GOALKEEPER",special:"Positioning expert",glow:"rgba(160,120,255,.2)"},
    {name:"David Raya",rating:89,role:"GOALKEEPER",special:"Quick distribution",glow:"rgba(100,220,130,.2)"},
    {name:"Mike Maignan",rating:90,role:"GOALKEEPER",special:"Explosive reactions",glow:"rgba(90,210,240,.2)"},
    {name:"Lev Yashin",rating:98,role:"THE BLACK SPIDER",special:"Legendary reflexes & reach",glow:"rgba(30,30,38,.28)"},
    {name:"Muhammad Arham",rating:93,role:"GOALKEEPER",special:"Brave close-range saves",glow:"rgba(255,99,99,.2)"}
  ];
  const modeNames = {penalty:"PENALTY",freekick:"FREE KICK",longshot:"LONG SHOT",goalkeeping:"GOALKEEPER",headtohead:"HEAD-TO-HEAD",vsattack:"VS ATTACK"};
  const modeText = {
    penalty:["Pick your corner.","Drag on the goal to aim, then shoot."],
    freekick:["Bend it around the wall.","Aim around the wall and choose your power."],
    longshot:["Go for the spectacular.","Pick a target in the goal from distance."],
    goalkeeping:["Read the shot.","Choose a dive direction before the shot arrives."],
    headtohead:["Play the full match.","Take attacks across 90 minutes. Score more goals than your rival."],
    vsattack:["VS Attack.","You have 5 attacks. Make every chance count."]
  };
  let selectedPlayer = "Zayd Quadri", selectedGoalkeeper = "Hassan Ali", difficulty = "Pro", mode = "penalty";
  let score = 0, opponentScore = 0, matchMinute = 0, matchAttacks = 0, attempt = 1, aim = {x:.5,y:.27}, power = 78, shotTaken = false, keeperDive = "center", keeperMotion = null, ballAnim = null, animationFrame = 0;
  const canvas = $("pitch"), ctx = canvas.getContext("2d");
  let cw = 900, ch = 620, lastResult = "", shotTimer = null, soundOn = false;
  const match = {active:false,finished:false,clock:0,lastTick:0,player:{x:.5,y:.72},rival:{x:.5,y:.28},ball:{x:.5,y:.72},move:"",sprint:false,hasBall:true,playerGoals:0,rivalGoals:0,rankPoints:0,rank:"ROOKIE III",lastRivalShot:0};

  function playerCard(p, selected, attr){
    return '<button class="player-card '+(p.name===selected?'selected':'')+'" '+attr+'="'+p.name.replace(/"/g,"&quot;")+'" style="--player-glow:'+p.glow+'"><div class="player-rating">'+p.rating+'</div><div class="player-role">'+p.role+'</div><div class="player-name">'+p.name+'</div><div class="player-special">'+p.special+'</div></button>';
  }
  function renderPlayers(){
    $("playerGrid").innerHTML = players.map(p=>playerCard(p,selectedPlayer,"data-player")).join("");
    $("playerGrid").querySelectorAll("[data-player]").forEach(btn=>btn.addEventListener("click",()=>{
      selectedPlayer=btn.dataset.player;renderPlayers();toast(selectedPlayer+" selected as shooter");
    }));
    $("goalkeeperGrid").innerHTML = goalkeepers.map(p=>playerCard(p,selectedGoalkeeper,"data-goalkeeper")).join("");
    $("goalkeeperGrid").querySelectorAll("[data-goalkeeper]").forEach(btn=>btn.addEventListener("click",()=>{
      selectedGoalkeeper=btn.dataset.goalkeeper;renderPlayers();toast(selectedGoalkeeper+" selected as goalkeeper");
    }));
  }
  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),1800)}
  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();if(!rect.width)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.width/1.36*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);cw=rect.width;ch=rect.width/1.36;drawPitch();
  }
  function drawFootballer(cx,cy,size,rotation,jersey,isKeeper){
    ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);ctx.scale(size,size);ctx.lineCap="round";ctx.lineJoin="round";
    ctx.strokeStyle=jersey;ctx.lineWidth=.13;
    if(isKeeper){
      // Keeper: wide ready stance with extended arms and unmistakable lime gloves.
      ctx.beginPath();ctx.moveTo(-.16,-.38);ctx.lineTo(-.43,-.53);ctx.lineTo(-.59,-.42);ctx.stroke();
      ctx.beginPath();ctx.moveTo(.16,-.38);ctx.lineTo(.43,-.53);ctx.lineTo(.59,-.42);ctx.stroke();
      ctx.fillStyle="#c7ff4a";
      ctx.beginPath();ctx.arc(-.61,-.41,.13,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(.61,-.41,.13,0,Math.PI*2);ctx.fill();
    }else{
      // Shooter: arms tucked for a run-up, not a goalkeeper's spread-arm pose.
      ctx.beginPath();ctx.moveTo(-.16,-.37);ctx.lineTo(-.32,-.20);ctx.lineTo(-.20,-.06);ctx.stroke();
      ctx.beginPath();ctx.moveTo(.16,-.37);ctx.lineTo(.31,-.25);ctx.lineTo(.24,-.10);ctx.stroke();
      ctx.fillStyle="#d5a57d";
      ctx.beginPath();ctx.arc(-.20,-.05,.065,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(.24,-.09,.065,0,Math.PI*2);ctx.fill();
    }
    // Head and neck
    ctx.fillStyle="#d5a57d";ctx.beginPath();ctx.arc(0,-.56,.15,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=jersey;ctx.fillRect(-.22,-.43,.44,.42);
    // Shorts, legs and boots
    ctx.fillStyle="#17231c";ctx.fillRect(-.22,-.02,.44,.18);
    ctx.strokeStyle="#d5a57d";ctx.lineWidth=.105;
    ctx.beginPath();ctx.moveTo(-.12,.13);ctx.lineTo(-.20,.39);ctx.moveTo(.12,.13);ctx.lineTo(.22,.37);ctx.stroke();
    ctx.fillStyle="#f2f4f2";ctx.fillRect(-.30,.37,.20,.09);ctx.fillRect(.14,.35,.20,.09);
    ctx.restore();
  }
  function drawFullMatchPitch(){
    const w=cw,h=ch;const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#17643a");g.addColorStop(1,"#0a3b22");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    for(let i=0;i<12;i++){ctx.fillStyle=i%2?"rgba(0,0,0,.055)":"rgba(220,255,220,.035)";ctx.fillRect(i*w/12,0,w/12,h)}
    ctx.strokeStyle="rgba(238,255,238,.82)";ctx.lineWidth=2;ctx.strokeRect(w*.055,h*.035,w*.89,h*.93);ctx.beginPath();ctx.moveTo(w*.055,h*.5);ctx.lineTo(w*.945,h*.5);ctx.stroke();ctx.beginPath();ctx.arc(w*.5,h*.5,w*.115,0,Math.PI*2);ctx.stroke();
    ctx.strokeRect(w*.25,h*.035,w*.5,h*.15);ctx.strokeRect(w*.37,h*.035,w*.26,h*.07);ctx.strokeRect(w*.25,h*.815,w*.5,h*.15);ctx.strokeRect(w*.37,h*.895,w*.26,h*.07);
    const dot=(x,y,color,label,r)=>{ctx.fillStyle=color;ctx.beginPath();ctx.arc(x*w,y*h,r||Math.max(7,w*.012),0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();if(label){ctx.fillStyle="#07110f";ctx.font="900 "+Math.max(9,w*.015)+"px sans-serif";ctx.textAlign="center";ctx.fillText(label,x*w,y*h+4)}};
    [[.24,.7],[.36,.62],[.64,.62],[.76,.7]].forEach((p,i)=>dot(p[0],p[1],"#c7ff4a",i===0?"7":""));[[.24,.3],[.36,.38],[.64,.38],[.76,.3]].forEach((p,i)=>dot(p[0],p[1],"#ed6570",i===0?"9":""));
    dot(match.rival.x,match.rival.y,"#ff8c42","9",Math.max(10,w*.017));dot(match.player.x,match.player.y,"#f5f7ef",selectedPlayer==="Lionel Messi"?"10":"7",Math.max(11,w*.019));
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(match.ball.x*w,match.ball.y*h,Math.max(4,w*.0075),0,Math.PI*2);ctx.fill();ctx.strokeStyle="#111";ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle="rgba(5,15,10,.78)";ctx.fillRect(w*.32,h*.012,w*.36,h*.045);ctx.fillStyle="#fff";ctx.font="800 "+Math.max(10,w*.016)+"px sans-serif";ctx.textAlign="center";ctx.fillText("ECLIPSE ARENA · 5v5",w*.5,h*.043);
    if(match.finished){ctx.fillStyle="rgba(0,0,0,.76)";ctx.fillRect(w*.15,h*.36,w*.7,h*.28);ctx.fillStyle="#c7ff4a";ctx.font="900 "+Math.max(20,w*.04)+"px sans-serif";ctx.fillText(match.playerGoals>match.rivalGoals?"VICTORY":match.playerGoals===match.rivalGoals?"DRAW":"FULL TIME",w*.5,h*.46);ctx.fillStyle="#fff";ctx.font="800 "+Math.max(14,w*.025)+"px sans-serif";ctx.fillText(match.playerGoals+"  -  "+match.rivalGoals,w*.5,h*.55)}
  }
  function drawPitch(){
    if(!ctx||!cw||!ch)return;
    const w=cw,h=ch;ctx.clearRect(0,0,w,h);
    if(mode==="headtohead"){drawFullMatchPitch();return;}
    const grad=ctx.createLinearGradient(0,0,0,h);grad.addColorStop(0,"#1c673b");grad.addColorStop(1,"#0c3c25");ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    const stripes=10;for(let i=0;i<stripes;i++){ctx.fillStyle=i%2?"rgba(0,0,0,.055)":"rgba(205,255,203,.045)";ctx.fillRect(i*w/stripes,0,w/stripes,h)}
    ctx.strokeStyle="rgba(224,255,226,.55)";ctx.lineWidth=2;
    ctx.strokeRect(w*.07,h*.07,w*.86,h*.86);ctx.beginPath();ctx.moveTo(w*.07,h*.5);ctx.lineTo(w*.93,h*.5);ctx.stroke();ctx.beginPath();ctx.ellipse(w*.5,h*.5,w*.12,h*.14,0,0,Math.PI*2);ctx.stroke();
    ctx.strokeRect(w*.24,h*.07,w*.52,h*.2);ctx.strokeRect(w*.34,h*.07,w*.32,h*.10);
    // Larger goal frame with visible netting
    ctx.fillStyle="rgba(220,245,229,.10)";ctx.fillRect(w*.25,h*.018,w*.50,h*.064);
    ctx.strokeStyle="#eef7ed";ctx.lineWidth=Math.max(2,w*.004);
    ctx.strokeRect(w*.25,h*.012,w*.50,h*.075);
    ctx.strokeStyle="rgba(235,255,239,.62)";ctx.lineWidth=1;
    for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(w*(.25+i*.05),h*.015);ctx.lineTo(w*(.25+i*.05),h*.084);ctx.stroke()}
    for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(w*.252,h*(.015+j*.017));ctx.lineTo(w*.748,h*(.015+j*.017));ctx.stroke()}
    ctx.strokeStyle="rgba(224,255,226,.55)";ctx.lineWidth=2;
    if(mode==="freekick"){for(let i=0;i<5;i++){ctx.fillStyle="#e9e8d8";ctx.fillRect(w*(.39+i*.045),h*.34,w*.03,h*.025)}}
    if(mode==="longshot"){ctx.setLineDash([6,6]);ctx.strokeStyle="rgba(199,255,74,.7)";ctx.beginPath();ctx.arc(w*.5,h*.27,w*.16,0,Math.PI*2);ctx.stroke();ctx.setLineDash([])}
    // Draw exactly ONE goalkeeper at the goal line. Keep the dive pose after the ball arrives.
    const keeperT = keeperMotion ? Math.min(1,(performance.now()-keeperMotion.start)/keeperMotion.duration) : 0;
    const diving = Boolean(keeperMotion);
    const side = keeperMotion ? keeperMotion.side : 0;
    const diveProgress = diving ? (1-Math.pow(1-keeperT,2)) : 0;
    const kx = w*.5 + (diving ? side*w*.115*diveProgress : 0);
    const ky = h*.135 + (diving ? h*.025*Math.sin(keeperT*Math.PI/2) : 0);
    const rotation = diving ? side*1.05*diveProgress : 0;
    const keeperJersey = selectedGoalkeeper==="Hassan Ali" ? "#c7ff4a" : selectedGoalkeeper==="Ehan Ali" ? "#bd7bff" : selectedGoalkeeper==="Alisson" ? "#4bbfff" : "#ff8c42";
    drawFootballer(kx,ky,Math.max(12,w*.105),rotation,keeperJersey,true);
    ctx.fillStyle="rgba(5,15,10,.82)";ctx.fillRect(w*.5-w*.095,h*.205,w*.19,h*.026);
    ctx.fillStyle="#f2f7f2";ctx.font="800 "+Math.max(8,w*.013)+"px sans-serif";ctx.textAlign="center";
    ctx.fillText(selectedGoalkeeper.toUpperCase(),w*.5,h*.224);

    if(mode==="goalkeeping"){
      // Keeper mode uses the same single keeper at the goal; the dive controls move that player.
      ctx.strokeStyle="#c7ff4a";ctx.lineWidth=3;ctx.setLineDash([5,5]);
      ctx.beginPath();ctx.moveTo(w*.5,h*.72);ctx.lineTo(w*.5+((aim.x-.5)*w*.4),h*.48);ctx.stroke();ctx.setLineDash([]);
    }else{
      // Shooter at the spot, with a distinct kit and ball at their feet.
      const shooterJersey = selectedPlayer==="Cristiano Ronaldo" ? "#f2f4ec" : selectedPlayer==="Erling Haaland" ? "#65baff" : selectedPlayer==="Jude Bellingham" ? "#bd7bff" : selectedPlayer==="Lamine Yamal" ? "#ff8c42" : "#f2f4ec";
      drawFootballer(w*.5,h*.755,Math.max(13,w*.105),-.08,shooterJersey,false);
      // Kick leg swings when the shot is taken.
      if(ballAnim){
        const kickT=Math.min(1,(performance.now()-ballAnim.start)/ballAnim.duration);
        ctx.strokeStyle="#d5a57d";ctx.lineWidth=Math.max(4,w*.012);ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(w*.5+w*.014,h*.78);ctx.lineTo(w*.5+w*(.05+.035*Math.sin(kickT*Math.PI)),h*.77);ctx.stroke();
      }
      ctx.fillStyle="#f5f6ed";ctx.beginPath();ctx.arc(w*.5+w*.022,h*.735,Math.max(4,w*.009),0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#17251c";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(w*.5+w*.018,h*.733);ctx.lineTo(w*.5+w*.026,h*.737);ctx.stroke();
      ctx.strokeStyle="#c7ff4a";ctx.lineWidth=3;ctx.beginPath();ctx.arc(aim.x*w,aim.y*h,Math.max(8,w*.015),0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(aim.x*w-7,aim.y*h);ctx.lineTo(aim.x*w+7,aim.y*h);ctx.moveTo(aim.x*w,aim.y*h-7);ctx.lineTo(aim.x*w,aim.y*h+7);ctx.stroke();
    }
    if(ballAnim){
      const t=Math.min(1,(performance.now()-ballAnim.start)/ballAnim.duration);
      const ease=1-Math.pow(1-t,2);
      const x=ballAnim.fromX+(ballAnim.toX-ballAnim.fromX)*ease;
      const y=ballAnim.fromY+(ballAnim.toY-ballAnim.fromY)*ease-Math.sin(t*Math.PI)*h*.16;
      ctx.fillStyle="#f5f6ed";ctx.beginPath();ctx.arc(x,y,Math.max(5,w*.012)*(1-ease*.25),0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#17251c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-2);ctx.lineTo(x+3,y+2);ctx.moveTo(x+2,y-4);ctx.lineTo(x-2,y+4);ctx.stroke();
      if(t<1){animationFrame=requestAnimationFrame(drawPitch)}else{ballAnim=null}
    }
  }
  function startMode(nextMode){
    const isRandomRush=nextMode==="random";
    if(isRandomRush){const choices=["penalty","freekick","longshot","goalkeeping","vsattack"];nextMode=choices[Math.floor(Math.random()*choices.length)];}
    mode=nextMode;shotTaken=false;ballAnim=null;keeperMotion=null;
    match.active=mode==="headtohead";match.finished=false;match.clock=0;match.playerGoals=0;match.rivalGoals=0;match.rankPoints=0;match.rank="ROOKIE III";match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.72};match.move="";match.sprint=false;match.hasBall=true;match.lastRivalShot=0;
    $("matchHud").classList.toggle("hidden",!match.active);$("matchControls").classList.toggle("hidden",!match.active);$("matchResult").classList.add("hidden");$("matchResult").textContent="";
    $("powerSlider").classList.toggle("hidden",match.active);$("powerSlider").disabled=match.active;$("shootBtn").classList.toggle("hidden",match.active);$("matchRank").textContent="ROOKIE III · 0 PTS";
    if(mode==="headtohead"||mode==="vsattack"){score=0;opponentScore=0;matchMinute=0;matchAttacks=0;attempt=1;}
    $("homeScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
    $("gameTitle").innerHTML=modeNames[mode]+" <em>MODE</em>";$("controlHeading").textContent=modeText[mode][0];$("controlText").textContent=modeText[mode][1];
    if(isRandomRush){$("gameTitle").innerHTML="RANDOM <em>RUSH</em>";$("controlHeading").textContent="Surprise challenge: "+modeNames[mode];$("controlText").textContent="Random Rush picked "+modeNames[mode]+". Finish the challenge, then try again for a different surprise.";}
    $("keeperPad").classList.toggle("hidden",mode!=="goalkeeping");
    $("shootBtn").classList.remove("hidden");$("shootBtn").innerHTML=mode==="goalkeeping"?"DIVE / SAVE <span>↗</span>":"SHOOT <span>↗</span>";
    $("nextBtn").classList.add("hidden");$("aimTip").textContent=mode==="goalkeeping"?"CHOOSE A DIVE · THEN SAVE THE SHOT":"TAP OR DRAG ON THE PITCH TO AIM";
    aim={x:.5,y:.27};keeperDive="center";keeperMotion=null;$("feedback").textContent="Ready when you are.";$("scoreValue").textContent=score;$("roundLabel").textContent="ATTEMPT "+String(attempt).padStart(2,"0");$("difficultyLabel").textContent=difficulty.toUpperCase()+" LEVEL";
    if(match.active){$("aimTip").textContent="MOVE YOUR PLAYER · PASS · TACKLE · SHOOT";$("roundLabel").textContent="KICK-OFF · 00:00";$("controlHeading").textContent="Play the full match";$("controlText").textContent="Use the touch controls to attack, defend and score.";resizeCanvas();startMatchLoop();}else{resizeCanvas();window.scrollTo({top:0,behavior:"smooth"});}
  }
  function startMatchLoop(){
    cancelAnimationFrame(animationFrame);match.lastTick=performance.now();
    const tick=(now)=>{if(!match.active||match.finished)return;const dt=Math.min(.06,(now-match.lastTick)/1000);match.lastTick=now;match.clock+=dt;
      if(match.clock>=90){match.clock=90;endFullMatch();return}
      const step=(match.sprint?.38:.25)*dt;if(match.move==="up")match.player.y-=step;if(match.move==="down")match.player.y+=step;if(match.move==="left")match.player.x-=step;if(match.move==="right")match.player.x+=step;
      match.player.x=Math.max(.08,Math.min(.92,match.player.x));match.player.y=Math.max(.06,Math.min(.94,match.player.y));
      const dx=match.player.x-match.rival.x,dy=match.player.y-match.rival.y,dist=Math.hypot(dx,dy)||.001;match.rival.x+=dx/dist*.12*dt;match.rival.y+=dy/dist*.12*dt;
      if(match.hasBall){match.ball.x=match.player.x;match.ball.y=match.player.y-.022}else{match.ball.x=match.rival.x;match.ball.y=match.rival.y-.022}
      if(match.clock-match.lastRivalShot>12){match.lastRivalShot=match.clock;if(Math.random()<.72){match.rivalGoals++;match.hasBall=false;match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.28};$("feedback").textContent="RIVAL SCORES! Regain possession and fight back.";}}
      const mm=Math.floor(match.clock),ss=Math.floor((match.clock-mm)*60);$("matchClock").textContent=String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");$("matchScore").textContent=match.playerGoals+" - "+match.rivalGoals;$("roundLabel").textContent="MATCH LIVE · "+String(mm).padStart(2,"0")+":"+String(ss).padStart(2,"0");drawPitch();animationFrame=requestAnimationFrame(tick);};
    animationFrame=requestAnimationFrame(tick);
  }
  function matchAction(action){
    if(!match.active||match.finished)return;
    const dist=Math.hypot(match.player.x-match.rival.x,match.player.y-match.rival.y);
    if(action==="sprint"){match.sprint=!match.sprint;$("feedback").textContent=match.sprint?"SPRINT ON":"SPRINT OFF";}
    else if(action==="pass"){if(match.hasBall){match.ball.x=Math.max(.08,Math.min(.92,match.player.x+(match.player.x<.5?.12:-.12)));match.ball.y=Math.max(.08,match.player.y-.12);$("feedback").textContent="PASS! Move into space."}else $("feedback").textContent="You need possession to pass.";}
    else if(action==="tackle"){if(dist<.24){match.hasBall=true;match.ball.x=match.player.x;match.ball.y=match.player.y;match.rankPoints+=20;$("feedback").textContent="TACKLE WON! +20 RANK POINTS"}else $("feedback").textContent="Get closer to the rival to tackle.";}
    else if(action==="shoot"){if(!match.hasBall)$("feedback").textContent="Win the ball first!";else if(match.player.y<.30){if(Math.random()>.22){match.playerGoals++;match.rankPoints+=100;$("feedback").textContent="GOOOAL! +100 RANK POINTS"}else $("feedback").textContent="Saved by the rival keeper!";match.hasBall=true;match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.72};}else $("feedback").textContent="Get closer to the opponent goal before shooting.";}
    updateRank();$("matchScore").textContent=match.playerGoals+" - "+match.rivalGoals;drawPitch();
  }
  function updateRank(){const tiers=[["LEGENDARY",1000],["CHAMPION",600],["PRO I",350],["PRO II",200],["PRO III",100],["ROOKIE I",50],["ROOKIE II",20],["ROOKIE III",0]];match.rank=(tiers.find(t=>match.rankPoints>=t[1])||tiers[tiers.length-1])[0];$("matchRank").textContent=match.rank+" · "+match.rankPoints+" PTS";}
  function endFullMatch(){match.active=false;match.finished=true;cancelAnimationFrame(animationFrame);updateRank();const outcome=match.playerGoals>match.rivalGoals?"WIN":match.playerGoals===match.rivalGoals?"DRAW":"LOSS";$("matchResult").classList.remove("hidden");$("matchResult").textContent="FULL TIME · "+match.playerGoals+" - "+match.rivalGoals+" · "+outcome+" · RANK "+match.rank;$("feedback").textContent=$("matchResult").textContent;$("roundLabel").textContent="FULL TIME";drawPitch();}
  function finishAttempt(success,message){
    shotTaken=true;
    if(success)score+=mode==="goalkeeping"?150:100;
    if(mode==="headtohead"||mode==="vsattack"){
      matchAttacks++;
      if(mode==="headtohead"){matchMinute=Math.min(90,matchAttacks*10);if(Math.random()<.34)opponentScore++;}
      else if(Math.random()<.30)opponentScore++;
      message += "  |  "+(mode==="headtohead"?matchMinute+"'":"ATTACK "+matchAttacks+"/5")+" · YOU "+Math.floor(score/100)+" - "+opponentScore+" RIVAL";
    }
    $("scoreValue").textContent=mode==="headtohead"||mode==="vsattack"?Math.floor(score/100)+"-"+opponentScore:score;
    $("feedback").textContent=message;$("shootBtn").classList.add("hidden");$("nextBtn").classList.remove("hidden");
    $("nextBtn").textContent=(mode==="headtohead"&&matchMinute>=90)||(mode==="vsattack"&&matchAttacks>=5)?"FINISH MATCH":"NEXT ATTACK →";
    $("roundLabel").textContent=mode==="headtohead"?matchMinute+"' · "+(matchMinute>=90?"FULL TIME":"MATCH LIVE"):mode==="vsattack"?"ATTACK "+matchAttacks+" / 5":"ATTEMPT "+String(attempt).padStart(2,"0")+" · COMPLETE";
  }
  function shoot(){
    if(shotTaken)return;
    const fromX=cw*.5,fromY=ch*.77,toX=aim.x*cw,toY=aim.y*ch;
    ballAnim={fromX,fromY,toX,toY,start:performance.now(),duration:500};keeperMotion={side:aim.x<.43?-1:aim.x>.57?1:(Math.random()<.5?-1:1),start:performance.now(),duration:500};drawPitch();
    const centerBias=Math.abs(aim.x-.5);
    const difficultyPenalty=difficulty==="Legend"?.10:difficulty==="Pro"?.035:0;
    const ronaldoBonus=selectedPlayer==="Cristiano Ronaldo" ? 0.015 : 0;const hitChance=Math.max(.62,Math.min(.995,.98-centerBias*.22-difficultyPenalty-(power>96?.03:0)+ronaldoBonus));
    const goal=aim.y<.32&&aim.x>.22&&aim.x<.78;
    const scored=goal&&Math.random()<hitChance;
    setTimeout(()=>{if(mode==="freekick"&&aim.x>.465&&aim.x<.535&&aim.y<.30){finishAttempt(false,"The wall blocks it! Aim wider around the wall.");}else if(scored){finishAttempt(true, power>90?"WHAT A STRIKE! Top corner!":"GOAL! Perfect placement.");}else{finishAttempt(false,goal?"Saved by the keeper! Try a different corner.":"Wide! Aim inside the goal frame.");}drawPitch();},510);
  }
  function dive(){
    if(shotTaken)return;
    const targetSide=aim.x<.38?"left":aim.x>.62?"right":"center";
    const save=targetSide===keeperDive;
    ballAnim={fromX:cw*.5,fromY:ch*.28,toX:aim.x*cw,toY:aim.y*ch,start:performance.now(),duration:430};keeperMotion={side:keeperDive==="left"?-1:keeperDive==="right"?1:0,start:performance.now(),duration:430};drawPitch();
    setTimeout(()=>{finishAttempt(save,save?"INCREDIBLE SAVE! You read the shot.":"GOAL CONCEDED. Read the direction next time.");drawPitch()},450);
  }
  function nextAttempt(){
    if((mode==="headtohead"&&matchMinute>=90)||(mode==="vsattack"&&matchAttacks>=5)){
      $("feedback").textContent="FULL TIME! Final score: "+Math.floor(score/100)+" - "+opponentScore+". "+(Math.floor(score/100)>opponentScore?"YOU WIN!":Math.floor(score/100)===opponentScore?"DRAW!":"RIVAL WINS!");
      $("nextBtn").classList.add("hidden");$("shootBtn").classList.remove("hidden");$("shootBtn").textContent="PLAY AGAIN ↻";
      $("shootBtn").onclick=()=>startMode(mode);return;
    }
    attempt++;shotTaken=false;ballAnim=null;keeperMotion=null;aim={x:.5,y:.27};
    $("shootBtn").classList.remove("hidden");$("shootBtn").textContent=mode==="goalkeeping"?"DIVE / SAVE ↗":"SHOOT ↗";
    $("nextBtn").classList.add("hidden");$("feedback").textContent="Next attack. Make it count.";
    $("roundLabel").textContent=mode==="headtohead"?(matchMinute+10)+"' · MATCH LIVE":mode==="vsattack"?"ATTACK "+(matchAttacks+1)+" / 5":"ATTEMPT "+String(attempt).padStart(2,"0");
    $("shootBtn").onclick=null;drawPitch();
  }
  function setAimFromEvent(e){
    if(shotTaken||mode==="goalkeeping")return;
    const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width;const y=(e.clientY-rect.top)/rect.height;
    aim={x:Math.max(.1,Math.min(.9,x)),y:Math.max(.06,Math.min(.42,y))};drawPitch();
  }
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture?.(e.pointerId);setAimFromEvent(e)});
  canvas.addEventListener("pointermove",e=>{if(e.buttons)setAimFromEvent(e)});
  document.querySelectorAll("[data-move]").forEach(b=>{const clear=()=>{if(match.move===b.dataset.move)match.move="";};b.addEventListener("pointerdown",e=>{e.preventDefault();match.move=b.dataset.move;b.setPointerCapture?.(e.pointerId)});b.addEventListener("pointerup",clear);b.addEventListener("pointercancel",clear);b.addEventListener("lostpointercapture",clear);});
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>matchAction(b.dataset.action)));
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
  document.querySelectorAll("[data-open-youtube]").forEach(b=>b.addEventListener("click",openYouTubeArea));
  $("youtubeBackBtn").addEventListener("click",closeYouTubeArea);
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.addEventListener("click",()=>{difficulty=b.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(x=>x.classList.toggle("selected",x===b));}));
  $("playNowBtn").addEventListener("click",()=>{document.querySelector(".mode-section").scrollIntoView({behavior:"smooth",block:"start"});toast("Choose a challenge to begin")});
  $("backBtn").addEventListener("click",()=>{match.active=false;cancelAnimationFrame(animationFrame);$("matchHud").classList.add("hidden");$("matchControls").classList.add("hidden");$("gameScreen").classList.add("hidden");$("homeScreen").classList.remove("hidden");ballAnim=null;cancelAnimationFrame(animationFrame);window.scrollTo({top:0,behavior:"smooth"})});
  $("shootBtn").addEventListener("click",()=>{if(mode==="goalkeeping")dive();else shoot()});$("nextBtn").addEventListener("click",nextAttempt);
  $("powerSlider").addEventListener("input",e=>{power=Number(e.target.value);$("powerReadout").textContent=power+"%"});
  document.querySelectorAll("[data-dive]").forEach(b=>b.addEventListener("click",()=>{keeperDive=b.dataset.dive;document.querySelectorAll("[data-dive]").forEach(x=>x.style.borderColor=x===b?"#c7ff4a":"");$("feedback").textContent="Dive selected: "+keeperDive.toUpperCase()+". Press save when ready."}));
  $("keeperPad").addEventListener("dblclick",dive);
  $("keeperPad").addEventListener("click",e=>{if(e.target.closest("[data-dive]"))return;});

  // Original, synthesized soundtrack loops. Licensed songs open their official video separately.
  let musicContext=null,musicTimer=null,musicStep=0,musicStyle="hiphop",musicPlaying=false;
  // Official recordings load inside the soundtrack panel; no navigation away from the game.
  const officialSongs={
    speed:"vrY1THC_NQE",
    dreamers:"IwzkfMmNMpM",
    waka:"pRpeEdMmmQ0",
    nights:"UtF6Jej8yb4",
    believer:"7wtfhZwyrcc",
    seven:"0J2QdDbelmY",
    sunflower:"ApXoWvfEYVU",
    dynamite:"gdZLi9oWNZg",
    desire:"Uc8LehnnjJk",
    montagemtomada:"Qsk6bMvGj_o",
    montagemcoral:"P1EwJbIZWnQ",
    montagemmysterious:"dJM5DN1mMls",
    montagemxonada:"YbcevoTpItI",
    takefive:"vmDDOFXSgAs",
    flymoon:"ZEcqHA7dbwM",
    autumnleaves:"JTt_2-ykGCQ",
    sowhat:"zqNTltOGh5c",
    entertainer:"BNBXDC77FVA"
  };
  function openOfficialSong(value){
    const videoId=officialSongs[value];
    if(!videoId){
      $("musicStatus").textContent="This song hasn't been connected to the in-game player yet. Choose a supported track for now.";
      return false;
    }
    stopArenaMusic();
    $("musicPlayer").src="https://www.youtube.com/embed/"+videoId+"?playsinline=1&rel=0&controls=1&modestbranding=1";
    $("musicPlayerWrap").classList.remove("hidden");
    $("musicStatus").textContent="Song loaded inside the game. Tap ▶ in the player to start; Safari blocks automatic audio playback.";
    return true;
  }
  function getMusicContext(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;if(!musicContext)musicContext=new AC();return musicContext;}
  function tone(freq,duration,type,volume,when){
    if(!musicContext||!freq)return;
    const osc=musicContext.createOscillator(),gain=musicContext.createGain(),start=when||musicContext.currentTime;
    osc.type=type||"sine";osc.frequency.setValueAtTime(freq,start);gain.gain.setValueAtTime(Math.max(.0001,volume||.035),start);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(gain);gain.connect(musicContext.destination);osc.start(start);osc.stop(start+duration+.02);
  }
  function beatKick(t){tone(125,.18,"sine",.12,t);tone(48,.15,"sine",.1,t);}
  function beatSnare(t){tone(180,.08,"triangle",.045,t);tone(95,.07,"square",.018,t+.015);}
  function playMusicStep(){
    if(!musicPlaying||!musicContext)return;
    const t=musicContext.currentTime+.02,step=musicStep%16;
    const patterns={
      hiphop:{bpm:92,root:55,notes:[220,0,261.6,0,196,0,246.9,0]},
      phonk:{bpm:138,root:41.2,notes:[164.8,0,196,0,146.8,0,220,0]},
      jazz:{bpm:104,root:65.4,notes:[261.6,329.6,392,329.6,293.7,349.2,440,349.2]},
      stadium:{bpm:124,root:55,notes:[261.6,329.6,392,523.3,392,329.6,293.7,392]},
      lofi:{bpm:78,root:49,notes:[220,261.6,329.6,261.6,196,246.9,293.7,246.9]},
      edm:{bpm:128,root:49,notes:[261.6,0,329.6,392,0,329.6,440,392]},
      funk:{bpm:132,root:46.2,notes:[185,0,220,246.9,0,185,277.2,246.9]}
    };
    const p=patterns[musicStyle]||patterns.hiphop;
    if(step%4===0)beatKick(t);
    if((musicStyle==="hiphop"||musicStyle==="lofi")&&(step===4||step===12))beatSnare(t);
    if(musicStyle==="phonk"&&(step===4||step===12))beatSnare(t);
    if(musicStyle==="jazz"&&(step===4||step===12)){tone(p.root*2,.23,"triangle",.025,t);tone(p.root*2.5,.23,"triangle",.02,t);}
    if(musicStyle==="stadium"&&(step===0||step===8)){tone(p.root,.4,"sawtooth",.035,t);tone(p.root*1.5,.4,"triangle",.025,t);}
    if(musicStyle==="edm"&&step%4===2)tone(180,.07,"square",.025,t);
    if(step%2===0){const n=p.notes[(step/2)%p.notes.length];if(n)tone(n,.16,musicStyle==="phonk"?"sawtooth":"triangle",musicStyle==="phonk"?.035:.025,t);}
    if(step%2===1&&musicStyle!=="jazz")tone(750,.025,"square",.008,t);
    musicStep++;const interval=60000/p.bpm/4;clearInterval(musicTimer);musicTimer=setTimeout(playMusicStep,interval);
  }
  async function startArenaMusic(){
    const value=$("musicSelect").value;
    if(Object.prototype.hasOwnProperty.call(officialSongs,value)){stopArenaMusic();openOfficialSong(value);return;}
    if(value==="silence"){stopArenaMusic();$("musicStatus").textContent="Music is off.";return;}
    const ac=getMusicContext();if(!ac){$("musicStatus").textContent="This browser does not support generated audio.";return;}
    try{await ac.resume();}catch(e){}
    clearTimeout(musicTimer);musicStyle=value;musicStep=0;musicPlaying=true;soundOn=true;$("soundBtn").textContent="♫";$("musicStatus").textContent="Playing original "+value.toUpperCase()+" instrumental.";playMusicStep();
  }
  function stopArenaMusic(){
    musicPlaying=false;clearTimeout(musicTimer);clearInterval(musicTimer);musicTimer=null;
    if(musicContext){try{musicContext.suspend();}catch(e){}}
    $("musicStatus").textContent="Music stopped.";
  }
  $("musicSelect").addEventListener("change",()=>{
    const value=$("musicSelect").value,official=Object.prototype.hasOwnProperty.call(officialSongs,value);
    $("musicOfficialBtn").classList.toggle("hidden",!official);
    $("musicPlayBtn").classList.toggle("hidden",official);
    $("musicPlayBtn").textContent=value==="silence"?"MUSIC OFF":"▶ PLAY BEAT";
    if(!official){$("musicPlayerWrap").classList.add("hidden");$("musicPlayer").src="about:blank";}
    $("musicStatus").textContent=official?"Tap PLAY SONG IN GAME to load the recording here.":value==="silence"?"Music is off.":"Original "+value.toUpperCase()+" beat ready.";
  });
  $("musicPlayBtn").addEventListener("click",startArenaMusic);
  $("musicStopBtn").addEventListener("click",stopArenaMusic);
  $("musicOfficialBtn").addEventListener("click",()=>openOfficialSong($("musicSelect").value));


  // YouTube Area is separate from gameplay so videos do not sit in the match controls.
  function openYouTubeArea(){
    match.active=false;
    cancelAnimationFrame(animationFrame);
    $("gameScreen").classList.add("hidden");
    $("homeScreen").classList.add("hidden");
    $("youtubeScreen").classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function closeYouTubeArea(){
    $("youtubeScreen").classList.add("hidden");
    $("homeScreen").classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function youtubeSearch(query){
    const cleaned=String(query||"").trim();
    if(!cleaned){$("youtubeAreaStatus").textContent="Type a channel name, creator, or video topic to search.";return;}
    const url="https://www.youtube.com/results?search_query="+encodeURIComponent(cleaned);
    const link=$("youtubeSearchLink");
    link.href=url;
    link.classList.remove("hidden");
    link.textContent='OPEN YOUTUBE RESULTS FOR "'+cleaned.toUpperCase()+'" ↗';
    $("youtubeAreaStatus").textContent="Search ready. Open the YouTube results to browse channels and videos. To play a video inside this area, paste its video URL below.";
    window.open(url,"_blank","noopener,noreferrer");
  }
  $("youtubeSearchForm").addEventListener("submit",e=>{
    e.preventDefault();
    youtubeSearch($("youtubeSearchInput").value);
  });
  document.querySelectorAll("[data-youtube-search]").forEach(b=>b.addEventListener("click",()=>{
    $("youtubeSearchInput").value=b.dataset.youtubeSearch;
    youtubeSearch(b.dataset.youtubeSearch);
  }));
  $("youtubeWatchForm").addEventListener("submit",e=>{
    e.preventDefault();
    const raw=$("youtubeVideoUrl").value.trim();
    const status=$("youtubeAreaStatus"),player=$("youtubeAreaPlayer"),openLink=$("youtubeOpenVideoLink");
    if(!raw){status.textContent="Paste a YouTube video link first.";return;}
    let videoId="",playlistId="",originalUrl=raw;
    try{
      if(/^[a-zA-Z0-9_-]{11}$/.test(raw)){videoId=raw;originalUrl="https://www.youtube.com/watch?v="+raw;}
      else{
        const u=new URL(raw);
        const host=u.hostname.toLowerCase().replace(/^www\./,"");
        if(host==="youtu.be")videoId=u.pathname.split("/").filter(Boolean)[0]||"";
        if(host.endsWith("youtube.com")||host==="youtube-nocookie.com"){
          videoId=u.searchParams.get("v")||"";
          if(!videoId){const m=u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);if(m)videoId=m[1];}
          playlistId=u.searchParams.get("list")||"";
        }
      }
    }catch(_){status.textContent="That link doesn't look valid. Paste a full YouTube video URL, such as youtube.com/watch?v=...";return;}
    if(videoId&&/^[a-zA-Z0-9_-]{11}$/.test(videoId)){
      player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?rel=0";
      status.textContent="Loading video. If playback is blocked, use the link below to watch it on YouTube.";
      openLink.href=originalUrl;
      openLink.classList.remove("hidden");
      openLink.textContent="OPEN VIDEO ON YOUTUBE ↗";
    }else if(playlistId){
      player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(playlistId);
      status.textContent="Loading playlist. Some playlists may not allow embedded playback.";
      openLink.href=originalUrl;
      openLink.classList.remove("hidden");
      openLink.textContent="OPEN PLAYLIST ON YOUTUBE ↗";
    }else{
      status.textContent="That looks like a channel or search page, not a single video. Use Search above to explore it, or paste a video link.";
      openLink.href=originalUrl;
      openLink.classList.remove("hidden");
      openLink.textContent="OPEN LINK ON YOUTUBE ↗";
    }
  });

  $("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"♫":"♪";toast(soundOn?"Music controls are below":"Sound cues muted")});
  $("resetBtn").addEventListener("click",()=>{match.active=false;match.finished=false;cancelAnimationFrame(animationFrame);score=0;attempt=1;shotTaken=false;ballAnim=null;$("scoreValue").textContent="0";toast("Score reset")});
  // A touch-friendly joystick appears only in goalkeeper mode as an extra dive input.
  window.addEventListener("resize",()=>{if(!$("gameScreen").classList.contains("hidden"))resizeCanvas()});
  renderPlayers();resizeCanvas();
})();