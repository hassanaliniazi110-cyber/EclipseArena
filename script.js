(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const players = [
{name:"Cristiano Ronaldo",rating:999,role:"ST",special:"Power · Finishing",unlockXP:3000,unlockWins:10,glow:"rgba(199,255,74,.2)"},
{name:"Lionel Messi",rating:123,role:"RW",special:"Dribbling · Vision",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Kylian Mbappé",rating:122,role:"ST",special:"Pace · Finishing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Erling Haaland",rating:121,role:"ST",special:"Power · Shooting",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Jude Bellingham",rating:120,role:"CM",special:"Passing · Stamina",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Lamine Yamal",rating:119,role:"RW",special:"Curve · Agility",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Kevin De Bruyne",rating:121,role:"CAM",special:"Vision · Passing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Mohamed Salah",rating:120,role:"RW",special:"Finishing · Pace",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Vinícius Júnior",rating:121,role:"LW",special:"Skill moves · Pace",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Neymar Jr.",rating:119,role:"LW",special:"Flair · Control",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Harry Kane",rating:120,role:"ST",special:"Finishing · Link-up",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Bukayo Saka",rating:118,role:"RW",special:"Agility · Crossing",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Phil Foden",rating:118,role:"CAM",special:"Control · Turns",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Zayd Quadri",rating:116,role:"CAM",special:"Close control",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Ehan Ali",rating:112,role:"CM",special:"Quick reactions",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Umar Shoaib",rating:123,role:"ST",special:"Long shooter · Finisher",stats:{PAC:118,SHO:124,PAS:117,DRI:118,DEF:116,PHY:118},unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Muhammad Arham",rating:122,role:"ST",special:"Finishing touch",unlockXP:0,unlockWins:0,glow:"rgba(199,255,74,.2)"},
{name:"Diego Maradona",rating:125,role:"CAM",special:"Legend · Dribbling",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Luís Figo",rating:121,role:"RW",special:"Legend · Crossing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Zinedine Zidane",rating:124,role:"CAM",special:"Legend · Vision",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Pelé",rating:128,role:"ST",special:"Icon · Finishing & movement",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Ronaldo Nazário",rating:127,role:"ST",special:"Icon · Explosive pace",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Ronaldinho",rating:127,role:"CAM",special:"Icon · Flair & skills",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Thierry Henry",rating:126,role:"ST",special:"Icon · Pace & finishing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Xavi",rating:126,role:"CM",special:"Icon · Passing & control",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Andrés Iniesta",rating:126,role:"CM",special:"Icon · Close control",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Andrea Pirlo",rating:125,role:"CM",special:"Icon · Long passing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Sergio Ramos",rating:125,role:"CB",special:"Defending · Leadership",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Virgil van Dijk",rating:125,role:"CB",special:"Strength · Interceptions",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Karim Benzema",rating:126,role:"ST",special:"Link-up · Finishing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Hassan Ali",rating:300,role:"GK",special:"Custom · Elite reflexes",unlockXP:2200,unlockWins:8,glow:"rgba(199,255,74,.22)"},
{name:"Federico Valverde",rating:121,role:"CM",special:"Stamina · Long shots",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Rodri",rating:122,role:"CDM",special:"Positioning · Passing",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Endrick",rating:116,role:"ST",special:"Explosive pace · Finishing",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Lllllllll FC",rating:999,role:"ST",special:"Keyboard Legend · Keyboard Vibration",stats:{PAC:999,SHO:999,PAS:999,DRI:999,DEF:999,PHY:999},unlockXP:0,unlockWins:0,glow:"rgba(255,214,92,.55)"}
];
const goalkeepers = [
{name:"David Raya",rating:117,role:"GOALKEEPER",special:"Quick distribution",unlockXP:0,unlockWins:0,glow:"rgba(100,220,130,.2)"},
{name:"Alisson",rating:120,role:"GOALKEEPER",special:"Fast one-on-ones",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},

{name:"Manuel Neuer",rating:120,role:"SWEEPER KEEPER",special:"Rushes off the line",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Ederson",rating:118,role:"PLAYMAKING KEEPER",special:"Accurate distribution",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Marc-André ter Stegen",rating:118,role:"GOALKEEPER",special:"Sharp reflexes",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Gianluigi Donnarumma",rating:121,role:"GOALKEEPER",special:"Big saves under pressure",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Emiliano Martínez",rating:118,role:"PENALTY SPECIALIST",special:"Penalty mind games",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Jan Oblak",rating:120,role:"GOALKEEPER",special:"Positioning expert",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Mike Maignan",rating:119,role:"GOALKEEPER",special:"Explosive reactions",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Gianluigi Buffon",rating:124,role:"ICON GOALKEEPER",special:"Legend · Reflexes & positioning",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Lev Yashin",rating:125,role:"ICON GOALKEEPER",special:"The Black Spider",unlockXP:700,unlockWins:3,glow:"rgba(30,30,38,.28)"},
{name:"Hassan Ali",rating:300,role:"CUSTOM GOALKEEPER",special:"Elite reflexes & diving",unlockXP:2200,unlockWins:8,glow:"rgba(199,255,74,.22)"},
{name:"Ehan Ali",rating:110,role:"GOALKEEPER",special:"Quick reactions",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Muhammad Arham",rating:122,role:"GOALKEEPER",special:"Brave close-range saves",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Iker Casillas",rating:123,role:"ICON GOALKEEPER",special:"Lightning reflexes",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Petr Čech",rating:122,role:"ICON GOALKEEPER",special:"Commanding presence",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Oliver Kahn",rating:123,role:"ICON GOALKEEPER",special:"Fearless saves",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Peter Schmeichel",rating:122,role:"ICON GOALKEEPER",special:"Powerful reach",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Edwin van der Sar",rating:121,role:"ICON GOALKEEPER",special:"Calm positioning",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Keylor Navas",rating:119,role:"GOALKEEPER",special:"Quick reactions",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Samir Handanović",rating:118,role:"GOALKEEPER",special:"Penalty saves",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Dida",rating:120,role:"ICON GOALKEEPER",special:"Big-match saves",unlockXP:700,unlockWins:3,glow:"rgba(199,255,74,.2)"},
{name:"Claudio Bravo",rating:117,role:"GOALKEEPER",special:"Sharp distribution",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Yann Sommer",rating:118,role:"GOALKEEPER",special:"Reflexes · Positioning",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"André Onana",rating:117,role:"PLAYMAKING KEEPER",special:"Distribution · Reactions",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"},
{name:"Giorgi Mamardashvili",rating:119,role:"GOALKEEPER",special:"Reach · Close-range saves",unlockXP:450,unlockWins:2,glow:"rgba(199,255,74,.2)"}
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
  let selectedPlayer = "Muhammad Arham", selectedGoalkeeper = "David Raya", difficulty = "Pro", mode = "penalty";
  let score = 0, opponentScore = 0, matchMinute = 0, matchAttacks = 0, attempt = 1, aim = {x:.5,y:.27}, power = 78, shotTaken = false, keeperDive = "center", keeperMotion = null, ballAnim = null, animationFrame = 0;
  const canvas = $("pitch"), ctx = canvas.getContext("2d");
  let cw = 900, ch = 620, lastResult = "", shotTimer = null, soundOn = false, masterVolume = 0.65, passcodeFailures=0, passcodeLockUntil=0, lastShotReplay=null, celebrationUntil=0;
  const match = {active:false,finished:false,clock:0,lastTick:0,player:{x:.5,y:.72},rival:{x:.5,y:.28},ball:{x:.5,y:.72},move:"",moveX:0,moveY:0,sprint:false,hasBall:true,playerGoals:0,rivalGoals:0,rankPoints:0,rank:"ROOKIE III",lastRivalShot:0};
  function getApex3DState(){
    return {
      mode,selectedPlayer,selectedGoalkeeper,score,attemptLabel:"ATTEMPT "+attempt,
      finished:match.finished,aim:{x:aim.x,y:aim.y},
      match:{
        active:match.active,finished:match.finished,clock:match.clock,
        player:{x:match.player.x,y:match.player.y},rival:{x:match.rival.x,y:match.rival.y},
        ball:{x:match.ball.x,y:match.ball.y},hasBall:match.hasBall,
        playerGoals:match.playerGoals,rivalGoals:match.rivalGoals
      },
      // Convert the original pixel-based animation to normalized 0–1 coordinates for WebGL.
      ballAnim:ballAnim?{
        ...ballAnim,
        fromX:ballAnim.fromX/Math.max(cw,1),fromY:ballAnim.fromY/Math.max(ch,1),
        toX:ballAnim.toX/Math.max(cw,1),toY:ballAnim.toY/Math.max(ch,1)
      }:null,
      keeperMotion:keeperMotion?Object.assign({},keeperMotion):null
    };
  }
  if(window.ApexMatch3D&&canvas)window.ApexMatch3D.init(canvas,getApex3DState);
  // Fullscreen match view.
  const pitchWrap=canvas?.closest(".pitch-wrap");
  if(pitchWrap&&!pitchWrap.querySelector(".apex-fullscreen-btn")){
    const fullscreenBtn=document.createElement("button");
    fullscreenBtn.type="button";fullscreenBtn.className="apex-fullscreen-btn";
    fullscreenBtn.textContent="⛶ FULLSCREEN";fullscreenBtn.setAttribute("aria-label","Enter fullscreen match view");
    fullscreenBtn.setAttribute("aria-pressed","false");
    const syncFullscreen=()=>{
      const active=document.fullscreenElement===$("gameScreen");
      fullscreenBtn.textContent=active?"✕ EXIT FULLSCREEN":"⛶ FULLSCREEN";
      fullscreenBtn.setAttribute("aria-label",active?"Exit fullscreen match view":"Enter fullscreen match view");
      fullscreenBtn.setAttribute("aria-pressed",String(active));
      requestAnimationFrame(()=>{resizeCanvas();window.ApexMatch3D?.resize?.();});
    };
    const toggleFullscreen=async()=>{
      try{
        if(document.fullscreenElement)await document.exitFullscreen();
        else if($("gameScreen").requestFullscreen)await $("gameScreen").requestFullscreen({navigationUI:"hide"});
        else toast("Fullscreen is not supported by this browser.");
      }catch(_){toast("The browser could not open fullscreen. Try its fullscreen shortcut.");}
    };
    fullscreenBtn.addEventListener("click",toggleFullscreen);
    pitchWrap.appendChild(fullscreenBtn);
    document.addEventListener("fullscreenchange",syncFullscreen);
    document.addEventListener("keydown",event=>{
      if(event.key.toLowerCase()!=="f"||event.metaKey||event.ctrlKey||event.altKey||
        event.target.matches("input,textarea,select")||$("gameScreen").classList.contains("hidden"))return;
      event.preventDefault();toggleFullscreen();
    });
  }

  let apexAdminMode=false;
  let ownedDraftCardIds=new Set();
  const normalizePlayerName=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const rosterPhotoSlugs={
    cristianoronaldo:"ronaldo",lionelmessi:"messi",kylianmbappe:"mbappe",erlinghaaland:"haaland",
    judebellingham:"bellingham",lamineyamal:"lamine-yamal",kevindebruyne:"de-bruyne",mohamedsalah:"salah",
    viniciusjunior:"vinicius",neymarjr:"neymar",harrykane:"kane",bukayosaka:"bukayo-saka",
    diegomaradona:"maradona",luisfigo:"luis-figo",zinedinezidane:"zidane",pele:"pele",
    ronaldonazario:"ronaldo-nazario",ronaldinho:"ronaldinho",thierryhenry:"thierry-henry",xavi:"xavi",
    andresiniesta:"iniesta",andreapirlo:"andrea-pirlo",sergioramos:"ramos",virgilvandijk:"van-dijk",
    karimbenzema:"benzema",rodri:"rodri",
    alisson:"alisson",thibautcourtois:"thibaut-courtois",manuelneuer:"neuer",
    marcandreterstegen:"ter-stegen",gianluigibuffon:"buffon",ikercasillas:"iker-casillas",
    petrcech:"petr-cech",oliverkahn:"oliver-kahn",edwinvandersar:"van-der-sar",keylornavas:"keylor-navas",
    bukayosaka:"bukayo-saka",philfoden:"phil-foden",diegoarmaradona:"maradona",pele:"pele",
    ronaldonazario:"ronaldo-nazario",thierryhenry:"thierry-henry",andreapirlo:"andrea-pirlo",
    sergioramos:"ramos",virgilvandijk:"van-dijk",federicovalverde:"federico-valverde",
    endrick:"endrick",gianluigidonnarumma:"gianluigi-donnarumma",ikercasillas:"iker-casillas",
    petrcech:"petr-cech",oliverkahn:"oliver-kahn",peterschmeichel:"peter-schmeichel",
    samirhandanovic:"samir-handanovic",claudiobravo:"claudio-bravo",yannsommer:"yann-sommer",
    andreonana:"andre-onana",giorgimamardashvili:"giorgi-mamardashvili",davidraya:"david-raya",
    ederson:"ederson",janoblak:"jan-oblak",mikemaignan:"mike-maignan",emilianomartinez:"emiliano-martinez",
    zaydquadri:"",ehanali:"",umarshoaib:"",muhammadarham:"",hassanali:""
  };
  // Build a fixed photo URL for every player with a catalogue slug.
  // GeoFootball Guessr documents the underlying Wikimedia Commons source and
  // each individual licence on its photo-credits page.
  const rosterPhotoUrls=Object.fromEntries(
    Object.entries(rosterPhotoSlugs)
      .filter(([,slug])=>Boolean(slug))
      .map(([key,slug])=>[key,"https://geofootballguessr.com/footballers/"+slug+".webp"])
  );
  // Pin these three portraits to verified Wikimedia Commons files so the
  // generic catalogue lookup cannot show a similarly named footballer.
  rosterPhotoUrls.rivaldo="https://commons.wikimedia.org/wiki/Special:FilePath/Rivaldo.jpg";
  rosterPhotoUrls.jairzinho="https://commons.wikimedia.org/wiki/Special:FilePath/Jairzinho_1970s.jpg";
  rosterPhotoUrls.casemiro="https://commons.wikimedia.org/wiki/Special:FilePath/Casemiro_Brazil_V_Morocco_13_June_2026-76_(cropped).jpg";
  rosterPhotoUrls.muhammadarham="/assets/players/muhammad-arham.jpg";
  rosterPhotoUrls.umarshoaib="data:image/jpeg;base64,NVaihKESQF2/wD/xAArEAABBAEDBAICAgMBAQAAAAABAAIDERMEEBIUICEiBTAxQCMyM0FQBkL/2gAIAQEAAQUC/RbsUf8AihWrR/48swjMmoIA1stwTNmH/DnkxxukaQXElQycCxwe37wP0/kv7j2PEIsTvC+Pdcf2gINVfp/Igl2mj/hAe587OLWs5wfGf0+ykNj+nqwVGGthMnnISAQ7S6NnGP6gq2tWr/Te3k2HkIpC9ha97jpmXEBQ+w/dX0OIaNQ8KwQ2qjAaxUj+wAqTu6SRsafIZI5H8gmn2ZM4Sxua5UnfqhUuKrY9gFqeUtUjiR/82qXqmH+YSNYYNRya77z3jd3bM7gyQkud+D/RcRtf8zXAjJ6aWXk0/ce9pQ2d2vd7l6mHkDxVbBH/ADM8kBgTCAPvPeCrV9hNK6YZGq7A/B3d/e+MuQJh8Rm2fVSpUut1C6zULq511c66uddXOurnXVzrq511c66uddXOurnXWTrTFwgmm5KR3sP6/wCt3niXflhUJCm1EjF1c66uddXOurnXVzrq511c66uddXOus1C63ULrdSuu1KxBYQsAWELCKwhYAsIWELCFgWELCFp4G85ZORd5WGyyiHFAo7EiuIcnDgbWEFYQsCwBYAsIWELCFhCwhYQsCwi8IVFHkv5EOS9kQ5eyHJe4bTkOS4PVOTSWgqnKnIAt3tGlIfH4e9ptNtU6vKp6917qivZHlZDl7L2CJfXknOEJQsjQRI3lmFl7SMjVlbRe1ZWrm0AT00z+ZXhybxBMrShJ51Dg2RUiUfJ4i+fvI9r2qEhqLxQeCjLZDxy5inygjKAhIEZQTkajI1ZW3lbbWNXFipgT2saqjvGyy2MgCNAMKc0IMYmNZTWR8RjVMaeDKjLQtUC8sdWzhStD1DgKbwx8I7/jC4RlUyg1obTLHDlxjVRkcGFcI1ULjUaLWFU0IxFYysLijC5GJy42HQowlYXccLkIliWKziN4VwTXiGSeVpHEFN/EipEr8oRnhiQgJToTeG0YiFiR0x4CAuIYjCQjA4JsJcmRLA7kITfuiZArkXKRc5CfcK5LLn1T2oGQLk8r+RAvKtwXJ6HMlzrcJnBCRrkbV+CUAg1NeeIL1ci9172eYVvIJl5EyE/yK5ETIg+VN50HSNX8lGZdQCM1LNSMiEwTtRZzN4ma1zRkZWYLqfOayJOIzi0dhIQsyzBdQUZXuUR4PzgEyAkS+cydKCRKGozCzMziZhWUFZaRmahO2s4WSh6cqYUWMQEapgRbGgGLgyyAmiMohifjXoVxjQawulDBHse7TMD5eMfL0BDGJrI+Poqir+NVGHExotjQEfFgjVRqguMROla2F2WJZYllhWWJSxh8mBYFgUEbY5uq066rTrqtOuq0613DUO1EPCI7Hu0Y5TYFgWBaSSKCLqtOuq066rTo6qAjpl0y6ZdMtKxsL8sSyxKyrK8ryvK8qyvKsryvKsqyrKsrWH+E7nt0RrUWVZVlWV5XlWVZVleVZXlWVZXlASlcJlxftYXJq5tWQLKsqylZXLM9ZnrM9ayRzg7cNLnOaWu30zuM2Z6zPWZ6yuWUrKsqyBc2rk1WNuLlwmREoRktei9F6L0XovRei9F6L0XorYvRei1pBkd+dviwxrPkWNlj3jNP9F6L0XovRei9F6L0VsXovRei9EJK/Q1BuU7xMxxrUR4pd4nco/3SbedtM3nPtrmgwb6M3p/uyLIuayLmuayLIua5rmua5rmnyehR20jMY5rmpDzY6xvoZAGc1kXNZFzWRc1kXNZFkWRZFk++d3Fsj0Ta0zOUnZq2WNh+fudp4XI6HTFH4yAo/FMR+Kcj8XMj8dqEdBqUdHqAjp5wjFKuL1W01EnbRu9uw/gith+VRXFywylDTTro9QUNBqUPjtQUPi5kPinIfFMQ+MgQ0GmCbp4Wpuv1IQ+TnQ+Vch8q1D5SFD5LTlDX6YoazTldRChLGVzar24r5fx8iRt/52ESarBEsESwRLBEsMS+dgw65D8taA1WuQWWNHUQhHWacI6/TI/JadH5SFH5VqPyrkfk507X6k/bZWR6luSXbQPkjj6mddXOuq1C6qddTOtZI+aRMsvyOXI/tFPa+z4UTeUndqxTlGak++1f1vdTDIUStPGA3u1n9Uw06KQSD6Ttfff0OFtdC+3RPCj8M7QtR/hVFaQU36T32jt47CrVrTQmc9JGyOQcVatclyXJclyV2I4gUGer46XJA947b+shBNmbDCdZcc0nJ30MfxbDNYfM1oeWHYd1/VW9dlKlS4rguKpUiFSpEKkGqlW97UFSHde99t9tfTW9dldoVKuwbX2HYI/oHc/q/wCz212D6Tufrra/opBV2VvfYf0AqVb/AI2CI2Cv7b2rsKvc9tb/AO+z8d47L2Gx2G9bDY/UD3jupV2gfSVe1Kuy+w/QEdxvXYFX0nsA89lb/hHuPcPCJV7V5CtE7DY7X9B7rRHbfZW19h25II72r7PHZSG1bf/EACsRAAIBAgUCBgIDAQAAAAAAAAABEQIDEBITIVEgMQQiMDJAQSNSU2Chsf/aAAgBAwEBPwH5tiyqvNUOijgu28nb4VleREHiF5PheGuJ05eCTxNxRlXoT1RilPYs2MvmffC5bacjXpogeFujPVBTSqexI6sLtv7XqTj4WnaSvoqSgahx1QZFwZFwZFwZFwZFwZFwKhP6IyrYb6F2HSp7GRcGRcGRcGRcGRcGVcdacFVU9NIzb4W/V9YQRhBtg8ZJJFuR1010NS3Bmt/sUu0+9R+H+T/GPRj3/wDTVpNWk1V26aNOPNVB+H+T/GVXKE4k1aR3kjWKbyb3M1v9jc36qPd03e/VubkskkkkkktbvC7VCLVc7PC99EkkkkkksgjCCCCCyu7wuvMynZzhdU0kEEEYQQaTNOoyVGVkMjC37Sv242nKjohmVmSo06jSZmZnqNRmqzVNU1RFVUI1Fwai4KK5eGqapqmqzUZnqMz9G5VLxt+4Y9vVppbexp1pTUQQQJblNMqS5S1Vv6klu9p/RV4p1KIJJJJKb7pUD8RP0T/av//EACkRAAIBAwMDAwUBAQAAAAAAAAABEQIDEhAgITAxUQQTMhQiI0FSQGD/2gAIAQIBAT8B6DI/yeovuj7ae4rlzyWL3uKH3/xeof3sk9K/yb2yel6u26asvJiektOc3uekbp1bS5Zf9T7n2rtpavU1UwJ9Nki0v3fbpkqrqr+Wyxec41dBbIFp6yqasSnYnDKXKndkZvyZvyZ1eTN+TOryZvyO41+zmtjUaoZTU0u5nV5M6vJnV5M35M35Mn53tNlNJVsqKe3VnRrnZwduN8n640nVEkDoMWYs7E6yTpJdvOmqKaZPqK/4KL1TfNMGZmZUkoWD5y211QzMyRkinCruz8f9FzClOqlyfUV/wcnO6j5bbnfdyckskkkkkktfLS7VCLVU8aXiSSSSSSWQQQQQQQWVpccsp4c6XVKIIIIIIIMDBmLIZGtHxKu2tt/rZBDMWYswJZkzNmbMzMz0qcIyRkily9MzMzM2ZsyZL6Nbl60d+v2Fd0gjT3B89V8iUEkkk/8AW//EADYQAAIABAMHAQcDBAMBAAAAAAABAhEhMRAzkQMSIDJBUaFhIjA0QFBxgUJgghNSkqIEFLFw/9oACAEBAAY/Av3HK7OZIun+ClH1X0SfUrfGfUUSs/ocK9MLlcIl2f0NPsjelNtlYRSUyP2N2hH9/oal1FIe70Ko2ihpQ+7+hyIodpzJlFQlIlMl9DmxSLnMJL6H7TJv7opghJVT6FH9BcKofchxkqi+zPUW/SfX5+fegt7gsUPwTGl0JP8AHz3s13P/AE7DthXg3exYpTdfz0UUX6uhUnwzFhMXvs1mYzMZmMzGZjMxmYzMZmMzGZjMxmYzf/5EU3dYIXDYnhJi/p7SXdGYzMZmMzGZjMxmYzMZmMzGZrM1may7Lly5cucxzHMcxdnMcxvRVSx5uKpKyxuXLs5jmLnMXZzFy7Ll2XOuFMOXCpbC2E5YNPC1CnGhTwoSwsUJlixbCmMyxN1ZMqM9SxLpjapIoUQpueClDUSdnxJ9mSlJ4VOkybwqSJSKIqTkVLFUTlhc7imrk0iYt0qWk8PUf9xV4dx1SFSciZKLgeELdaTJxEqE1hWg7VPaJnaZ7LKkinQ9SsmemN7lLFGxe1Uk2UdSpOYqyKdCheR6dzdbTb6M3YFLvPCXDB6lWd2TJzK4b1Sc6HqirxuSWPc6lVh6EqlWTKF+C+DbK1WFyT4JTtQkSJdEIlwWvwUsUeEpEkhotTsWoUVj/wBkKaquDtNCoNtHcn6cNjlPZgSObQTJqEmVqcpYoPrMk1XuSkSvipw0OU9VhcnQv+SrKHYWHf7nQkmdMKuZFJ+5U7KrLl6F0TcUmi5cq9C9CxR0HvC6DqdCdyJxwqOfoZC0MhaGQtDIWhFEkkn0kdNDpodNCGOJKJJ2kfCw6I+Fh0R8LDoj4WHREL2cC2cl2G5+5l6HTQ6aHTQ3I9io3O8j4WHRHwsOiPhYdENf9WHRF1oXWhdaF1oNxwqOa7GQtDIWhYsWLFixYsWLFixYsWPu/cosWLFixYsWLFixYsWLFIYtDll9ysUC/kZsJmf6nNFofqOV6nItTlhLQ6H6dDpoX8HMQqJzrwbsN2SiUnwQNdzmL+Dpofp0LQ6HJCci1OV6n6jmi0Mz/UzYSkUD/kcs/sVhi0Kwz/kzKh8mVD5MqHyZUPkyofJlQ+TKh8mVD5MqHyZUPkyofJlQ+TKh8mVD5MqHyZUPkyofJlQ+TKh8mVD5FuwqGS4ItpHsodo3RT6G9s9lDBFD26rghfZmVD5MqHyZUPkyofJlQ+TKh8mVD5MqHyZUPkyofJlQ+TKh8mVD5MqHyUhl/J/IRelOBQ9sGujtwQvuvnon3xhWM5W4Iff2LFixYsWLFsbFsHwbzVWWLDhaubrxcPrjYsWLFi2NsLFvfr1KLCtlXh31+cZq/v67KDQy5fZlHGvyU2sWhTbLQpHAy0L/Jl+TJiMmPQrs4/8TlehbBLFr3CnhZnK9DLi0MqPQyYjL8lVCvyVjgRXarQrtYtCrjf5Muf3ZTZQaGZP7oqoH+Cuyh1K7J6lYI0XiX4MzwZ0JmwalNpDqcy1L4W8G2l3xjiihnDDD1MqDQyoNDKg0MqDQyoNBtKUO0W8sEJbuFzmWpXaQ6mbBqZ0JmeC8X+JSCNlNk9SmyWpRQL8GZL7L3vMzni1InXFuCNw7z6Mzo9TOj1M6PUzY9TOj1PbicW7SuClc54tTmevzdColxp98IWvnGyuCi68awT7FPm2iiKoh44sJj9fm5Jykf3PuOnuZymVKfNVH/TZCuv2HK3uvbO5OX75t/8AIb/M1/YVf2h//8QAKhAAAgIBAgQGAwEBAQAAAAAAAAERITFBURBhcfGBkcHR4fAgMKFAsVD/2gAIAQEAAT8h/wARcGf/AIrQIP8A8gWItv8ACXPkEhCELmJTRyaf+JNShqQ1xdq5jxr1NdiCXDBgJJ/fH+RZ7ZS/okKWRSQkFxMBGqjG47oJ4/uk4VP8azWrfMsrPERhCXIax0BdGZO09JRffh/z9cECCiG/xvvTo2RBSWTDF1GKY3M6gz7iLv3FBF/46GNrh7GM7afMrM23UkdKt2kT0iVCEJhfrVEjfukR+crYReX3HSwk1kpHkyt9xKRFP9Kgn5JpiqRWdmroyNjCQ2RM0TkUBqRBJMvTUYT97/JJFxjY0/gxoQ4sImR9UzgNxG9WiOGiDeYFBAamTaYNLcuNNFE7AX96fkqfDA1+TyNQWkbVXsJ5GfwZTJwkl0FPLJhXi+CWat2f7yfnAMP8SUsU5pFZvDYa6i3iiTfbImixTBtwINEt0PapUMZmLjWcnVP90EUZfpb/AAISWxwBEp9AlrTfMbvZzL4W/hoLC6Cw8SfDbFyyTJJ+pIRRR7YjsSO3I7cjtyO3I7cjtyO3I7cjtyO3I7cjsSOyI7Ujs6N/wAoxXvkVNzrkJqmfkZk/Iqmfkc55GPdyLsvITmlK+RD4hNmyjkZ7VyLIzYeGN5BoNwPnnQiHIvTgWGaDgTKV6iINZm0zKjMTXpAnKU8dBI8M8CiZeRJhn4E0w9chNUy8hfBFqUp6DS8/Iu9ISuYeuRifyKc/IluJDPhQ9zU0xqYYTbFeLcjYwhJbRtCSTsOQ4KYyX8GWIvSyYEu2s7alBDkYjTeQlW6RQ01myWxOHwPDmOgt2TBmHMC/NDdjRlXCyaJG9ijLconhuCyJQ5LZd0zUiaoeY2sZQSyUPAThIb0GkyX3TGElTZcVYLFj0IcD2NBsYSMSSFyEuJfwQLcPIjdVjBE0W28y/ONDJCytdBxsW2olyqU+Qh0QsDeGLnuI86UeNqlsSwjZxTMRy/BkQ4JaCkM6iknbQ4c4DnQYe4hI3r0JSmYwAnqIlgnHixL2uhRWFiCE3g03Ie3ZEcIk1h6EjhKnQbai+ZG5m57KCmmiDUvlLLKDVpKDyL8nJpi0gapNjQitNP+ExIbzJoEoTPoeZr60oktZZDsy5J0KFSZFmKVMbxNyyhTDYeBm1ySqJUrZj3vj/hhVqT+QlT5j8w0SG5CltIkKI3m0mOvU/glZFWgktMqP6USmimhMc8BkYLcaE0wkJZag1MhN1ZEmmS6MlLRvuSUqhZtirTkRCT9gJrbGRv0iKYmmk/IShOQXVoE2SGNiEsOglgdCxBCobHE1DzKbWsFlak5YpiZ9WpPNlWUc5KqvLUJF3HijYkLkr3fQexYsSaCwlrIjoDTwJDOHkjGLVgm4acJwNJJbiabReibMsrEihh2siy7FomyGrcfLiXQQ93oy2mXsWOFA1t4VqSTr0EYzUCcNZRpkHkkcpM9YMuBZbWBtLdE4AmNBtyCWDA3pKyQbNSOy7YJWalL+FBhuxNtS1pIkUndQUDmYxBks2yBxsTlGuwympoUdjga8HjDGsQUBIxDzouTHRJ1SglU46jk3GgymhcN+A8jcyOmZ1gpi1KG+nPVjLUp0IKMSS74ZSxTqJwZq4FpprLXctEnrJV9WKqbFYmajk8kKRG9OhZNJcjI28gRV2sijNK87i1HGkCgdKg0hWnaIwOEiW0CmpqxahFkJQjAcpmSshqzLMn4kHnTsqm0bUH5GHa3IpeUol7D7FWJwQeEQ6pvnwDgNM2UxLINoxLyGAnUDgZlaISio/4QGoiUKIUk0WpC5g3sNbFH9Byg4ryErCRzgiwfNZIbaLYb00bWxIh5Ri1atR3yjx1MOU41Kp2nVFktReYsSMCXnmKdtOSrYhShqeooNSawW7wm0zC/FAxCEePICrCNQOQ00rwMpTYJMhU6ic3KpTQmRS8hYtTsZFHmaRU99hRpOeE6lsRqMqShLckboWzZBDb55HAmpVEi8EkJaDso7KOwjtobCSVoEAgEAkUiesfaPQ+0eh9o9D7R6Cr3uTSS/Io89MfgMnijr98kAgEAvrx0H2j0PtHofaPQVREqPovxRERYygjQdlHZR9bPrZPfJ75PfJ759bJ759bJ75PfOT8zkfM5DzOQ8x9Gog142YcFwRQblNHIeZyHmch5n0snvk98+tn1s+tk98+tk98+tn1snvmRXjN5vARB/UQxnwZfoQ7+g5z4Ucp/FexzTqYfIPunh7leSczyTkvIfUkO+pYz4qSJCTTiIY9Q0PqSOT8hzPJOV5PD0+4Q9hjknQ8pfFexPo+BkuzqM48VNehL/EQ2m8BmAXjFY/V7pPz/AHE/P9xPz/cT8/3E/P8AcT8/3E/P9xPz/cT8/wBxPz/cT8/3Hd/cT8/3E/P9wq0GBTxNBqAbLoKuYt+IiSFKQyfn+4n5/uJ+f7ifn+4n5/uJ+f7ifn+4n5/uJ+f7ju/uJ+f7ifn+4n5/uJ0+f7hWP0e7/gmIZ8M0sik+jhGu90cEaHI0f+5cpmzLh1Cl+HFxaTdQ9homCYhoomkrjP7JcBPZwOlwuhwJ9x0onokT2ExPYdhitykVg5R0TfpNEx9pMfiQK1ohrhglHdkjpJbHSJcB9J4wn2JbEth0f0Ta/wBD5BP5eH4SIbMkYSkMTSQ1uSroRPxJvhCocqujhDXMeEoRiweJznhZqUWafjgy8ProI9aAaSdUZ6qFD1BC2OiKWh9FPRgyg13S8RFlfiG27yGOwbMookbFLVtSSU9UJk/ZFTZTlQSGtqZ/CesUimBaHkCfq+IWA3xjGPOCxvEGdvVT+sRY9QZ6THVTogv6APWQZh8PRAYp6CEczoyNN+h9ESZkuqOzerGC80T8Fyh8ImYf4C3yIkaNYhp2MFC6EjIFrouk2/rOyTsk7JOySLHkSHpZAoWz4SaFblC2IoSUQRGh9JGvPlhowfCZY+S80Q39GEcNCH/CSFP+9TS/qzHPVBojoRPkS9hzN8WT48H4DRhYgmdX5karzSJXB1jXlL1HWpIpR7BJtfgxQb3GXHEhOTGREusht96Sgc6t+Y1w8OKckeHDKOjJ8OCkcmTJWoo3MH8PEvc8eFkyQhXUR6Ine2JVSggaMcL2Id0jH5xJLujqQjQkh6n94LjKiCkRQ1AuQdBY2EhUTA2aV+FaG9CQq2JCLllk5mlMWBbE7jY173JWopa7taGRo01lbcHyP4YFwXQhCJaWWrGxTKgcpCnUcwWiXJGXQkJ7UMRaZpkujJIpr5iOWwQS2RJJ0JRIws4MDjQT1Rx0HMtNSLNJKw+EwXoyyRQ+QkbmBdRpeJDNBIUOCtDLcqbGih3o+Fh/gNRQRFlydoLgm9RB8bgOg20uRYEtsMdkLYZey4ObQmiTxIInUhlDWxySSMy2jQ04WVtZWrJLmxpvA2DNLHUnoTikhE44K9zGxFieCRDjhA5IJFLMlIkMxZ9KKpKSGJHIUslpaEt4E2aj4lEDSLbFSo1Hkhb2U5l8iOLQdsvlHSNeCmBuLgxukYWJYPFEogrQjAoLI1HFMlMcDEkNNGdhcxiyxQ0gnYhmEOsWW0MGcj5FtXRLhCIW4+okXNIfMgWojUhSZEHU8CzkhIT8jNplvUQgNEyK1EuENRui2g7NCyGg8C3bMsmkJirI3NIShWWS0LN8JbxRqULkJb4GJKTkJnAubHqgm44N0KWRCPAck7kcIgir4TQuQ5gVaDZnQ/4Zy4HkTsyzoQickOeQ0yYe43Lg80TCHepEIWRvkUSwJWLLEh0JeAk4KeRToxrdGdSVA86EcHDmJsTGhFlJlnSDDsysmBTJyCcIeKUFsoZxgwKDJlkLUidRWlQsaGXYhuxsg0G2JsuSRPwFTHEYMiGMsgOEqyaWzI8CwiRpGGw4oy+C6kbmNTxMDzRknYg04HGwmRktMe51FjJEDPc0srg2zq4JjYbbYnGDJE6khOLZMjErs6DdWWYoTorVEpaCl0GQHyGh2TWBrJEpKYZYgiORBC3HzEkxkLUSotMXMcI1BwQ9RIcxBEcGTMkNOx8FbEZKajOgk1nA404DzCI3NDNkmBWiCC4ZkhA4cIOqFDI2vAc68S5FiobljY3QhoGeoxIpwd4FAdYMlIQbN2JHQR4DzwvUfBQqQ71NwI1gajUbTQmdidiGMSnhO3ByJIo6E5yZOop0LeeIIN6G4MkjKeAnBKZXE6slsTsONfw1E6wJKlHiQlkSOhjI5cSIQnCG4MDmamnBghI3OChIuiWrHIkxNxIRQaNEqBlZFJEHUdjghtB7CgzQ/9oADAMBAAIAAwAAABAEEEEEEEFZSsEEEEEEEEEAAAAAAAAD/iEAAAAAAAYU00000000Ipc00000VTY444444447drY44445jPoc888XE88r5/xw8889889bzw2H3zlXIgGTbzzzzzz/ADz26xzGEPp6fxzzzz+kQIBNNIBq1XtHknJBNIyEsaWbXn3aEFyUb0GBuxiCGArEpsGKon0urc0KjTSsQj4Ysh+J6IK+d3x9dPdJRy0SSPPBaGWwSjCSM2JhMIKGOCwjAeMiTwAMCEEM7i6222+t8bUAh+y6y62vZtNt59J0vH16+1FFNFxduf55jWR5kBZmNNwXEOPSx9u3n0Lakv8AzbT+PQ6/RdQdUiRUBPUbaxAHbTTQfWVrffUrvH9GL8XvsbfSZoQZAcc+wABEpspFQWbUYTWSQKUcVsSPUeaYZWImNlXPXNZADnXXsptQpeTWrBtpPNrSPG92TSluTsFaVdkTeBuvLuS86iuuUXTimmTkFVcjeoGd5sbzivIbWf/EACURAAMAAgICAQUBAQEAAAAAAAABERAhMUFRYSAwcZGx8IFAof/aAAgBAwEBPxD6C0Uf/Gh6P2RRKXXg/oJX6T2gSQQm/wA+UEqJJfSUm5/Qew72rv5IpXxSHkxogp0wN6G1t3sgvppcGxvHHZp1gmXA1qYSk/oTWVrB4g3mPrK5HnUGMbr4wT4H8Eel+D0Pwekf0Q0iT8CSYY3v4bwxrYel+D+CPS/B/BH8FiJrhkT3T7ES7G/B1RDbYjRGnvEOyJETWx6aElw2a4OdNjWxR8iVWxa6G3osfBEf4RyoftF1Mwb6aPcJrgWtQXPA+NoWw31BI1yaOs1xRoyIuTT7EVEtXoovIggbyEktFGJdEXN0RMk2iI2ovEY3u/ozTLS+zI/QHRmlf+DwM9hZyhfBNy28Rv8ARv0/j0NCUl3vZqlIk2R4IxJexK4/8MggjIyPKVBHG3ldX6zGRkZBMKyyyyyx3hctLlm5itJkWWWWWXioojKKKKJrBwvCKTg7R0UUUURlFD6HgfiPSPxFYSIM0zWdo6zGLxHrE7oQLsZPsSuxHDoT+D7SPBwFWeUkSSONk+D7Rt4H4Bnbsb+/gsrbiEoaZdFw7SCVNCNo8rEpMP4RsVFzFQEh06WWPSMjUOkDWXnWLhaELG9iQQT8OkRUhKRqOsVPFH8IeswmaXCxwMuLjjFKUfopzjguLjkhDjCpMbwoifBY4EcYuFsSPZcTLZfJRuF+CHo+4mIuOT7DFsuexpsioyQtzTsbP//EACURAAMAAAUEAgMBAAAAAAAAAAABERAhMUFhIDBRkXGBobHB0f/aAAgBAgEBPxClKUpSlMyNQtClKUpSlL2nO+38CTre/JY0X57Dc7UH8jejI+/11UgU32nhdP2Fkorspl1kiClKUbgrZSi2kQxGv+sFxMmtv8KMpSlwpRPF2jMLvhkfV5If1qQmDyfUy9bFKPM1mQpJ2JfsSY7DkNbCVruUpSjcGiOV7Od7OR7Od7OR7Od7EVbexul6sQixm5ixiak0+Tmezmezkeznex7rezneybifAk9WKskN4hJoPWbH0WCFkK7WJkRnYPWo1zaM08kRDTWhc6N1y6iWo9JSvUrWpCcZHsKTsYiiSLPOmWoN16j8DzWT0FrER1wig21Y2w5Mgm3qVoZja5DRqM8BwCcNaYPYPJobdpqSg2E8pCoMTy+U5fpiSpftDVb7JinRE+Bbg76iorN4jH0ZIJPAo5s5Rtr+n/BJNvpmYiWizV+2N2r+0QQRkZGRkEqDG4J74KYRkZGRkEwVllllljt5hmRLc1XClGiyyyyy8KiiiiiihqrYzQ9iki7o0EooooooobbYHAcRXgjwWB3cxqg9MMyvBxHBhJvJLc58QvwfE+ItEIoziOIXBIeSJ8HxL8YhznN1rNxFMkWLxR5qDTTj7kFuGPYarpWBKNMaeBqpOxcUyAgR0Bwpe9MaXBdq4svVcNcdMZ29OuYXpbwvUh4Lo17DVJjcbj//xAAoEAEAAgEEAgIDAAMBAQEAAAABABEhMUFRYXGBkcGhsfAQ0eEg8TD/2gAIAQEAAT8QqVKlSpUqVKlSpUqVKlSv8WVHj/FUqVKlSpUqVKlSpUqVKlSpUqVKlSpcmHWXEyZUqVKlSpUqVKlSpUqVKlSpUqVKlSpUqVKlSoFCSX8v+iW6VgPLLczZk7Ll0FLeIQVGtbJuMe+6DrqVKlf4qVKlSpUqVKlQS4l7bKlSpUqVKlSpUqVKlSpUqVFXm2Ta3/iPY0a1sRd6enSPIijXaLeTaBsx3NhvSlypUqVKlSpUqVKlSorgm0wSpUqVKlSpUqVKlSpUqVKlQTcAA0vVCNQAOANJTdHFNovSmqgNpkuWTPcZ5B8RUqVKlSpUqVKhaXmTMAlagVKlSpUqVKlSpUqVKlSpUqVAYYcLQP8A7KcWNDd3liWxhwFi/iS0c8eJSBYMbrQS7i8A6KlSpUqVKlSpUqC2GESof4G8lSpUqVKlSpUqVKlSpUqVKmF5D2NmIyVRVUSxOpr4NvAZSgZUgruKwlkm6ZqGjQUEqVKlSpUqVKlTNAV/gqVKlSpUqVKlSpUqCaEUakqVKlSpUeHNC/OkZTTSKquMG/qKyMyhlhnBDkUXTc6sdYlJKpUqVKlSpUqVBSOZUqVKlSpUqVKlSllzbACAEqVKlSpvMWi9Ioi8S4rQrxACpt93mXTckS9Sj0FVqrtxxRMQGu7XwlBKmVKlSpUqVKlSpUqVKgpZUqVKlS1BdodIUlRHfUqVKgM7WWY3zuQ4imSNly1ERQinzVfqUXAacDyxUsTvtDlRAvioDeE1gQR3PCfMtiUypUqVKlSpUqVKlSpUypUqVKjgxgElRMRlSpUqLSFVQs27xaRTYVcYK8EK2q8sBLSxIZjZdMzRwGF9wwNj9lypinVsEWMuinTC5jMzAscpueoC5UqVKlSpUqVKlSpUtIlMqVKlSpUoiqCkYkFjKlSpUF1brAgEB0A+AYA2vVn8TAWOg6RfiG8Ep0bRVTD1KqNiZBkSaVJAbXywxLAUtLfzEEiIQ2DNcypUqVKlSpUqVKlQboRgKj3Pc9z3PcMOsoNYnmE7/49z3KkA54hX+p6MVg/uL3owr9JZuUC60aQV7Q2bqgFyqhdiKXAbGgmuGC7fOWCtoQrjMzpmqb6nue57nue57nue57ljCYMOfzn1FtX/jif3n1P7z6n959T+8+p/efU/vPqf3n1P7z6n959T+8+p/efU/nPqKBPBGjBj5YjgDeKoiKZAXrMAbd5Zj3uzZxiLnRLQDWneM+tBRxLgcU53lxlI1LbMYfYcBrlpP7z6n959T+8+p/efU/vPqf3n1P7z6n959T+8+oFp/Z1A9P7Op/SfUC0/o6iTQr0lHLhSgyrJNUUmsaZRDMS4FAYS4EBEHeMFnwhMAtl4kYWCzpMNoSpoC26QRBiWzTpp0qTYY9prYbEVGj2auDqlZxAXChfkxEhSzqWKMJo2jrzEMNBm4qCl3HmKXiTQbyhtZuCUqy0tMbk0umNuM4niCBVWHECgtFptI3BAW3oirrAXKGbCBA3rUo0s7MZm1tTHIl1emYDjWjnBlrDRrNmxwMaRyoa5g0alzWgy/Oy26SlZrb+/ENxhXQQ10HAJKILlFDLMy2mg0RBFcI93NwHoBa74jI/RQKBOI0BscTArHUyFCZYqZmsBX5mDgvR3jqJiLuCJnlrhzEUxSs5jRQCAcVXuJRb/T+IjFihsHSC5oGxhdyyFr0zZ3Ei2grfxK1AOBowE2gsX6lho53erK+BEwm3ENKG6sgS4mt1myMvQhq8sAA4sBhuY4xa6+YJoNhWI0mzV8GUIQUYUzKLk1Yl3Lj2tUVTtKCrWy8GGSd2cYXvGiRAAZLitKBGrDHoCgwDPiNItcH6orDXRiiW8RQZUSwgAJoWuTuXTA4WsWUN2goPe8PvLimdIQKMDQvqGXdk8jhikVYjZeUFyl8EAAy4CCGIbs2Y2NQfylLQb5UFltzL6Iob1zC16La0IvqjD1iNKGtKwSydlnGrBF6TdAmU6hWr3AIyxohxdDX5olpgs1c+Y4Km3K61HiClAS7OeIKVNEB48RYOGYTM0IVfYOeom0aXcwc3MpiijoO8DGUvBARIvkNAfMSFaoubdbxCe8BaHUdWSwJhqPVEcnQcR6AEFMKz3BWSsrQxwwADJF/FxSSH48QojpQGc6acQmNouE+IwkNgLTxCCsQi3+7jk7Gk3vdMwjbXf8A4iGVZu6ibqsjMGXZcNGtUfMBcHjCcAAG6QwsEMCzpcK7CuW0x8xdG1NcwcuBpTPpAxQTyoVFdjH42YKQ5sLfEc4pJZVX1zBY0Y5MbNFSpryRUMEpsB4hkQyjThlYrThUyKzAUBo3vLKhFi27fSBS1FyD8TDFByOOrlpYukWQlyOZy1+YKRam73rYjesWGMfMDnKqBlQMts4dY5IAAFBkXxFgOqaz9xkVxOCm9wagxhZLHgqp6nuUQmjjd/UXQsrV2qDYoGAwP/sxEBC1sTsppK4zAwXh0c6sOpEDCOYqglbzLQJRhlCX5jmso0CYARrrBNbASq9F0WmtpkkiGdA1lO6NMF3i6ejqV8RQDXgG4qFUmlYrkgQ06i2ual5AUWcIAWgrGKguWyFPgIqtLlWHSJXu1S/2kMTlUx3mZoOTsPcdBWwdB5zMsNDRM1BraTKph0NziXCKqsBBOmIbrHqNSqjNnMHYrpJAVrddcxJWe3LGEDDEfoXp2VppmBWBhdZIWEm4EuqaUu4BYGwTUl2AeA1E1ODrK8nEC+B+mNbz0kDYy8OsTYcv9ZiMZRqWZlHg3i76VrZPUAkkMhnzMioeRWsHSmAGLgFhA+hFspq8awFepkWsB1ozahjmWfnK0aJntgshqcw5vC2bm0aEKxjOCKgIbedOfUdlWiVxGIiw3u4V3F8ldyjBo1wICVfTHwytQmbP94FFlgNGX5xNDkIkhRt1G6bzORu9Bwg7Y7U3HmaklNlb7MNBfSGxHmXkgYPNu9y2aQLDw+Y1xpmC1CcKqO/VwgmBF26iSbkKGQh0Dd23AOEyA0miSmPgahu95hkVvE+pQrsVUtRl0PxBEUFR0XkmlvjJfKpa1EKBpDsWyK0HcAVcAcLpUSt6Ta66CW0gjmWlQgbCAksdELFHhL++EKw3zcokRCJdEKbPi2+2ZZlCAhcJEdFhbntg0bhpFBekK0JyVi3MAFSFBo9ImCUoVfdsAam6SFrqKMF0iIviANFeweEfZVXbiDV1FKP5TQltsr4TKOi0+5YsFk0Hh4gFQVljBtFkVrClLglerUKUxtAS1ijXPC7Q8d0oDiyNiNYpXFBAwNXLx/hrrEHFVAQJDXlhiXWOw/7UKIpZWk5xKWGGhseIWkUhep5iU40Ns7nEqiVWZmgK2K+Vh0BUWhRKdBty7DplAs7SGzsepVjFqFu6lQJKWumXNCS+sS5e1tirhOMTKE3qF1zMFItk+IINaBkN3kZ/e/U/vfqf1v1P5X6lJTY0OMTul3S7pEd84Y04zj/zixYsWRqpBUbwJbNKqFdWoQxBzUA3MNMsswWa6zCodigRhelTul2S7pa5NvRaoyLt/wCNWLE1AYOgpVxf/ol/+iX/AOqX/wCiUYWWMrG83P736n979ToT0PnOp851PnOp851PnOh851J6HznU+c6nz/8AIUtaetoird/UxsvSXmZEVqGstzDH+DUwqZavH/hrW9Kep851PnOh850PnOhPU+c6HznU+c6HznQ+c6k5gvkq/Ux2Nyv2Mf42eriUxeh+qL2V5b+0lOvi/aZT+wcVVX9DYnD7Eltj8i+5wF/e5XoHiHEPj/TOIvB/U40eC+oLQKrWtV9yg/MtubTa8AuiKhDZiPP+MmLerhOxPud58t9Q3k8v9TkXz/pnOnmHI3x+5kyvgH3LDPoEvu/6G5Lf0HjYeT94l7Dy3/pYH6X9lAv44/upfkzt+hht9+/6or8gJVbU8tAZoSDf+CZo0R/9Ro0SNGTcUNVDWDQqq1dcrHaP8Xo4l0IpUDWq5f1GXiqas1EeNfmYSxh/gAojDuCYl7j/APQ0aNGiRokaMGzRrtUkBbF2FGX8IP8AG8xnq4S98/4fmZl9z3LrMt2ZekztK4XQPRMvKJKUahAjr7C1q6r8xyU5vaVUwXvLb1pNHXP+BlBjFkwfV4epc9f5v3MbaxZ7xMw8z3HXUi06/wCM1pDXLEdnWODmHjXuU3ghfFTPMvNVma6EcatTFS81cKH6i8EzqC/ziNusG5hNQrVtlFdfqDniXDFbgWmJh2cyqg7K0ckviu9N6U6fmFmtHuW7yl1cyPTLC/8AGXiVvKOWJG9sy6NPcWoOyfEdWnplr3e5VoHuX0RnuGD+Ri9AfMsf7pssfMuyD5RdZL3An9qDYs9y7Ye5/VgFArg+EC9Bys3gFWlOYgTOkeLfT71nEPmDHQwAALtejtLkbpI06wV8n7j5DmjTVZ8xbofmIalXuD/6R3B8wdZNdsVsIXWn5ltx8zVB+Ycf2xHT5JbY3AHBCNvyMpnjrMzUpeo+alml3exGjS14rSNhmKzdB7l8MxWaWIc8bRdueJk3rtjlrpHJbMvASigRsZWVlAGwQiAja9L2jmtE7YA9dXMnUFpo/EayVYfCJYZqGgocQrsUlOkVhSrLl2VlKAtumRwkcM0yzViFjhlhaqJqag5zK3sSVuY8Qo1UZnUgeZrXu9B/EMqv9DWGOT4P7EUf35yQjbfMfpgr09v0S2/dPyQdKhzL/MVuyuA/pg2APZigQNv+Eciq6K/EqlmcqJgbi7JDOukqCypNm4Vpd+otNm9P/Ya2wih+S4F4THMQ7nqGOC7B5JUhS3Jw6x4t7EFBWgQ3zCBhQwURWVe0VKNtX+qIme0r/VB21UqrUcA/bHS8vFr8yk9A4+CMHon6IvT+Z/bNZ43fcBrp0j8Ertc/uuZZs3qv5iJgDa0/EXALlf6MGPM/vLifnCf2EQ1/YN4ZfkH6mwPHfUZq52j6lfbvTAiVLdf7oRZHX+6BGAntFDJZ2XKIqdh+oywDRACjZUyhMXLMMzYBeBh6I/hvqf231P5b6n8N9Q0wf62gE5CANUgdl+5qXtCEWEHOYa5rBxgghih0VEBkHmkGsh2X3Pzpf7pbVq1wYtXpJ+pT4X531PwIo/c/sgds1RG1T9DFmtafWVLur6X7M/DkFfiUXS9ywsI7TYG+4F5KjbqCdxhozALgLzpXcF8viFWA9EsyKL0/YmUAcDhiGOMH5lNGdVt+VYnB+R9zTlJe4wjUBQte5WWoO0A/2ZZnB2o15o5tL2n+jua8NKrOXXuIXEL+IES2iubgWpfs/MLGr2v9y9tfyg3YnzAQ0PCEAqkDzMBkthfOPMDCljby9xspv6hqLXmY5MSm5Y7lrdmO2Z8Fdxc7rW4KsMRVlNa5hyJUsLwI0kBfxNUUeEelcdF/aUhQL4i5Ru+oamuIUGWtrqiSC3F3KPWWJ0ZZxgYMQog6TUWqlvCtYOw2bxw39x1lFD5JhenuZ1SSubwkAAhOYcD1cE0KOLjjBWupa6D3LMIOalIVaPMavVHuJ2fUtusX3Chy19yuwTa7lPiuottkITsSNR+UIpWfMDmFGKmU+YAVrKZ0/EzFaXuxLwe6jhtKlI4mHNeYC5J1AKzoKxcCgNvOkNie1h9/DI0OS+phCB0lTVMPjaW1aeJTGeN5uMCqcMMcn/Io5PqUAFCYGtopY6Z1TZspi4fEFCm+gRyu7uMbNa5milZ6IG7Yb7dtpVMadlTQt8IGBbA40rqCNtHJKWSXzKiv1M2GJZhiNDaPmWlYJsJuUNJiUFUHNytUNwqBUpO5G9AI20lWGkIwV2YhIBYxT+pYuESu4MfPMLmHHESjYMxa29xTdQLbwdwCjQtkswxW0h2SqFG4q+ZSOWrNQJQNRPzMGoX1BVpMBybRSpjbU+IpYXMmeFl7S3mKsA6Y3kuOosUBuIwY8pl0A7hbqJSXr5gB+ohyvywdYPMadnEb5KqE6JVaQAYxRrKRkmZTTXcGrqFa1SLqGiCXAV6NoOEssxNNuWVMoIlZbmWhrmOWElq3uL4U8wLqsXR/caWQDBB9RsARQTT1MXu4G0AFD+YhuFsxrjH3KglpxBtB2ShkywCWEFsKeYWlhfmL9DcQcLXc5VcS7HuLdhfiDifHMtNTfUq9FeYiOUpggwlcVCn8Ep5A6IAoItmqvcbU68wnBgbBb6DaWhC+Ur/uJMrbpSbfUGqQ+XmWKEY4d67it0soRTAVys2F5g3t8y9aMRMjsQ0KjWt3wwSX7t2jqayWhCkg1g6cxlZkbwjpab7zEJ5QJq8RucfEC8ssoeEltYb9S+sdM2DfqCDfqVQCjkgxZcsxkWQOBpzM1KVGihi3ZWEU6FMMm7U5muyPUCub+o3IHzCzQ65iWlpcegHwRLgy8TDYBfc1hSeId4x6hqun9zYg5YEwKS45iOgCXqcPMsa6wdqNcxLw+2BH7qUcXxUDQeOIDqxEUEd8R3Vyo3fviW1sT5iNcTFGkNhbwy4ah4qK6UHEC9hX3LoqBGWRbSLLQL+paqAdw3Mcxl0I+I1BYvuInNt9TGgnqAKaMXMW2jhSmt7hgBbeoFbWfMGzWjupWvqTMOahZ/JLXQLiKRvqAar7i6tTAaWDxBFtvEsWqe2NmKPiUuqxoxwmE5mIuWZXDCUpDw/4rLajzmCGzXWYgasYrUg4SEZDEQ9+YLKCV222CFVmRtAboNU1gh1K6iTs5qLAuzog5J7mdLHiLaseWIwwZUovuDbh+4IwVUbFJbzEuDMVCqdYMzobzKLWmYNupsy2osZTdIN6GJsBA3ejeNFWgTgigPZcUMU9QznbiXULxvAlrZN8V3ByBlzUWDZELWrhlLzZwMQMFLCxxfOYA3Ia0ldxvRMckDQaIcBTyw6qXKsl3xCkXTdzEbUKgEMn1K3QUzIZF7IZkIxqoaO5QGeuqExUsZiRYKa5iNinUSnGvMdlqpgrY4IIbUjN5lx3uKshogDb7Rd1l7sSDV4mNlvuGyoDmJk2TKoq7miNnEUECJB0OIAij2RADqiFl+4kuCve4KtMc6Roxqu8LMu01AYlzFHiJs1g+3M16X1NTxxC1oDsjdlHtmLH0jqZIDUuUrOCxGIQgOOoqyjDLCu0HRYxUsqo5aLKVsHRADCxzLdu6lm2qNXDMWl1CMLeqlfmcgs4Y9kJRxkhC6GC7bMvWPyywpPIh1M/cLpj6mTjIRDVGUslzlwTA60B5EtoN94NN2uBeweYSm3UBaZ6iq0FRrcF3aiI3mohwZQyqjW8aFmEsq3VzM7seIKvN3zEBSzxMG79TprDQZZaUUYBeAlXszHLLo5lGkFRCYw4mxtLNGGGouZYkFyYlUrWFm2OYB3qICtXEQNbWMFV8wHKsRhVBuyxn7jaGtOZsAJgxr1GDZbzB4bPMCNAQMJRvpFzXqUCmoklll2/ZN9aIWwixmr6mDJXUKo0IgN2JTXlALF+GJWgTzLrVd3FLSJV6bEAJdnc0YGJZsM/iEdQeYBq7jRJqswsCNFYMKw2dytTZ+osVh4iZRtiXYriNKpa7RocAdo5kI0AV3APmDrioA2sClL8R0kEItkWsnxDSihg9xqVQlIxcF1G9AZjOMXFYxN25aqaQtaoYVFzIEBUL4Q8wW03FRLtKShmNE1pmWhxLAOYjq8MtCtuopLvMWsZNmaE2ME3VqLWKuGXRqWAw1ArQImjFcx0wCxLExOEollDPcGaCLUa9SlgdRLvTEvMAt2Fmaj0iAqmSwJMm9oNlJfcRbq4iBRMuNDmWl0lAwXBRzYY7HEwNGsXclluoAgpBaYLM2zDTFmxA025lW0VK2Y2gMsEmGBFm38zhLWJjveDRQxIVq5lWYLYbGCo4qoTOmulBZGLCVIuWFYTgzErIeorimoJoqWcmJnVjMbskIvuOnN3NCeoW7UzDUqC2pYLS4QCNvmOlapvT6ZkM5jbhwSkDrW8Fv7QiSnmUOuUxMqiraykYRV65YqE03UtWhqOv3hYSrgZVbBbKiAKq4XnUFbVELbmYOMQKl2QgRhpm5UK6x1VqTAWZUqparaVIJgXV3EBhiqJDQwwypSw1lEeUsB1iih9Qa0XAENCbpZKjdHRsi2ajEWhTU//2Q==";
  const CUSTOM_PLAYER_KEYS=new Set(["arham","muhammadarham","hassanali","zaydquadri","umarshoaib","ehanali","llllllllfc"]);
  function isValidPlayerPhoto(source){
    const value=String(source||"");
    return /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//i.test(value)||
      /^https:\/\/geofootballguessr\.com\/footballers\/[a-z0-9-]+\.webp$/i.test(value)||
      /^\/assets\/players\/[a-z0-9-]+\.jpe?g$/i.test(value)||
      /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value)||
      /^data:image\/svg\+xml;charset=utf-8,/i.test(value);
  }
  function makePlayerAvatarData(name,role){
    const words=String(name||"APEX PLAYER").trim().split(/\s+/).filter(Boolean);
    const initials=words.slice(0,2).map(word=>word[0]||"").join("").toUpperCase()||"AP";
    const keeper=/keeper|goalkeeper|sweeper/i.test(String(role||""));
    const label=keeper?"GOALKEEPER":"APEX PLAYER";
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#20344a"/><stop offset=".55" stop-color="#101923"/><stop offset="1" stop-color="#090e14"/></linearGradient><linearGradient id="shirt" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d6ff65"/><stop offset="1" stop-color="#548d36"/></linearGradient></defs><rect width="320" height="420" rx="18" fill="url(#bg)"/><path d="M0 290 320 170M0 360 320 240" stroke="#ffffff" stroke-opacity=".07" stroke-width="2"/><circle cx="160" cy="140" r="61" fill="#b7c3cb"/><path d="M101 145c7-65 111-90 120 2-14-21-27-32-50-35-26 19-46 25-70 33Z" fill="#667887"/><path d="M48 420c8-103 48-157 112-157s104 54 112 157" fill="url(#shirt)"/><path d="M117 277h86l-9 52h-68z" fill="#20344a"/><text x="160" y="362" text-anchor="middle" font-family="Arial,sans-serif" font-size="49" font-weight="900" fill="#f5f8ed">'+initials+'</text><text x="160" y="397" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" font-weight="800" letter-spacing="3" fill="#e5f7ba">'+label+'</text></svg>';
    return "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  }
  const UMAR_SHOAIB_PHOTO="data:image/jpeg;base64,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";
  function ensureRosterPlayerImages(){
    const savedPhoto=readSavedProfile().photo||"";
    [...players,...goalkeepers].forEach(player=>{
      const key=normalizePlayerName(player.name);
      if(key==="umarshoaib"){player.image=UMAR_SHOAIB_PHOTO;return;}
      const stable=getStableWikiPortrait(player.name);
      if(stable&&isValidPlayerPhoto(stable.image)){player.image=stable.image;return;}
      if(isValidPlayerPhoto(player.image)&&!String(player.image).startsWith("data:image/svg+xml"))return;
      const sourced=rosterPhotoUrls[key]||"";
      const personal=["muhammadarham","hassanali","ehanali"].includes(key)&&isValidPlayerPhoto(savedPhoto)?savedPhoto:"";
      player.image=isValidPlayerPhoto(sourced)?sourced:personal||"";
    });
  }
  const wikiPortraitCache=new Map();
  const WIKI_PORTRAIT_STORAGE_KEY="apexStrikersVerifiedPortraitsV1";
  function readStableWikiPortraits(){
    try{const value=JSON.parse(localStorage.getItem(WIKI_PORTRAIT_STORAGE_KEY)||"{}");return value&&typeof value==="object"&&!Array.isArray(value)?value:{};}catch(_){return {};}
  }
  function getStableWikiPortrait(name){
    const key=normalizePlayerName(name);
    // Ederson's old catalogue slug resolved to the wrong footballer.
    // Pin his portrait to the exact Wikimedia Commons file for Ederson Moraes.
    if(key==="ederson")return{
      image:"https://commons.wikimedia.org/wiki/Special:FilePath/Ederson.png",
      title:"Ederson.png",
      author:"Wikimedia Commons contributors",
      fileUrl:"https://commons.wikimedia.org/wiki/Category:Ederson_Moraes",
      license:"See the file page for its licence",
      licenseUrl:"https://commons.wikimedia.org/wiki/File:Ederson.png",
      needsCredit:true
    };
    const fixed=rosterPhotoUrls[key];
    if(fixed)return{
      image:fixed,
      title:"GeoFootball Guessr footballer photo",
      author:"Attribution listed on the GeoFootball Guessr photo credits page",
      fileUrl:"https://geofootballguessr.com/image-credits",
      license:"See individual photo licence",
      licenseUrl:"https://geofootballguessr.com/image-credits",
      needsCredit:true
    };
    const item=readStableWikiPortraits()[key];
    return item&&isValidPlayerPhoto(item.image)&&item.fileUrl?item:null;
  }
  function saveStableWikiPortrait(name,record){
    if(!record||!isValidPlayerPhoto(record.image)||!record.fileUrl)return;
    try{const all=readStableWikiPortraits();all[normalizePlayerName(name)]=record;localStorage.setItem(WIKI_PORTRAIT_STORAGE_KEY,JSON.stringify(all));}catch(_){}
  }
  function cleanWikiText(value){
    const box=document.createElement("textarea");
    box.innerHTML=String(value||"").replace(/<[^>]*>/g," ");
    return box.value.replace(/\s+/g," ").trim();
  }
  function findWikiPortrait(playerName,forceCommonsSearch=false){
    const name=String(playerName||"").trim();
    if(!name)return Promise.resolve(null);
    const key=normalizePlayerName(name);
    if(CUSTOM_PLAYER_KEYS.has(key))return Promise.resolve(null);
    if(!forceCommonsSearch){
      const stable=getStableWikiPortrait(name);
      if(stable)return Promise.resolve(stable);
    }
    const cacheKey=key+(forceCommonsSearch?"|commons":"");
    if(wikiPortraitCache.has(cacheKey))return wikiPortraitCache.get(cacheKey);
    const task=(async()=>{
      try{
        const headers={"Accept":"application/json"};
        const searchUrl="https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch="+encodeURIComponent('filetype:bitmap "'+name+'"')+"&srnamespace=6&srlimit=20&format=json&origin=*";
        const searchResponse=await fetch(searchUrl,{mode:"cors",credentials:"omit",headers});
        if(!searchResponse.ok)return null;
        const searchData=await searchResponse.json();
        const titles=(searchData.query?.search||[]).map(item=>item.title).filter(Boolean);
        if(!titles.length)return null;
        const infoUrl="https://commons.wikimedia.org/w/api.php?action=query&titles="+encodeURIComponent(titles.join("|"))+"&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=520&format=json&origin=*";
        const infoResponse=await fetch(infoUrl,{mode:"cors",credentials:"omit",headers});
        if(!infoResponse.ok)return null;
        const infoData=await infoResponse.json();
        const candidates=Object.values(infoData.query?.pages||{}).map(page=>{
          const info=page.imageinfo?.[0]||{},meta=info.extmetadata||{};
          const license=cleanWikiText(meta.LicenseShortName?.value||meta.UsageTerms?.value||"");
          const licenseUrl=String(meta.LicenseUrl?.value||"").trim();
          const image=info.thumburl||info.url||"";
          const title=page.title||"";
          const titleKey=normalizePlayerName(title.replace(/^File:/i,""));
          const exactNameMatch=titleKey.includes(key);
          const author=cleanWikiText(meta.Attribution?.value||meta.Artist?.value||meta.Credit?.value||"");
          const fileUrl=info.descriptionurl||("https://commons.wikimedia.org/wiki/"+encodeURIComponent(title.replace(/ /g,"_")));
          const needsCredit=/^CC BY(?:[- ]SA)?/i.test(license);
          const allowedLicense=/^(?:CC0(?:\s*1\.0)?|Public domain|PD(?:[- ].*)?|CC BY(?:[- ]SA)?(?:[- ]\d+(?:\.\d+)?)?)$/i.test(license);
          return {title,image,license,licenseUrl,author,fileUrl,exactNameMatch,needsCredit,allowedLicense};
        }).filter(item=>item.exactNameMatch&&item.allowedLicense&&item.image&&item.fileUrl&&/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\//i.test(item.image)&&(!item.needsCredit||(item.author&&item.licenseUrl)));
        candidates.sort((a,b)=>Number(b.needsCredit)-Number(a.needsCredit));
        const selected=candidates[0]||null;
        if(selected)saveStableWikiPortrait(name,selected);
        return selected;
      }catch(_){return null;}
    })();
    wikiPortraitCache.set(cacheKey,task);
    return task;
  }
  const wikiPhotoCredits=new Map();
  function renderWikiPhotoCredits(){
    const panel=document.getElementById("apexPhotoCreditsList");
    if(!panel)return;
    panel.replaceChildren();
    if(!wikiPhotoCredits.size){
      const empty=document.createElement("p");empty.textContent="Photo credits will appear here as verified player photos load.";panel.appendChild(empty);return;
    }
    [...wikiPhotoCredits.values()].sort((a,b)=>a.player.localeCompare(b.player)).forEach(item=>{
      const row=document.createElement("p");row.className="apex-photo-credit-entry";
      const player=document.createElement("strong");player.textContent=item.player+" · ";
      const author=document.createElement("span");author.textContent=item.author?item.author+" · ":"";
      const source=document.createElement("a");source.href=item.fileUrl;source.target="_blank";source.rel="noopener noreferrer";source.textContent=item.title||"Original photo";
      const license=document.createElement("a");license.href=item.licenseUrl||item.fileUrl;license.target="_blank";license.rel="noopener noreferrer";license.textContent=item.license||"Source licence";
      row.append(player,author,source,document.createTextNode(" · "),license);
      panel.appendChild(row);
    });
  }
  function showWikiPhotoCredit(photo,credit){
    if(!photo||!credit)return;
    const player=photo.dataset.playerName||photo.alt||"Footballer";
    wikiPhotoCredits.set(player+"|"+credit.fileUrl,{player,author:credit.author||"",title:credit.title||"",fileUrl:credit.fileUrl,license:credit.license,licenseUrl:credit.licenseUrl});
    renderWikiPhotoCredits();
  }
  function showMissingWikiPhoto(photo,name){
    if(!photo||!photo.isConnected)return;
    photo.dataset.wikiFailed="true";
    photo.dataset.wikiMissing="true";
    photo.removeAttribute("src");
    photo.alt=name+" · verified photo not found";
    photo.title="No verified real-player photo was found yet.";
    photo.classList.add("photo-unavailable");
    photo.closest(".apex-card-portrait,.player-card")?.classList.add("photo-pending");
  }
  function hydrateWikiPortrait(photo,name,role){
    if(!photo||photo.dataset.wikiAttempted==="true")return;
    photo.dataset.wikiAttempted="true";
    if(CUSTOM_PLAYER_KEYS.has(normalizePlayerName(name))){
      if(!photo.getAttribute("src"))showMissingWikiPhoto(photo,name);
      return;
    }
    const setVerifiedPhoto=(record)=>{
      if(!photo.isConnected)return;
      if(record&&isValidPlayerPhoto(record.image)&&!String(record.image).startsWith("data:image/svg+xml")){
        photo.src=record.image;
        photo.dataset.wikiResolved="true";
        photo.dataset.wikiSource=record.fileUrl||"";
        photo.classList.remove("photo-unavailable");
        photo.closest(".apex-card-portrait,.player-card")?.classList.remove("photo-pending");
        const rosterPlayer=[...players,...goalkeepers].find(p=>normalizePlayerName(p.name)===normalizePlayerName(name));
        if(rosterPlayer)rosterPlayer.image=record.image;
        showWikiPhotoCredit(photo,record);
      }else showMissingWikiPhoto(photo,name);
    };
    photo.onerror=()=>{
      photo.onerror=null;
      const failedSource=photo.src||"";
      if(photo.dataset.wikiRetry!=="true"){
        photo.dataset.wikiRetry="true";
        findWikiPortrait(name,true).then(record=>setVerifiedPhoto(record)).catch(()=>showMissingWikiPhoto(photo,name));
      }else showMissingWikiPhoto(photo,name);
    };
    findWikiPortrait(name).then(record=>setVerifiedPhoto(record)).catch(()=>showMissingWikiPhoto(photo,name));
  }

  function attachPlayerPortraitFallbacks(root){
    if(!root)return;
    root.querySelectorAll(".player-card-photo").forEach(photo=>{
      const name=photo.dataset.playerName||photo.alt||"Apex Player",role=photo.dataset.playerRole||"PLAYER";
      if(CUSTOM_PLAYER_KEYS.has(normalizePlayerName(name))){
        if(!photo.getAttribute("src"))showMissingWikiPhoto(photo,name);
        return;
      }
      hydrateWikiPortrait(photo,name,role);
    });
  }

  const isGoalkeeperPosition=position=>/^(GK|GOALKEEPER|ICON GOALKEEPER|CUSTOM GOALKEEPER|SWEEPER KEEPER|PLAYMAKING KEEPER|PENALTY SPECIALIST)$/i.test(String(position||"").trim());
  function syncOwnedCardsToRoster(ownedIds,cardCatalog){
    ownedDraftCardIds=new Set(Array.isArray(ownedIds)?ownedIds.filter(id=>typeof id==="string"):[]);
    (Array.isArray(cardCatalog)?cardCatalog:[]).forEach(card=>{
      if(!card||!ownedDraftCardIds.has(card.id)||card.id==="arham")return;
      const keeper=isGoalkeeperPosition(card.position);
      const target=keeper?goalkeepers:players;
      const other=keeper?players:goalkeepers;
      const nameKey=normalizePlayerName(card.name);
      const existing=target.find(p=>p.cardId===card.id||normalizePlayerName(p.name)===nameKey);
      const misplaced=other.findIndex(p=>p.cardId===card.id||normalizePlayerName(p.name)===nameKey);
      if(misplaced>=0)other.splice(misplaced,1);
      const signedPlayer={
        name:card.name,
        rating:Number(card.ovr)||60,
        role:keeper?(card.position||"GOALKEEPER"):(card.position||"ST"),
        special:"SIGNED CARD · "+String(card.rarity||"PLAYER").toUpperCase(),
        unlockXP:0,unlockWins:0,glow:"rgba(199,255,74,.2)",
        cardId:card.id,image:card.image||"",stats:card.stats||null
      };
      if(existing)Object.assign(existing,signedPlayer);
      else target.push(signedPlayer);
    });
    if(typeof renderPlayers==="function")renderPlayers();
  }
  function isUnlocked(p,isKeeper){
    const starter=(!isKeeper&&p.name==="Muhammad Arham")||(isKeeper&&p.name==="David Raya");
    const signed=Boolean(p.cardId&&ownedDraftCardIds.has(p.cardId));
    return apexAdminMode||starter||signed||((p.unlockXP||0)<=(career.unlockXP||0)&&(p.unlockWins||0)<=(career.unlockWins||0));
  }
  function playerCard(p, selected, attr, isKeeper){
    const unlocked=isUnlocked(p,isKeeper),xp=career.players[p.name]||0,level=1+Math.floor(xp/100);
    const rawRating=(p.rating||60)+Math.min(4,Math.floor(xp/250));
    const rating=Math.min(199,Math.max(60,rawRating));
    const displayRating=(p.name==="Cristiano Ronaldo"||p.name==="Lllllllll FC"?999:(p.name==="Hassan Ali"&&(isKeeper||p.role==="GK")?300:rating));
    const xpNeeded=Math.max(0,(p.unlockXP||0)-(career.unlockXP||0)),winsNeeded=Math.max(0,(p.unlockWins||0)-(career.unlockWins||0));
    const lockLabel=unlocked?"LVL "+level:"🔒 "+xpNeeded+" XP + "+winsNeeded+" MATCH WINS TO UNLOCK";
    const labels=isKeeper?["DIV","HAN","KIC","REF","SPD","POS"]:["PAC","SHO","PAS","DRI","DEF","PHY"];
    const offsets=isKeeper?[1,0,-3,2,-2,1]:p.role==="ST"?[0,3,-2,-1,-4,2]:p.role==="RW"||p.role==="LW"?[3,0,-1,3,-5,-2]:p.role==="CAM"||p.role==="CM"?[-1,-1,3,1,0,0]:[0,0,0,0,0,0];
    const attributes=labels.map((label,i)=>'<span><b>'+label+'</b><strong>'+(p.stats&&p.stats[label]!=null?p.stats[label]:Math.min(199,Math.max(45,rating+offsets[i])))+'</strong></span>').join("");
    const safeName=String(p.name).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
    const safeImage=isValidPlayerPhoto(p.image)&&!String(p.image).startsWith("data:image/svg+xml")?p.image:"";
    const portrait='<img class="player-card-photo" '+(safeImage?'src="'+safeImage+'" ':'')+'data-player-name="'+safeName+'" data-player-role="'+(isKeeper?"GOALKEEPER":String(p.role||"PLAYER"))+'" alt="'+safeName+' portrait" loading="lazy">';
    const signedTag=p.cardId&&ownedDraftCardIds.has(p.cardId)?'<span class="player-signed-tag">SIGNED CARD</span>':"";
    return '<button class="player-card '+(p.name===selected?'selected ':'')+(p.name==="Lllllllll FC"?'keyboard-master-card ':'')+(signedTag?'player-card-signed ':'')+(!unlocked?'player-locked':'')+'" '+(unlocked?'':'disabled aria-label="Locked player '+safeName+'" ')+attr+'="'+safeName.replace(/"/g,"&quot;")+'" style="--player-glow:'+p.glow+'">'+portrait+'<div class="player-card-copy">'+signedTag+'<div class="player-rating">'+displayRating+'</div><div class="player-role">'+p.role+' · OVR</div><div class="player-name">'+safeName+'</div><div class="player-special">'+(unlocked?p.special:lockLabel)+'</div><div class="fc-attributes">'+attributes+'</div><div class="ovr-meter"><i><span style="width:'+Math.min(100,rating)+'%"></span></i></div></div></button>';
  }
  function renderPlayers(){
    ensureRosterPlayerImages();
    const rosterQuery=( $("rosterSearch")?.value||"").trim().toLowerCase();
    const rosterFilter=$("rosterFilter")?.value||"all";
    const visiblePlayers=players.filter(p=>!isGoalkeeperPosition(p.role)).filter(p=>{const matches=!rosterQuery||(p.name+" "+p.role+" "+(p.club||"")).toLowerCase().includes(rosterQuery);const role=String(p.role||"").toUpperCase();const group=role==="ST"||role==="LW"||role==="RW"?"attack":role==="CAM"||role==="CM"||role==="CDM"||role==="RM"||role==="LM"?"midfield":role==="CB"||role==="LB"||role==="RB"?"defence":"other";return matches&&(rosterFilter==="all"||group===rosterFilter);}).sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
    $("playerGrid").innerHTML=visiblePlayers.map(p=>playerCard(p,selectedPlayer,"data-player",false)).join("");
    attachPlayerPortraitFallbacks($("playerGrid"));
    $("playerGrid").querySelectorAll("[data-player]").forEach(btn=>btn.addEventListener("click",()=>{const wasOpen=btn.classList.contains("show-stats");$("playerGrid").querySelectorAll(".player-card").forEach(card=>card.classList.remove("show-stats","selected"));selectedPlayer=btn.dataset.player;btn.classList.add("selected");if(!wasOpen)btn.classList.add("show-stats");if(typeof renderCareerHub==="function")renderCareerHub();toast(wasOpen?"PLAYER SELECTED":"PLAYER SELECTED · STATS OPEN");}));
    $("goalkeeperGrid").innerHTML=goalkeepers.map(p=>playerCard(p,selectedGoalkeeper,"data-goalkeeper",true)).join("");
    attachPlayerPortraitFallbacks($("goalkeeperGrid"));
    $("goalkeeperGrid").querySelectorAll("[data-goalkeeper]").forEach(btn=>btn.addEventListener("click",()=>{const wasOpen=btn.classList.contains("show-stats");$("goalkeeperGrid").querySelectorAll(".player-card").forEach(card=>card.classList.remove("show-stats","selected"));selectedGoalkeeper=btn.dataset.goalkeeper;btn.classList.add("selected");if(!wasOpen)btn.classList.add("show-stats");if(typeof renderCareerHub==="function")renderCareerHub();toast(wasOpen?"GOALKEEPER SELECTED":"GOALKEEPER SELECTED · STATS OPEN");}));
    const count=players.filter(p=>isUnlocked(p,false)).length,gcount=goalkeepers.filter(p=>isUnlocked(p,true)).length;const visibleCount=$("playerGrid").querySelectorAll("[data-player]").length;if($("rosterResultCount"))$("rosterResultCount").textContent=visibleCount+" PLAYERS SHOWN · "+players.length+" TOTAL";if($("rosterSearch"))$("rosterSearch").oninput=renderPlayers;if($("rosterFilter"))$("rosterFilter").onchange=renderPlayers;
    const counters=document.querySelectorAll(".section-count");if(counters[0])counters[0].textContent=count+" / "+players.length+" UNLOCKED";if(counters[1])counters[1].textContent=gcount+" / "+goalkeepers.length+" UNLOCKED";
  }
  function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}
  const career=(()=>{const fresh={attempts:0,goals:0,saves:0,xp:0,players:{},tournamentWins:0,unlockXP:0,unlockWins:0,bestScore:0,achievements:{}};try{const saved=localStorage.getItem("eclipseCareerV3");return saved?Object.assign(fresh,JSON.parse(saved)):fresh;}catch(_){return fresh;}})();
  function saveCareer(){try{localStorage.setItem("eclipseCareerV3",JSON.stringify(career));}catch(_){}if(typeof renderModeTools==="function")renderModeTools();}
  function awardProgress(success){career.attempts++;if(success){if(mode==="goalkeeping"||mode==="survival")career.saves++;else career.goals++;}const earned=10+(success?20:0),progressionPlayer=(mode==="goalkeeping"||mode==="survival")?selectedGoalkeeper:selectedPlayer;career.xp+=earned;career.unlockXP=(career.unlockXP||0)+earned;career.players[progressionPlayer]=(career.players[progressionPlayer]||0)+earned;career.bestScore=Math.max(career.bestScore,score);career.achievements=career.achievements||{};const milestones=[["firstAttempt",career.attempts>=1,"First Whistle"],["firstGoal",career.goals>=1,"First Goal"],["hatTrick",career.goals>=3,"Hat-Trick Hero"],["keeperWall",career.saves>=5,"Keeper Wall"],["xp1000",career.xp>=1000,"XP Collector"]];const newlyUnlocked=[];milestones.forEach(([id,earnedNow,label])=>{if(earnedNow&&!career.achievements[id]){career.achievements[id]=true;newlyUnlocked.push(label);}});saveCareer();renderPlayers();const unlocked=newlyUnlocked.length?" · ACHIEVEMENT UNLOCKED: "+newlyUnlocked.join(", "):"";return "CAREER · "+career.goals+" goals · "+career.saves+" saves · "+career.xp+" XP · BEST "+career.bestScore+" · "+progressionPlayer+" LVL "+(1+Math.floor((career.players[progressionPlayer]||0)/100))+unlocked;}
  function playCue(kind){if(!soundOn)return;const ac=getMusicContext();if(!ac)return;try{ac.resume();const t=ac.currentTime+.01;if(kind==="goal"){tone(523,.12,"triangle",.05,t);tone(659,.16,"triangle",.045,t+.12);tone(784,.22,"triangle",.04,t+.25);}else{tone(220,.14,"sine",.035,t);tone(165,.18,"sine",.025,t+.12);}}catch(_){}}
  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,1.75);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);cw=rect.width;ch=rect.height;window.ApexMatch3D?.resize?.();drawPitch();
  }
  function drawFootballer(cx,cy,size,rotation,jersey,isKeeper,playerName){
    const name=playerName||"",known={
      "Lllllllll FC":{number:99,hair:"#292018",skin:"#bd8967",shorts:"#302718",trim:"#ffe39a",style:"curly"},
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
    // Recognisable club/national-team kit palettes for the real players.
    // Custom ApexStrikers players keep their own signature colours.
    const realKits = {
      "Cristiano Ronaldo":{shirt:"#f5d52f",shorts:"#17469b",trim:"#173d86"},
      "Erling Haaland":{shirt:"#6caddf",shorts:"#ffffff",trim:"#172b4d"},
      "Jude Bellingham":{shirt:"#f8f8f4",shorts:"#f8f8f4",trim:"#d4b16a"},
      "Lamine Yamal":{shirt:"#153a8a",shorts:"#153a8a",trim:"#b51f3a"},
      "Lionel Messi":{shirt:"#f4a4c3",shorts:"#171717",trim:"#171717"},
      "Kylian Mbappé":{shirt:"#f8f8f4",shorts:"#f8f8f4",trim:"#173d86"},
      "Kevin De Bruyne":{shirt:"#6caddf",shorts:"#ffffff",trim:"#172b4d"},
      "Mohamed Salah":{shirt:"#c92536",shorts:"#c92536",trim:"#f8f8f4"},
      "Vinícius Júnior":{shirt:"#f8f8f4",shorts:"#f8f8f4",trim:"#d4b16a"},
      "Neymar Jr.":{shirt:"#ffffff",shorts:"#ffffff",trim:"#111111"},
      "Harry Kane":{shirt:"#c91f36",shorts:"#c91f36",trim:"#f8f8f4"},
      "Bukayo Saka":{shirt:"#c92536",shorts:"#f8f8f4",trim:"#f8f8f4"},
      "Phil Foden":{shirt:"#6caddf",shorts:"#ffffff",trim:"#172b4d"},
      "Alisson":{shirt:"#2f7d55",shorts:"#172b3a",trim:"#f8f8f4"},
      "Thibaut Courtois":{shirt:"#3cbd78",shorts:"#172b3a",trim:"#f8f8f4"},
      "Manuel Neuer":{shirt:"#f28b35",shorts:"#172b3a",trim:"#f8f8f4"},
      "Ederson":{shirt:"#f28b35",shorts:"#172b3a",trim:"#f8f8f4"},
      "Marc-André ter Stegen":{shirt:"#39b86a",shorts:"#172b3a",trim:"#f8f8f4"},
      "Gianluigi Donnarumma":{shirt:"#43c6b7",shorts:"#102b34",trim:"#f8f8f4"},
      "Emiliano Martínez":{shirt:"#a88bff",shorts:"#242033",trim:"#f8f8f4"},
      "Jan Oblak":{shirt:"#55d6e8",shorts:"#123b49",trim:"#f8f8f4"},
      "David Raya":{shirt:"#39b86a",shorts:"#172b3a",trim:"#f8f8f4"},
      "Mike Maignan":{shirt:"#f2cf35",shorts:"#172b3a",trim:"#171717"},
      "Lev Yashin":{shirt:"#191919",shorts:"#151519",trim:"#c9c9d0"}
    };
    const kit=realKits[name];
    if(kit){p.shorts=kit.shorts;p.trim=kit.trim;jersey=kit.shirt;}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(rotation);ctx.scale(size,size);ctx.lineCap="round";ctx.lineJoin="round";
    const gaitPhase=performance.now()/125+(name.length%9)*.7;
    const stride=Math.sin(gaitPhase)*.105;
    const lift=Math.max(0,Math.cos(gaitPhase))*.045;
    // Animated contact shadow and running stride give each footballer life.
    ctx.fillStyle="rgba(0,0,0,.32)";ctx.beginPath();ctx.ellipse(0,.43,.39,.085,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#18222b";ctx.lineWidth=.115;
    ctx.beginPath();
    ctx.moveTo(-.12,.105);ctx.quadraticCurveTo(-.16+stride,.24,-.19+stride*1.45,.385-lift);
    ctx.moveTo(.12,.105);ctx.quadraticCurveTo(.16-stride,.24,.22-stride*1.45,.385-Math.max(0,-Math.cos(gaitPhase))*.045);
    ctx.stroke();
    const shortsGradient=ctx.createLinearGradient(-.23,-.02,.23,.18);
    shortsGradient.addColorStop(0,"rgba(0,0,0,.28)");shortsGradient.addColorStop(.48,p.shorts);shortsGradient.addColorStop(1,"rgba(255,255,255,.18)");
    ctx.fillStyle=shortsGradient;ctx.beginPath();ctx.moveTo(-.22,-.03);ctx.lineTo(.22,-.03);ctx.lineTo(.24,.17);ctx.lineTo(.04,.17);ctx.lineTo(0,.10);ctx.lineTo(-.04,.17);ctx.lineTo(-.24,.17);ctx.closePath();ctx.fill();
    const shirtGradient=ctx.createLinearGradient(-.23,-.43,.24,-.04);
    shirtGradient.addColorStop(0,"rgba(255,255,255,.34)");shirtGradient.addColorStop(.42,jersey);shirtGradient.addColorStop(1,"rgba(0,0,0,.28)");
    ctx.fillStyle=shirtGradient;ctx.beginPath();ctx.moveTo(-.19,-.43);ctx.lineTo(.19,-.43);ctx.lineTo(.25,-.05);ctx.lineTo(-.25,-.05);ctx.closePath();ctx.fill();
    // Premium match kit: central fabric panel, subtle woven texture and breathing movement.
    const breathe=1+Math.sin(gaitPhase*.5)*.012;
    ctx.save();ctx.scale(1,breathe);
    ctx.fillStyle="rgba(255,255,255,.10)";ctx.beginPath();ctx.moveTo(-.055,-.415);ctx.lineTo(.055,-.415);ctx.lineTo(.075,-.075);ctx.lineTo(-.075,-.075);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.13)";ctx.lineWidth=.009;
    for(let seam=-2;seam<=2;seam++){ctx.beginPath();ctx.moveTo(seam*.052,-.39);ctx.lineTo(seam*.052,-.09);ctx.stroke();}
    ctx.restore();
    ctx.strokeStyle="rgba(255,255,255,.3)";ctx.lineWidth=.018;ctx.beginPath();ctx.moveTo(-.14,-.37);ctx.lineTo(-.08,-.09);ctx.moveTo(.14,-.37);ctx.lineTo(.08,-.09);ctx.stroke();
    // Shirt seams, shoulder panels and collar.
    ctx.strokeStyle=p.trim;ctx.lineWidth=.025;ctx.beginPath();ctx.moveTo(-.17,-.40);ctx.lineTo(-.11,-.07);ctx.moveTo(.17,-.40);ctx.lineTo(.11,-.07);ctx.stroke();
    ctx.fillStyle=p.trim;ctx.fillRect(-.22,-.41,.06,.13);ctx.fillRect(.16,-.41,.06,.13);
    // Small crest and sleeve detailing.
    ctx.fillStyle="rgba(255,255,255,.92)";ctx.beginPath();ctx.moveTo(-.145,-.31);ctx.lineTo(-.105,-.325);ctx.lineTo(-.065,-.31);ctx.lineTo(-.073,-.245);ctx.lineTo(-.105,-.22);ctx.lineTo(-.137,-.245);ctx.closePath();ctx.fill();
    ctx.fillStyle=p.trim;ctx.beginPath();ctx.arc(-.105,-.28,.018,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.65)";ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(.19,-.36);ctx.lineTo(.225,-.12);ctx.stroke();
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
      ctx.beginPath();
      ctx.moveTo(-.17,-.37);ctx.quadraticCurveTo(-.30,-.28+stride*.45,-.31+stride*.35,-.17);
      ctx.lineTo(-.22+stride*.35,-.08);
      ctx.moveTo(.17,-.37);ctx.quadraticCurveTo(.30,-.28-stride*.45,.30-stride*.35,-.17);
      ctx.lineTo(.23-stride*.35,-.10);ctx.stroke();
      ctx.strokeStyle=p.skin;ctx.lineWidth=.07;ctx.beginPath();
      ctx.moveTo(-.22+stride*.35,-.08);ctx.lineTo(-.19+stride*.35,-.04);
      ctx.moveTo(.23-stride*.35,-.10);ctx.lineTo(.24-stride*.35,-.06);ctx.stroke();
    }
    // Socks and cleats.
    ctx.strokeStyle=p.trim;ctx.lineWidth=.075;ctx.beginPath();
    ctx.moveTo(-.16,.15);ctx.lineTo(-.19+stride,.30);ctx.lineTo(-.19+stride*1.45,.38-lift);
    ctx.moveTo(.15,.15);ctx.lineTo(.20-stride,.29);ctx.lineTo(.22-stride*1.45,.38-Math.max(0,-Math.cos(gaitPhase))*.045);ctx.stroke();
    ctx.fillStyle="#f4f5f3";ctx.beginPath();ctx.ellipse(-.25+stride*1.45,.405-lift,.13,.058,-.15,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(.25-stride*1.45,.39-Math.max(0,-Math.cos(gaitPhase))*.045,.13,.058,.1,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#c7ff4a";ctx.fillRect(-.32+stride*1.45,.43-lift,.12,.025);ctx.fillRect(.19-stride*1.45,.415-Math.max(0,-Math.cos(gaitPhase))*.045,.12,.025);
    // Cleat studs and glossy toe caps.
    ctx.fillStyle="rgba(20,28,34,.9)";
    for(let stud=0;stud<3;stud++){ctx.beginPath();ctx.arc(-.30+stride*1.45+stud*.045,.455-lift,.012,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(.20-stride*1.45+stud*.045,.435-Math.max(0,-Math.cos(gaitPhase))*.045,.012,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle="rgba(255,255,255,.7)";ctx.beginPath();ctx.ellipse(-.28+stride*1.45,.39-lift,.055,.014,-.2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(.22-stride*1.45,.38-Math.max(0,-Math.cos(gaitPhase))*.045,.055,.014,.2,0,Math.PI*2);ctx.fill();
    // Short neck only: ears are intentionally omitted.
    const skinGradient=ctx.createRadialGradient(-.055,-.68,.015,.015,-.62,.19);
    skinGradient.addColorStop(0,"#f0c6a5");skinGradient.addColorStop(.55,p.skin);skinGradient.addColorStop(1,"#694332");
    ctx.fillStyle=skinGradient;ctx.fillRect(-.055,-.53,.11,.13);
    // Face, ears, cheek lighting and tiny facial details.
    ctx.beginPath();ctx.arc(0,-.625,.15,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=p.skin;ctx.beginPath();ctx.ellipse(-.145,-.615,.035,.055,0,0,Math.PI*2);ctx.ellipse(.145,-.615,.035,.055,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(255,224,197,.2)";ctx.beginPath();ctx.ellipse(-.055,-.67,.045,.075,-.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=p.hair||"#211b18";
    ctx.beginPath();
    if(p.style==="curly"){
      ctx.arc(-.105,-.69,.075,0,Math.PI*2);ctx.arc(-.035,-.735,.075,0,Math.PI*2);
      ctx.arc(.045,-.735,.075,0,Math.PI*2);ctx.arc(.115,-.68,.07,0,Math.PI*2);
    }else if(p.style==="long"){
      ctx.moveTo(-.15,-.65);ctx.quadraticCurveTo(-.12,-.83,0,-.79);
      ctx.quadraticCurveTo(.15,-.82,.15,-.64);ctx.lineTo(.12,-.52);ctx.lineTo(-.12,-.52);ctx.closePath();
    }else{
      ctx.moveTo(-.15,-.64);ctx.quadraticCurveTo(-.13,-.79,0,-.78);
      ctx.quadraticCurveTo(.14,-.78,.15,-.63);ctx.lineTo(.1,-.68);
      ctx.quadraticCurveTo(0,-.72,-.1,-.67);ctx.closePath();
    }
    ctx.fill();
    ctx.fillStyle="rgba(35,25,20,.72)";
    ctx.beginPath();ctx.arc(-.052,-.625,.012,0,Math.PI*2);ctx.arc(.052,-.625,.012,0,Math.PI*2);ctx.fill();
    // Eyebrows, nose highlight and soft jaw shadow.
    ctx.strokeStyle="rgba(35,25,20,.72)";ctx.lineWidth=.018;ctx.beginPath();ctx.moveTo(-.078,-.65);ctx.lineTo(-.025,-.66);ctx.moveTo(.025,-.66);ctx.lineTo(.078,-.65);ctx.stroke();
    ctx.strokeStyle="rgba(255,225,200,.48)";ctx.lineWidth=.012;ctx.beginPath();ctx.moveTo(0,-.615);ctx.lineTo(.008,-.58);ctx.stroke();
    ctx.fillStyle="rgba(70,38,28,.16)";ctx.beginPath();ctx.ellipse(0,-.548,.065,.018,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(70,35,25,.55)";ctx.lineWidth=.012;
    ctx.beginPath();ctx.moveTo(-.035,-.565);ctx.quadraticCurveTo(0,-.55,.035,-.565);ctx.stroke();
    ctx.restore();
  }
  function drawFullMatchPitch(){
    const w=cw,h=ch;
    const g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,"#237a49");g.addColorStop(.52,"#12643a");g.addColorStop(1,"#08351f");
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    // Stadium-style pitch lighting and alternating mowing stripes.
    for(let i=0;i<14;i++){
      ctx.fillStyle=i%2?"rgba(0,0,0,.065)":"rgba(220,255,220,.045)";
      ctx.fillRect(i*w/14,0,w/14,h);
    }
    // Fine-cut turf lanes and subtle stadium floodlight beams add depth without obscuring play.
    for(let i=0;i<34;i++){
      const yy=h*(.04+i*.028);
      ctx.strokeStyle=i%2?"rgba(225,255,230,.025)":"rgba(0,20,10,.045)";
      ctx.lineWidth=Math.max(1,h*.0012);ctx.beginPath();ctx.moveTo(w*.055,yy);ctx.lineTo(w*.945,yy);ctx.stroke();
    }
    ctx.save();ctx.globalCompositeOperation="screen";
    for(let i=0;i<3;i++){
      const beam=ctx.createLinearGradient(w*(.12+i*.38),0,w*(.3+i*.25),h*.72);
      beam.addColorStop(0,"rgba(220,255,235,.055)");beam.addColorStop(1,"rgba(220,255,235,0)");
      ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(w*(.08+i*.38),0);ctx.lineTo(w*(.3+i*.38),0);ctx.lineTo(w*(.55+i*.18),h*.78);ctx.lineTo(w*(.2+i*.18),h*.78);ctx.closePath();ctx.fill();
    }
    ctx.restore();
    const glow=ctx.createRadialGradient(w*.5,h*.5,5,w*.5,h*.5,w*.62);
    glow.addColorStop(0,"rgba(180,255,190,.08)");glow.addColorStop(1,"rgba(0,0,0,.18)");
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    // Pitch markings, penalty areas and goals.
    ctx.strokeStyle="rgba(245,255,245,.78)";ctx.lineWidth=Math.max(1.5,w*.0025);
    ctx.strokeRect(w*.055,h*.035,w*.89,h*.93);
    ctx.beginPath();ctx.moveTo(w*.055,h*.5);ctx.lineTo(w*.945,h*.5);
    ctx.arc(w*.5,h*.5,w*.115,0,Math.PI*2);ctx.stroke();
    ctx.strokeRect(w*.25,h*.035,w*.5,h*.15);ctx.strokeRect(w*.37,h*.035,w*.26,h*.07);
    ctx.strokeRect(w*.25,h*.815,w*.5,h*.15);ctx.strokeRect(w*.37,h*.895,w*.26,h*.07);
    ctx.fillStyle="rgba(225,245,255,.12)";
    ctx.fillRect(w*.405,h*.004,w*.19,h*.03);ctx.fillRect(w*.405,h*.966,w*.19,h*.03);
    // Tiny stadium lights along the touchlines.
    for(let i=0;i<8;i++){
      const yy=h*(.09+i*.115);
      ctx.fillStyle="rgba(235,255,242,.7)";
      ctx.beginPath();ctx.arc(w*.025,yy,Math.max(1.5,w*.003),0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(w*.975,yy,Math.max(1.5,w*.003),0,Math.PI*2);ctx.fill();
    }
    const drawMatchPlayer=(x,y,name,kit,number,rotation,highlight)=>{
      const px=x*w,py=y*h;
      // Perspective scale: players farther upfield are smaller, nearer players feel closer.
      const depth=Math.max(.72,Math.min(1.18,.72+(1-y)*.52));
      const playerSize=Math.max(15,w*.043*depth);
      // Ground shadow and a subtle team-coloured selection halo.
      ctx.save();
      if(highlight){
        ctx.fillStyle="rgba(199,255,74,.2)";ctx.beginPath();
        ctx.ellipse(px,py+playerSize*.32,playerSize*.72,playerSize*.24,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle="rgba(220,255,125,.9)";ctx.lineWidth=1.5;
        ctx.beginPath();ctx.ellipse(px,py+playerSize*.32,playerSize*.78,playerSize*.28,0,0,Math.PI*2);ctx.stroke();
      }else{
        ctx.fillStyle="rgba(0,0,0,.22)";ctx.beginPath();
        ctx.ellipse(px,py+playerSize*.34,playerSize*.58,playerSize*.2,0,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
      // Layered player lighting gives every footballer a clearer 3D silhouette.
      ctx.save();
      ctx.shadowColor=highlight?"rgba(199,255,74,.48)":"rgba(0,0,0,.55)";
      ctx.shadowBlur=highlight?playerSize*.42:playerSize*.24;
      ctx.shadowOffsetY=playerSize*.12;
      drawFootballer(px,py,playerSize,rotation,kit,false,name);
      ctx.restore();
      // Compact floating labels keep teammates identifiable.
      if(!highlight && name!=="Cristiano Ronaldo"){
        ctx.save();const labelW=Math.max(38,playerSize*1.75),labelH=Math.max(11,playerSize*.34);
        ctx.fillStyle="rgba(5,13,18,.72)";ctx.strokeStyle="rgba(255,255,255,.22)";ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(px-labelW/2,py-playerSize*.93,labelW,labelH,4);ctx.fill();ctx.stroke();
        ctx.fillStyle="#f4f7f4";ctx.font="700 "+Math.max(6,playerSize*.19)+"px sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText(name.length>15?name.slice(0,14)+"…":name,px,py-playerSize*.76);ctx.restore();
      }
      if(highlight){
        ctx.save();ctx.fillStyle="#f4ffd0";ctx.font="900 "+Math.max(7,w*.012)+"px sans-serif";
        ctx.textAlign="center";ctx.textBaseline="bottom";
        ctx.shadowColor="rgba(199,255,74,.9)";ctx.shadowBlur=8;
        ctx.fillText("YOU",px,py-playerSize*.73);ctx.restore();
      }else if(name==="Cristiano Ronaldo"){
        ctx.save();ctx.fillStyle="rgba(16,22,31,.78)";ctx.strokeStyle="rgba(255,255,255,.32)";
        const tagW=Math.max(34,playerSize*1.8),tagH=Math.max(12,playerSize*.48);
        ctx.beginPath();ctx.roundRect(px-tagW/2,py-playerSize*.95,tagW,tagH,4);ctx.fill();ctx.stroke();
        ctx.fillStyle="#fff";ctx.font="900 "+Math.max(7,playerSize*.25)+"px sans-serif";
        ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("RIVAL",px,py-playerSize*.71);ctx.restore();
      }
    };
    // Four supporting players on each side, plus the two active players.
    [[.24,.7],[.36,.62],[.64,.62],[.76,.7]].forEach((p,i)=>{
      drawMatchPlayer(p[0],p[1],["Zayd Quadri","Umar Shoaib","Muhammad Arham","Ehan Ali"][i],"#c7ff4a",[7,10,9,8][i],0,false);
    });
    [[.24,.3],[.36,.38],[.64,.38],[.76,.3]].forEach((p,i)=>{
      drawMatchPlayer(p[0],p[1],["Kylian Mbappé","Erling Haaland","Jude Bellingham","Vinícius Júnior"][i],"#ed6570",[7,9,5,7][i],Math.PI,false);
    });
    drawMatchPlayer(match.rival.x,match.rival.y,"Cristiano Ronaldo","#ed6570",9,Math.PI,false);
    drawMatchPlayer(match.player.x,match.player.y,selectedPlayer,"#c7ff4a",selectedPlayer==="Lionel Messi"?10:7,0,true);
    // Ball with a small shadow and panel detail.
    const bx=match.ball.x*w,by=match.ball.y*h,br=Math.max(4,w*.008);
    ctx.fillStyle="rgba(0,0,0,.3)";ctx.beginPath();ctx.ellipse(bx+2,by+br*1.5,br*1.25,br*.55,0,0,Math.PI*2);ctx.fill();
    const ballGlow=ctx.createRadialGradient(bx-br*.35,by-br*.4,br*.08,bx,by,br*1.35);
    ballGlow.addColorStop(0,"#ffffff");ballGlow.addColorStop(.72,"#f1f4ec");ballGlow.addColorStop(1,"#aeb8ad");
    ctx.fillStyle=ballGlow;ctx.beginPath();ctx.arc(bx,by,br,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#17251c";ctx.lineWidth=Math.max(1,w*.0018);ctx.stroke();
    ctx.fillStyle="#17251c";ctx.beginPath();ctx.arc(bx,by,br*.35,0,Math.PI*2);ctx.fill();
    // Five-panel ball seams and a specular highlight.
    ctx.save();ctx.translate(bx,by);ctx.rotate(performance.now()*.0008);ctx.strokeStyle="rgba(23,37,28,.82)";ctx.lineWidth=Math.max(.7,br*.075);
    for(let panel=0;panel<5;panel++){const a=panel*Math.PI*2/5;ctx.beginPath();ctx.moveTo(Math.cos(a)*br*.35,Math.sin(a)*br*.35);ctx.lineTo(Math.cos(a+.35)*br*.78,Math.sin(a+.35)*br*.78);ctx.stroke();}
    ctx.fillStyle="rgba(255,255,255,.72)";ctx.beginPath();ctx.arc(-br*.35,-br*.42,br*.14,0,Math.PI*2);ctx.fill();ctx.restore();
    // Match label and score-friendly header.
    ctx.fillStyle="rgba(5,15,10,.78)";ctx.fillRect(w*.32,h*.012,w*.36,h*.045);
    ctx.strokeStyle="rgba(199,255,74,.42)";ctx.lineWidth=1;ctx.strokeRect(w*.32,h*.012,w*.36,h*.045);
    ctx.fillStyle="#fff";ctx.font="800 "+Math.max(10,w*.016)+"px sans-serif";
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText("APEX STRIKERS · 5v5",w*.5,h*.034);
    if(match.finished){
      ctx.fillStyle="rgba(0,0,0,.78)";ctx.fillRect(w*.15,h*.36,w*.7,h*.28);
      ctx.strokeStyle="rgba(199,255,74,.8)";ctx.lineWidth=2;ctx.strokeRect(w*.15,h*.36,w*.7,h*.28);
      ctx.fillStyle="#c7ff4a";ctx.font="900 "+Math.max(20,w*.04)+"px sans-serif";
      ctx.fillText(match.playerGoals>match.rivalGoals?"VICTORY":match.playerGoals===match.rivalGoals?"DRAW":"FULL TIME",w*.5,h*.46);
      ctx.fillStyle="#fff";ctx.font="800 "+Math.max(14,w*.025)+"px sans-serif";
      ctx.fillText(match.playerGoals+"  -  "+match.rivalGoals,w*.5,h*.55);
    }
  }
  function drawPitch(){
    if(!ctx||!cw||!ch)return;
    const w=cw,h=ch;ctx.clearRect(0,0,w,h);window.ApexMatch3D?.sync?.();
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
  const modeGrid=document.querySelector(".mode-grid"), modeSection=document.querySelector(".mode-section");
  const modeToolbar=document.createElement("div");modeToolbar.className="arena-tools";
  modeToolbar.innerHTML='<input id="modeSearch" type="search" aria-label="Search game modes" placeholder="Search modes..."><select id="modeFilter" aria-label="Filter modes"><option value="all">All modes</option><option value="attack">Shooting</option><option value="keeper">Goalkeeping</option><option value="saved">Favourites</option><option value="recent">Recently played</option></select><span id="arenaStats" class="arena-stats"></span>';
  modeSection.insertBefore(modeToolbar,modeGrid);
  const modeFavourites=(()=>{try{return new Set(JSON.parse(localStorage.getItem("eclipseModeFavourites")||"[]"));}catch(_){return new Set();}})();
  let recentModes=(()=>{try{return JSON.parse(localStorage.getItem("eclipseRecentModes")||"[]");}catch(_){return [];}})();
  const modeCategories={penalty:"attack",freekick:"attack",longshot:"attack",goalkeeping:"keeper",random:"attack",vsattack:"attack",crossbar:"attack",survival:"keeper",headtohead:"attack"};
  function renderModeTools(){
    const q=$("modeSearch").value.trim().toLowerCase(),f=$("modeFilter").value;
    modeGrid.querySelectorAll("[data-mode],[data-open-youtube]").forEach(card=>{
      const key=card.dataset.mode||"youtube",txt=(card.innerText||"").toLowerCase();
      card.hidden=!((!q||txt.includes(q)||key.includes(q))&&(f==="all"||(f==="saved"&&modeFavourites.has(key))||(f==="recent"&&recentModes.includes(key))||(f==="attack"&&modeCategories[key]==="attack")||(f==="keeper"&&modeCategories[key]==="keeper")));
      const star=card.querySelector(".mode-favourite");if(star)star.textContent=modeFavourites.has(key)?"★":"☆";
    });
    $("arenaStats").textContent=career.goals+" goals · "+career.saves+" saves · "+career.xp+" XP · Best "+career.bestScore;
  }
  modeGrid.querySelectorAll("[data-mode],[data-open-youtube]").forEach(card=>{
    // Mode cards are already buttons, so the favourite control must not be another nested button.
    const key=card.dataset.mode||"youtube",star=document.createElement("span");
    star.className="mode-favourite";star.textContent=modeFavourites.has(key)?"★":"☆";
    star.setAttribute("role","button");star.setAttribute("tabindex","0");
    star.setAttribute("aria-label","Toggle favourite for "+key);
    const toggleFavourite=e=>{
      e.preventDefault();e.stopPropagation();
      modeFavourites.has(key)?modeFavourites.delete(key):modeFavourites.add(key);
      try{localStorage.setItem("eclipseModeFavourites",JSON.stringify([...modeFavourites]));}catch(_){}
      renderModeTools();
    };
    star.addEventListener("click",toggleFavourite);
    star.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){toggleFavourite(e);}});
    card.appendChild(star);
  });
  if($("modeSearch"))$("modeSearch").addEventListener("input",renderModeTools);if($("modeFilter"))$("modeFilter").addEventListener("change",renderModeTools);renderModeTools();

  const careerHub=document.createElement("section");careerHub.className="career-hub";
  careerHub.innerHTML='<div class="career-hub-head"><div><p class="eyebrow">YOUR SEASON</p><h2>Career <em>hub.</em></h2></div><span class="career-hub-note">Progress saved on this device</span><span class="career-hub-note" id="careerDraftVoucherBalance">◇ DRAFT VOUCHERS: --</span></div><div class="career-metrics" id="careerMetrics"></div><div class="career-hub-actions"><button type="button" id="dailyChallengeBtn" class="secondary-btn">🎯 DAILY CHALLENGE</button><button type="button" id="tournamentBtn" class="primary-btn">🏆 WORLD TOUR</button><button type="button" id="goalkeeperCareerBtn" class="secondary-btn">🧤 GOALKEEPER CAREER</button><button type="button" id="careerMarketBtn" class="primary-btn">🛒 MARKET · DRAFT VOUCHERS</button></div><p id="challengeStatus" class="career-hub-status" aria-live="polite"></p><div class="career-extra-actions"><button type="button" id="trainingAcademyBtn" class="secondary-btn">🎓 TRAINING ACADEMY</button><button type="button" id="trophyCabinetBtn" class="secondary-btn">🏆 TROPHY CABINET</button><button type="button" id="seasonBtn" class="secondary-btn">📅 CAREER SEASON</button><button type="button" id="rankingBtn" class="secondary-btn">📈 PERSONAL RANKING</button><button type="button" id="playerCardsBtn" class="secondary-btn">🃏 PLAYER COLLECTION</button></div><div id="careerExtraPanel" class="career-extra-panel" aria-live="polite"></div><section class="friends-panel"><h3>👥 FRIENDS, ONLINE SERVERS & PROGRESS</h3><p>The server address is managed by the repository owner and loads automatically. Online profiles, friend IDs and invitations require the backend to be deployed.</p><div class="friend-add-row"><button type="button" id="connectServerBtn" class="primary-btn">RETRY SERVER CONNECTION</button></div><div class="profile-editor"><div class="profile-avatar-wrap"><img id="profilePhotoPreview" alt="Your profile photo" class="profile-photo-preview hidden"><span id="profilePhotoFallback" class="profile-photo-fallback">EA</span></div><div class="profile-photo-controls"><strong>PROFILE PHOTO</strong><p>Choose a photo, adjust the crop, then save it.</p><input id="profilePhotoInput" class="profile-file-input" type="file" accept="image/*"><button type="button" id="chooseProfilePhotoBtn" class="secondary-btn">CHOOSE FROM PHOTOS</button><label for="profilePhotoZoom">CROP / ZOOM</label><input id="profilePhotoZoom" type="range" min="0.35" max="2.5" step="0.05" value="1"><div class="profile-photo-buttons"><button type="button" id="saveProfilePhotoBtn" class="secondary-btn">SAVE PHOTO</button><button type="button" id="removeProfilePhotoBtn" class="secondary-btn">REMOVE</button></div></div></div><div class="friend-add-row"><input id="nicknameInput" maxlength="24" placeholder="Your display name" value="Eclipse Player" autocomplete="nickname"><button type="button" id="saveNicknameBtn" class="secondary-btn">SAVE NAME</button></div><p id="serverStatus" class="career-hub-status" aria-live="polite">Offline mode · deploy the backend and connect its URL.</p><div class="friend-id-row"><strong id="myPlayerId">EA-LOADING</strong><button type="button" id="copyPlayerIdBtn" class="secondary-btn">COPY ID</button></div><button type="button" id="showProfileCodeBtn" class="secondary-btn">CREATE PROFILE SHARE CODE</button><textarea id="profileShareCode" rows="3" readonly placeholder="Your share code appears here"></textarea><div class="friend-add-row"><input id="friendIdInput" placeholder="Player name or EA ID" maxlength="32"><button type="button" id="addFriendBtn" class="primary-btn">ADD FRIEND</button></div><div class="friend-add-row"><input id="friendCodeInput" placeholder="Paste your friend’s profile code"><button type="button" id="compareFriendBtn" class="secondary-btn">COMPARE</button></div><p id="friendStatus" class="career-hub-status" aria-live="polite"></p><section id="apexLiveHub" class="career-hub-columns"><section class="career-events-shortcut"><p class="eyebrow">APEX EVENT CIRCUIT</p><h3>LIVE EVENTS</h3><p class="career-hub-hint">Three rotating challenges are waiting. View the event details, rewards and start each challenge from the event hub.</p><button type="button" id="careerViewEventsBtn" class="primary-btn">VIEW EVENTS ↗</button></section><section><h3>GLOBAL LEADERBOARD</h3><div id="apexLeaderboard"><p class="career-hub-hint">Connect to see top players.</p></div></section></section><div id="friendsList"></div></section><div class="career-hub-columns"><section><h3>PLAYER DEVELOPMENT</h3><div id="playerDevelopment"></div></section><section><h3>ACHIEVEMENTS</h3><div id="achievementList"></div></section></div>';
  document.querySelector(".roster-section").appendChild(careerHub);
  let tournamentActive=false,tournamentWinsThisRun=0,dailyChallengeMode="crossbar",dailyChallengeActive=false;
  function dateKey(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  function dailyRecord(){try{return JSON.parse(localStorage.getItem("eclipseDailyChallenge")||"{}");}catch(_){return {};}}
  function renderCareerHub(){
    const metrics=$("careerMetrics"),dev=$("playerDevelopment"),ach=$("achievementList");if(!metrics||!dev||!ach)return;
    metrics.innerHTML='<div><strong>'+career.goals+'</strong><span>GOALS</span></div><div><strong>'+career.saves+'</strong><span>SAVES</span></div><div><strong>'+career.xp+'</strong><span>TOTAL XP</span></div><div><strong>'+career.tournamentWins+'</strong><span>CUP WINS</span></div><div><strong>'+career.bestScore+'</strong><span>BEST SCORE</span></div>';
    const p=players.find(x=>x.name===selectedPlayer)||players[0],g=goalkeepers.find(x=>x.name===selectedGoalkeeper)||goalkeepers[0],px=career.players[selectedPlayer]||0,gx=career.players[selectedGoalkeeper]||0;
    const level=x=>1+Math.floor(x/100),stat=(base,x)=>Math.min(99,Math.max(1,Math.round(base+Math.min(15,Math.floor(x/100)))));
    const ps=p.stats||{power:Math.min(99,Math.round(p.rating*.88)),accuracy:Math.min(99,Math.round(p.rating*.91)),speed:Math.min(99,Math.round(p.rating*.92))},kb=Math.min(99,Math.round(g.rating*.92));
    dev.innerHTML='<div class="development-player"><strong>'+selectedPlayer+'</strong><span>LVL '+level(px)+' · '+px+' XP</span><div class="development-bars">'+[['Power',stat(ps.power||p.rating,px)],['Accuracy',stat(ps.accuracy||p.rating,px)],['Speed',stat(ps.speed||p.rating,px)],['Curve',stat(p.name==="Lamine Yamal"?96:p.name==="Lionel Messi"?92:Math.min(90,p.rating*.84),px)]].map(([n,v])=>'<label>'+n+' <b>'+v+'</b><i><span style="width:'+Math.min(100,v)+'%"></span></i></label>').join("")+'</div></div><div class="development-player"><strong>'+selectedGoalkeeper+' · GK</strong><span>LVL '+level(gx)+' · '+gx+' XP</span><div class="development-bars">'+[['Reflexes',Math.min(99,g.name==="Hassan Ali"?99:stat(kb,gx))],['Diving',Math.min(99,g.name==="Hassan Ali"?99:stat(kb-2,gx))],['Positioning',Math.min(99,stat(kb-1,gx))]].map(([n,v])=>'<label>'+n+' <b>'+v+'</b><i><span style="width:'+Math.min(100,v)+'%"></span></i></label>').join("")+'</div></div><p class="career-hub-hint">Play challenges to earn XP and level up your selected player or goalkeeper.</p>';
    const badges=[["firstAttempt","FIRST WHISTLE","Complete your first attempt"],["firstGoal","FIRST GOAL","Score your first goal"],["hatTrick","HAT-TRICK HERO","Score 3 goals"],["keeperWall","KEEPER WALL","Make 5 saves"],["xp1000","XP COLLECTOR","Earn 1,000 XP"]];
    ach.innerHTML=badges.map(([id,n,d])=>'<div class="achievement '+(career.achievements&&career.achievements[id]?'unlocked':'')+'"><span>'+(career.achievements&&career.achievements[id]?'★':'◇')+'</span><div><strong>'+n+'</strong><small>'+d+'</small></div></div>').join("");
    const rec=dailyRecord(),done=rec.date===dateKey()&&rec.done;
    $("challengeStatus").textContent=done?"Today's challenge completed! Come back tomorrow for a new target.":"Daily target: "+({crossbar:"Hit the crossbar zone",penalty:"Score a penalty",goalkeeping:"Make a goalkeeper save"}[dailyChallengeMode])+" · Finish one attempt to claim it.";
    $("dailyChallengeBtn").textContent=done?"✓ DAILY COMPLETE":"🎯 DAILY CHALLENGE";
    $("tournamentBtn").textContent=tournamentActive?"🏆 WORLD TOUR · ROUND "+(tournamentWinsThisRun+1)+"/3":"🏆 WORLD TOUR";
  }
  function launchDailyChallenge(){const rec=dailyRecord();if(rec.date===dateKey()&&rec.done){toast("Daily challenge already completed. Return tomorrow!");renderCareerHub();return;}const opts=["crossbar","penalty","goalkeeping"];dailyChallengeMode=opts[Math.floor(Date.now()/86400000)%opts.length];dailyChallengeActive=true;startMode(dailyChallengeMode);$("feedback").textContent="DAILY CHALLENGE · "+({crossbar:"Hit the crossbar zone.",penalty:"Score this penalty.",goalkeeping:"Make this save."}[dailyChallengeMode]);toast("Daily challenge: "+modeNames[dailyChallengeMode]);}
  function launchWorldTour(){tournamentActive=true;tournamentWinsThisRun=0;startMode("vsattack");$("gameTitle").innerHTML="WORLD TOUR <em>ROUND 1</em>";$("controlHeading").textContent="World Tour · Round 1 of 3";$("controlText").textContent="Win this five-attack round to advance. Three round wins earn the World Tour trophy.";toast("WORLD TOUR started · Win 3 rounds to lift the trophy!");renderCareerHub();}
  if($("dailyChallengeBtn"))$("dailyChallengeBtn").addEventListener("click",launchDailyChallenge);if($("tournamentBtn"))$("tournamentBtn").addEventListener("click",launchWorldTour);
  if($("goalkeeperCareerBtn"))$("goalkeeperCareerBtn").addEventListener("click",()=>{startMode("goalkeeping");$("gameTitle").innerHTML="GOALKEEPER <em>CAREER</em>";$("controlHeading").textContent="Goalkeeper Career";$("controlText").textContent="Read the striker, choose your dive, and build your save record.";});
  function renderExtraPanel(kind){
    const panel=$("careerExtraPanel");if(!panel)return;
    const season=Math.floor((career.attempts||0)/10)+1,seasonAttempts=(career.attempts||0)%10;
    const tier=career.xp>=2500?"ELITE":career.xp>=1200?"PRO":career.xp>=500?"CHALLENGER":career.xp>=150?"ROOKIE II":"ROOKIE III";
    if(kind==="training"){
      panel.innerHTML='<h3>🎓 TRAINING ACADEMY</h3><p>Choose a focused drill. Your existing difficulty setting still applies.</p><div class="career-extra-grid"><button type="button" data-training-mode="freekick">🎯 Curved free kicks</button><button type="button" data-training-mode="longshot">🚀 Long-shot accuracy</button><button type="button" data-training-mode="crossbar">🥅 Crossbar precision</button><button type="button" data-training-mode="penalty">⚽ Penalty practice</button><button type="button" data-training-mode="goalkeeping">🧤 Keeper reflexes</button><button type="button" data-training-mode="survival">🛡️ Survival saves</button></div><p class="career-hub-hint">Complete attempts to earn XP and improve your selected player or goalkeeper.</p>';
      panel.querySelectorAll("[data-training-mode]").forEach(b=>b.addEventListener("click",()=>{const m=b.dataset.trainingMode;dailyChallengeActive=false;tournamentActive=false;startMode(m);$("controlHeading").textContent="Training Academy · "+modeNames[m];$("controlText").textContent="Training drill: "+modeNames[m]+". Practise, learn the timing, and earn career XP.";toast("Training drill started: "+modeNames[m]);}));
    }else if(kind==="trophies"){
      const wins=career.tournamentWins||0,ach=career.achievements||{};
      const trophyItems=[["🏆","World Tour Champion",wins>=3,"Win 3 VS Attack matches or complete a World Tour"],["🥇","First Victory",wins>=1,"Win your first VS Attack match"],["⚽","Goal Machine",(career.goals||0)>=10,"Score 10 career goals"],["🧤","Safe Hands",(career.saves||0)>=10,"Make 10 career saves"],["✨","XP Legend",(career.xp||0)>=1000,"Earn 1,000 career XP"],["🎖️","Achievement Hunter",Object.values(ach).filter(Boolean).length>=5,"Unlock 5 achievements"]];
      panel.innerHTML='<h3>🏆 TROPHY CABINET</h3><p>Your awards are saved on this device.</p><div class="trophy-grid">'+trophyItems.map(([icon,name,earned,goal])=>'<div class="trophy-item '+(earned?'earned':'locked')+'"><span>'+icon+'</span><strong>'+name+'</strong><small>'+(earned?'UNLOCKED':'LOCKED')+' · '+goal+'</small></div>').join("")+'</div>';
    }else if(kind==="season"){
      const progress=Math.round(seasonAttempts/10*100);
      panel.innerHTML='<h3>📅 CAREER SEASON '+season+'</h3><p>Season target: complete 10 attempts to move into the next season.</p><div class="season-progress"><div><span>SEASON PROGRESS</span><b>'+seasonAttempts+'/10 attempts</b></div><i><span style="width:'+progress+'%"></span></i></div><div class="career-season-stats"><div><strong>'+career.goals+'</strong><small>CAREER GOALS</small></div><div><strong>'+career.saves+'</strong><small>CAREER SAVES</small></div><div><strong>'+career.xp+'</strong><small>CAREER XP</small></div></div><p class="career-hub-hint">Season number is calculated from your saved career attempts. Your all-time records stay intact.</p>';
    }else if(kind==="cards"){
      loadApexStore();
    }else{
      panel.innerHTML='<h3>📈 PERSONAL RANKING</h3><div class="personal-rank"><span>YOUR LOCAL DIVISION</span><strong>'+tier+'</strong><small>Based on your career XP · this is a personal offline rank, not a global leaderboard.</small></div><div class="career-season-stats"><div><strong>'+career.xp+'</strong><small>XP POINTS</small></div><div><strong>'+career.tournamentWins+'</strong><small>WINS</small></div><div><strong>'+career.bestScore+'</strong><small>BEST SCORE</small></div></div><p class="career-hub-hint">Keep playing to climb divisions. Online rankings would require a secure server and shared leaderboard.</p>';
    }
  }
  if($("trainingAcademyBtn"))$("trainingAcademyBtn").addEventListener("click",()=>renderExtraPanel("training"));
  if($("trophyCabinetBtn"))$("trophyCabinetBtn").addEventListener("click",()=>renderExtraPanel("trophies"));
  if($("seasonBtn"))$("seasonBtn").addEventListener("click",()=>renderExtraPanel("season"));
  if($("rankingBtn"))$("rankingBtn").addEventListener("click",()=>renderExtraPanel("ranking"));
  if($("playerCardsBtn"))$("playerCardsBtn").addEventListener("click",()=>renderExtraPanel("cards"));
  const originalSaveCareer=saveCareer;saveCareer=function(){originalSaveCareer();renderCareerHub();renderPlayers();};
  let playerId=(()=>{try{let id=localStorage.getItem("eclipsePlayerId");if(!id){id="EA-"+Math.random().toString(36).slice(2,6).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();localStorage.setItem("eclipsePlayerId",id);}return id;}catch(_){return "EA-LOCAL";}})();
  const savedFriends=(()=>{try{return JSON.parse(localStorage.getItem("eclipseFriends")||"[]");}catch(_){return [];}})();
  function renderFriends(){const list=$("friendsList");if(!list)return;list.innerHTML=savedFriends.length?savedFriends.map(f=>{const p=f.profile||f;return '<div class="friend-entry"><div><strong>'+String(f.id).replace(/[<>&"]/g,"")+'</strong><small>'+(p.name?String(p.name).replace(/[<>&"]/g,"")+' · '+(Number(p.xp)||0)+' XP · '+(f.online?"ONLINE":(onlineCfg.base?"OFFLINE":"PROFILE NOT SYNCED")):'ID saved · waiting for profile')+'</small></div><div class="friend-entry-actions"><button type="button" data-invite-friend="'+String(f.id).replace(/"/g,"&quot;")+'">⚽ INVITE</button><button type="button" data-remove-friend="'+String(f.id).replace(/"/g,"&quot;")+'">REMOVE</button></div></div>';}).join(""):'<p class="career-hub-hint">No friends added yet.</p>';list.querySelectorAll("[data-remove-friend]").forEach(b=>b.addEventListener("click",async()=>{const id=b.dataset.removeFriend;if(onlineCfg.base){try{await api("/api/friends/remove",{method:"POST",body:JSON.stringify({friendId:id})});}catch(_){}}const i=savedFriends.findIndex(f=>f.id===id);if(i>=0)savedFriends.splice(i,1);try{localStorage.setItem("eclipseFriends",JSON.stringify(savedFriends));}catch(_){}renderFriends();}));list.querySelectorAll("[data-invite-friend]").forEach(b=>b.addEventListener("click",async()=>{if(!onlineCfg.base){setFriendStatus("Connect to your deployed server to invite friends online.");return;}try{const d=await api("/api/invites",{method:"POST",body:JSON.stringify({friendId:b.dataset.inviteFriend})});setFriendStatus("Match invitation sent · room "+d.roomId+". Keep the game open while your friend accepts.");onlineCfg.roomId=d.roomId;}catch(e){setFriendStatus("Could not invite friend: "+e.message);}}));}
  if($("myPlayerId"))$("myPlayerId").textContent=playerId;
  const onlineCfg={base:(()=>{try{return String(window.ECLIPSE_CONFIG?.backendUrl||"").trim().replace(/\/$/,"");}catch(_){return "";}})(),deviceKey:(()=>{try{let key=localStorage.getItem("apexDeviceKey")||"";if(!/^[a-f0-9]{64}$/i.test(key)){const bytes=new Uint8Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(bytes);else for(let i=0;i<bytes.length;i++)bytes[i]=Math.floor(Math.random()*256);key=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");localStorage.setItem("apexDeviceKey",key);}return key;}catch(_){return "";}})(),token:(()=>{try{return localStorage.getItem("eclipseDeviceToken")||"";}catch(_){return "";}})(),socket:null,roomId:null,onlineMatch:false,lastStateAt:0};
  let connectPromise=null,onlineAccountApproved=false,activeRewardSessionId=null,activeRewardSessionPromise=null,rewardClaimedThisGame=false,pendingApexEventId='',activeRewardEventId='';
  function setServerStatus(message){const el=$("serverStatus");if(el)el.textContent=message;} function setFriendStatus(message){const el=$("friendStatus");if(el)el.textContent=message;}
  let authRefreshPromise=null;
  async function refreshOnlineAuth(){
    if(authRefreshPromise)return authRefreshPromise;
    authRefreshPromise=(async()=>{
      const headers={"Content-Type":"application/json"};
      if(onlineCfg.token)headers.Authorization="Bearer "+onlineCfg.token;
      const response=await fetch(onlineCfg.base+"/api/register",{method:"POST",headers,body:JSON.stringify({profile:onlineProfile(),deviceKey:onlineCfg.deviceKey})});
      const data=await response.json().catch(()=>({error:"Invalid server response"}));
      if(!response.ok||!data.token)throw new Error(data.error||"Could not restore your online session. Please reconnect.");
      onlineCfg.token=data.token;
      try{localStorage.setItem("eclipseDeviceToken",data.token);localStorage.setItem("eclipsePlayerId",data.playerId);}catch(_){}
      playerId=data.playerId;
      if($("myPlayerId"))$("myPlayerId").textContent=data.playerId;
      return data;
    })();
    try{return await authRefreshPromise;}finally{authRefreshPromise=null;}
  }
  function api(path,opts={}){
    if(!onlineCfg.base)return Promise.reject(new Error("Online server is not configured yet."));
    const method=String(opts.method||"GET").toUpperCase();
    // Only owner-only endpoints require a code. A normal player's POST to
    // /api/youtube/requests must remain available without owner verification.
    const needsOwnerCode=
      (path==="/api/admin/audit"&&method==="GET")||
      (path==="/api/admin/players"&&method==="GET")||
      (path==="/api/youtube/requests"&&method==="GET")||
      (path==="/api/admin/account-requests"&&method==="GET")||
      (method==="POST"&&/^\/api\/youtube\/requests\/[^/]+\/decision$/.test(path))||
      (method==="POST"&&/^\/api\/admin\/account-requests\/[^/]+\/decision$/.test(path));
    let ownerCode=String(opts.headers?.["X-Admin-2FA"]||"").trim();
    if(needsOwnerCode&&!ownerCode){
      const entered=window.prompt("OWNER SECURITY CHECK\nEnter the current 6-digit code from your authenticator app:");
      ownerCode=String(entered||"").trim();
      if(!/^\d{6}$/.test(ownerCode))return Promise.reject(new Error("Owner verification cancelled. Enter a 6-digit authenticator code."));
    }
    const send=()=>{
      const headers={"Content-Type":"application/json",...(opts.headers||{})};
      if(needsOwnerCode&&!headers["X-Admin-2FA"])headers["X-Admin-2FA"]=ownerCode;
      // Read the current token on every send so a session refresh is respected.
      if(onlineCfg.token)headers.Authorization="Bearer "+onlineCfg.token;
      return fetch(onlineCfg.base+path,{...opts,headers});
    };
    return send().then(async response=>{
      let data=await response.json().catch(()=>({error:"Invalid server response"}));
      // Refresh a stale player session, but don't mistake a bad 2FA code for
      // an expired login and silently retry it.
      if(response.status===401&&data.error==="Authentication required. Reconnect to the server."&&path!=="/api/register"){
        await refreshOnlineAuth();
        response=await send();
        data=await response.json().catch(()=>({error:"Invalid server response"}));
      }
      if(!response.ok)throw new Error(data.error||"Server error "+response.status);
      return data;
    });
  }
  const saveCareerBeforeLeaderboardSync=saveCareer;saveCareer=function(){saveCareerBeforeLeaderboardSync();if(onlineCfg.base&&onlineCfg.token)api("/api/profile",{method:"PUT",body:JSON.stringify({profile:onlineProfile()})}).catch(()=>{});};
  async function claimGameReward(finalScore){
    if(rewardClaimedThisGame)return;
    if(!onlineCfg.base||!onlineCfg.token){toast("Connect online to collect your match gems.");return;}
    rewardClaimedThisGame=true;
    try{
      const sessionId=activeRewardSessionId||(activeRewardSessionPromise?await activeRewardSessionPromise:null);
      if(!sessionId)throw new Error("Your online game session did not start. Start a new game while connected.");
      const safeScore=Math.max(0,Math.min(5000,Math.floor(Number(finalScore)||0)));
      const data=await api("/api/games/complete",{method:"POST",body:JSON.stringify({sessionId,score:safeScore})});
      activeRewardSessionId=null;activeRewardSessionPromise=null;
      updateTopGemBalance(data.gems,data.unlimitedGems);
      const storeBalance=$("apexGemCount");if(storeBalance)storeBalance.textContent=data.unlimitedGems?"∞ GEMS · ADMIN WALLET":"◇ "+Number(data.gems).toLocaleString()+" GEMS";
      if(data.eventXp){career.xp+=data.eventXp;career.unlockXP=(career.unlockXP||0)+data.eventXp;saveCareer();api("/api/profile",{method:"PUT",body:JSON.stringify({profile:onlineProfile()})}).catch(()=>{});}
      if(data.eventCard){
        syncOwnedCardsToRoster(data.ownedCards,[data.eventCard]);
        renderCareerHub();
        toast((data.eventId==="apex-ascension"?"APEX ASCENSION SIGNED · ":"GAME CHANGERS SIGNED · ")+data.eventCard.name+" · "+data.eventCard.ovr+" OVR");
      }else{
        renderCareerHub();
        toast("+"+data.reward+" GEMS EARNED · "+data.gems+" TOTAL");
      }
    }catch(error){
      rewardClaimedThisGame=false;
      if(error.message)toast("Gem reward not added: "+error.message);
    }
  }
  // Admin status comes from the authenticated server response, never from a client-set ID.
  async function detectApexAdmin(){
    if(!onlineCfg.base||!onlineCfg.token)return;
    try{
      const response=await fetch(onlineCfg.base.replace(/\/$/,"")+"/api/youtube/access",{headers:{Authorization:"Bearer "+onlineCfg.token}});
      if(!response.ok)return;
      const data=await response.json();
      if(data.isAdmin&&!apexAdminMode){apexAdminMode=true;renderPlayers();toast("ADMIN MODE · all players and goalkeepers unlocked");}if(data.isAdmin){const ownerPanel=$("youtubeOwnerRequests");ownerPanel?.classList.remove("hidden");}
    }catch(_){}
  }
  if($("youtubeRefreshRequests"))$("youtubeRefreshRequests").addEventListener("click",()=>refreshYouTubeRequests());
  const nicknameInput=$("nicknameInput");
  const PROFILE_STORAGE_KEY="eclipseProfileV1";
  function readSavedProfile(){try{const p=JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY)||"null");if(p&&typeof p==="object")return p;}catch(_){}try{return {name:localStorage.getItem("eclipseDisplayName")||"",photo:localStorage.getItem("eclipseProfilePhoto")||""};}catch(_){return {name:"",photo:""};}}
  function writeSavedProfile(p){try{localStorage.setItem(PROFILE_STORAGE_KEY,JSON.stringify(p));if(p.name)localStorage.setItem("eclipseDisplayName",p.name);if(p.photo)localStorage.setItem("eclipseProfilePhoto",p.photo);else localStorage.removeItem("eclipseProfilePhoto");return true;}catch(_){return false;}}
  const savedProfile=readSavedProfile();if(nicknameInput&&savedProfile.name)nicknameInput.value=String(savedProfile.name).slice(0,24);
  const photoPreview=$("profilePhotoPreview"),photoFallback=$("profilePhotoFallback"),photoInput=$("profilePhotoInput"),photoZoom=$("profilePhotoZoom");let pendingPhoto=null;
  function displayPhoto(src){if(!photoPreview)return;if(src){photoPreview.src=src;photoPreview.classList.remove("hidden");if(photoFallback)photoFallback.classList.add("hidden");}else{photoPreview.removeAttribute("src");photoPreview.classList.add("hidden");if(photoFallback)photoFallback.classList.remove("hidden");}}
  displayPhoto(savedProfile.photo||"");
  function currentDisplayName(){return String((nicknameInput&&nicknameInput.value.trim())||readSavedProfile().name||"Eclipse Player").slice(0,24)||"Eclipse Player";}
  function saveNameLocally(){if(!nicknameInput||!nicknameInput.value.trim())return;const p=readSavedProfile();p.name=nicknameInput.value.trim().slice(0,24);writeSavedProfile(p);}
  if(nicknameInput){nicknameInput.addEventListener("input",saveNameLocally);nicknameInput.addEventListener("change",saveNameLocally);nicknameInput.addEventListener("blur",saveNameLocally);}
  if($("chooseProfilePhotoBtn")&&photoInput)$("chooseProfilePhotoBtn").addEventListener("click",()=>photoInput.click());
  if(photoInput)photoInput.addEventListener("change",()=>{const file=photoInput.files&&photoInput.files[0];if(!file)return;if(!file.type.startsWith("image/")){setServerStatus("Choose an image from Photos.");return;}const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{pendingPhoto=img;displayPhoto(reader.result);if(photoPreview)photoPreview.style.transform="scale("+Number(photoZoom.value||1)+")";setServerStatus("Photo loaded. Adjust crop and press SAVE PHOTO.");};img.onerror=()=>setServerStatus("Could not open that image.");img.src=String(reader.result||"");};reader.readAsDataURL(file);});
  if(photoZoom)photoZoom.addEventListener("input",()=>{if(photoPreview&&!photoPreview.classList.contains("hidden"))photoPreview.style.transform="scale("+Number(photoZoom.value||1)+")";});
  if($("saveProfilePhotoBtn"))$("saveProfilePhotoBtn").addEventListener("click",()=>{if(!pendingPhoto){setServerStatus("Choose a photo first.");return;}try{const img=pendingPhoto,w=img.naturalWidth||img.width,h=img.naturalHeight||img.height,side=Math.min(w,h),zoom=Math.max(.35,Math.min(2.5,Number(photoZoom.value||1))),canvas=document.createElement("canvas");canvas.width=256;canvas.height=256;const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Photo editor unavailable");ctx.fillStyle="#101923";ctx.fillRect(0,0,256,256);if(zoom<1){const fit=Math.min(256/w,256/h)*zoom,dw=w*fit,dh=h*fit;ctx.drawImage(img,(256-dw)/2,(256-dh)/2,dw,dh);}else{const crop=side/zoom;ctx.drawImage(img,(w-crop)/2,(h-crop)/2,crop,crop,0,0,256,256);}const p=readSavedProfile();p.photo=canvas.toDataURL("image/jpeg",.78);p.name=currentDisplayName();if(!writeSavedProfile(p))throw new Error("Storage full or blocked");displayPhoto(p.photo);photoPreview.style.transform="";pendingPhoto=null;photoInput.value="";setServerStatus("Profile photo saved on this device.");}catch(e){setServerStatus("Could not save photo: "+e.message);}});
  if($("removeProfilePhotoBtn"))$("removeProfilePhotoBtn").addEventListener("click",()=>{const p=readSavedProfile();p.photo="";if(!writeSavedProfile(p)){setServerStatus("Could not update browser storage.");return;}pendingPhoto=null;if(photoInput)photoInput.value="";displayPhoto("");setServerStatus("Profile photo removed.");});
  function onlineProfile(){return {name:currentDisplayName(),xp:career.xp,goals:career.goals,saves:career.saves,wins:career.tournamentWins,best:career.bestScore,player:selectedPlayer,goalkeeper:selectedGoalkeeper,ovr:Math.min(99,92+Math.floor(career.xp/500))};}
  function updateTopGemBalance(value,unlimited=false){const badge=$("topGemBalance");if(!badge)return;if(unlimited){badge.textContent="∞ GEMS";badge.setAttribute("aria-label","Admin wallet: unlimited gems");return;}if(Number.isFinite(Number(value)))badge.textContent="◇ "+Number(value).toLocaleString()+" GEMS";}
  async function refreshTopGemBalance(){if(!onlineCfg.base||!onlineCfg.token){updateTopGemBalance("--");return;}try{const data=await api("/api/store");updateTopGemBalance(data.gems,data.unlimitedGems);}catch(_){const badge=$("topGemBalance");if(badge)badge.textContent="◇ GEMS";}}
  function updateCareerVoucherBalance(value){const badge=$("careerDraftVoucherBalance");if(badge)badge.textContent="◇ DRAFT VOUCHERS: "+(Number.isFinite(Number(value))?Number(value):0);}
  async function refreshCareerVoucherBalance(){const badge=$("careerDraftVoucherBalance");if(!onlineCfg.base||!onlineCfg.token){if(badge)badge.textContent="◇ DRAFT VOUCHERS: CONNECT ONLINE";return;}try{const data=await api("/api/store");updateCareerVoucherBalance(data.draftVouchers||0);}catch(_){if(badge)badge.textContent="◇ DRAFT VOUCHERS: UNAVAILABLE";}}
  async function loadApexStore(){
    const panel=$("featuredMarketPanel");if(!panel)return;
    let selectedDraftEvent="apex-ascension";
    panel.innerHTML='<section class="apex-draft-market"><div class="draft-market-kicker">APEX STRIKERS · PLAYER EXCHANGE</div><h3>THE DRAFT ROOM</h3><p>Exchange gems for a Draft Voucher, then choose which event pool to draft from. Each voucher reveals one random player from that event. You will not see who it is until the final reveal.</p><div class="draft-event-picker" role="group" aria-label="Choose draft event"><button type="button" class="draft-event-option selected" data-draft-event="apex-ascension"><strong>APEX ASCENSION</strong><small>200-player elite pool</small></button><button type="button" class="draft-event-option" data-draft-event="game-changers"><strong>GAME CHANGERS</strong><small>10 special players</small></button></div><div class="apex-store-head"><strong>YOUR WALLET</strong><span class="apex-gem-count" id="apexGemCount">Loading...</span></div><div class="draft-wallet-line"><span id="apexVoucherCount">◇ -- DRAFT VOUCHERS</span><span>150 GEMS = 1 VOUCHER</span></div><div class="draft-layout"><div class="draft-main-actions"><div class="apex-pack-row draft-voucher-actions"><button class="apex-pack draft-buy" id="buyDraftVoucher"><strong>GET 1 VOUCHER</strong><span>150 GEMS · 1 VOUCHER</span><small>One sealed player. One big reveal.</small></button><button class="apex-pack draft-buy draft-buy-ten" id="buyTenDraftVouchers"><strong>GET 10 VOUCHERS</strong><span>1,500 GEMS · 10 VOUCHERS</span><small>Stock up for a 10-player opening.</small></button><button class="apex-pack draft-start" id="startPlayerDraft"><strong>ENTER THE DRAFT</strong><span>1 VOUCHER · 1 MYSTERY PLAYER</span><small>Open one mystery player pack. The result is revealed at the end.</small></button><button class="apex-pack draft-start draft-open-ten" id="openTenDrafts"><strong>OPEN 10 DRAFTS</strong><span>10 VOUCHERS · 10 PLAYERS</span><small>Use 10 vouchers instantly and reveal all 10 players.</small></button></div><p id="apexPackStatus" class="career-hub-status" aria-live="polite"></p><div id="apexDraftChoices" class="apex-card-grid draft-choice-grid"></div><div id="apexPackReveal" class="apex-card-grid"></div></div><aside class="draft-odds-panel" id="draftOddsPanel" aria-live="polite"><div class="draft-odds-heading"><span>✦</span><div><strong>TOP 3 PACKABLE</strong><small>BEST PLAYERS IN THIS EVENT</small></div></div><div id="draftOddsList"><p>Loading real pack odds...</p></div><small class="draft-odds-note">Chance per voucher · based on actual pack weights</small><div id="draftPityStatus" class="draft-pity-status" aria-live="polite">Loading guaranteed pools...</div></aside></div><section class="pool-a-gallery" aria-labelledby="poolAHeading"><div class="pool-a-gallery-heading"><div><span>✦ ELITE GUARANTEE POOL</span><h3 id="poolAHeading">POOL A · ALL 126+ OVR PLAYERS</h3><p>Browse every player eligible for the Pool A guarantee. Tap a card to expand its attributes.</p></div><strong id="poolACount">LOADING...</strong></div><div id="poolACards" class="pool-a-card-grid"><p>Loading Pool A cards...</p></div></section></section><p class="apex-photo-credit">Player photo credits are listed in the credits section at the bottom of Apex Strikers. Custom players use their own profile photos.</p>';
    if(!onlineCfg.base||!onlineCfg.token){$("apexGemCount").textContent="Connect online to sync gems";$("apexVoucherCount").textContent="Connect to view vouchers";updateCareerVoucherBalance("CONNECT ONLINE");return;}
    try{
      const data=await api("/api/store");$("apexGemCount").textContent=data.unlimitedGems?"∞ GEMS · ADMIN WALLET":"◇ "+Number(data.gems).toLocaleString()+" GEMS";updateTopGemBalance(data.gems,data.unlimitedGems);updateCareerVoucherBalance(data.draftVouchers||0);$("apexVoucherCount").textContent="◇ "+(data.draftVouchers||0)+" DRAFT VOUCHERS";syncOwnedCardsToRoster(data.ownedCards,data.cardCatalog);
      const draftOdds=data.draftOdds||{};const draftPity=data.draftPity||{};const draftPools=data.draftPools||{};
      function renderDraftOdds(eventId){
        const box=$("draftOddsList");if(!box)return;
        const list=draftOdds[eventId]||[];
        box.replaceChildren();
        if(!list.length){const empty=document.createElement("p");empty.textContent="Odds unavailable.";box.appendChild(empty);return;}
        list.forEach((player,index)=>{
          const row=document.createElement("div");row.className="draft-odds-player";
          const rank=document.createElement("span");rank.className="draft-odds-rank";rank.textContent=String(index+1).padStart(2,"0");
          const info=document.createElement("div");info.className="draft-odds-info";
          const name=document.createElement("strong");name.textContent=player.name;
          const meta=document.createElement("small");meta.textContent=player.ovr+" OVR · "+player.position+" · "+(player.rarity||"ELITE");
          info.append(name,meta);
          const chance=document.createElement("strong");chance.className="draft-odds-chance";chance.textContent=player.chance.toFixed(player.chance<1?4:2)+"%";
          row.append(rank,info,chance);box.appendChild(row);
        });
      }
      renderDraftOdds("apex-ascension");
      function renderDraftPity(eventId){
        const box=$("draftPityStatus");if(!box)return;
        const state=draftPity[eventId]||{};
        const a=state.poolA||{},b=state.poolB||{};
        const line=(label,item)=>item.remaining===null?label+" · Not in this event":label+" · "+item.remaining+" draft"+(item.remaining===1?"":"s")+" left";
        box.textContent=line("POOL A · 126+ OVR",a)+"  |  "+line("POOL B · 125 OVR & BELOW",b);
      }
      renderDraftPity("apex-ascension");
      const catalog=Object.fromEntries((data.cardCatalog||[]).map(card=>[card.id,[
        card.name,card.ovr,card.position,card.country,card.flag,card.image||"",
        card.stats||{PAC:Math.max(45,Number(card.ovr||80)-2),SHO:Math.max(45,Number(card.ovr||80)-1),PAS:Math.max(45,Number(card.ovr||80)-4),DRI:Math.max(45,Number(card.ovr||80)-3),DEF:Math.max(35,Number(card.ovr||80)-20),PHY:Math.max(45,Number(card.ovr||80)-7)},
        card.club||"Club unverified",card.careerStatus||"Needs verification"
      ]]));
      if(catalog.arham){const savedPhoto=readSavedProfile().photo||"";catalog.arham[5]=isValidPlayerPhoto(savedPhoto)?savedPhoto:makePlayerAvatarData(catalog.arham[0],catalog.arham[2]);}
      const cardRarityMap=Object.fromEntries((data.cardCatalog||[]).map(card=>[card.id,card.rarity]));
      const rarityFor=id=>cardRarityMap[id]||(["messi","ronaldo","figo"].includes(id)?"ICON":"ELITE");
      const makeCard=(p,extraClass="")=>{
        const info=catalog[p.id]||[p.name,p.ovr,p.position,p.country,p.flag,"",{},"Club unverified","Needs verification"];
        const card=document.createElement("article");
        card.className="apex-player-card draft-player-card "+(p.rarity==="ICON"?"icon ":p.rarity==="GAME CHANGERS"?"game-changers ":"elite ")+(extraClass||"");
        card.dataset.player=p.id||"";
        card.dataset.rarity=String(p.rarity||"ELITE").toLowerCase().replace(/[^a-z0-9-]/g,"-");
        const portrait=document.createElement("div");portrait.className="apex-card-portrait";
        const photo=document.createElement("img");if(isValidPlayerPhoto(info[5])&&!String(info[5]).startsWith("data:image/svg+xml"))photo.src=info[5];photo.alt=info[0]+" player portrait";photo.loading="lazy";photo.referrerPolicy="no-referrer";
        photo.onerror=()=>{if(photo.dataset.wikiResolved==="true"){showMissingWikiPhoto(photo,info[0]);return;}if(photo.dataset.sourceRetry!=="true"){const alternate=rosterPhotoUrls[normalizePlayerName(info[0])];if(alternate&&photo.src!==alternate){photo.dataset.sourceRetry="true";photo.src=alternate;return;}}hydrateWikiPortrait(photo,info[0],info[2]);};
        if(!isValidPlayerPhoto(info[5])){photo.dataset.needsWiki="true";}
        portrait.appendChild(photo);
        if(photo.dataset.needsWiki==="true")hydrateWikiPortrait(photo,info[0],info[2]);
        const foil=document.createElement("div");foil.className="apex-card-foil";
        const top=document.createElement("div");top.className="apex-card-top";
        const ratingGroup=document.createElement("div");ratingGroup.className="apex-card-rating-group";
        const rating=document.createElement("strong");rating.className="apex-card-rating";rating.textContent=Number(p.ovr||info[1])+Number(p.level||0);
        const ratingLabel=document.createElement("small");ratingLabel.className="apex-card-rating-label";ratingLabel.textContent="OVR";
        ratingGroup.append(rating,ratingLabel);
        const position=document.createElement("span");position.className="apex-card-position";position.textContent=p.position||info[2];
        top.append(ratingGroup,position);
        const rarity=document.createElement("span");rarity.className="apex-card-rarity";
        rarity.textContent=p.rarity==="ICON"?"ICON":(p.rarity||"ELITE").toUpperCase();
        const crest=document.createElement("span");crest.className="apex-card-crest";crest.textContent="A";
        const footer=document.createElement("div");footer.className="apex-card-footer";
        const name=document.createElement("strong");name.className="apex-card-name";name.textContent=info[0];
        const country=document.createElement("small");country.className="apex-card-country";
        const flagMap={SA:"🇸🇦",AR:"🇦🇷",PT:"🇵🇹",FR:"🇫🇷",ES:"🇪🇸",NO:"🇳🇴",EN:"🏴",EG:"🇪🇬",BE:"🇧🇪",BR:"🇧🇷",HR:"🇭🇷",KR:"🇰🇷",PL:"🇵🇱",SE:"🇸🇪",UY:"🇺🇾",WA:"🏴",DE:"🇩🇪"};
        country.textContent=(flagMap[info[4]]||"⚽")+"  "+info[3];
        const club=document.createElement("small");club.className="apex-card-club";club.textContent=info[7]||"Club unverified";
        const playerStatus=document.createElement("small");playerStatus.className="apex-card-status";playerStatus.textContent=info[8]||"Needs verification";
        const stats=document.createElement("div");stats.className="apex-card-stats";
        const statData=info[6]||{};
        ["PAC","SHO","PAS","DRI","DEF","PHY"].forEach(label=>{
          const item=document.createElement("span");item.className="apex-card-stat";
          const value=document.createElement("strong");value.textContent=Number(statData[label]||Math.max(45,Number(p.ovr||info[1])-8));
          const key=document.createElement("small");key.textContent=label;item.append(value,key);stats.appendChild(item);
        });
        const brand=document.createElement("small");brand.className="apex-card-brand";brand.textContent="APEX STRIKERS · PLAYER ITEM";
        footer.append(name,country,club,playerStatus,stats,brand);
        card.append(portrait,foil,top,rarity,crest,footer);
        card.setAttribute("tabindex","0");
        card.setAttribute("role","button");
        card.setAttribute("aria-label","Tap to view "+info[0]+" stats");
        card.addEventListener("click",event=>{if(event.target.closest(".draft-select-btn"))return;const expanded=card.classList.toggle("show-stats");card.setAttribute("aria-expanded",String(expanded));});
        card.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();const expanded=card.classList.toggle("show-stats");card.setAttribute("aria-expanded",String(expanded));}});
        return card;
      };
      const renderPoolACards=()=>{
        const grid=$("poolACards"),count=$("poolACount");if(!grid)return;
        const pool=Array.isArray(draftPools.poolA)?draftPools.poolA.slice().sort((a,b)=>(Number(b.ovr)||0)-(Number(a.ovr)||0)||String(a.name).localeCompare(String(b.name))):[];
        grid.replaceChildren();
        if(count)count.textContent=pool.length+" PLAYERS";
        if(!pool.length){const empty=document.createElement("p");empty.className="pool-a-empty";empty.textContent="Pool A player list is unavailable. Refresh the Draft Room while online.";grid.appendChild(empty);return;}
        pool.forEach((player,index)=>{
          const card=makeCard(player,"pool-a-gallery-card");
          card.dataset.poolRank=String(index+1);
          card.setAttribute("aria-label","Pool A player "+(index+1)+": "+player.name+", "+player.ovr+" overall. Tap to show all attributes.");
          grid.appendChild(card);
        });
      };
      renderPoolACards();
      const showSigningReveal=(pick,onContinue=null,walkoutOptions={})=>{
        const isTenPack=walkoutOptions.tenPack===true;
        const info=catalog[pick.id]||[pick.name,pick.ovr,pick.position,pick.country,pick.flag,"",{},"Club unverified"];
        const name=String(info[0]||pick.name||"PLAYER"),club=String(info[7]||pick.club||"Club unverified"),careerStatus=String(info[8]||"Needs verification"),countryName=String(info[3]||pick.country||"COUNTRY"),positionName=String(pick.position||info[2]||"PLAYER");
        const flagMap={SA:"🇸🇦",AR:"🇦🇷",PT:"🇵🇹",FR:"🇫🇷",ES:"🇪🇸",NO:"🇳🇴",EN:"🏴",EG:"🇪🇬",BE:"🇧🇪",BR:"🇧🇷",HR:"🇭🇷",KR:"🇰🇷",PL:"🇵🇱",SE:"🇸🇪",UY:"🇺🇾",WA:"🏴",DE:"🇩🇪",IT:"🇮🇹",NL:"🇳🇱",SU:"☭"};
        const overlay=document.createElement("div");overlay.className="apex-signing-overlay apex-fullscreen-walkout apex-walkout-cinema";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-label","Player pack cinematic reveal");
        const stage=document.createElement("div");stage.className="apex-signing-stage apex-fullscreen-stage apex-cinema-stage";
        const stadium=document.createElement("div");stadium.className="walkout-stadium";const roof=document.createElement("div");roof.className="walkout-roof";const crowd=document.createElement("div");crowd.className="walkout-crowd";const pitch=document.createElement("div");pitch.className="walkout-pitch";const spotlight=document.createElement("div");spotlight.className="walkout-spotlight";const flash=document.createElement("div");flash.className="walkout-flash";
        const top=document.createElement("div");top.className="walkout-cinema-top";top.innerHTML="<span>APEX STRIKERS</span><span>"+(isTenPack?"10-PLAYER DRAFT · BEST SIGNING":"ULTIMATE PLAYER PACK")+"</span><span>"+(isTenPack?"BEST OF 10":"01 / 01")+"</span>";
        const kicker=document.createElement("p");kicker.className="walkout-cinema-kicker";kicker.textContent=isTenPack?"YOUR HIGHEST-RATED PLAYER IS WALKING OUT":"A NEW LEGEND ENTERS THE ARENA";const phase=document.createElement("div");phase.className="walkout-phase";phase.textContent="THE REVEAL";
        const headline=document.createElement("h2");headline.className="walkout-headline";headline.textContent="WHO'S THE PLAYER?";const detail=document.createElement("div");detail.className="walkout-identity";
        const makeReveal=(cls,label,value)=>{const el=document.createElement("div");el.className=cls+" walkout-reveal-line";const small=document.createElement("span");small.className="walkout-mini-label";small.textContent=label;const strong=document.createElement("strong");strong.textContent=value;el.append(small,strong);return el;};
        const country=makeReveal("walkout-country","NATIONALITY",(flagMap[info[4]]||"🌍")+"  "+countryName),team=makeReveal("walkout-team","CLUB / TEAM",club),status=makeReveal("walkout-status","PLAYER STATUS",careerStatus),position=makeReveal("walkout-position","POSITION",positionName);
        const silhouette=document.createElement("div");silhouette.className="walkout-player-silhouette";silhouette.innerHTML="<span></span><i></i><b>?</b>";
        const card=makeCard(pick,"signing-hero-card walkout-final-card");card.hidden=true;const reward=document.createElement("div");reward.className="walkout-reward-stamp";reward.textContent=pick.duplicate?(pick.upgraded?"DUPLICATE · LEVEL "+pick.level:"DUPLICATE PLAYER"):"NEW PLAYER SIGNED";
        const close=document.createElement("button");close.type="button";close.className="apex-signing-continue walkout-continue";close.textContent=onContinue?"SEE OTHER 9 PLAYERS  ↗":"CLAIM PLAYER  ↗";close.addEventListener("click",()=>{overlay.remove();if(typeof onContinue==="function")onContinue();});const skip=document.createElement("button");skip.type="button";skip.className="walkout-skip-btn";skip.textContent="SKIP WALKOUT";skip.setAttribute("aria-label",isTenPack?"Skip the best-player walkout and reveal the card":"Skip player walkout and reveal the card");
        const footer=document.createElement("div");footer.className="walkout-cinema-footer";footer.textContent=isTenPack?"BEST PLAYER FROM YOUR 10-PACK · 9 MORE WAITING":"ONE PACK. ONE PLAYER. YOUR NEXT CHAPTER.";
        detail.append(country,team,status,position);stage.append(stadium,roof,crowd,pitch,spotlight,flash,top,kicker,phase,headline,detail,silhouette,card,reward,skip,close,footer);overlay.appendChild(stage);document.body.appendChild(overlay);
        const walkoutTimers=[];
        const later=(fn,delay)=>walkoutTimers.push(window.setTimeout(fn,delay));
        const finishWalkout=()=>{walkoutTimers.splice(0).forEach(timer=>clearTimeout(timer));stage.classList.add("walkout-final-reveal","walkout-gold-burst");phase.textContent="YOUR NEW SIGNING";headline.textContent=name.toUpperCase();silhouette.classList.add("walkout-silhouette-out");card.hidden=false;card.classList.add("walkout-card-visible");reward.classList.add("walkout-card-visible");skip.hidden=true;close.classList.add("walkout-card-visible");close.focus();};
        skip.addEventListener("click",finishWalkout);
        const reveal=(label,node,delay)=>later(()=>{phase.textContent=label;headline.textContent=label;[country,team,status,position].forEach(el=>el.classList.remove("walkout-line-active"));node.classList.add("walkout-line-active");stage.dataset.reveal=label.toLowerCase().replace(/[^a-z]+/g,"-");},delay);
        later(()=>overlay.classList.add("walkout-cinema-start"),120);
        later(()=>{phase.textContent="THE STADIUM GOES DARK";headline.textContent="ONE PLAYER. ONE MOMENT.";stage.classList.add("walkout-power-up");},900);
        reveal("NATIONALITY",country,2500);reveal("CLUB / TEAM",team,4300);reveal("PLAYER STATUS",status,6100);reveal("POSITION",position,7900);
        later(()=>{phase.textContent="THE CROWD ERUPTS";headline.textContent="A NEW ERA BEGINS";stage.classList.add("walkout-crowd-eruption");},5200);
        later(()=>{phase.textContent="LIGHTS ON";headline.textContent="REVEALING YOUR SIGNING";stage.classList.add("walkout-final-flash");},6100);
        later(finishWalkout,7600);
      };
      const choices=$("apexDraftChoices");
      const renderDraft=draft=>{choices.replaceChildren();if(!draft||!draft.id)return;selectedDraftEvent=draft.eventId==="game-changers"?"game-changers":"apex-ascension";panel.querySelectorAll("[data-draft-event]").forEach(btn=>btn.classList.toggle("selected",btn.dataset.draftEvent===selectedDraftEvent));const heading=document.createElement("h4");heading.className="draft-choice-heading";heading.textContent=(selectedDraftEvent==="game-changers"?"GAME CHANGERS":"APEX ASCENSION")+" · MYSTERY PLAYER PACK";const note=document.createElement("p");note.className="draft-mystery-note";note.textContent="One player is sealed inside. No previews. No choices. The identity stays hidden until the final reveal.";const open=document.createElement("button");open.type="button";open.className="draft-open-pack-btn";open.textContent="⚡ OPEN MY PLAYER PACK";open.addEventListener("click",async()=>{open.disabled=true;open.textContent="OPENING PACK...";$("apexPackStatus").textContent="The stadium is going dark...";try{const result=await api("/api/store/draft/choose",{method:"POST",body:JSON.stringify({draftId:draft.id})});$("apexPackStatus").textContent=result.pick.duplicate?(result.pick.upgraded?"DUPLICATE SIGNED · CARD UPGRADED!":"DUPLICATE SIGNED · MAX LEVEL"):"NEW PLAYER SIGNED · "+result.pick.name.toUpperCase();updateTopGemBalance(result.gems);showSigningReveal(result.pick);await loadApexStore();}catch(error){$("apexPackStatus").textContent=error.message;open.disabled=false;open.textContent="TRY OPENING AGAIN";}});choices.append(heading,note,open);choices.dataset.pickCount="1";};
      if(data.activeDraft&&data.activeDraft.expiresAt>Date.now()&&data.activeDraft.draftVersion===4)renderDraft(data.activeDraft);
      panel.querySelectorAll("[data-draft-event]").forEach(btn=>btn.addEventListener("click",()=>{selectedDraftEvent=btn.dataset.draftEvent;panel.querySelectorAll("[data-draft-event]").forEach(item=>item.classList.toggle("selected",item===btn));choices.replaceChildren();renderDraftOdds(selectedDraftEvent);renderDraftPity(selectedDraftEvent);$("apexPackStatus").textContent=selectedDraftEvent==="game-changers"?"GAME CHANGERS POOL SELECTED · 10 SPECIAL PLAYERS":"APEX ASCENSION POOL SELECTED · UP TO 200 PLAYERS";$("startPlayerDraft").querySelector("strong").textContent="ENTER "+(selectedDraftEvent==="game-changers"?"GAME CHANGERS":"APEX ASCENSION")+" DRAFT";}));
      const buyVouchers=async(quantity,button)=>{button.disabled=true;$("apexPackStatus").textContent="Adding "+quantity+" draft vouchers...";try{const result=await api("/api/store/vouchers/buy",{method:"POST",body:JSON.stringify({quantity})});updateTopGemBalance(result.gems);$("apexPackStatus").textContent=quantity+" DRAFT VOUCHERS ADDED!";await loadApexStore();}catch(error){$("apexPackStatus").textContent=error.message;button.disabled=false;}};
      $("buyDraftVoucher").addEventListener("click",()=>buyVouchers(1,$("buyDraftVoucher")));
      $("buyTenDraftVouchers").addEventListener("click",()=>buyVouchers(10,$("buyTenDraftVouchers")));
      $("openTenDrafts").addEventListener("click",async()=>{const button=$("openTenDrafts");button.disabled=true;$("apexPackStatus").textContent="Opening 10 player packs...";try{const result=await api("/api/store/draft/open-ten",{method:"POST",body:JSON.stringify({eventId:selectedDraftEvent})});$("apexVoucherCount").textContent="◇ "+result.draftVouchers+" DRAFT VOUCHERS";updateCareerVoucherBalance(result.draftVouchers);$("apexDraftChoices").replaceChildren();const reveal=$("apexPackReveal");reveal.replaceChildren();const picks=Array.isArray(result.picks)?result.picks:[];const bestIndex=picks.reduce((best,pick,index)=>!picks[best]||(Number(pick.ovr)||0)>(Number(picks[best].ovr)||0)?index:best,-1);const bestPick=picks[bestIndex];const showOtherNine=()=>{reveal.replaceChildren();picks.forEach((pick,index)=>{if(index===bestIndex)return;const card=makeCard(pick,"draft-ten-result-card");card.dataset.draftNumber=String(index+1);reveal.appendChild(card);});reveal.scrollIntoView({behavior:"smooth",block:"start"});};$("apexPackStatus").textContent="10 PLAYERS SIGNED · BEST OVR "+(bestPick?bestPick.ovr:"--")+" · "+picks.filter(p=>!p.duplicate).length+" NEW · "+picks.filter(p=>p.duplicate).length+" DUPLICATES";const pity=result.draftPity||{};draftPity[selectedDraftEvent]=pity[selectedDraftEvent]||{};renderDraftPity(selectedDraftEvent);syncOwnedCardsToRoster(result.ownedCards,data.cardCatalog);reveal.scrollIntoView({behavior:"smooth",block:"start"});if(bestPick)showSigningReveal(bestPick,showOtherNine,{tenPack:true});else showOtherNine();}catch(error){$("apexPackStatus").textContent=error.message;}finally{button.disabled=false;}});
      $("startPlayerDraft").addEventListener("click",async()=>{const button=$("startPlayerDraft");button.querySelector("strong").textContent="ENTER "+(selectedDraftEvent==="game-changers"?"GAME CHANGERS":"APEX ASCENSION")+" DRAFT";button.disabled=true;$("apexPackStatus").textContent="The draft room is opening...";try{const result=await api("/api/store/draft/start",{method:"POST",body:JSON.stringify({eventId:selectedDraftEvent})});$("apexVoucherCount").textContent="◇ "+result.draftVouchers+" DRAFT VOUCHERS";updateCareerVoucherBalance(result.draftVouchers);$("apexPackStatus").textContent="ONE SEALED PLAYER. THE REVEAL IS YOURS.";renderDraft(result.draft);}catch(error){$("apexPackStatus").textContent=error.message;}finally{button.disabled=false;}});
    }catch(error){$("apexPackStatus").textContent="Draft Room unavailable: "+error.message;}
  }
  if($("careerMarketBtn"))$("careerMarketBtn").addEventListener("click",async()=>{const panel=$("featuredMarketPanel");if(panel){panel.scrollIntoView({behavior:"smooth",block:"start"});}await loadApexStore();});
  loadApexStore();
  let apexLeaderboardTimer=null,apexLeaderboardLoading=false;
  let apexLeaderboardData=[],apexLeaderboardVisible=5000;
  function drawApexLeaderboard(boardBox,updatedAt){
    boardBox.replaceChildren();
    const rows=apexLeaderboardData.slice(0,apexLeaderboardVisible);
    const summary=document.createElement("p");summary.className="apex-leaderboard-summary";summary.textContent="SHOWING "+rows.length+" OF "+apexLeaderboardData.length+" REGISTERED PLAYERS · GLOBAL LEADERBOARD";boardBox.appendChild(summary);
    const list=document.createElement("div");list.className="apex-leaderboard-list";
    rows.forEach(p=>{const row=document.createElement("p");row.className="apex-leaderboard-row";const rank=document.createElement("strong");rank.textContent="#"+p.rank;const details=document.createElement("span");details.textContent=p.name+" · "+p.wins+" wins · "+p.xp+" XP";row.append(rank,details);list.appendChild(row);});
    if(!rows.length){const empty=document.createElement("p");empty.textContent="No players have joined the leaderboard yet.";list.appendChild(empty);}
    boardBox.appendChild(list);
    if(apexLeaderboardVisible<apexLeaderboardData.length){const more=document.createElement("button");more.type="button";more.className="leaderboard-more-btn";more.textContent="LOAD NEXT "+Math.min(50,apexLeaderboardData.length-apexLeaderboardVisible)+" PLAYERS";more.addEventListener("click",()=>{apexLeaderboardVisible=Math.min(50000,apexLeaderboardVisible+50);drawApexLeaderboard(boardBox,updatedAt);});boardBox.appendChild(more);}
    const stamp=document.createElement("small");stamp.className="apex-leaderboard-updated";stamp.textContent="UPDATED "+(updatedAt?new Date(updatedAt).toLocaleTimeString():"JUST NOW")+" · AUTO-REFRESHES EVERY 60 SECONDS";boardBox.appendChild(stamp);
  }
  async function refreshApexLeaderboard(){const boardBox=$("apexLeaderboard");if(!boardBox||!onlineCfg.base||!onlineCfg.token||apexLeaderboardLoading)return;apexLeaderboardLoading=true;try{const boardData=await api("/api/leaderboard?limit=50000",{cache:"no-store"});apexLeaderboardData=(boardData.leaderboard||[]).slice(0,50000);apexLeaderboardVisible=Math.max(5000,Math.min(50000,apexLeaderboardVisible));drawApexLeaderboard(boardBox,boardData.updatedAt);}catch(error){const note=document.createElement("small");note.className="apex-leaderboard-updated";note.textContent="Could not refresh leaderboard. Will retry in 60 seconds.";if(boardBox&&!boardBox.querySelector(".apex-leaderboard-updated"))boardBox.appendChild(note);}finally{apexLeaderboardLoading=false;}}
  function startApexLeaderboardRefresh(){if(apexLeaderboardTimer)return;apexLeaderboardTimer=setInterval(()=>{if(!document.hidden)refreshApexLeaderboard();},60000);}
  async function loadApexLiveHub(){
    const eventBox=$("apexEvents"),modal=$("eventsModal");
    const localEvents=[
      {id:"game-changers",title:"GAME CHANGERS",subtitle:"ICON REBORN",type:"FEATURED",description:"Win the event to sign a featured Game Changers player, plus gems and XP.",mode:"vsattack",rewardGems:45,rewardXp:300,rewardPlayer:"1 GAME CHANGERS PLAYER"},
      {id:"apex-ascension",title:"APEX ASCENSION",subtitle:"200 LEGENDS. ONE THRONE.",type:"ULTIMATE EVENT",description:"Enter the ultimate showdown. Pick up one player from a 200-player event pool, plus 100 gems and 750 XP.",mode:"vsattack",rewardGems:100,rewardXp:750,rewardPlayer:"1 OF 200 PLAYERS",playerCount:200},
      {id:"neon-derby",title:"NEON DERBY",subtitle:"LIGHTS. CROWD. KICK-OFF.",type:"WEEKLY",description:"Hit the target in a high-energy crossbar challenge.",mode:"crossbar",rewardGems:25,rewardXp:180},
      {id:"last-line",title:"LAST LINE",subtitle:"THE WALL NEVER FALLS",type:"DAILY",description:"Read the shot and protect your goal in the keeper challenge.",mode:"goalkeeping",rewardGems:15,rewardXp:90}
    ];
    let events=[localEvents[1],localEvents[0],...localEvents.slice(2)];
    if(onlineCfg.base&&onlineCfg.token){
      try{
        const eventData=await api("/api/events");
        if(Array.isArray(eventData.events)&&eventData.events.some(e=>["game-changers","apex-ascension","neon-derby","last-line"].includes(e.id)))events=eventData.events;
        events=[...events].sort((a,b)=>(a.id==="apex-ascension"?-1:b.id==="apex-ascension"?1:0));
        const featured=events.find(e=>e.id==="apex-ascension")||localEvents[1];
        if($("featuredEventTitle"))$("featuredEventTitle").textContent=featured.title+": "+(featured.subtitle||"");
        if($("featuredEventSubtitle"))$("featuredEventSubtitle").textContent=featured.description;
        if($("featuredEventReward"))$("featuredEventReward").textContent=featured.playerCount+" PLAYERS · "+featured.rewardGems+" GEMS + "+featured.rewardXp+" XP";
      }catch(_){}
    }
    const enterEvent=event=>{const allowed=["vsattack","crossbar","goalkeeping"];if(!event||!allowed.includes(event.mode)){toast("This event is being prepared. Please try another challenge.");return;}if(modal)modal.classList.add("hidden");pendingApexEventId=event.id;startMode(event.mode);$("controlHeading").textContent=event.title+" · "+(event.subtitle||"EVENT");$("controlText").textContent=event.description+" Complete the challenge to earn the event reward.";toast(event.title+" EVENT STARTED");};
    if($("featuredEventPlay"))$("featuredEventPlay").onclick=()=>enterEvent(events.find(e=>e.id==="apex-ascension")||localEvents[1]);
    if(eventBox){
      eventBox.replaceChildren();
      events.forEach((event,index)=>{
        const card=document.createElement("article");card.className="apex-event-card event-"+(event.id||"unknown")+(index===0?" featured":"");
        const art=document.createElement("div");art.className="apex-event-art "+(event.id||"");art.setAttribute("aria-hidden","true");art.textContent=event.id==="game-changers"?"GC":event.id==="apex-ascension"?"AA":event.id==="neon-derby"?"ND":"LL";
        const badge=document.createElement("span");badge.className="apex-event-badge";badge.textContent=String(event.type||"LIMITED EVENT").toUpperCase();
        const title=document.createElement("h3");title.textContent=event.title;
        const subtitle=document.createElement("strong");subtitle.className="apex-event-subtitle";subtitle.textContent=event.subtitle||"LIMITED-TIME CHALLENGE";
        const desc=document.createElement("p");desc.textContent=event.description;
        const rewards=document.createElement("div");rewards.className="apex-event-rewards";rewards.textContent="◇ "+event.rewardGems+" GEMS   ·   "+event.rewardXp+" XP"+(event.rewardPlayer?"   ·   "+event.rewardPlayer:"")+(event.playerCount?"   ·   "+event.playerCount+" PLAYER POOL":"");
        const button=document.createElement("button");button.type="button";button.className="primary-btn apex-event-play";button.textContent="ENTER EVENT";
        button.addEventListener("click",()=>enterEvent(event));
        card.append(art,badge,title,subtitle,desc,rewards,button);eventBox.appendChild(card);
      });
    }
    const open=$("viewEventsBtn"),careerOpen=$("careerViewEventsBtn"),close=$("closeEventsBtn");
    if(open&&!open.dataset.bound){open.dataset.bound="1";open.addEventListener("click",()=>{if(modal)modal.classList.remove("hidden");});}if(careerOpen&&!careerOpen.dataset.bound){careerOpen.dataset.bound="1";careerOpen.addEventListener("click",()=>{if(modal)modal.classList.remove("hidden");});}
    if(close&&!close.dataset.bound){close.dataset.bound="1";close.addEventListener("click",()=>{if(modal)modal.classList.add("hidden");});}
    if(modal&&!modal.dataset.bound){modal.dataset.bound="1";modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.add("hidden");});}
    await refreshApexLeaderboard();
  }
  async function refreshServerFriends(){const d=await api("/api/friends");for(const p of d.friends||[]){const f=savedFriends.find(x=>x.id===p.id);if(f)Object.assign(f,p);else savedFriends.push(p);}try{localStorage.setItem("eclipseFriends",JSON.stringify(savedFriends));}catch(_){}renderFriends();}
  async function connectOnline(){if(!onlineCfg.base){setServerStatus("Offline mode · online server has not been deployed/configured yet.");return;}if(!/^https:\/\//i.test(onlineCfg.base)){setServerStatus("Blocked: backend configuration must use HTTPS.");return;}setServerStatus("Connecting…");onlineAccountApproved=false;try{const d=await api("/api/register",{method:"POST",body:JSON.stringify({profile:onlineProfile(),deviceKey:onlineCfg.deviceKey})});if(d.token){onlineCfg.token=d.token;try{localStorage.setItem("eclipseDeviceToken",d.token);}catch(_){}}try{localStorage.setItem("eclipsePlayerId",d.playerId);}catch(_){}playerId=d.playerId;if($("myPlayerId"))$("myPlayerId").textContent=d.playerId;onlineAccountApproved=true;await api("/api/profile",{method:"PUT",body:JSON.stringify({profile:onlineProfile()})});try{const ownedStore=await api("/api/store");syncOwnedCardsToRoster(ownedStore.ownedCards,ownedStore.cardCatalog);}catch(_){}refreshTopGemBalance();refreshCareerVoucherBalance();const sc=document.createElement("script");sc.src=onlineCfg.base+"/socket.io/socket.io.js";sc.onload=()=>{if(!window.io){setServerStatus("Server connected, but live socket client did not load.");return;}if(onlineCfg.socket)onlineCfg.socket.disconnect();onlineCfg.socket=window.io(onlineCfg.base,{auth:{playerId:d.playerId,token:onlineCfg.token},transports:["websocket","polling"]});onlineCfg.socket.on("connect",()=>{setServerStatus("🟢 ONLINE · "+d.playerId);});onlineCfg.socket.on("connect_error",e=>{setServerStatus("Socket connection error: "+e.message);});onlineCfg.socket.on("friend:status",e=>{setFriendStatus(e.playerId+" is "+(e.online?"online":"offline"));});onlineCfg.socket.on("friend:invite",invite=>{if(confirm(invite.fromName+" invited you to a friend match. Accept?")){onlineCfg.roomId=invite.roomId;onlineCfg.socket.emit("match:accept",{roomId:invite.roomId});}else onlineCfg.socket.emit("match:decline",{roomId:invite.roomId});});onlineCfg.socket.on("match:ready",e=>{onlineCfg.roomId=e.roomId;onlineCfg.onlineMatch=true;onlineCfg.matchStartAt=Number(e.startAt)||Date.now();setFriendStatus("🟢 Online match connected! Shared 90-second match started.");startMode("headtohead");});onlineCfg.socket.on("match:state",e=>{if(!onlineCfg.onlineMatch||e.roomId!==onlineCfg.roomId||!e.state)return;const st=e.state;if(Number.isFinite(Number(e.serverClock)))match.clock=Math.max(match.clock,Number(e.serverClock));if(Number.isFinite(st.x)&&Number.isFinite(st.y)){match.rival={x:Math.max(.08,Math.min(.92,st.x)),y:Math.max(.06,Math.min(.94,1-st.y))};match.rivalGoals=Math.max(0,Math.min(99,Number(st.goals)||0));match.hasBall=!Boolean(st.hasBall);if(Number.isFinite(Number(st.ballX))&&Number.isFinite(Number(st.ballY)))match.ball={x:Math.max(.02,Math.min(.98,Number(st.ballX))),y:Math.max(.02,Math.min(.98,1-Number(st.ballY)))};$("matchScore").textContent=match.playerGoals+" - "+match.rivalGoals;drawPitch();}});onlineCfg.socket.on("match:finished",e=>{const mine=(e.players||[]).find(p=>p.playerId===playerId),other=(e.players||[]).find(p=>p.playerId!==playerId);if(mine&&other){match.playerGoals=Number(mine.goals)||0;match.rivalGoals=Number(other.goals)||0;$("matchScore").textContent=match.playerGoals+" - "+match.rivalGoals;}onlineCfg.onlineMatch=false;onlineCfg.matchStartAt=0;if(match.active)endFullMatch();setFriendStatus("🏁 Match finished. Final score: "+match.playerGoals+" - "+match.rivalGoals);});onlineCfg.socket.on("match:ended",e=>{onlineCfg.onlineMatch=false;setFriendStatus("Friend match ended: "+(e.message||e.reason||"connection closed"));});onlineCfg.socket.on("match:error",e=>{setFriendStatus(e.message);});};sc.onerror=()=>{setServerStatus("Server API connected, but Socket.IO client could not load.");};document.head.appendChild(sc);await refreshServerFriends();await loadApexLiveHub();startApexLeaderboardRefresh();}catch(e){setServerStatus("Could not connect: "+e.message);}}
  if($("connectServerBtn"))$("connectServerBtn").addEventListener("click",connectOnline);
  if($("saveNicknameBtn"))$("saveNicknameBtn").addEventListener("click",async()=>{const name=currentDisplayName();if(!nicknameInput||!name||name==="Eclipse Player"&&!nicknameInput.value.trim()){setServerStatus("Enter a name first.");return;}const p=readSavedProfile();p.name=name;if(!writeSavedProfile(p)){setServerStatus("Could not save name; browser storage may be full or blocked.");return;}try{await api("/api/profile",{method:"PUT",body:JSON.stringify({profile:onlineProfile()})});setServerStatus("Name saved on this device and online.");}catch(e){setServerStatus("Name saved on this device. Online sync unavailable.");}});
  if($("copyPlayerIdBtn"))$("copyPlayerIdBtn").addEventListener("click",()=>{const value=localStorage.getItem("eclipsePlayerId")||playerId;if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(value).then(()=>toast("Player ID copied")).catch(()=>{setFriendStatus("Select and copy your ID manually: "+value);});else{setFriendStatus("Select and copy your ID manually: "+value);}});
  if($("showProfileCodeBtn"))$("showProfileCodeBtn").addEventListener("click",()=>{const profile={id:playerId,name:currentDisplayName(),xp:career.xp,goals:career.goals,saves:career.saves,wins:career.tournamentWins,best:career.bestScore,ovr:Math.min(99,92+Math.floor(career.xp/500))};$("profileShareCode").value=btoa(unescape(encodeURIComponent(JSON.stringify(profile))));setFriendStatus("Send this profile code to your friend so they can compare progress.");});
  if($("addFriendBtn"))$("addFriendBtn").addEventListener("click",async()=>{const value=$("friendIdInput").value.trim(),id=value.toUpperCase(),own=localStorage.getItem("eclipsePlayerId")||playerId,isId=/^EA-[A-Z0-9]{3,8}-[A-Z0-9]{3,8}$/.test(id);if(!value){setFriendStatus("Enter a player name or EA player ID.");return;}if(isId&&id===own){setFriendStatus("That is your own ID.");return;}if(isId&&savedFriends.some(f=>f.id===id)){setFriendStatus("That friend is already on your list.");return;}if(!onlineCfg.base){setFriendStatus("Connect to the online server to find players by name or ID.");return;}try{const payload=isId?{friendId:id}:{friendName:value};const d=await api("/api/friends",{method:"POST",body:JSON.stringify(payload)});if(!savedFriends.some(f=>f.id===d.friend.id))savedFriends.push(d.friend);localStorage.setItem("eclipseFriends",JSON.stringify(savedFriends));setFriendStatus("Added "+d.friend.name+" to your friends!");$("friendIdInput").value="";renderFriends();await refreshServerFriends();}catch(e){setFriendStatus("Could not add friend: "+e.message);}});
  if($("compareFriendBtn"))$("compareFriendBtn").addEventListener("click",async()=>{if(onlineCfg.base&&onlineCfg.token){const id=$("friendIdInput").value.trim().toUpperCase()||$("friendCodeInput").value.trim().toUpperCase();if(id.startsWith("EA-")){try{const d=await api("/api/profiles/"+encodeURIComponent(id)),p=d.profile;setFriendStatus("ONLINE COMPARISON · You: "+career.xp+" XP, "+career.goals+" goals, "+career.saves+" saves. "+p.name+": "+p.xp+" XP, "+p.goals+" goals, "+p.saves+" saves.");return;}catch(e){setFriendStatus(e.message);return;}}}try{const raw=decodeURIComponent(escape(atob($("friendCodeInput").value.trim()))),p=JSON.parse(raw);if(!p.id||p.id===playerId)throw new Error("bad");let f=savedFriends.find(x=>x.id===p.id);if(!f){f={id:p.id,profile:p};savedFriends.push(f);}else f.profile=p;try{localStorage.setItem("eclipseFriends",JSON.stringify(savedFriends));}catch(_){}setFriendStatus("Progress comparison · You: "+career.xp+" XP, "+career.goals+" goals, "+career.saves+" saves, "+career.tournamentWins+" wins. Friend: "+(p.xp||0)+" XP, "+(p.goals||0)+" goals, "+(p.saves||0)+" saves, "+(p.wins||0)+" wins.");renderFriends();}catch(_){setFriendStatus("That profile code is invalid. Ask your friend to create and send their profile share code."); }});
  renderFriends();
  if(onlineCfg.base)connectPromise=connectOnline();else setServerStatus("Offline mode · backend URL is managed in repository configuration.");
  renderCareerHub();renderPlayers();

  function startMode(nextMode){
    const isRandomRush=nextMode==="random";
    if(isRandomRush){const choices=["penalty","freekick","longshot","goalkeeping","vsattack","crossbar","survival"];nextMode=choices[Math.floor(Math.random()*choices.length)];}
    mode=nextMode;shotTaken=false;ballAnim=null;keeperMotion=null;
    activeRewardSessionId=null;activeRewardSessionPromise=null;rewardClaimedThisGame=false;activeRewardEventId=pendingApexEventId;pendingApexEventId="";
    if(onlineCfg.base&&onlineCfg.token)activeRewardSessionPromise=api("/api/games/start",{method:"POST",body:JSON.stringify({mode,eventId:activeRewardEventId})}).then(data=>{activeRewardSessionId=data.sessionId;return data.sessionId;}).catch(error=>{activeRewardSessionId=null;activeRewardSessionPromise=null;toast("Online game session could not start: "+error.message);return null;});
    if(!isRandomRush){recentModes=[nextMode,...recentModes.filter(x=>x!==nextMode)].slice(0,5);try{localStorage.setItem("eclipseRecentModes",JSON.stringify(recentModes));}catch(_){}renderModeTools();}
    match.active=mode==="headtohead";match.finished=false;match.clock=0;match.playerGoals=0;match.rivalGoals=0;match.rankPoints=0;match.rank="ROOKIE III";match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.72};match.move="";match.moveX=0;match.moveY=0;match.sprint=false;match.hasBall=true;match.lastRivalShot=0;
    $("matchHud").classList.toggle("hidden",!match.active);$("matchControls").classList.toggle("hidden",!match.active);$("matchCameraControls").classList.toggle("hidden",!match.active);$("matchResult").classList.add("hidden");$("matchResult").textContent="";
    $("powerSlider").classList.toggle("hidden",match.active);$("powerSlider").disabled=match.active;$("shootBtn").classList.toggle("hidden",match.active);$("matchRank").textContent="ROOKIE III · 0 PTS";
    score=0;attempt=1;if(mode==="headtohead"||mode==="vsattack"){opponentScore=0;matchMinute=0;matchAttacks=0;}
    $("homeScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
    $("gameTitle").innerHTML=modeNames[mode]+" <em>MODE</em>";$("controlHeading").textContent=modeText[mode][0];$("controlText").textContent=modeText[mode][1];
    if(isRandomRush){$("gameTitle").innerHTML="RANDOM <em>RUSH</em>";$("controlHeading").textContent="Surprise challenge: "+modeNames[mode];$("controlText").textContent="Random Rush picked "+modeNames[mode]+". Finish the challenge, then try again for a different surprise.";}
    $("keeperPad").classList.toggle("hidden",mode!=="goalkeeping"&&mode!=="survival");
    $("shootBtn").classList.remove("hidden");$("shootBtn").innerHTML=(mode==="goalkeeping"||mode==="survival")?"DIVE / SAVE <span>↗</span>":"SHOOT <span>↗</span>";
    $("nextBtn").classList.add("hidden");$("aimTip").textContent=(mode==="goalkeeping"||mode==="survival")?"CHOOSE A DIVE · THEN SAVE THE SHOT":mode==="crossbar"?"AIM FOR THE CROSSBAR ZONE · THEN SHOOT":"TAP OR DRAG ON THE PITCH TO AIM";
    aim={x:.5,y:.27};keeperDive="center";keeperMotion=null;$("feedback").textContent="Ready when you are.";$("scoreValue").textContent=score;$("roundLabel").textContent="ATTEMPT "+String(attempt).padStart(2,"0");$("difficultyLabel").textContent=difficulty.toUpperCase()+" LEVEL";
    if(match.active){$("aimTip").textContent="MOVE YOUR PLAYER · PASS · TACKLE · SHOOT";$("roundLabel").textContent="KICK-OFF · 00:00";$("controlHeading").textContent="Play the full match";$("controlText").textContent="Use the touch controls to attack, defend and score.";resizeCanvas();startMatchLoop();}else{resizeCanvas();window.scrollTo({top:0,behavior:"smooth"});}
  }
  if($("featuredEventPlay"))$("featuredEventPlay").addEventListener("click",()=>startMode("vsattack"));
  function startMatchLoop(){
    cancelAnimationFrame(animationFrame);match.lastTick=performance.now();
    const tick=(now)=>{if(!match.active||match.finished)return;const dt=Math.min(.06,(now-match.lastTick)/1000);match.lastTick=now;if(onlineCfg.onlineMatch&&onlineCfg.matchStartAt){match.clock=Math.min(90,Math.max(0,(Date.now()-onlineCfg.matchStartAt)/1000));}else match.clock+=dt;
      if(match.clock>=90){match.clock=90;endFullMatch();return}
      const axisX=match.moveX||(match.move==="left"?-1:match.move==="right"?1:0);const axisY=match.moveY||(match.move==="up"?-1:match.move==="down"?1:0);const inputMagnitude=Math.min(1,Math.hypot(axisX,axisY));if(inputMagnitude>0){const worldX=axisX*68,worldY=axisY*105,worldLength=Math.hypot(worldX,worldY)||1,speed=match.sprint?9.2:6.4;match.player.x+=(worldX/worldLength*speed*inputMagnitude*dt)/68;match.player.y+=(worldY/worldLength*speed*inputMagnitude*dt)/105;}
      match.player.x=Math.max(.08,Math.min(.92,match.player.x));match.player.y=Math.max(.06,Math.min(.94,match.player.y));
      const dx=match.player.x-match.rival.x,dy=match.player.y-match.rival.y,worldDx=dx*68,worldDy=dy*105,dist=Math.hypot(worldDx,worldDy)||.001;if(!onlineCfg.onlineMatch){const rivalSpeed=4.8;match.rival.x+=worldDx/dist*rivalSpeed*dt/68;match.rival.y+=worldDy/dist*rivalSpeed*dt/105;}
      if(match.hasBall){match.ball.x=match.player.x;match.ball.y=match.player.y-.022}else{match.ball.x=match.rival.x;match.ball.y=match.rival.y-.022}
      if(!onlineCfg.onlineMatch&&match.clock-match.lastRivalShot>12){match.lastRivalShot=match.clock;if(Math.random()<.72){match.rivalGoals++;match.hasBall=false;match.player={x:.5,y:.72};match.rival={x:.5,y:.28};match.ball={x:.5,y:.28};$("feedback").textContent="RIVAL SCORES! Regain possession and fight back.";}}
      if(onlineCfg.onlineMatch&&onlineCfg.socket&&onlineCfg.socket.connected&&now-onlineCfg.lastStateAt>100){onlineCfg.lastStateAt=now;onlineCfg.socket.emit("match:state",{roomId:onlineCfg.roomId,state:{x:match.player.x,y:match.player.y,goals:match.playerGoals,hasBall:match.hasBall,ballX:match.ball.x,ballY:match.ball.y,clock:match.clock}});}
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
  function endFullMatch(){claimGameReward(score);match.active=false;match.finished=true;cancelAnimationFrame(animationFrame);updateRank();const outcome=match.playerGoals>match.rivalGoals?"WIN":match.playerGoals===match.rivalGoals?"DRAW":"LOSS";$("matchResult").classList.remove("hidden");$("matchResult").textContent="FULL TIME · "+match.playerGoals+" - "+match.rivalGoals+" · "+outcome+" · RANK "+match.rank;$("feedback").textContent=$("matchResult").textContent;$("roundLabel").textContent="FULL TIME";drawPitch();}
  function finishAttempt(success,message){
    shotTaken=true;
    
    const daily=dailyRecord();if(dailyChallengeActive&&mode===dailyChallengeMode&&!(daily.date===dateKey()&&daily.done)){try{localStorage.setItem("eclipseDailyChallenge",JSON.stringify({date:dateKey(),done:true,success:Boolean(success),mode}));}catch(_){}dailyChallengeActive=false;message+=" · DAILY CHALLENGE COMPLETED";renderCareerHub();}

    if(success)score+=mode==="goalkeeping"?150:100;
    if(mode==="vsattack"&&matchAttacks>=4)claimGameReward(score);
    if(mode==="headtohead"||mode==="vsattack"){
      matchAttacks++;
      if(mode==="headtohead"){matchMinute=Math.min(90,matchAttacks*10);if(Math.random()<.34)opponentScore++;}
      else if(Math.random()<.30)opponentScore++;
      message += "  |  "+(mode==="headtohead"?matchMinute+"'":"ATTACK "+matchAttacks+"/5")+" · YOU "+Math.floor(score/100)+" - "+opponentScore+" RIVAL";
    }
    $("scoreValue").textContent=mode==="headtohead"||mode==="vsattack"?Math.floor(score/100)+"-"+opponentScore:score;
    const careerLine=awardProgress(success);playCue(success?"goal":"save");if(success&&mode!=="goalkeeping"&&mode!=="survival")celebrationUntil=performance.now()+900;if(mode==="vsattack"&&matchAttacks>=5&&Math.floor(score/100)>opponentScore&&!tournamentActive){career.tournamentWins++;career.unlockWins=(career.unlockWins||0)+1;saveCareer();message+=" 🏆 VS ATTACK WON! Total wins: "+career.tournamentWins;}if(success&&mode!=="goalkeeping"&&mode!=="survival")message="🏆 "+message+"  ✨ GOAL CELEBRATION!";$("feedback").textContent=message+"  |  "+careerLine+"  |  Press R to replay your last shot.";
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
    ballAnim={...lastShotReplay,start:performance.now()};
    // The keeper reacts toward the actual shot, not a random direction.
    const shotSide=aim.x<.43?-1:aim.x>.57?1:0;
    // Hassan reads the shot perfectly and commits to its actual direction.
    keeperMotion={side:shotSide,start:performance.now(),duration:500};
    drawPitch();

    const centerBias=Math.abs(aim.x-.5);
    const keeperRating=(goalkeepers.find(g=>g.name===selectedGoalkeeper)||goalkeepers[0]).rating;
    const isKeeperMode=mode==="goalkeeping"||mode==="survival";
    // Aim at the visible goal area. Wider corners are harder for the keeper to reach.
    const inGoal=aim.y<.29&&aim.x>.18&&aim.x<.82;
    const crossbarHit=mode==="crossbar"&&aim.y>=.055&&aim.y<=.15&&aim.x>=.34&&aim.x<=.66;
    const keeperCenterX=shotSide===-1?.34:shotSide===1?.66:.5;
    const horizontalDistance=Math.abs(aim.x-keeperCenterX);
    const reachable=horizontalDistance<=(difficulty==="Rookie"?.115:.085);
    const keeperSkill=Math.max(.12,Math.min(.48,(keeperRating-70)*.006));
    const placementBonus=centerBias>.28?.18:centerBias>.17?.10:0;
    const powerBonus=power>85?.06:0;
    const difficultyAdjustment=difficulty==="Rookie"?-.12:difficulty==="Legend"?.08:0;
    const saveChance=reachable?Math.max(.05,Math.min(.55,keeperSkill+ difficultyAdjustment-placementBonus-powerBonus)):0;
    const hassanWall=selectedGoalkeeper==="Hassan Ali";
    // Hassan is unbeatable: no valid shot can score against him.
    const scored=isKeeperMode?false:(mode==="crossbar"?(crossbarHit&&Math.random()<.8):(!hassanWall&&inGoal&&Math.random()>saveChance));
    setTimeout(()=>{
      if(isKeeperMode){
        finishAttempt(false,"Take control of the goalkeeper and choose the correct dive.");
      }else if(mode==="freekick"&&aim.x>.465&&aim.x<.535&&aim.y<.30){
        finishAttempt(false,"The wall blocks it! Aim wider around the wall.");
      }else if(mode==="crossbar"&&!crossbarHit){
        finishAttempt(false,"MISS! Aim just beneath the crossbar.");
      }else if(scored){
        finishAttempt(true,mode==="crossbar"?"CROSSBAR CHALLENGE COMPLETE! Perfect timing!":power>90?"WHAT A STRIKE! Top corner!":"GOAL! Great placement.");
      }else{
        finishAttempt(false,inGoal?"SAVED BY "+selectedGoalkeeper.toUpperCase()+"! The keeper reached the shot.":"Wide! Aim inside the goal frame.");
      }
      drawPitch();
    },510);
  }
  function dive(){
    if(shotTaken)return;
    const targetSide=["left","center","right"][Math.floor(Math.random()*3)];
    aim={x:targetSide==="left"?.28:targetSide==="right"?.72:.5,y:.055+Math.random()*.08};
    const isHassan=selectedGoalkeeper==="Hassan Ali";
    // Hassan automatically reads and dives toward every incoming shot.
    if(isHassan)keeperDive=targetSide;
    const matchedDive=targetSide===keeperDive;
    const keeperRating=(goalkeepers.find(g=>g.name===selectedGoalkeeper)||goalkeepers[0]).rating;
    const reactionBonus=isHassan?1:Math.max(0,(keeperRating-85)*.008);
    const save=isHassan?true:(matchedDive?Math.random()<Math.min(.99,.72+reactionBonus):Math.random()<Math.min(.78,.08+reactionBonus+(difficulty==="Rookie"?.12:0)));
    ballAnim={fromX:cw*.5,fromY:ch*.28,toX:aim.x*cw,toY:aim.y*ch,start:performance.now(),duration:430};keeperMotion={side:isHassan?(targetSide==="left"?-1:targetSide==="right"?1:0):(keeperDive==="left"?-1:keeperDive==="right"?1:0),start:performance.now(),duration:430};drawPitch();
    setTimeout(()=>{finishAttempt(save,save?"INCREDIBLE SAVE! "+selectedGoalkeeper+" reads the shot!":"GOAL CONCEDED. Read the direction next time.");drawPitch()},450);
  }
  function nextAttempt(){
    if(mode==="vsattack"&&matchAttacks>=5&&tournamentActive){
      const won=Math.floor(score/100)>opponentScore;if(won)tournamentWinsThisRun++;
      if(won&&tournamentWinsThisRun>=3){tournamentActive=false;career.tournamentWins++;career.unlockWins=(career.unlockWins||0)+1;saveCareer();$("feedback").textContent="🏆 WORLD TOUR CHAMPION! Three rounds won. Trophy added to your career.";$("nextBtn").classList.add("hidden");$("shootBtn").classList.remove("hidden");$("shootBtn").textContent="PLAY AGAIN ↻";$("shootBtn").onclick=()=>startMode("vsattack");renderCareerHub();toast("WORLD TOUR CHAMPION!");return;}
      if(won){const r=tournamentWinsThisRun+1;startMode("vsattack");$("gameTitle").innerHTML="WORLD TOUR <em>ROUND "+r+"</em>";$("controlHeading").textContent="World Tour · Round "+r+" of 3";$("controlText").textContent="Win this five-attack round to advance toward the trophy.";toast("Round "+(r-1)+" won! Round "+r+" begins.");renderCareerHub();return;}
      tournamentActive=false;renderCareerHub();$("feedback").textContent="WORLD TOUR ROUND LOST. Win 3 rounds to lift the trophy. Start World Tour to try again.";
    }
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
    if(mode==="headtohead"||shotTaken||mode==="goalkeeping"||mode==="survival")return;
    const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width;const y=(e.clientY-rect.top)/rect.height;
    aim={x:Math.max(.1,Math.min(.9,x)),y:Math.max(.06,Math.min(.42,y))};drawPitch();
  }
  canvas.addEventListener("pointerdown",e=>{canvas.setPointerCapture?.(e.pointerId);setAimFromEvent(e)});
  canvas.addEventListener("pointermove",e=>{if(e.buttons&&mode!=="headtohead")setAimFromEvent(e)});
  const joystick=$("matchJoystick"),joystickThumb=$("matchJoystickThumb");let joystickPointer=null;
  function resetJoystick(){joystickPointer=null;match.moveX=0;match.moveY=0;if(joystickThumb)joystickThumb.style.transform="translate(0,0)";}
  function moveJoystick(e){if(joystickPointer!==e.pointerId||!joystick)return;const r=joystick.getBoundingClientRect(),radius=Math.max(24,Math.min(r.width,r.height)*.34);let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const len=Math.hypot(dx,dy);if(len>radius){dx=dx/len*radius;dy=dy/len*radius;}match.moveX=dx/radius;match.moveY=dy/radius;if(joystickThumb)joystickThumb.style.transform="translate("+dx+"px,"+dy+"px)";}
  if(joystick){joystick.addEventListener("pointerdown",e=>{if(!match.active)return;e.preventDefault();joystickPointer=e.pointerId;joystick.setPointerCapture?.(e.pointerId);moveJoystick(e);});joystick.addEventListener("pointermove",moveJoystick);["pointerup","pointercancel","lostpointercapture"].forEach(type=>joystick.addEventListener(type,resetJoystick));}
  document.querySelectorAll("[data-action]").forEach(b=>b.addEventListener("click",()=>matchAction(b.dataset.action)));
  document.querySelectorAll("[data-camera-zoom]").forEach(b=>b.addEventListener("click",()=>{const current=window.ApexMatch3D?.getZoom?.()||1.25;const action=b.dataset.cameraZoom;window.ApexMatch3D?.setZoom?.(action==="reset"?1.25:current+(action==="in"?.12:-.12));}));
  const heldMatchKeys=new Set();
  function syncMatchKeyboard(){if(!match.active)return;match.moveX=(heldMatchKeys.has("a")||heldMatchKeys.has("arrowleft")?-1:0)+(heldMatchKeys.has("d")||heldMatchKeys.has("arrowright")?1:0);match.moveY=(heldMatchKeys.has("w")||heldMatchKeys.has("arrowup")?-1:0)+(heldMatchKeys.has("s")||heldMatchKeys.has("arrowdown")?1:0);}
  document.addEventListener("keydown",e=>{if(!match.active||e.target.matches("input,textarea,select"))return;const key=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)){e.preventDefault();heldMatchKeys.add(key);syncMatchKeyboard();}else if(key==="shift"){match.sprint=true;}else if(!e.repeat&&key===" "){e.preventDefault();matchAction("shoot");}else if(!e.repeat&&key==="e"){matchAction("pass");}else if(!e.repeat&&key==="q"){matchAction("tackle");}});
  document.addEventListener("keyup",e=>{const key=e.key.toLowerCase();if(heldMatchKeys.delete(key))syncMatchKeyboard();if(key==="shift")match.sprint=false;});
  window.addEventListener("blur",()=>{heldMatchKeys.clear();match.moveX=0;match.moveY=0;match.sprint=false;});
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>startMode(b.dataset.mode)));
  document.addEventListener("click",e=>{
    const youtubeButton=e.target.closest("[data-open-youtube]");
    if(!youtubeButton)return;
    e.preventDefault();
    openYouTubeArea();
  });
  $("youtubeBackBtn").addEventListener("click",closeYouTubeArea);
  document.querySelectorAll("[data-difficulty]").forEach(b=>b.addEventListener("click",()=>{difficulty=b.dataset.difficulty;document.querySelectorAll("[data-difficulty]").forEach(x=>x.classList.toggle("selected",x===b));}));

  $("playNowBtn").addEventListener("click",()=>{document.querySelector(".mode-section")?.scrollIntoView({behavior:"smooth",block:"start"});toast("Choose a challenge to begin")});
  $("backBtn").addEventListener("click",()=>{if(mode!=="headtohead"&&mode!=="vsattack"&&!rewardClaimedThisGame)claimGameReward(score);match.active=false;cancelAnimationFrame(animationFrame);$("matchHud").classList.add("hidden");$("matchControls").classList.add("hidden");$("matchCameraControls").classList.add("hidden");resetJoystick();$("gameScreen").classList.add("hidden");$("homeScreen").classList.remove("hidden");ballAnim=null;cancelAnimationFrame(animationFrame);window.scrollTo({top:0,behavior:"auto"})});
  $("shootBtn").addEventListener("click",()=>{if(mode==="goalkeeping"||mode==="survival")dive();else shoot()});$("nextBtn").addEventListener("click",nextAttempt);
  $("powerSlider").addEventListener("input",e=>{power=Number(e.target.value);$("powerReadout").textContent=power+"%"});
  document.querySelectorAll("[data-dive]").forEach(b=>b.addEventListener("click",()=>{keeperDive=b.dataset.dive;document.querySelectorAll("[data-dive]").forEach(x=>x.style.borderColor=x===b?"#c7ff4a":"");$("feedback").textContent="Dive selected: "+keeperDive.toUpperCase()+". Press save when ready."}));
  $("keeperPad").addEventListener("dblclick",dive);
  $("keeperPad").addEventListener("click",e=>{if(e.target.closest("[data-dive]"))return;});

  // Original, synthesized soundtrack loops. Licensed songs open their official video separately.
  let musicContext=null,musicMaster=null,musicTimer=null,musicStep=0,musicStyle="hiphop",musicPlaying=false;
  // Official recordings load inside the soundtrack panel; no navigation away from the game.
  const officialSongs={
    speed:"vrY1THC_NQE", dreamers:"IwzkfMmNMpM", waka:"pRpeEdMmmQ0", jujalarimfunk:"qxcKlN2VwL4",
    montagemguerriero:"wGehOGFFf8o", montagemabnormal:"anAaYVUa-wk",
    nights:"UtF6Jej8yb4", believer:"7wtfhZwyrcc", seven:"0J2QdDbelmY",
    sunflower:"ApXoWvfEYVU", dynamite:"gdZLi9oWNZg", desire:"Uc8LehnnjJk",
    montagemtomada:"Qsk6bMvGj_o", montagemcoral:"P1EwJbIZWnQ",
    montagemmysterious:"dJM5DN1mMls", montagemxonada:"YbcevoTpItI",
    montagembailao:"p7mJqlhPvtk", montagemsupersonic:"4C-b3ml5xQc",
    montagemrugada:"pszU-BtiW2I", brazilianphonk2026:"m_52WB-sYd4",
    phonkdrift:"m_52WB-sYd4", phonkaggressive:"m_52WB-sYd4", phonknightdrive:"m_52WB-sYd4",
    phonkvelocity:"m_52WB-sYd4", phonkmontagem:"m_52WB-sYd4", phonkultraslowed:"m_52WB-sYd4",
    phonkfunk:"m_52WB-sYd4", phonkedit:"m_52WB-sYd4", phonkdark:"m_52WB-sYd4", phonkenergy:"m_52WB-sYd4",
    montagemalquimia:"m_52WB-sYd4", montagemmatadora:"m_52WB-sYd4",
    montagemnobatidao:"m_52WB-sYd4", montagemhomagefunk:"m_52WB-sYd4",
    montagemacelerada:"m_52WB-sYd4", montagemvocenamira:"m_52WB-sYd4",
    montagemgozalo:"m_52WB-sYd4", montagemvemvem:"m_52WB-sYd4",
    montagemperigosa:"m_52WB-sYd4", montagempassobemsolto:"m_52WB-sYd4",
    montagemluar:"8Wvw_DJCtIg", montagembelenos:"8Wvw_DJCtIg", montagemyueshi:"8Wvw_DJCtIg",
    montagemela:"8Wvw_DJCtIg", montagemartemis:"8Wvw_DJCtIg", montagemyumei:"8Wvw_DJCtIg",
    montagemmaldito:"8Wvw_DJCtIg", montagemsemparar:"8Wvw_DJCtIg", montagembrother:"8Wvw_DJCtIg",
    montagemabismo:"8Wvw_DJCtIg",
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
  const officialSongSegments={
    montagemalquimia:[0,111], montagemmatadora:[111,200],
    montagemnobatidao:[275,395], montagemhomagefunk:[446,569],
    montagemacelerada:[569,631], montagemvocenamira:[631,768],
    montagemgozalo:[860,974], montagemvemvem:[974,1059],
    montagempassobemsolto:[1171,1300], montagemperigosa:[1300,1381],
    montagemluar:[0,32], montagembelenos:[32,85], montagemyueshi:[85,117],
    montagemela:[117,151], montagemartemis:[151,202], montagemyumei:[202,249],
    montagemmaldito:[249,276], montagemsemparar:[276,309], montagembrother:[309,333],
    montagemabismo:[333,372]
  };
  function openOfficialSong(value){
    const videoId=officialSongs[value];
    const longAbnormalUrl=value==="montagemabnormal"?"https://embed.music.apple.com/us/album/montagem-anormal-ultra-slowed/6771553459?i=6771553463":null;
    if(!videoId&&!longAbnormalUrl){$("musicStatus").textContent="This song is not available here yet.";return false;}
    stopArenaMusic();
    const wrap=$("musicEmbedWrap"),player=$("musicEmbedPlayer");
    if(!wrap||!player){$("musicStatus").textContent="In-game player missing. Refresh the game and try again.";return false;}
    wrap.classList.remove("hidden");
    if(longAbnormalUrl){player.src=longAbnormalUrl;$("musicStatus").textContent="Montagem Anormal Ultra Slowed loaded — listed duration 5:26. Press play in the player if needed.";return true;}
    const segment=officialSongSegments[value];
    const segmentParams=segment?"&start="+segment[0]+"&end="+segment[1]:"";
    player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?autoplay=1&playsinline=1&controls=1&rel=0"+segmentParams;
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
  $("playMontagemGuerreiroBtn").addEventListener("click",()=>{ $("musicSelect").value="montagemguerriero"; $("musicOfficialBtn").classList.remove("hidden"); $("musicPlayBtn").classList.add("hidden"); openOfficialSong("montagemguerriero"); });
  $("playMontagemAbnormalBtn").addEventListener("click",()=>{ $("musicSelect").value="montagemabnormal"; $("musicOfficialBtn").classList.remove("hidden"); $("musicPlayBtn").classList.add("hidden"); openOfficialSong("montagemabnormal"); });


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
    {name:"RkReddy",channelId:"UCurtk6gwUZPnccBndhFPNMQ",category:"FC Mobile · football gaming",tags:"rkreddy fc mobile fifa football soccer",playlist:"UUurtk6gwUZPnccBndhFPNMQ",videoId:"c0SkacQheBY",channelUrl:"https://www.youtube.com/@rkreddy",websiteUrl:"https://www.digitalsportsmgmt.com/rkreddy",websiteLabel:"CREATOR WEBSITE",preferred:true},
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
  async function openYouTubeArea(){
    match.active=false;
    cancelAnimationFrame(animationFrame);
    $("gameScreen").classList.add("hidden");
    $("homeScreen").classList.add("hidden");
    const screen=$("youtubeScreen"),gate=$("youtubeAccessGate");
    const requestForm=$("youtubeAccessRequestForm"),ownerPanel=$("youtubeOwnerRequests");
    screen.classList.remove("hidden","youtube-authorized");
    requestForm?.classList.add("hidden");ownerPanel?.classList.add("hidden");
    gate.textContent="Checking your permission with the Apex Strikers server…";
    window.scrollTo({top:0,behavior:"smooth"});
    try{
      if(connectPromise)await connectPromise;
      const access=await api("/api/youtube/access");
      if(access.isAdmin){ownerPanel?.classList.remove("hidden");await refreshYouTubeRequests();}
      if(access.allowed){
        screen.classList.add("youtube-authorized");
        gate.textContent="Access verified by the Apex Strikers server.";
        renderYouTubeChannels();
      }else{
        gate.textContent=access.requestStatus==="pending"?"Your request is waiting for the owner to review it.":"You need the owner's approval to use the YouTube Area.";
        if(access.requestStatus!=="pending")requestForm?.classList.remove("hidden");
        const status=$("youtubeRequestStatus");
        if(status)status.textContent=access.requestStatus==="declined"?"Your last request was declined. You can send a new request.":"";
      }
    }catch(error){
      gate.textContent=error.message||"Could not check access. Please connect to the Apex Strikers server.";
      requestForm?.classList.add("hidden");
    }
  }
  async function refreshYouTubeRequests(){
    const list=$("youtubeOwnerRequestList");if(!list)return;
    try{
      const data=await api("/api/youtube/requests");
      list.replaceChildren();
      if(!data.requests?.length){const empty=document.createElement("p");empty.textContent="No pending requests.";list.appendChild(empty);return;}
      for(const request of data.requests){
        const card=document.createElement("article");card.className="youtube-owner-request";
        const title=document.createElement("strong");title.textContent=request.name+" · "+request.playerId;card.appendChild(title);
        const message=document.createElement("p");message.textContent=request.message||"No message.";card.appendChild(message);
        const date=document.createElement("small");date.textContent=new Date(request.createdAt).toLocaleString();card.appendChild(date);
        const actions=document.createElement("div");actions.className="youtube-owner-request-actions";
        for(const [decision,label] of [["accept","ACCEPT"],["decline","DECLINE"]]){
          const button=document.createElement("button");button.type="button";button.dataset.decision=decision;button.textContent=label;
          button.addEventListener("click",async()=>{
            button.disabled=true;
            try{await api("/api/youtube/requests/"+encodeURIComponent(request.id)+"/decision",{method:"POST",body:JSON.stringify({decision})});await refreshYouTubeRequests();if(decision==="accept")setYouTubeOwnerNotice("Access approved for "+request.playerId+".");}
            catch(error){button.disabled=false;setYouTubeOwnerNotice(error.message);}
          });actions.appendChild(button);
        }
        card.appendChild(actions);list.appendChild(card);
      }
    }catch(error){list.textContent="Could not load requests: "+error.message;}
  }

  function setYouTubeOwnerNotice(message){
    const gate=$("youtubeAccessGate");if(gate)gate.textContent=message;
  }
  $("youtubeAccessRequestForm")?.addEventListener("submit",async event=>{
    event.preventDefault();
    const status=$("youtubeRequestStatus"),button=event.currentTarget.querySelector('button[type="submit"]');
    button.disabled=true;if(status)status.textContent="Sending your request…";
    try{
      const result=await api("/api/youtube/requests",{method:"POST",body:JSON.stringify({message:$("youtubeAccessMessage").value})});
      if(status)status.textContent=result.message||"Request sent.";
      $("youtubeAccessRequestForm").classList.add("hidden");
      $("youtubeAccessGate").textContent="Your access request has been sent. You’ll be able to enter after the owner accepts.";
    }catch(error){if(status)status.textContent=error.message;}
    finally{button.disabled=false;}
  });
  $("youtubeRefreshRequests")?.addEventListener("click",refreshYouTubeRequests);
  function closeYouTubeArea(){
    if(onlineCfg.base&&onlineCfg.token){api("/api/youtube/leave",{method:"POST"}).catch(()=>{});}
    $("youtubeScreen").classList.add("hidden");
    $("youtubeScreen").classList.remove("youtube-authorized");
    $("homeScreen").classList.remove("hidden");
    setArenaView("home");
    window.scrollTo({top:0,behavior:"auto"});
  }
  function setYouTubePlaybackStatus(message,url){
    const status=$("youtubeAreaStatus");status.textContent=message;
    const link=document.createElement("a");link.href=url;link.target="_blank";link.rel="noopener noreferrer";link.textContent="Open on YouTube";
    status.appendChild(document.createTextNode(" · "));status.appendChild(link);
  }
  function playChannelPlaylist(channel){
    const player=$("youtubeAreaPlayer");
    if(channel.videoId){
      player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(channel.videoId)+"?rel=0";
      setYouTubePlaybackStatus("Loading a video from "+channel.name+" inside Apex Strikers. YouTube may block embedding for some videos.","https://www.youtube.com/watch?v="+channel.videoId);
      $("youtubeVideoUrl").value="https://www.youtube.com/watch?v="+channel.videoId;
    }else if(channel.playlist){
      player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(channel.playlist)+"&rel=0";
      setYouTubePlaybackStatus("Loading "+channel.name+" uploads playlist inside Apex Strikers. YouTube determines whether the playlist can be embedded here.","https://www.youtube.com/playlist?list="+channel.playlist);
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
    channelLink.setAttribute("aria-label",(channel.playlist||channel.videoId)?"Play "+channel.name+" videos inside Apex Strikers":"Open "+channel.name+" YouTube channel");
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
    if(!$("youtubeDirectoryGrid").children.length){const status=$("youtubeAreaStatus");status.textContent="No directory match. Search all of YouTube instead: ";const link=document.createElement("a");link.href="https://www.youtube.com/results?search_query="+encodeURIComponent($("youtubeSearchInput").value.trim());link.target="_blank";link.rel="noopener noreferrer";link.textContent="Search YouTube";status.appendChild(link);}
  }
  $("youtubeSearchForm").addEventListener("submit",e=>{e.preventDefault();youtubeSearch($("youtubeSearchInput").value);});
  $("youtubeSearchInput").addEventListener("input",renderYouTubeChannels);
  document.querySelectorAll("[data-youtube-search]").forEach(b=>b.addEventListener("click",()=>youtubeSearch(b.dataset.youtubeSearch)));
  // Read-only YouTube comments panel: comments are fetched through the backend so the API key stays private.
  (function setupYouTubeComments(){
    const player=$("youtubeAreaPlayer");
    if(!player||!player.parentNode)return;
    const panel=document.createElement("section");
    panel.id="apexYouTubeComments";
    panel.setAttribute("aria-live","polite");
    panel.style.cssText="margin-top:16px;padding:16px;border:1px solid #34401c;border-radius:14px;background:#080b06;color:#f3f6ec";
    const heading=document.createElement("h3");heading.textContent="YOUTUBE COMMENTS";heading.style.cssText="margin:0 0 8px;color:#C7FF4A";
    const status=document.createElement("p");status.textContent="Play a single YouTube video to load its comments.";status.style.cssText="font-size:14px;opacity:.85";
    const list=document.createElement("div");list.id="apexYouTubeCommentList";
    const more=document.createElement("button");more.type="button";more.textContent="LOAD MORE COMMENTS";more.hidden=true;more.style.cssText="margin-top:12px;padding:10px 14px;border-radius:9px;border:1px solid #C7FF4A;background:#10150b;color:#C7FF4A;font-weight:700";
    panel.append(heading,status,list,more);
    player.insertAdjacentElement("afterend",panel);
    let currentVideo="",nextPageToken="",loading=false;
    async function load(videoId,append=false){
      if(loading)return;
      if(!append){currentVideo=videoId;nextPageToken="";list.replaceChildren();more.hidden=true;status.textContent="Loading comments…";}
      loading=true;
      try{
        const params=new URLSearchParams({videoId});
        if(append&&nextPageToken)params.set("pageToken",nextPageToken);
        const config=window.ECLIPSE_CONFIG||{};
        const base=String(config.backendUrl||"").replace(/\/$/,"");
        if(!base)throw new Error("The game backend URL is not configured.");
        const response=await fetch(base+"/api/youtube/comments?"+params.toString());
        const data=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(data.error||"Could not load comments.");
        if(currentVideo!==videoId)return;
        const comments=Array.isArray(data.comments)?data.comments:[];
        if(!append)list.replaceChildren();
        if(!comments.length&&!append){status.textContent="No public comments were returned for this video.";}
        comments.forEach(comment=>{
          const card=document.createElement("article");
          card.style.cssText="padding:12px 0;border-top:1px solid #273019;overflow-wrap:anywhere";
          const author=document.createElement("strong");author.textContent=comment.author||"YouTube user";author.style.color="#C7FF4A";
          const meta=document.createElement("small");meta.textContent=" · "+(comment.publishedAt?new Date(comment.publishedAt).toLocaleDateString():"")+" · ♡ "+(Number(comment.likeCount)||0);meta.style.cssText="opacity:.7";
          const body=document.createElement("p");body.textContent=comment.text||"";body.style.cssText="white-space:pre-wrap;margin:7px 0 0;font-size:14px;line-height:1.45";
          card.append(author,meta,body);list.appendChild(card);
        });
        nextPageToken=data.nextPageToken||"";
        more.hidden=!nextPageToken;
        status.textContent=comments.length?(append?"More comments loaded.":"Showing public top-level comments."):(append?"No more comments.":status.textContent);
      }catch(error){if(currentVideo===videoId)status.textContent=(error.message||"Comments could not be loaded.")+" If this is the first setup, the owner must add YOUTUBE_API_KEY to the backend environment.";}
      finally{loading=false;}
    }
    more.addEventListener("click",()=>{if(currentVideo&&nextPageToken)load(currentVideo,true);});
    function syncFromPlayer(){
      const src=player.getAttribute("src")||"";
      let url;try{url=new URL(src,location.href);}catch(_){return;}
      const match=url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if(match&&match[1]!==currentVideo)load(match[1]);
      else if(/\/embed\/videoseries/.test(url.pathname)){
        currentVideo="";nextPageToken="";list.replaceChildren();more.hidden=true;status.textContent="Comments are shown for single videos, not an entire playlist. Open a video directly to view its comments.";
      }
    }
    new MutationObserver(syncFromPlayer).observe(player,{attributes:true,attributeFilter:["src"]});
    syncFromPlayer();
  })();

  $("youtubeWatchForm").addEventListener("submit",e=>{
    e.preventDefault();
    const raw=$("youtubeVideoUrl").value.trim(),status=$("youtubeAreaStatus"),player=$("youtubeAreaPlayer");
    if(!raw){status.textContent="Paste a YouTube video, playlist, or channel URL first.";return;}
    let videoId="",playlistId="",channelHandle="",channelId="",normalizedUrl="";
    try{
      if(/^[a-zA-Z0-9_-]{11}$/.test(raw))videoId=raw;
      else{
        const u=new URL(raw);
        const host=u.hostname.toLowerCase().replace(/^www\./,"");
        if(host==="youtu.be")videoId=u.pathname.split("/").filter(Boolean)[0]||"";
        if(host==="youtube.com"||host==="m.youtube.com"||host==="youtube-nocookie.com"){
          videoId=u.searchParams.get("v")||"";
          if(!videoId){const m=u.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/);if(m)videoId=m[1];}
          playlistId=u.searchParams.get("list")||"";
          const handleMatch=u.pathname.match(/^\/@([^/]+)/);
          if(handleMatch)channelHandle=handleMatch[1].toLowerCase();
          normalizedUrl="https://www.youtube.com"+u.pathname.replace(/\/$/,"");
          if(!videoId&&!playlistId&&!channelHandle){
            const channelIdMatch=u.pathname.match(/^\/(?:channel|c|user)\/([^/?]+)/);
            if(channelIdMatch)channelHandle=channelIdMatch[1].toLowerCase();
          }
        }else{
          status.textContent="Please paste a URL from youtube.com or youtu.be.";
          return;
        }
      }
    }catch(_){status.textContent="That link doesn't look valid. Paste a full YouTube video, playlist, or channel URL.";return;}
    if(videoId&&/^[a-zA-Z0-9_-]{11}$/.test(videoId)){
      player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(videoId)+"?rel=0";
      setYouTubePlaybackStatus("Loading video inside YouTube Area. YouTube may block embedded playback.","https://www.youtube.com/watch?v="+videoId);
    }else if(playlistId&&/^[a-zA-Z0-9_-]+$/.test(playlistId)){
      player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(playlistId)+"&rel=0";
      setYouTubePlaybackStatus("Loading playlist inside YouTube Area. Some playlists may block embedded playback.","https://www.youtube.com/playlist?list="+playlistId);
    }else if(channelHandle||channelId){
      const cleanHandle=(channelHandle||"").replace(/^@/,"");
      const matchedChannel=youtubeChannels.find(c=>{
        const m=(c.channelUrl||"").match(/youtube\.com\/@?([^/?]+)/i);
        return (cleanHandle&&m&&m[1].toLowerCase()===cleanHandle)||(channelId&&c.channelId&&c.channelId.toLowerCase()===channelId);
      });
      if(matchedChannel&&(matchedChannel.playlist||matchedChannel.videoId)){
        if(matchedChannel.playlist){
          player.src="https://www.youtube-nocookie.com/embed/videoseries?list="+encodeURIComponent(matchedChannel.playlist)+"&rel=0";
          status.textContent="Loading "+matchedChannel.name+"'s channel uploads playlist inside Apex Strikers. YouTube may restrict embedded playback.";
        }else{
          player.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(matchedChannel.videoId)+"?rel=0";
          status.textContent="This channel has a video configured, so that video is loading inside Apex Strikers.";
        }
      }else{
        player.src="about:blank";
        status.textContent="YouTube does not allow a full channel page to play inside an embedded player. For this channel, paste its uploads playlist URL instead, or open the channel on YouTube.";
        const openLink=document.createElement("a");
        openLink.href=normalizedUrl||("https://www.youtube.com/@"+cleanHandle);
        openLink.target="_blank";openLink.rel="noopener noreferrer";openLink.textContent=" Open channel on YouTube";
        status.appendChild(openLink);
      }
    }else{
      status.textContent="That link doesn't contain a valid video, playlist, or supported channel URL.";
    }
  });
  renderYouTubeChannels();

  $("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"♫":"♪";if(musicMaster)musicMaster.gain.setTargetAtTime(soundOn?masterVolume:0,musicContext.currentTime,.04);toast(soundOn?"Sound on · volume "+Math.round(masterVolume*100)+"%":"Sound muted. Use + and − keys to change volume.")});
  document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea,select")||e.metaKey||e.ctrlKey||e.altKey)return;if(e.key.toLowerCase()==="r"&&lastShotReplay&&!$("gameScreen").classList.contains("hidden")){ballAnim={...lastShotReplay,start:performance.now()};keeperMotion=null;drawPitch();toast("Replaying last shot");return;}if(e.key==="+"||e.key==="="||e.key==="-"||e.key==="_"){masterVolume=Math.max(0,Math.min(1,masterVolume+(e.key==="-"||e.key==="_"?-.1:.1)));if(musicMaster&&soundOn)musicMaster.gain.setTargetAtTime(masterVolume,musicContext.currentTime,.04);toast("Game volume: "+Math.round(masterVolume*100)+"%");}});
  $("resetBtn").addEventListener("click",()=>{match.active=false;match.finished=false;cancelAnimationFrame(animationFrame);score=0;attempt=1;shotTaken=false;ballAnim=null;$("scoreValue").textContent="0";toast("Session score reset · Career records and upgrades are saved")});
  // A touch-friendly joystick appears only in goalkeeper mode as an extra dive input.
  window.addEventListener("resize",()=>{if(!$("gameScreen").classList.contains("hidden"))resizeCanvas()});
  renderPlayers();
  loadApexLiveHub();
  detectApexAdmin();resizeCanvas();
})();