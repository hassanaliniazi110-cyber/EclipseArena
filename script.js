(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const players = [
    {name:"Hassan Ali", rating:300, role:"GOALKEEPER", special:"Elite reflexes", glow:"rgba(199,255,74,.22)"},
    {name:"Zayd Quadri", rating:96, role:"DRIBBLER", special:"Close control", glow:"rgba(75,191,255,.2)"},
    {name:"Ehan Ali", rating:94, role:"ALL-ROUNDER", special:"Quick reactions", glow:"rgba(189,123,255,.2)"},
    {name:"Umar Shoaib", rating:92, role:"PLAYMAKER", special:"Smart passing", glow:"rgba(255,140,66,.2)"},
    {name:"Muhammad Arham", rating:122, role:"STRIKER", special:"Finishing touch", glow:"rgba(255,99,99,.2)"},
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
    {name:"Muhammad Arham",rating:122,role:"GOALKEEPER",special:"Brave close-range saves",glow:"rgba(255,99,99,.2)"}
  ];
  const modeNames = {penalty:"PENALTY",freekick:"FREE KICK",longshot:"LONG SHOT",goalkeeping:"GOALKEEPER",headtohead:"HEAD-TO-HEAD",vsattack:"VS ATTACK",crossbar:"CROSSBAR CHALLENGE",survival:"SURVIVAL SAVES"};
  const modeText = {
    penalty:["Pick your corner.","Drag on the goal to aim, then shoot."],
    freekick:["Bend it around the wall.","Aim around the wall and choose your power."],
    longshot:["Go for the spectacular.","Pick a target in the goal from distance."],
    goalkeeping:["Read the shot.","Choose a dive direction before the shot arrives."],
    headtohead:["Play the full match.","Take attacks across 90 minutes. Score more goals than your rival."],
    vsattack:["VS Attack.","You have 5 attacks. Make every chance count."],
    crossbar:["Hit the bar.","Aim right under the crossbar and time your shot."],
    survival:["Survival saves.","Save as many shots as possible. Hassan makes an almost impossible wall."]
  };
  let selectedPlayer = "Zayd Quadri", selectedGoalkeeper = "Hassan Ali", difficulty = "Pro", mode = "penalty";
  let score = 0, opponentScore = 0, matchMinute = 0, matchAttacks = 0, attempt = 1, aim = {x:.5,y:.27}, power = 78, shotTaken = false, keeperDive = "center", keeperMotion = null, ballAnim = null, animationFrame = 0;
  const canvas = $("pitch"), ctx = canvas.getContext("2d");
  let cw = 900, ch = 620, lastResult = "", shotTimer = null, soundOn = false, masterVolume = 0.65, passcodeFailures=0, passcodeLockUntil=0, lastShotReplay=null, celebrationUntil=0;
  const match = {active:false,finished:false,clock:0,lastTick:0,player:{x:.5,y:.72},rival:{x:.5,y:.28},ball:{x:.5,y:.72},move:"",sprint:false,hasBall:true,playerGoals:0,rivalGoals:0,rankPoints:0,rank:"ROOKIE III",lastRivalShot:0};

  function playerCard(p, selected, attr){
    const xp=career.players[p.name]||0,level=1+Math.floor(xp/100),rating=p.rating+(p.name==="Hassan Ali"?0:level-1);
    return '<button class="player-card '+(p.name===selected?'selected':'')+'" '+attr+'="'+p.name.replace(/"/g,"&quot;")+'" style="--player-glow:'+p.glow+'"><div class="player-rating">'+rating+'</div><div class="player-role">'+p.role+' · LVL '+level+'</div><div class="player-name">'+p.name+'</div><div class="player-special">'+p.special+' · '+xp+' XP</div></button>';
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
  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
  const career=(()=>{try{return Object.assign({attempts:0,goals:0,saves:0,xp:0,players:{},tournamentWins:0,bestScore:0},JSON.parse(localStorage.getItem("eclipseCareer")||"{}"));}catch(_){return {attempts:0,goals:0,saves:0,xp:0,players:{},tournamentWins:0,bestScore:0};}})();
  function saveCareer(){try{localStorage.setItem("eclipseCareer",JSON.stringify(career));}catch(_){}}
  function awardProgress(success){career.attempts++;if(success){if(mode==="goalkeeping"||mode==="survival")career.saves++;else career.goals++;}const earned=10+(success?20:0),progressionPlayer=(mode==="goalkeeping"||mode==="survival")?selectedGoalkeeper:selectedPlayer;career.xp+=earned;career.players[progressionPlayer]=(career.players[progressionPlayer]||0)+earned;career.bestScore=Math.max(career.bestScore,score);saveCareer();renderPlayers();return "CAREER · "+career.goals+" goals · "+career.saves+" saves · "+career.xp+" XP · "+progressionPlayer+" LVL "+(1+Math.floor((career.players[progressionPlayer]||0)/100));}
  function playCue(kind){if(!soundOn)return;const ac=getMusicContext();if(!ac)return;try{ac.resume();const t=ac.currentTime+.01;if(kind==="goal"){tone(523,.12,"triangle",.05,t);tone(659,.16,"triangle",.045,t+.12);tone(784,.22,"triangle",.04,t+.25);}else{tone(220,.14,"sine",.035,t);tone(165,.18,"sine",.025,t+.12);}}catch(_){}}
  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();if(!rect.width)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.width/1.36*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);cw=rect.width;ch=rect.width/1.36;drawPitch();
  }
  function drawFootballer(cx,cy,size,rotation,jersey,isKeeper,playerName){
    const name=playerName||"",known={
      "Hassan Ali":{number:1,hair:"#171717",skin:"#b77d58",shorts:"#182331",trim:"#c7ff4a",style:"short"},
      "Zayd Quadri":{number:7,hair:"#171717",skin:"#b77d58",shorts:"#182331",trim:"#f5f5ef",style:"curly"},
      "Ehan Ali":{number:8,hair:"#30241d",skin:"#d5a57d",shorts:"#252033",trim:"#bd7bff",style:"short"},
      "Umar Shoaib":{number:10,hair:"#191919",skin:"#bd8967",shorts:"#202b37",trim:"#ffb45f",style:"wavy"},
      "Muhammad Arham":{number:9,hair:"#201b18",skin:"#b77d58",shorts:"#192a42",trim:"#ff6b6b",style:"short"},
      "Cristiano Ronaldo":{number:7,hair:"#35251b",skin:"#c58d68",shorts:"#173d86",trim:"#f6d447",style:"short"},
      "Erling Haaland":{number:9,hair:"#d4b17b",skin:"#efc9a6",shorts:"#ffffff",trim:"#ffffff",style:"long"},
      "Jude Bellingham":{number:5,hair:"#171311",skin:"#89573f",shorts:"#ffffff",trim:"#d4b16a",style:"curly"},
      "Lamine Yamal":{number:19,hair:"#171311",skin:"#a96f50",shorts:"#153a8a",trim:"#b82035",style:"curly"},
      "Lionel Messi":{number:10,hair:"#5a3828",skin:"#d2a17d",shorts:"#f4a4c3",trim:"#171717",style:"short"},
      "Kylian Mbappé":{number:7,hair:"#171311",skin:"#925d43",shorts:"#ffffff",trim:"#d4b16a",style:"short"},
      "Kevin De Bruyne":{number:17,hair:"#bd956b",skin:"#e5bd9c",shorts:"#ffffff",trim:"#ffffff",style:"short"},
      "Mohamed Salah":{number:11,hair:"#211713",skin:"#9c674d",shorts:"#c83d45",trim:"#f5f5ef",style:"curly"},
      "Vinícius Júnior":{number:7,hair:"#171311",skin:"#8e593f",shorts:"#ffffff",trim:"#d4b16a",style:"short"},
      "Neymar Jr.":{number:10,hair:"#2d211a",skin:"#c18d6a",shorts:"#ffffff",trim:"#111111",style:"wavy"},
      "Harry Kane":{number:9,hair:"#765139",skin:"#e2b997",shorts:"#c91f36",trim:"#ffffff",style:"short"},
      "Bukayo Saka":{number:7,hair:"#171311",skin:"#986246",shorts:"#ffffff",trim:"#ffffff",style:"short"},
      "Phil Foden":{number:47,hair:"#bd956b",skin:"#e3bb98",shorts:"#ffffff",trim:"#ffffff",style:"short"},
      "Alisson":{number:1,hair:"#382b20",skin:"#c58f6b",shorts:"#25313d",trim:"#4bbfff",style:"short"},
      "Thibaut Courtois":{number:1,hair:"#765139",skin:"#e2b997",shorts:"#263448",trim:"#ffb45f",style:"short"},
      "Manuel Neuer":{number:1,hair:"#a98662",skin:"#e0b995",shorts:"#25313d",trim:"#ffe27a",style:"short"},
      "Ederson":{number:31,hair:"#4c392a",skin:"#bd8b6c",shorts:"#25313d",trim:"#50dcb8",style:"short"},
      "Marc-André ter Stegen":{number:1,hair:"#8d745c",skin:"#e4c09e",shorts:"#25313d",trim:"#5aa0ff",style:"short"},
      "Gianluigi Donnarumma":{number:1,hair:"#5d4534",skin:"#dfb696",shorts:"#25313d",trim:"#ff6e82",style:"short"},
      "Emiliano Martínez":{number:23,hair:"#62482f",skin:"#c99975",shorts:"#25313d",trim:"#ffad66",style:"short"},
      "Jan Oblak":{number:1,hair:"#5e4736",skin:"#e0b995",shorts:"#25313d",trim:"#a078ff",style:"short"},
      "David Raya":{number:22,hair:"#49362a",skin:"#bd8b6c",shorts:"#25313d",trim:"#64dc82",style:"short"},
      "Mike Maignan":{number:16,hair:"#171311",skin:"#89573f",shorts:"#25313d",trim:"#5ad2f0",style:"short"},
      "Lev Yashin":{number:1,hair:"#171311",skin:"#bd8b6c",shorts:"#151519",trim:"#c9c9d0",style:"short"}
    };
    const p=known[name]||{number:isKeeper?1:7,hair:"#211b18",skin:"#c99572",shorts:"#182331",trim:"#f2f4f2",style:"short"};
    ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);ctx.scale(size,size);ctx.lineCap="round";ctx.lineJoin="round";
    // Soft ground shadow and detailed football boots.
    ctx.fillStyle="rgba(0,0,0,.28)";ctx.beginPath();ctx.ellipse(0,.43,.36,.075,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#20252c";ctx.lineWidth=.11;
    ctx.beginPath();ctx.moveTo(-.12,.12);ctx.lineTo(-.19,.39);ctx.moveTo(.12,.12);ctx.lineTo(.22,.37);ctx.stroke();
    ctx.fillStyle=p.shorts;ctx.fillRect(-.22,-.025,.44,.19);
    ctx.fillStyle=jersey;ctx.beginPath();ctx.moveTo(-.19,-.43);ctx.lineTo(.19,-.43);ctx.lineTo(.25,-.05);ctx.lineTo(-.25,-.05);ctx.closePath();ctx.fill();
    // Shirt seams, shoulder panels and collar.
    ctx.strokeStyle=p.trim;ctx.lineWidth=.025;ctx.beginPath();ctx.moveTo(-.17,-.40);ctx.lineTo(-.11,-.07);ctx.moveTo(.17,-.40);ctx.lineTo(.11,-.07);ctx.stroke();
    ctx.fillStyle=p.trim;ctx.fillRect(-.22,-.41,.06,.13);ctx.fillRect(.16,-.41,.06,.13);
    ctx.strokeStyle=p.trim;ctx.lineWidth=.025;ctx.beginPath();ctx.arc(0,-.42,.065,0,Math.PI);ctx.stroke();
    // Large readable jersey number.
    ctx.fillStyle=p.trim;ctx.font="900 .19px Arial,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(p.number),0,-.245);
    ctx.fillStyle="rgba(0,0,0,.24)";ctx.fillRect(-.13,-.13,.26,.035);
    // Arms, wrist tape and gloves.
    ctx.strokeStyle=jersey;ctx.lineWidth=.105;
    if(isKeeper){
      ctx.beginPath();ctx.moveTo(-.17,-.38);ctx.lineTo(-.43,-.50);ctx.lineTo(-.57,-.40);ctx.moveTo(.17,-.38);ctx.lineTo(.43,-.50);ctx.lineTo(.57,-.40);ctx.stroke();
      ctx.fillStyle=p.trim;ctx.beginPath();ctx.arc(-.60,-.39,.105,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(.60,-.39,.105,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#f5f5ef";ctx.fillRect(-.53,-.44,.10,.055);ctx.fillRect(.43,-.44,.10,.055);
    }else{
      ctx.beginPath();ctx.moveTo(-.17,-.37);ctx.lineTo(-.31,-.20);ctx.lineTo(-.21,-.08);ctx.moveTo(.17,-.37);ctx.lineTo(.30,-.24);ctx.lineTo(.23,-.10);ctx.stroke();
      ctx.strokeStyle=p.skin;ctx.lineWidth=.07;ctx.beginPath();ctx.moveTo(-.21,-.08);ctx.lineTo(-.18,-.04);ctx.moveTo(.23,-.10);ctx.lineTo(.24,-.06);ctx.stroke();
    }
    // Socks and cleats.
    ctx.strokeStyle=p.trim;ctx.lineWidth=.075;ctx.beginPath();ctx.moveTo(-.16,.15);ctx.lineTo(-.19,.30);ctx.moveTo(.15,.15);ctx.lineTo(.20,.29);ctx.stroke();
    ctx.fillStyle="#f4f5f3";ctx.beginPath();ctx.ellipse(-.25,.405,.12,.055,-.15,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(.25,.39,.12,.055,.1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#c7ff4a";ctx.fillRect(-.32,.43,.12,.025);ctx.fillRect(.19,.415,.12,.025);
    // Neck and ears.
    ctx.fillStyle=p.skin;ctx.fillRect(-.055,-.53,.11,.13);ctx.beginPath();ctx.ellipse(-.15,-.60,.035,.06,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(.15,-.60,.035,.06,0,0,Math.PI*2);ctx.fill();
    // Head shape, jaw and facial features.
    ctx.beginPath();ctx.ellipse(0,-.625,.145,.185,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.16)";ctx.beginPath();ctx.ellipse(-.045,-.67,.045,.075,-.3,0,Math.PI*2);ctx.fill();
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
    ctx.fillStyle="rgba(220,245,229,.10)";ctx.fillRect(w*.18,h*.008,w*.64,h*.086);
    ctx.strokeStyle="#eef7ed";ctx.lineWidth=Math.max(2,w*.004);
    ctx.strokeRect(w*.18,h*.008,w*.64,h*.086);
    ctx.strokeStyle="rgba(235,255,239,.62)";ctx.lineWidth=1;
    for(let i=1;i<13;i++){ctx.beginPath();ctx.moveTo(w*(.18+i*.05333),h*.01);ctx.lineTo(w*(.18+i*.05333),h*.092);ctx.stroke()}
    for(let j=1;j<5;j++){ctx.beginPath();ctx.moveTo(w*.182,h*(.008+j*.016));ctx.lineTo(w*.818,h*(.008+j*.016));ctx.stroke()}
    ctx.strokeStyle="rgba(224,255,226,.55)";ctx.lineWidth=2;
    if(mode==="freekick"){for(let i=0;i<5;i++){ctx.fillStyle="#e9e8d8";ctx.fillRect(w*(.39+i*.045),h*.34,w*.03,h*.025)}}
    if(mode==="longshot"){ctx.setLineDash([6,6]);ctx.strokeStyle="rgba(199,255,74,.7)";ctx.beginPath();ctx.arc(w*.5,h*.27,w*.16,0,Math.PI*2);ctx.stroke();ctx.setLineDash([])}
    // Draw exactly ONE goalkeeper at the goal line. Keep the dive pose after the ball arrives.
    const keeperT = keeperMotion ? Math.min(1,(performance.now()-keeperMotion.start)/keeperMotion.duration) : 0;
    const diving = Boolean(keeperMotion);
    const side = keeperMotion ? keeperMotion.side : 0;
    const diveProgress = diving ? (1-Math.pow(1-keeperT,2)) : 0;
    const diveRange=selectedGoalkeeper==="Hassan Ali"?.22:.16;
    const kx = w*.5 + (diving ? side*w*diveRange*diveProgress : 0);
    const ky = h*.135 - (diving ? h*(selectedGoalkeeper==="Hassan Ali"?.085:.055)*Math.sin(keeperT*Math.PI/2) : 0);
    const rotation = diving ? side*1.25*diveProgress : 0;
    const keeperKits = {"Hassan Ali":"#c7ff4a","Ehan Ali":"#bd7bff","Alisson":"#f2cf35","Thibaut Courtois":"#3cbd78","Manuel Neuer":"#f28b35","Ederson":"#f28b35","Marc-André ter Stegen":"#39b86a","Gianluigi Donnarumma":"#242936","Emiliano Martínez":"#65baff","Jan Oblak":"#39b86a","David Raya":"#39b86a","Mike Maignan":"#f2cf35","Lev Yashin":"#191919","Muhammad Arham":"#ff6b6b"}; const keeperJersey=keeperKits[selectedGoalkeeper]||"#ff8c42";
    drawFootballer(kx,ky,Math.max(12,w*.105),rotation,keeperJersey,true,selectedGoalkeeper);
    ctx.fillStyle="rgba(5,15,10,.82)";ctx.fillRect(w*.5-w*.095,h*.205,w*.19,h*.026);
    ctx.fillStyle="#f2f7f2";ctx.font="800 "+Math.max(8,w*.013)+"px sans-serif";ctx.textAlign="center";
    ctx.fillText(selectedGoalkeeper.toUpperCase(),w*.5,h*.224);

    if(mode==="goalkeeping"||mode==="survival"){
      // Keeper modes use the same single keeper at the goal; dive controls move that player.
      ctx.strokeStyle="#c7ff4a";ctx.lineWidth=3;ctx.setLineDash([5,5]);
      ctx.beginPath();ctx.moveTo(w*.5,h*.72);ctx.lineTo(w*.5+((aim.x-.5)*w*.4),h*.48);ctx.stroke();ctx.setLineDash([]);
    }else{
      // Shooter at the spot, with a distinct kit and ball at their feet.
      const shooterKits = {"Hassan Ali":"#f2f4ec","Zayd Quadri":"#f2f4ec","Ehan Ali":"#bd7bff","Umar Shoaib":"#ff8c42","Muhammad Arham":"#ff6b6b","Cristiano Ronaldo":"#f5d52f","Erling Haaland":"#65baff","Jude Bellingham":"#f8f8f4","Lamine Yamal":"#b51f3a","Lionel Messi":"#f4a4c3","Kylian Mbappé":"#f8f8f4","Kevin De Bruyne":"#1767c7","Mohamed Salah":"#c92536","Vinícius Júnior":"#f8f8f4","Neymar Jr.":"#f8f8f4","Harry Kane":"#c91f36","Bukayo Saka":"#d92535","Phil Foden":"#65baff"}; const shooterJersey=shooterKits[selectedPlayer]||"#f2f4ec";
      drawFootballer(w*.5,h*.755,Math.max(13,w*.105),-.08,shooterJersey,false,selectedPlayer);
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
      const x=ballAnim.fromX+(ballAnim.toX-ballAnim.fromX)*ease+Math.sin(t*Math.PI)*(ballAnim.curve||0)*w;
      const y=ballAnim.fromY+(ballAnim.toY-ballAnim.fromY)*ease-Math.sin(t*Math.PI)*h*(ballAnim.lift||.16);
      ctx.fillStyle="#f5f6ed";ctx.beginPath();ctx.arc(x,y,Math.max(5,w*.012)*(1-ease*.25),0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#17251c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-3,y-2);ctx.lineTo(x+3,y+2);ctx.moveTo(x+2,y-4);ctx.lineTo(x-2,y+4);ctx.stroke();
      if(t<1){animationFrame=requestAnimationFrame(drawPitch)}else{ballAnim=null}
    }
    if(performance.now()<celebrationUntil){
      const elapsed=celebrationUntil-performance.now();
      for(let i=0;i<28;i++){const x=((i*73+Math.floor(elapsed*.17)*17)%997)/997*w;const y=((i*47+Math.floor(elapsed*.31)*11)%613)/613*h*.58;ctx.fillStyle=["#c7ff4a","#f5f6ed","#ff8c42","#4bbfff"][i%4];ctx.fillRect(x,y,Math.max(3,w*.006),Math.max(5,h*.014));}
      animationFrame=requestAnimationFrame(drawPitch);
    }
  }
  function startMode(nextMode){
    const isRandomRush=nextMode==="random";
    if(isRandomRush){const choices=["penalty","freekick","longshot","goalkeeping","vsattack","crossbar","survival"];nextMode=choices[Math.floor(Math.random()*choices.length)];}
    mode=nextMode;shotTaken=false;ballAnim=null;keeperMotion=null;
    match.active=mode==="headtohead";match.finished=false;match.clock=0;match.playerGoals=0;match.rivalGoals=0;match.rankPoints=0;match.rank="ROOKIE III";match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.72};match.move="";match.sprint=false;match.hasBall=true;match.lastRivalShot=0;
    $("matchHud").classList.toggle("hidden",!match.active);$("matchControls").classList.toggle("hidden",!match.active);$("matchResult").classList.add("hidden");$("matchResult").textContent="";
    $("powerSlider").classList.toggle("hidden",match.active);$("powerSlider").disabled=match.active;$("shootBtn").classList.toggle("hidden",match.active);$("matchRank").textContent="ROOKIE III · 0 PTS";
    if(mode==="headtohead"||mode==="vsattack"){score=0;opponentScore=0;matchMinute=0;matchAttacks=0;attempt=1;}
    $("homeScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
    $("gameTitle").innerHTML=modeNames[mode]+" <em>MODE</em>";$("controlHeading").textContent=modeText[mode][0];$("controlText").textContent=modeText[mode][1];
    if(isRandomRush){$("gameTitle").innerHTML="RANDOM <em>RUSH</em>";$("controlHeading").textContent="Surprise challenge: "+modeNames[mode];$("controlText").textContent="Random Rush picked "+modeNames[mode]+". Finish the challenge, then try again for a different surprise.";}
    $("keeperPad").classList.toggle("hidden",mode!=="goalkeeping"&&mode!=="survival");
    $("shootBtn").classList.remove("hidden");$("shootBtn").innerHTML=(mode==="goalkeeping"||mode==="survival")?"DIVE / SAVE <span>↗</span>":"SHOOT <span>↗</span>";
    $("nextBtn").classList.add("hidden");$("aimTip").textContent=(mode==="goalkeeping"||mode==="survival")?"CHOOSE A DIVE · THEN SAVE THE SHOT":mode==="crossbar"?"AIM FOR THE CROSSBAR ZONE · THEN SHOOT":"TAP OR DRAG ON THE PITCH TO AIM";
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
    const careerLine=awardProgress(success);playCue(success?"goal":"save");if(success&&mode!=="goalkeeping"&&mode!=="survival")celebrationUntil=performance.now()+900;if(mode==="vsattack"&&matchAttacks>=5&&Math.floor(score/100)>opponentScore){career.tournamentWins++;saveCareer();message+=" 🏆 TOURNAMENT WON! Total wins: "+career.tournamentWins;}if(success&&mode!=="goalkeeping"&&mode!=="survival")message="🏆 "+message+"  ✨ GOAL CELEBRATION!";$("feedback").textContent=message+"  |  "+careerLine+"  |  Press R to replay your last shot.";
    $("shootBtn").classList.add("hidden");$("nextBtn").classList.remove("hidden");
    $("nextBtn").textContent=(mode==="headtohead"&&matchMinute>=90)||(mode==="vsattack"&&matchAttacks>=5)?"FINISH MATCH":"NEXT ATTACK →";
    $("roundLabel").textContent=mode==="headtohead"?matchMinute+"' · "+(matchMinute>=90?"FULL TIME":"MATCH LIVE"):mode==="vsattack"?"ATTACK "+matchAttacks+" / 5":"ATTEMPT "+String(attempt).padStart(2,"0")+" · COMPLETE";
  }
  function shoot(){
    if(shotTaken)return;
    const fromX=cw*.5,fromY=ch*.77,toX=aim.x*cw,toY=aim.y*ch;
    const curveStrength=mode==="freekick"?.12:selectedPlayer==="Lamine Yamal"?.085:selectedPlayer==="Lionel Messi"?.065:selectedPlayer==="Zayd Quadri"?.045:.018;
    const curve=(aim.x<.5?1:-1)*curveStrength*(power/78);
    lastShotReplay={fromX,fromY,toX,toY,curve,lift:.16,duration:500,mode,aim:{...aim},power,player:selectedPlayer};
    ballAnim={...lastShotReplay,start:performance.now()};keeperMotion={side:aim.x<.43?-1:aim.x>.57?1:(Math.random()<.5?-1:1),start:performance.now(),duration:500};drawPitch();
    const centerBias=Math.abs(aim.x-.5);
    const keeperIsHassan=selectedGoalkeeper==="Hassan Ali";
    const baseScoreChance=difficulty==="Rookie"?.88:difficulty==="Pro"?.58:.24;
    const placementBonus=Math.max(0,.12-centerBias*.20)+(power>90?.025:0)+(selectedPlayer==="Cristiano Ronaldo"?.02:0);
    const goal=aim.y<.36&&aim.x>.18&&aim.x<.82;
    const crossbarHit=mode==="crossbar"&&aim.y>=.055&&aim.y<=.15&&aim.x>=.34&&aim.x<=.66;
    const scoreChance=keeperIsHassan?.00001:Math.max(.03,Math.min(.98,baseScoreChance+placementBonus));
    const scored=mode==="crossbar"?(crossbarHit&&Math.random()<(difficulty==="Rookie"?.75:difficulty==="Pro"?.45:.18)):(goal&&Math.random()<scoreChance);
    setTimeout(()=>{if(mode==="freekick"&&aim.x>.465&&aim.x<.535&&aim.y<.30){finishAttempt(false,"The wall blocks it! Aim wider around the wall.");}else if(mode==="crossbar"&&!crossbarHit){finishAttempt(false,"MISS! Aim just beneath the crossbar.");}else if(scored){finishAttempt(true,mode==="crossbar"?"CROSSBAR CHALLENGE COMPLETE! Perfect timing!":power>90?"WHAT A STRIKE! Top corner!":"GOAL! Perfect placement.");}else{finishAttempt(false,goal?"SAVED BY "+selectedGoalkeeper.toUpperCase()+"! Try another corner.":"Wide! Aim inside the bigger goal frame.");}drawPitch();},510);
  }
  function dive(){
    if(shotTaken)return;
    const targetSide=["left","center","right"][Math.floor(Math.random()*3)];
    aim={x:targetSide==="left"?.28:targetSide==="right"?.72:.5,y:.055+Math.random()*.08};
    const matchedDive=targetSide===keeperDive;
    const save=selectedGoalkeeper==="Hassan Ali" ? Math.random()>=.00001 : matchedDive||(difficulty==="Rookie"&&Math.random()<.12);
    ballAnim={fromX:cw*.5,fromY:ch*.28,toX:aim.x*cw,toY:aim.y*ch,start:performance.now(),duration:430};keeperMotion={side:keeperDive==="left"?-1:keeperDive==="right"?1:0,start:performance.now(),duration:430};drawPitch();
    setTimeout(()=>{finishAttempt(save,save?"INCREDIBLE SAVE! "+selectedGoalkeeper+" reads the shot!":"GOAL CONCEDED. Read the direction next time.");drawPitch()},450);
  }
  function nextAttempt(){
    if((mode==="headtohead"&&matchMinute>=90)||(mode==="vsattack"&&matchAttacks>=5)){
      $("feedback").textContent="FULL TIME! Final score: "+Math.floor(score/100)+" - "+opponentScore+". "+(Math.floor(score/100)>opponentScore?"YOU WIN!":Math.floor(score/100)===opponentScore?"DRAW!":"RIVAL WINS!");
      $("nextBtn").classList.add("hidden");$("shootBtn").classList.remove("hidden");$("shootBtn").textContent="PLAY AGAIN ↻";
      $("shootBtn").onclick=()=>startMode(mode);return;
    }
    attempt++;shotTaken=false;ballAnim=null;keeperMotion=null;aim={x:.5,y:.27};
    $("shootBtn").classList.remove("hidden");$("shootBtn").textContent=(mode==="goalkeeping"||mode==="survival")?"DIVE / SAVE ↗":"SHOOT ↗";
    $("nextBtn").classList.add("hidden");$("feedback").textContent="Next attack. Make it count.";
    $("roundLabel").textContent=mode==="headtohead"?(matchMinute+10)+"' · MATCH LIVE":mode==="vsattack"?"ATTACK "+(matchAttacks+1)+" / 5":"ATTEMPT "+String(attempt).padStart(2,"0");
    $("shootBtn").onclick=null;drawPitch();
  }
  function setAimFromEvent(e){
    if(shotTaken||mode==="goalkeeping"||mode==="survival")return;
    const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width;const y=(e.clientY-rect.top)/rect.height;
    aim={x:Math.max(.1,Math.min(.9,x)),y:Math.max(.06,Math.min(.42,y))};drawPitch();
  }
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture?.(e.pointerId);setAimFromEvent(e)});
  canvas.addEventListener("pointermove",e=>{if(e.buttons)setAimFromEvent(e)});
  document.querySelectorAll("[data-move]").forEach(b=>{const clear=()=>{if(match.move===b.dataset.move)match.move="";};b.addEventListener("pointerdown",e=>{e.preventDefault();match.move=b.dataset.move;b.setPointerCapture?.(e.pointerId)});b.addEventListener("pointerup",clear);b.addEventListener("pointercancel",clear);b.addEventListener("lostpointercapture",clear);});
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>matchAction(b.dataset.action)));
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
  document.addEventListener("click",e=>{
    const youtubeButton=e.target.closest("[data-open-youtube]");
    if(!youtubeButton)return;
    e.preventDefault();
    openYouTubeArea();
  });
  $("youtubeBackBtn").addEventListener("click",closeYouTubeArea);
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.addEventListener("click",()=>{difficulty=b.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(x=>x.classList.toggle("selected",x===b));}));
  $("playNowBtn").addEventListener("click",()=>{document.querySelector(".mode-section").scrollIntoView({behavior:"smooth",block:"start"});toast("Choose a challenge to begin")});
  $("backBtn").addEventListener("click",()=>{match.active=false;cancelAnimationFrame(animationFrame);$("matchHud").classList.add("hidden");$("matchControls").classList.add("hidden");$("gameScreen").classList.add("hidden");$("homeScreen").classList.remove("hidden");ballAnim=null;cancelAnimationFrame(animationFrame);window.scrollTo({top:0,behavior:"smooth"})});
  $("shootBtn").addEventListener("click",()=>{if(mode==="goalkeeping"||mode==="survival")dive();else shoot()});$("nextBtn").addEventListener("click",nextAttempt);
  $("powerSlider").addEventListener("input",e=>{power=Number(e.target.value);$("powerReadout").textContent=power+"%"});
  document.querySelectorAll("[data-dive]").forEach(b=>b.addEventListener("click",()=>{keeperDive=b.dataset.dive;document.querySelectorAll("[data-dive]").forEach(x=>x.style.borderColor=x===b?"#c7ff4a":"");$("feedback").textContent="Dive selected: "+keeperDive.toUpperCase()+". Press save when ready."}));
  $("keeperPad").addEventListener("dblclick",dive);
  $("keeperPad").addEventListener("click",e=>{if(e.target.closest("[data-dive]"))return;});

  // Original, synthesized soundtrack loops. Licensed songs open their official video separately.
  let musicContext=null,musicMaster=null,musicTimer=null,musicStep=0,musicStyle="hiphop",musicPlaying=false;
  // Official recordings load inside the soundtrack panel; no navigation away from the game.
  const officialSongs={
    speed:"vrY1THC_NQE", dreamers:"IwzkfMmNMpM", waka:"pRpeEdMmmQ0",
    nights:"UtF6Jej8yb4", believer:"7wtfhZwyrcc", seven:"0J2QdDbelmY",
    sunflower:"ApXoWvfEYVU", dynamite:"gdZLi9oWNZg", desire:"Uc8LehnnjJk",
    montagemtomada:"Qsk6bMvGj_o", montagemcoral:"P1EwJbIZWnQ",
    montagemmysterious:"dJM5DN1mMls", montagemxonada:"YbcevoTpItI",
    montagembailao:"p7mJqlhPvtk", montagemsupersonic:"4C-b3ml5xQc",
    montagemrugada:"pszU-BtiW2I", brazilianphonk2026:"m_52WB-sYd4",
    takefive:"vmDDOFXSgAs", flymoon:"ZEcqHA7dbwM", autumnleaves:"JTt_2-ykGCQ",
    sowhat:"zqNTltOGh5c", entertainer:"BNBXDC77FVA",
    wc26daidai:"fcnDmrtj6Sk", wc26goals:"safzyuZNCGI", wc26gametime:"JLucCHwY-2c",
    wc26illuminate:"im0FLUw7wtY", wc26echo:"228FtMaq8uY", wc26dna:"alTzdOAAMhc"
  };
  function clearInGameSong(){
    const wrap=$("musicEmbedWrap"),player=$("musicEmbedPlayer");
    if(player)player.src="about:blank";
    if(wrap)wrap.classList.add("hidden");
  }
  function openOfficialSong(value){
    const videoId=officialSongs[value];
    if(!videoId){$("musicStatus").textContent="This song is not available here yet.";return false;}
    stopArenaMusic();
    const wrap=$("musicEmbedWrap"),player=$("musicEmbedPlayer");
    if(!wrap||!player){$("musicStatus").textContent="In-game player missing. Refresh the game and try again.";return false;}
    wrap.classList.remove("hidden");
    player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?autoplay=1&playsinline=1&controls=1&rel=0";
    $("musicStatus").textContent="Song loaded in the in-game soundtrack player. If it does not autoplay, press play on the player.";
    return true;
  }
  function getMusicContext(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;if(!musicContext){musicContext=new AC();musicMaster=musicContext.createGain();musicMaster.gain.value=soundOn?masterVolume:0;musicMaster.connect(musicContext.destination);}return musicContext;}
  function tone(freq,duration,type,volume,when){
    if(!musicContext||!freq)return;
    const osc=musicContext.createOscillator(),gain=musicContext.createGain(),start=when||musicContext.currentTime;
    osc.type=type||"sine";osc.frequency.setValueAtTime(freq,start);gain.gain.setValueAtTime(Math.max(.0001,volume||.035),start);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
    osc.connect(gain);gain.connect(musicMaster||musicContext.destination);osc.start(start);osc.stop(start+duration+.02);
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
    if(Object.prototype.hasOwnProperty.call(officialSongs,value)){openOfficialSong(value);return;}
    clearInGameSong();
    if(value==="silence"){stopArenaMusic();$("musicStatus").textContent="Music is off.";return;}
    const ac=getMusicContext();if(!ac){$("musicStatus").textContent="This browser does not support generated audio.";return;}
    try{await ac.resume();}catch(e){}
    clearTimeout(musicTimer);musicStyle=value;musicStep=0;musicPlaying=true;soundOn=true;$("soundBtn").textContent="♫";if(musicMaster)musicMaster.gain.setTargetAtTime(masterVolume,musicContext.currentTime,.04);$("musicStatus").textContent="Playing original "+value.toUpperCase()+" instrumental.";playMusicStep();
  }
  function stopArenaMusic(){
    musicPlaying=false;clearTimeout(musicTimer);clearInterval(musicTimer);musicTimer=null;
    clearInGameSong();
    if(musicContext){try{musicContext.suspend();}catch(e){}}
    $("musicStatus").textContent="Music stopped.";
  }
  $("musicSelect").addEventListener("change",()=>{
    const value=$("musicSelect").value,official=Object.prototype.hasOwnProperty.call(officialSongs,value);
    $("musicOfficialBtn").classList.toggle("hidden",!official);
    $("musicPlayBtn").classList.toggle("hidden",official);
    $("musicPlayBtn").textContent=value==="silence"?"MUSIC OFF":"▶ PLAY BEAT";
    $("musicStatus").textContent=official?"Tap PLAY SONG IN GAME to play it on this game screen.":value==="silence"?"Music is off.":"Original "+value.toUpperCase()+" beat ready.";
  });
  $("musicPlayBtn").addEventListener("click",startArenaMusic);
  $("musicStopBtn").addEventListener("click",stopArenaMusic);
  $("musicOfficialBtn").addEventListener("click",()=>openOfficialSong($("musicSelect").value));


  // In-game YouTube directory. Channel upload playlists use YouTube's public UU playlist IDs.
  // No API key is needed for this curated directory; YouTube still controls embed availability.
  const youtubeChannels = [
    {name:"Muhammad Arham",category:"YouTube creator",tags:"muhammad arham crazy fan muhammadarham-o1p1h creator",playlist:"",channelUrl:"https://www.youtube.com/@muhammadarham-o1p1h",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Funny Accent Slips — Best Of YouTube",category:"Funny · accent slips",tags:"funny accent slips fails accents comedy shorts",playlist:"",videoId:"hWLmy_G27iQ",channelUrl:"https://www.youtube.com/watch?v=hWLmy_G27iQ",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Funny Accent Slip Moments — LOL Treasure",category:"Funny · accent slips",tags:"funny accent slips british american arabic accents comedy",playlist:"",videoId:"utaTV3ott9o",channelUrl:"https://www.youtube.com/watch?v=utaTV3ott9o",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Funniest Accent Fails Ranked — DAILY TOP 5",category:"Funny · accent slips",tags:"funny accent slips accent fails ranked compilation comedy",playlist:"",videoId:"CIl9CAGXc_Y",channelUrl:"https://www.youtube.com/watch?v=CIl9CAGXc_Y",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Ranking The Best Accent Slips Moments — PhantomShortz",category:"Funny · accent slips",tags:"funny accent slips stutters unexpected accent fails compilation",playlist:"",videoId:"TLupK1LZ67Y",channelUrl:"https://www.youtube.com/watch?v=TLupK1LZ67Y",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Top 5 Funniest Accent Fails — MxRanks",category:"Funny · accent slips",tags:"funny accent fails accent mistakes try not to laugh shorts",playlist:"",videoId:"XwFJo1J9zVo",channelUrl:"https://www.youtube.com/watch?v=XwFJo1J9zVo",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Friends — When Americans Fail at British Accents",category:"Funny · accent slips",tags:"friends british accent fail ross comedy accent slips",playlist:"",videoId:"l8k3orPWrQk",channelUrl:"https://www.youtube.com/watch?v=l8k3orPWrQk",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"RkReddy",category:"FC Mobile · football gaming",tags:"rkreddy fc mobile fifa football soccer",playlist:"UUurtk6gwUZPnccBndhFPNMQ",videoId:"c0SkacQheBY",channelUrl:"https://www.youtube.com/@rkreddy",websiteUrl:"https://www.digitalsportsmgmt.com/rkreddy",websiteLabel:"CREATOR WEBSITE",preferred:true},
    {name:"RkReddy 2.0",category:"FC Mobile · football gaming",tags:"rkreddy 2.0 fc mobile fifa football",playlist:"",channelUrl:"https://www.youtube.com/@rkreddy2.0",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"NealGuides",category:"FC Mobile · guides and tactics",tags:"neal guides fc mobile football tactics tips",playlist:"UU0sB_mkyZZlWmnpF61a7ZXg",channelUrl:"https://www.youtube.com/@nealguides",websiteUrl:"https://nealguides.com/links/",websiteLabel:"CREATOR LINKS",preferred:true},
    {name:"KreekCraft",category:"Roblox · gaming",tags:"roblox kreekcraft gaming updates",playlist:"UUxsk7hqE_CwZWGEJEkGanbA",videoId:"I9Y9h8rvstI",channelUrl:"https://www.youtube.com/@KreekCraft",websiteUrl:"https://kreekcraft.stream/en-sgd/pages/links",websiteLabel:"CREATOR LINKS",preferred:true},
    {name:"Flamingo",category:"Roblox · gaming comedy",tags:"roblox flamingo albert gaming comedy",playlist:"UUm-X6o81nRsXQTmqpyArkBQ",videoId:"So7OxBU0bbU",channelUrl:"https://www.youtube.com/@Flamingo",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Thinknoodles",category:"Roblox · gaming",tags:"roblox thinknoodles gameplay gaming",playlist:"UUhd1FPXykD4pust3ljzq6hQ",channelUrl:"https://www.youtube.com/@Thinknoodles",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"ItsFunneh",category:"Roblox · family gaming",tags:"roblox itsfunneh krew gaming",playlist:"UUUk7VggtJdo9XYTy3Z5QVAw",videoId:"Cvq4u6hdQEY",channelUrl:"https://www.youtube.com/@ItsFunneh",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Grian",category:"Minecraft · building",tags:"minecraft grian building survival hermitcraft",playlist:"UUR9Gcq0CMm6YgTzsDxAxjOQ",channelUrl:"https://www.youtube.com/@Grian",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Mumbo Jumbo",category:"Minecraft · redstone",tags:"minecraft mumbo jumbo redstone builds",playlist:"UUhFur_NwVSbUozOcF_F2kMg",channelUrl:"https://www.youtube.com/@MumboJumbo",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"DanTDM",category:"Minecraft · gaming",tags:"minecraft dantdm gaming mods",playlist:"UUS5Oz6CHmeoF7vSad0qqXfw",channelUrl:"https://www.youtube.com/@DanTDM",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Aphmau",category:"Minecraft · roleplay",tags:"minecraft aphmau roleplay gaming",playlist:"UUzYfz8uibvnB7Yc1LjePi4g",channelUrl:"https://www.youtube.com/@Aphmau",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Dream",category:"Minecraft · challenges",tags:"minecraft dream speedrun manhunt gaming",playlist:"UUTkXRDQl0luXxVQrRQvWS6w",channelUrl:"https://www.youtube.com/@Dream",websiteUrl:"",websiteLabel:"",preferred:true},
    {name:"Dude Perfect",category:"Sports · comedy · trick shots",tags:"football soccer sports comedy tricks",playlist:"UURijo3ddMTht_IHyNSNXpNQ",channelUrl:"https://www.youtube.com/@DudePerfect",websiteUrl:"https://dudeperfect.com/",websiteLabel:"OFFICIAL WEBSITE",preferred:true},
    {name:"Real Madrid",category:"Football · club highlights",tags:"football soccer real madrid goals highlights",playlist:"UUWV3obpZVGgJ3j9FVhEjF2Q",channelUrl:"https://www.youtube.com/@realmadrid",websiteUrl:"https://www.realmadrid.com/",websiteLabel:"OFFICIAL WEBSITE",preferred:true},
    {name:"FIFA",category:"Football · World Cup",tags:"football soccer fifa world cup international",playlist:"UUpcTrCXblq78GZrTUTLWeBw",channelUrl:"https://www.youtube.com/@FIFA",websiteUrl:"https://www.fifa.com/",websiteLabel:"OFFICIAL WEBSITE",preferred:true},
    {name:"MrBeast",category:"Challenges · entertainment",tags:"gaming comedy challenge entertainment",playlist:"UUX6OQ3DkcsbYNE6H8uQQuVA",channelUrl:"https://www.youtube.com/@MrBeast",websiteUrl:"https://www.mrbeast.store/",websiteLabel:"OFFICIAL STORE",preferred:true},
    {name:"Mark Rober",category:"Science · engineering",tags:"science engineering experiments inventions",playlist:"UUY1kMZp36IQSyNx_9h4mpCg",channelUrl:"https://www.youtube.com/@MarkRober",websiteUrl:"https://www.crunchlabs.com/",websiteLabel:"OFFICIAL WEBSITE",preferred:true},
    {name:"NASA",category:"Space · science",tags:"science space nasa planets astronomy",playlist:"UU_aP7p621ATY_yAa8jMqUVA",channelUrl:"https://www.youtube.com/@NASA",websiteUrl:"https://www.nasa.gov/",websiteLabel:"OFFICIAL WEBSITE",preferred:true},
    {name:"TED-Ed",category:"Learning · science",tags:"education learning science history facts",playlist:"UUsooa4yRKGN_zEE8iknghZA",channelUrl:"https://www.youtube.com/@TEDEd",websiteUrl:"https://ed.ted.com/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"Kurzgesagt",category:"Science · animation",tags:"science space biology animation learning",playlist:"UUsXVk37bltHxD1rDPwtNM8Q",channelUrl:"https://www.youtube.com/@kurzgesagt",websiteUrl:"https://kurzgesagt.org/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"Veritasium",category:"Science · experiments",tags:"science experiments physics education",playlist:"UUHnyfMqiRRG1u-2MsSQLbXA",channelUrl:"https://www.youtube.com/@veritasium",websiteUrl:"https://www.veritasium.com/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"Marques Brownlee (MKBHD)",category:"Technology · reviews",tags:"technology tech phones reviews gadgets",playlist:"UUBJycsmduvYEL83R_U4JriQ",channelUrl:"https://www.youtube.com/@mkbhd",websiteUrl:"https://mkbhd.com/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"Linus Tech Tips",category:"Technology · computers",tags:"technology computers pc gaming hardware",playlist:"UUXuqSBlHAE6Xw-yeJA0Tunw",channelUrl:"https://www.youtube.com/@LinusTechTips",websiteUrl:"https://www.lttstore.com/",websiteLabel:"OFFICIAL STORE"},
    {name:"Sidemen",category:"Gaming · challenges · comedy",tags:"gaming comedy challenges football sidemen",playlist:"UUDogdKl7t7NHzQ95aEwkdMw",channelUrl:"https://www.youtube.com/@sidemen",websiteUrl:"https://sidemenclothing.com/",websiteLabel:"OFFICIAL STORE"},
    {name:"NBA",category:"Basketball · sports",tags:"basketball nba sports highlights",playlist:"UUWJ2lWNubArHWmf3FIHbfcQ",channelUrl:"https://www.youtube.com/@NBA",websiteUrl:"https://www.nba.com/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"National Geographic",category:"Nature · science",tags:"nature animals science geography documentary",playlist:"UUpVm7bg6pXKo1Pr6k5kxG9A",channelUrl:"https://www.youtube.com/@NatGeo",websiteUrl:"https://www.nationalgeographic.com/",websiteLabel:"OFFICIAL WEBSITE"},
    {name:"CrashCourse",category:"Learning · school subjects",tags:"education school history science biology learning",playlist:"UUX6b17PVsYBQ0ip5gyeme-Q",channelUrl:"https://www.youtube.com/@crashcourse",websiteUrl:"https://thecrashcourse.com/",websiteLabel:"OFFICIAL WEBSITE"}
  ];
  const defaultPreferred = youtubeChannels.filter(c=>c.preferred).map(c=>c.name);
  let preferredChannels = (()=>{try{const saved=JSON.parse(localStorage.getItem("eclipseYoutubePreferred")||"null");return Array.isArray(saved)?[...new Set([...defaultPreferred,...saved])]:defaultPreferred.slice();}catch(_){return defaultPreferred.slice();}})();
  function openYouTubeArea(){
    if(Date.now()<passcodeLockUntil){toast("YouTube Area temporarily locked. Try again in a moment.");return;}
    const enteredPasscode=window.prompt("ECLIPSE ARENA — YouTube Area is locked. Enter passcode:");
    if(enteredPasscode!=="2728"){
      if(enteredPasscode!==null){passcodeFailures++;toast("Incorrect passcode. YouTube Area remains locked.");if(passcodeFailures>=3){passcodeLockUntil=Date.now()+20000;passcodeFailures=0;toast("Too many attempts. Locked for 20 seconds.");}}
      return;
    }
    passcodeFailures=0;
    match.active=false;
    cancelAnimationFrame(animationFrame);
    $("gameScreen").classList.add("hidden");
    $("homeScreen").classList.add("hidden");
    $("youtubeScreen").classList.remove("hidden");
    renderYouTubeChannels();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function closeYouTubeArea(){
    $("youtubeScreen").classList.add("hidden");
    $("homeScreen").classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function playChannelPlaylist(channel){
    const player=$("youtubeAreaPlayer");
    if(channel.videoId){
      player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(channel.videoId)+"?rel=0";
      $("youtubeAreaStatus").textContent="Loading a video from "+channel.name+" inside Eclipse Arena. YouTube may block embedding for some videos.";
      $("youtubeVideoUrl").value="https://www.youtube.com/watch?v="+channel.videoId;
    }else if(channel.playlist){
      player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(channel.playlist)+"&rel=0";
      $("youtubeAreaStatus").textContent="Loading "+channel.name+"'s uploads playlist inside Eclipse Arena. YouTube will determine whether the playlist can be embedded here.";
      $("youtubeVideoUrl").value="https://www.youtube.com/playlist?list="+channel.playlist;
    }else{
      player.src="about:blank";
      $("youtubeAreaStatus").textContent=channel.name+" does not have an in-game video or uploads playlist configured yet.";
      $("youtubeVideoUrl").value="";
    }
    player.scrollIntoView({behavior:"smooth",block:"center"});
  }
  function togglePreferredChannel(name){
    preferredChannels=preferredChannels.includes(name)?preferredChannels.filter(n=>n!==name):[name,...preferredChannels];
    try{localStorage.setItem("eclipseYoutubePreferred",JSON.stringify(preferredChannels));}catch(_){}
    renderYouTubeChannels();
  }
  function makeChannelCard(channel){
    const card=document.createElement("article");
    card.className="youtube-channel-card";
    const title=document.createElement("strong");title.className="youtube-channel-name";title.textContent=channel.name;
    const category=document.createElement("span");category.className="youtube-channel-category";category.textContent=channel.category;
    const actions=document.createElement("div");actions.className="youtube-channel-actions";
    const play=document.createElement("button");play.type="button";play.className="youtube-channel-play";play.textContent=(channel.playlist||channel.videoId)?"▶ PLAY IN GAME":"↗ OPEN CHANNEL";play.addEventListener("click",()=>{if(channel.playlist||channel.videoId)playChannelPlaylist(channel);else window.open(channel.channelUrl,"_blank","noopener,noreferrer");});
    const fav=document.createElement("button");fav.type="button";fav.className="youtube-channel-fav";const isFav=preferredChannels.includes(channel.name);fav.textContent=isFav?"★ SAVED":"☆ SAVE";fav.setAttribute("aria-label",(isFav?"Remove ":"Add ")+channel.name+" "+(isFav?"from":"to")+" preferred channels");fav.addEventListener("click",()=>togglePreferredChannel(channel.name));
    actions.append(play,fav);
    const links=document.createElement("div");links.className="youtube-channel-links";
    const channelLink=document.createElement("a");
    channelLink.setAttribute("aria-label",(channel.playlist||channel.videoId)?"Play "+channel.name+" videos inside Eclipse Arena":"Open "+channel.name+" YouTube channel");
    if(channel.playlist||channel.videoId){
      channelLink.href="#youtubeAreaPlayer";
      channelLink.textContent="PLAY VIDEOS HERE";
      channelLink.addEventListener("click",event=>{event.preventDefault();playChannelPlaylist(channel);});
    }else{
      channelLink.href=channel.channelUrl;channelLink.target="_blank";channelLink.rel="noopener noreferrer";channelLink.textContent="CHANNEL URL";
    }
    links.appendChild(channelLink);
    if(channel.websiteUrl){
      const websiteLink=document.createElement("a");websiteLink.href=channel.websiteUrl;websiteLink.target="_blank";websiteLink.rel="noopener noreferrer";websiteLink.textContent=channel.websiteLabel||"WEBSITE";websiteLink.setAttribute("aria-label","Open "+channel.name+" official website or creator links in a new tab");links.appendChild(websiteLink);
    }
    card.append(title,category,actions,links);return card;
  }
  function renderYouTubeChannels(){
    const query=($("youtubeSearchInput")?.value||"").trim().toLowerCase();
    const matches=youtubeChannels.filter(c=>!query||(c.name+" "+c.category+" "+c.tags).toLowerCase().includes(query));
    const preferred=$("youtubePreferredGrid"),directory=$("youtubeDirectoryGrid");
    preferred.replaceChildren();directory.replaceChildren();
    const preferredMatches=matches.filter(c=>preferredChannels.includes(c.name));
    preferredMatches.forEach(c=>preferred.appendChild(makeChannelCard(c)));
    if(!preferredMatches.length){const empty=document.createElement("p");empty.className="youtube-empty";empty.textContent=query?"No preferred channels match this search. Save channels with ☆ to see them here.":"Save channels with ☆ and they'll appear here.";preferred.appendChild(empty);}
    matches.forEach(c=>directory.appendChild(makeChannelCard(c)));
    $("youtubeChannelCount").textContent=matches.length+" of "+youtubeChannels.length+" channels";
    $("youtubeAreaStatus").textContent=query?("Showing "+matches.length+" matching channels in the built-in directory. This offline directory does not search all of YouTube."):("Ready: "+youtubeChannels.length+" channels. Supported playlists play in-game; other channels open directly on YouTube.");
  }
  function youtubeSearch(query){
    $("youtubeSearchInput").value=String(query||"").trim();
    renderYouTubeChannels();
    if(!$("youtubeDirectoryGrid").children.length)$("youtubeAreaStatus").textContent="No channels matched. Try football, science, gaming, technology, nature, or comedy.";
  }
  $("youtubeSearchForm").addEventListener("submit",e=>{e.preventDefault();youtubeSearch($("youtubeSearchInput").value);});
  $("youtubeSearchInput").addEventListener("input",renderYouTubeChannels);
  document.querySelectorAll("[data-youtube-search]").forEach(b=>b.addEventListener("click",()=>youtubeSearch(b.dataset.youtubeSearch)));
  $("youtubeWatchForm").addEventListener("submit",e=>{
    e.preventDefault();
    const raw=$("youtubeVideoUrl").value.trim(),status=$("youtubeAreaStatus"),player=$("youtubeAreaPlayer");
    if(!raw){status.textContent="Paste a YouTube video or playlist link first.";return;}
    let videoId="",playlistId="";
    try{
      if(/^[a-zA-Z0-9_-]{11}$/.test(raw))videoId=raw;
      else{
        const u=new URL(raw),host=u.hostname.toLowerCase().replace(/^www\./,"");
        if(host==="youtu.be")videoId=u.pathname.split("/").filter(Boolean)[0]||"";
        if(host.endsWith("youtube.com")||host==="youtube-nocookie.com"){
          videoId=u.searchParams.get("v")||"";
          if(!videoId){const m=u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);if(m)videoId=m[1];}
          playlistId=u.searchParams.get("list")||"";
        }
      }
    }catch(_){status.textContent="That link doesn't look valid. Paste a full YouTube video or playlist URL.";return;}
    if(videoId&&/^[a-zA-Z0-9_-]{11}$/.test(videoId)){
      player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?rel=0";
      status.textContent="Loading video inside YouTube Area. YouTube may block embedded playback.";
    }else if(playlistId){
      player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(playlistId)+"&rel=0";
      status.textContent="Loading playlist inside YouTube Area. Some playlists may block embedded playback.";
    }else status.textContent="That link doesn't contain a video or playlist ID. Choose a channel above or paste a video/playlist URL.";
  });
  renderYouTubeChannels();

  $("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"♫":"♪";if(musicMaster)musicMaster.gain.setTargetAtTime(soundOn?masterVolume:0,musicContext.currentTime,.04);toast(soundOn?"Sound on · volume "+Math.round(masterVolume*100)+"%":"Sound muted. Use + and − keys to change volume.")});
  document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea,select")||e.metaKey||e.ctrlKey||e.altKey)return;if(e.key.toLowerCase()==="r"&&lastShotReplay&&!$("gameScreen").classList.contains("hidden")){ballAnim={...lastShotReplay,start:performance.now()};keeperMotion=null;drawPitch();toast("Replaying last shot");return;}if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="_"){masterVolume=Math.max(0,Math.min(1,masterVolume+(e.key==="-"||e.key==="_"?-.1:.1)));if(musicMaster&&soundOn)musicMaster.gain.setTargetAtTime(masterVolume,musicContext.currentTime,.04);toast("Game volume: "+Math.round(masterVolume*100)+"%");}});
  $("resetBtn").addEventListener("click",()=>{match.active=false;match.finished=false;cancelAnimationFrame(animationFrame);score=0;attempt=1;shotTaken=false;ballAnim=null;$("scoreValue").textContent="0";toast("Session score reset · Career records and upgrades are saved")});
  // A touch-friendly joystick appears only in goalkeeper mode as an extra dive input.
  window.addEventListener("resize",()=>{if(!$("gameScreen").classList.contains("hidden"))resizeCanvas()});
  renderPlayers();resizeCanvas();
})();