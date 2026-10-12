(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const players = [
    {name:"Hassan Ali", rating:300, role:"GOALKEEPER", special:"Elite reflexes", glow:"rgba(199,255,74,.22)"},
    {name:"Zayd Quadri", rating:96, role:"DRIBBLER", special:"Close control", glow:"rgba(75,191,255,.2)"},
    {name:"Ehan Ali", rating:94, role:"ALL-ROUNDER", special:"Quick reactions", glow:"rgba(189,123,255,.2)"},
    {name:"Umar Shoaib", rating:92, role:"PLAYMAKER", special:"Smart passing", glow:"rgba(255,140,66,.2)"},
    {name:"Muhammad Arham", rating:91, role:"STRIKER", special:"Finishing touch", glow:"rgba(255,99,99,.2)"},
    {name:"Cristiano Ronaldo", rating:99, role:"FORWARD", special:"Power & precision", glow:"rgba(255,140,66,.2)"},
    {name:"Erling Haaland", rating:98, role:"STRIKER", special:"Long-shot power", glow:"rgba(75,191,255,.2)"},
    {name:"Jude Bellingham", rating:97, role:"MIDFIELDER", special:"Penalty specialist", glow:"rgba(189,123,255,.2)"},
    {name:"Lamine Yamal", rating:96, role:"WINGER", special:"Free-kick magic", glow:"rgba(199,255,74,.2)"}
  ];
  const goalkeepers = [
    {name:"Hassan Ali",rating:300,role:"ELITE KEEPER",special:"Best reflexes & diving",glow:"rgba(199,255,74,.22)"},
    {name:"Ehan Ali",rating:94,role:"GOALKEEPER",special:"Quick reactions",glow:"rgba(189,123,255,.2)"},
    {name:"Alisson",rating:95,role:"GOALKEEPER",special:"Fast one-on-ones",glow:"rgba(75,191,255,.2)"},
    {name:"Thibaut Courtois",rating:95,role:"GOALKEEPER",special:"Huge reach",glow:"rgba(255,140,66,.2)"}
  ];
  const modeNames = {penalty:"PENALTY",freekick:"FREE KICK",longshot:"LONG SHOT",goalkeeping:"GOALKEEPER"};
  const modeText = {
    penalty:["Pick your corner.","Drag on the goal to aim, then shoot."],
    freekick:["Bend it around the wall.","Aim around the wall and choose your power."],
    longshot:["Go for the spectacular.","Pick a target in the goal from distance."],
    goalkeeping:["Read the shot.","Choose a dive direction before the shot arrives."]
  };
  let selectedPlayer = "Zayd Quadri", selectedGoalkeeper = "Hassan Ali", difficulty = "Pro", mode = "penalty";
  let score = 0, attempt = 1, aim = {x:.5,y:.27}, power = 78, shotTaken = false, keeperDive = "center", keeperMotion = null, ballAnim = null, animationFrame = 0;
  const canvas = $("pitch"), ctx = canvas.getContext("2d");
  let cw = 900, ch = 620, lastResult = "", shotTimer = null, soundOn = false;

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
    // Arms reaching out; keeper gloves are bright lime, shooter sleeves match the shirt.
    ctx.strokeStyle=jersey;ctx.lineWidth=.13;
    ctx.beginPath();ctx.moveTo(-.16,-.38);ctx.lineTo(-.43,-.53);ctx.lineTo(-.59,-.42);ctx.stroke();
    ctx.beginPath();ctx.moveTo(.16,-.38);ctx.lineTo(.43,-.53);ctx.lineTo(.59,-.42);ctx.stroke();
    if(isKeeper){ctx.fillStyle="#c7ff4a";}else{ctx.fillStyle="#f2f4ec";}
    ctx.beginPath();ctx.arc(-.61,-.41,.105,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(.61,-.41,.105,0,Math.PI*2);ctx.fill();
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
  function drawPitch(){
    if(!ctx||!cw||!ch)return;
    const w=cw,h=ch;ctx.clearRect(0,0,w,h);
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
    // Draw a single proper goalkeeper at the goal. He dives toward shots.
    const keeperT = keeperMotion ? Math.min(1,(performance.now()-keeperMotion.start)/keeperMotion.duration) : 1;
    const diving = keeperMotion && keeperT < 1;
    const side = keeperMotion ? keeperMotion.side : 0;
    const kx = w*.5 + (diving ? side*w*.105*(1-Math.pow(1-keeperT,2)) : 0);
    const ky = h*.135 + (diving ? Math.sin(keeperT*Math.PI)*h*.035 : 0);
    const rotation = diving ? side*(0.95*Math.sin(keeperT*Math.PI/2)) : 0;
    drawFootballer(kx,ky,Math.max(12,w*.105),rotation,"#c7ff4a",true);
    if(keeperMotion && keeperT>=1) keeperMotion=null;

    if(mode==="goalkeeping"){
      // In goalkeeper mode the selected keeper is the controlled player in the foreground.
      drawFootballer(w*.5,h*.77,Math.max(14,w*.13),keeperMotion ? rotation : 0,"#c7ff4a",true);
      ctx.strokeStyle="#c7ff4a";ctx.lineWidth=3;ctx.setLineDash([5,5]);
      ctx.beginPath();ctx.moveTo(w*.5,h*.72);ctx.lineTo(w*.5+((aim.x-.5)*w*.4),h*.48);ctx.stroke();ctx.setLineDash([]);
    }else{
      // Shooter silhouette at the spot, facing the goal, with the ball at their feet.
      drawFootballer(w*.5,h*.755,Math.max(13,w*.105),-.08,"#f2f4ec",false);
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
    mode=nextMode;shotTaken=false;ballAnim=null;
    $("homeScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
    $("gameTitle").innerHTML=modeNames[mode]+" <em>MODE</em>";$("controlHeading").textContent=modeText[mode][0];$("controlText").textContent=modeText[mode][1];
    $("keeperPad").classList.toggle("hidden",mode!=="goalkeeping");
    $("shootBtn").classList.toggle("hidden",mode==="goalkeeping");
    $("nextBtn").classList.add("hidden");$("aimTip").textContent=mode==="goalkeeping"?"CHOOSE A DIVE · THEN SAVE THE SHOT":"TAP OR DRAG ON THE PITCH TO AIM";
    aim={x:.5,y:.27};keeperDive="center";keeperMotion=null;$("feedback").textContent="Ready when you are.";$("scoreValue").textContent=score;$("roundLabel").textContent="ATTEMPT "+String(attempt).padStart(2,"0");$("difficultyLabel").textContent=difficulty.toUpperCase()+" LEVEL";
    resizeCanvas();window.scrollTo({top:0,behavior:"smooth"});
  }
  function finishAttempt(success,message){
    shotTaken=true;if(success)score+=mode==="goalkeeping"?150:100;
    $("scoreValue").textContent=score;$("feedback").textContent=message;$("shootBtn").classList.add("hidden");$("nextBtn").classList.remove("hidden");
    $("roundLabel").textContent="ATTEMPT "+String(attempt).padStart(2,"0")+" · COMPLETE";
  }
  function shoot(){
    if(shotTaken)return;
    const fromX=cw*.5,fromY=ch*.77,toX=aim.x*cw,toY=aim.y*ch;
    ballAnim={fromX,fromY,toX,toY,start:performance.now(),duration:500};keeperMotion={side:aim.x<.5?-1:1,start:performance.now(),duration:500};drawPitch();
    const centerBias=Math.abs(aim.x-.5);
    const difficultyPenalty=difficulty==="Legend"?.10:difficulty==="Pro"?.035:0;
    const hitChance=Math.max(.62,Math.min(.98,.98-centerBias*.22-difficultyPenalty-(power>96?.03:0)));
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
  function nextAttempt(){attempt++;shotTaken=false;ballAnim=null;aim={x:.5,y:.27};$("shootBtn").classList.toggle("hidden",mode==="goalkeeping");$("nextBtn").classList.add("hidden");$("feedback").textContent="New attempt. Make it count.";$("roundLabel").textContent="ATTEMPT "+String(attempt).padStart(2,"0");drawPitch()}
  function setAimFromEvent(e){
    if(shotTaken||mode==="goalkeeping")return;
    const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width;const y=(e.clientY-rect.top)/rect.height;
    aim={x:Math.max(.1,Math.min(.9,x)),y:Math.max(.06,Math.min(.42,y))};drawPitch();
  }
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture?.(e.pointerId);setAimFromEvent(e)});
  canvas.addEventListener("pointermove",e=>{if(e.buttons)setAimFromEvent(e)});
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.addEventListener("click",()=>{difficulty=b.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(x=>x.classList.toggle("selected",x===b));}));
  $("playNowBtn").addEventListener("click",()=>{document.querySelector(".mode-section").scrollIntoView({behavior:"smooth",block:"start"});toast("Choose a challenge to begin")});
  $("backBtn").addEventListener("click",()=>{$("gameScreen").classList.add("hidden");$("homeScreen").classList.remove("hidden");ballAnim=null;cancelAnimationFrame(animationFrame);window.scrollTo({top:0,behavior:"smooth"})});
  $("shootBtn").addEventListener("click",shoot);$("nextBtn").addEventListener("click",nextAttempt);
  $("powerSlider").addEventListener("input",e=>{power=Number(e.target.value);$("powerReadout").textContent=power+"%"});
  document.querySelectorAll("[data-dive]").forEach(b=>b.addEventListener("click",()=>{keeperDive=b.dataset.dive;document.querySelectorAll("[data-dive]").forEach(x=>x.style.borderColor=x===b?"#c7ff4a":"");$("feedback").textContent="Dive selected: "+keeperDive.toUpperCase()+". Press save when ready."}));
  $("keeperPad").addEventListener("dblclick",dive);
  $("keeperPad").addEventListener("click",e=>{if(e.target.closest("[data-dive]"))return;});
  // In goalkeeper mode, the main action becomes the save button.
  $("shootBtn").addEventListener("click",()=>{if(mode==="goalkeeping")dive()});
  $("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"♫":"♪";toast(soundOn?"Sound cues enabled visually":"Sound cues muted")});
  $("resetBtn").addEventListener("click",()=>{score=0;attempt=1;shotTaken=false;ballAnim=null;$("scoreValue").textContent="0";toast("Score reset")});
  // A touch-friendly joystick appears only in goalkeeper mode as an extra dive input.
  window.addEventListener("resize",()=>{if(!$("gameScreen").classList.contains("hidden"))resizeCanvas()});
  renderPlayers();resizeCanvas();
})();