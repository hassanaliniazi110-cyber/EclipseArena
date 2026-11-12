(() => {
  "use strict";
  const T = window.THREE;
  let sourceCanvas=null,wrap=null,glCanvas=null,hud=null,renderer=null,scene=null,camera=null;
  let resizeObserver=null,lastWidth=0,lastHeight=0,active=false,raf=0,getState=null;
  let playerModel,rivalModel,keeperHome,keeperAway,teammateModels=[],rivalSupportModels=[],ball,ballShadow,flightTrail,aimMarker,cameraTarget;
  let hudMode,hudScore,hudClock,hudStatus,lastPlayerLabel="",cameraZoom=1.25;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mat=(color,extra)=>new T.MeshStandardMaterial(Object.assign({color:color||0xffffff,roughness:.62,metalness:.035},extra||{}));
  function box(parent,size,pos,material,cast,receive){
    const m=new T.Mesh(new T.BoxGeometry(size[0],size[1],size[2]),material);
    m.position.set(pos[0],pos[1],pos[2]);m.castShadow=cast!==false;m.receiveShadow=receive!==false;parent.add(m);return m;
  }
  function cylinder(parent,rt,rb,height,pos,material,radial){
    const m=new T.Mesh(new T.CylinderGeometry(rt,rb,height,radial||12),material);
    m.position.set(pos[0],pos[1],pos[2]);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }
  function segment(parent,a,b,radius,material){
    const start=new T.Vector3(a[0],a[1],a[2]),end=new T.Vector3(b[0],b[1],b[2]);
    const direction=new T.Vector3().subVectors(end,start);
    const m=new T.Mesh(new T.CylinderGeometry(radius*.78,radius,direction.length(),9),material);
    m.position.copy(start).add(end).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());
    m.castShadow=true;parent.add(m);return m;
  }
  function line(points,color,opacity,parent){
    const geo=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(p[0],p[1],p[2])));
    const m=new T.Line(geo,new T.LineBasicMaterial({color:color||0xffffff,transparent:opacity!==undefined&&opacity<1,opacity:opacity===undefined?1:opacity}));
    (parent||scene).add(m);return m;
  }
  function textTexture(text,w,h,opt){
    const c=document.createElement("canvas");c.width=w||512;c.height=h||128;
    const g=c.getContext("2d");opt=opt||{};g.clearRect(0,0,c.width,c.height);
    if(opt.background){g.fillStyle=opt.background;g.beginPath();g.roundRect(8,8,c.width-16,c.height-16,18);g.fill();}
    g.textAlign="center";g.textBaseline="middle";g.font="900 "+(opt.fontSize||68)+"px Arial,sans-serif";
    g.fillStyle=opt.color||"#fff";g.shadowColor=opt.shadow||"transparent";g.shadowBlur=opt.shadowBlur||0;
    g.fillText(String(text||""),c.width/2,c.height/2,c.width-28);
    const texture=new T.CanvasTexture(c);if(T.SRGBColorSpace)texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;return texture;
  }
  function label(parent,name){
    const texture=textTexture(name,512,112,{background:"rgba(4,12,22,.82)",color:"#f5fbff",fontSize:55});
    const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
    sprite.scale.set(3.1,.68,1);sprite.position.y=2.92;parent.add(sprite);return sprite;
  }
  function footballer(name,kitColor,accentColor,isKeeper,facing){
    const root=new T.Group(),kit=mat(kitColor||"#39c9ff",{roughness:.48,metalness:.07});
    const shorts=mat(isKeeper?"#111e30":"#17243a"),trim=mat(accentColor||"#eafaff",{metalness:.12,roughness:.38});
    const skin=mat("#b9815f",{roughness:.82}),hair=mat("#211b18",{roughness:.95});
    const boots=mat("#f4f7fc",{roughness:.34,metalness:.12}),socks=mat(kitColor||"#39c9ff");
    const torso=new T.Mesh(new T.CylinderGeometry(.43,.53,.94,16),kit);torso.position.y=1.48;torso.castShadow=true;root.add(torso);
    const shoulders=new T.Mesh(new T.SphereGeometry(.47,16,12),kit);shoulders.scale.set(1.03,.43,.72);shoulders.position.y=1.84;shoulders.castShadow=true;root.add(shoulders);
    const shortMesh=new T.Mesh(new T.CylinderGeometry(.45,.43,.43,14),shorts);shortMesh.position.y=.87;shortMesh.castShadow=true;root.add(shortMesh);
    const waist=new T.Mesh(new T.TorusGeometry(.39,.035,6,18),trim);waist.rotation.x=Math.PI/2;waist.position.y=1.08;root.add(waist);
    const stripe=new T.Mesh(new T.BoxGeometry(.085,.78,.025),trim);stripe.position.set(.18,1.48,-.424);root.add(stripe);
    const stripe2=stripe.clone();stripe2.position.x=-.18;root.add(stripe2);
    const band=new T.Mesh(new T.BoxGeometry(.79,.055,.08),trim);band.position.set(0,1.88,-.02);root.add(band);
    cylinder(root,.105,.12,.22,[0,2.02,0],skin,10);
    const head=new T.Mesh(new T.SphereGeometry(.235,20,16),skin);head.position.y=2.22;head.castShadow=true;root.add(head);
    const cap=new T.Mesh(new T.SphereGeometry(.242,18,12,0,Math.PI*2,0,Math.PI*.52),hair);cap.position.set(0,2.28,0);root.add(cap);
    const eyeMat=mat("#171a20",{roughness:.35});
    [-.075,.075].forEach(x=>{const eye=new T.Mesh(new T.SphereGeometry(.018,8,6),eyeMat);eye.position.set(x,2.23,-.211);root.add(eye);});
    const number=new T.Mesh(new T.PlaneGeometry(.36,.42),new T.MeshBasicMaterial({map:textTexture(isKeeper?"1":String((name.length*7)%27+1),256,256,{color:"#fff",fontSize:150,shadow:"#08131e",shadowBlur:9}),transparent:true,side:T.DoubleSide,depthWrite:false}));
    number.position.set(0,1.49,.466);root.add(number);
    const arms=[],legs=[];
    [-1,1].forEach(side=>{
      const pivot=new T.Group();pivot.position.set(side*.43,1.78,0);root.add(pivot);
      segment(pivot,[0,0,0],[side*.11,-.42,-.025],.135,kit);
      segment(pivot,[side*.11,-.42,-.025],[side*.14,-.73,-.04],.105,skin);
      if(isKeeper){const glove=new T.Mesh(new T.SphereGeometry(.13,10,8),trim);glove.position.set(side*.14,-.76,-.04);pivot.add(glove);}
      arms.push(pivot);
    });
    [-1,1].forEach(side=>{
      const pivot=new T.Group();pivot.position.set(side*.21,.75,0);root.add(pivot);
      segment(pivot,[0,0,0],[0,-.36,0],.145,shorts);segment(pivot,[0,-.34,0],[0,-.72,-.015],.095,socks);
      box(pivot,[.22,.12,.37],[0,-.77,-.14],boots,true,false);box(pivot,[.19,.025,.31],[0,-.835,-.15],trim,false,false);legs.push(pivot);
    });
    const nameLabel=label(root,name||"APEX PLAYER");
    const halo=new T.Mesh(new T.RingGeometry(.68,.79,48),new T.MeshBasicMaterial({color:accentColor||"#75eaff",transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false}));
    halo.rotation.x=-Math.PI/2;halo.position.y=.035;root.add(halo);
    root.rotation.y=facing==="toward"?Math.PI:0;
    root.userData={arms,legs,halo,label:nameLabel,isKeeper,phase:Math.random()*6.28};return root;
  }
  function makeBall(){
    const group=new T.Group();
    const white=mat("#fbfdff",{roughness:.23,metalness:.025});
    const dark=mat("#152538",{roughness:.38,metalness:.09});
    const sphere=new T.Mesh(new T.SphereGeometry(.30,40,32),white);
    sphere.castShadow=true;sphere.receiveShadow=true;group.add(sphere);
    const shape=new T.Shape();
    for(let i=0;i<5;i++){
      const angle=i/5*Math.PI*2-Math.PI/2,x=Math.cos(angle)*.105,y=Math.sin(angle)*.105;
      if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);
    }
    shape.closePath();
    const panelGeometry=new T.ShapeGeometry(shape);
    const normals=[[0,0,1],[0,.94,.34],[.89,.30,.34],[-.89,.30,.34],[0,-.94,.34],[0,0,-1]];
    normals.forEach(v=>{
      const normal=new T.Vector3(v[0],v[1],v[2]).normalize();
      const panel=new T.Mesh(panelGeometry,dark);
      panel.position.copy(normal.clone().multiplyScalar(.294));
      panel.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);
      group.add(panel);
    });
    const seamMaterial=new T.MeshBasicMaterial({color:0x25364a,transparent:true,opacity:.72});
    for(let i=0;i<3;i++){
      const seam=new T.Mesh(new T.TorusGeometry(.245,.006,5,64),seamMaterial);
      seam.rotation.set(i*.92,(i+1)*.64,i*.48);group.add(seam);
    }
    return group;
  }
  function goal(z,direction){
    const root=new T.Group();scene.add(root);const frame=mat("#eaf6ff",{metalness:.55,roughness:.22});
    const net=new T.LineBasicMaterial({color:0xb9d9ec,transparent:true,opacity:.38});
    const x1=-4.1,x2=4.1,top=3.1,back=z+direction*2.1;
    segment(root,[x1,.1,z],[x1,top,z],.095,frame);segment(root,[x2,.1,z],[x2,top,z],.095,frame);
    segment(root,[x1,top,z],[x2,top,z],.095,frame);
    segment(root,[x1,.1,z],[x1,.1,back],.035,frame);segment(root,[x2,.1,z],[x2,.1,back],.035,frame);
    segment(root,[x1,top,z],[x1,top,back],.035,frame);segment(root,[x2,top,z],[x2,top,back],.035,frame);
    segment(root,[x1,.1,back],[x2,.1,back],.035,frame);segment(root,[x1,top,back],[x2,top,back],.035,frame);
    for(let i=0;i<=16;i++){const x=x1+(x2-x1)*i/16;root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x,.1,z),new T.Vector3(x,top,back)]),net));}
    for(let j=0;j<=8;j++){const y=.1+(top-.1)*j/8;root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x1,y,z),new T.Vector3(x2,y,z+direction*.1)]),net));root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x1,y,back),new T.Vector3(x2,y,back)]),net));}
  }
  function seats(){
    const geo=new T.BoxGeometry(.42,.34,.72),material=new T.MeshStandardMaterial({color:0x45617c,roughness:.82});
    const colors=[0x45617c,0x7f4d76,0x3c7892,0xb2a0b5,0x586c8e,0x8b744d];
    function row(side,end){
      const count=end?30:27,rows=7,mesh=new T.InstancedMesh(geo,material,count*rows),d=new T.Object3D();let n=0;
      for(let r=0;r<rows;r++)for(let i=0;i<count;i++){
        if(!end)d.position.set(side*(18.2+r*.62),2.2+r*.56,-19.2+i*1.48);
        else {d.position.set(-20.2+i*1.4,2.2+r*.56,side*(24+r*.62));d.rotation.y=side<0?0:Math.PI;}
        d.scale.set(1,1,1);d.updateMatrix();mesh.setMatrixAt(n,d.matrix);if(mesh.setColorAt)mesh.setColorAt(n,new T.Color(colors[(i*3+r*5)%colors.length]));n++;
      }
      mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);
    }
    row(-1,false);row(1,false);row(-1,true);row(1,true);
  }
  function buildScene(){
    scene.background=new T.Color(0x071321);scene.fog=new T.Fog(0x071321,58,112);
    const ground=new T.Mesh(new T.PlaneGeometry(110,110),mat("#081521",{roughness:1}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-1.45;ground.receiveShadow=true;scene.add(ground);
    const turf=new T.Mesh(new T.PlaneGeometry(32,44),mat("#167743",{roughness:.94}));turf.rotation.x=-Math.PI/2;turf.receiveShadow=true;scene.add(turf);
    for(let i=0;i<12;i++){const stripe=new T.Mesh(new T.PlaneGeometry(32/12,44),new T.MeshStandardMaterial({color:i%2?0x0e6638:0x21854a,transparent:true,opacity:.42,roughness:1}));stripe.rotation.x=-Math.PI/2;stripe.position.set(-16+(i+.5)*32/12,.008,0);stripe.receiveShadow=true;scene.add(stripe);}
    const y=.035,W=32,L=44,mark=pts=>line(pts,0xeaf8ef,.9);
    mark([[-W/2,y,-L/2],[W/2,y,-L/2],[W/2,y,L/2],[-W/2,y,L/2],[-W/2,y,-L/2]]);
    mark([[-W/2,y,0],[W/2,y,0]]);
    const circle=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*2;circle.push([Math.cos(a)*5.1,y,Math.sin(a)*5.1]);}mark(circle);
    [[-8.2,-22,16.4,7.4],[-5.1,-22,10.2,3.2],[-8.2,22,16.4,7.4],[-5.1,22,10.2,3.2]].forEach(b=>{
      const end=b[1]+(b[1]<0?b[3]:-b[3]);mark([[-b[2]/2,y,b[1]],[b[2]/2,y,b[1]],[b[2]/2,y,end],[-b[2]/2,y,end],[-b[2]/2,y,b[1]]]);
    });
    const sideStand=mat("#12263c",{roughness:.86});
    box(scene,[5.5,8,49],[-20.1,3.7,0],sideStand,false,true);box(scene,[5.5,8,49],[20.1,3.7,0],sideStand,false,true);
    box(scene,[43,8,5.5],[0,3.7,-27.1],sideStand,false,true);box(scene,[43,8,5.5],[0,3.7,27.1],sideStand,false,true);
    seats();
    const led=mat("#06334a",{emissive:0x0879a0,emissiveIntensity:1.4,roughness:.35});
    [-1,1].forEach(side=>box(scene,[.24,.72,43],[side*16.45,.44,0],led,false,false));
    box(scene,[31,.72,.24],[0,.44,-22.45],led,false,false);box(scene,[31,.72,.24],[0,.44,22.45],led,false,false);
    goal(-22,-1);goal(22,1);
    scene.add(new T.HemisphereLight(0xadcfff,0x15251b,1.02));
    const sun=new T.DirectionalLight(0xffffff,2.05);sun.position.set(-15,34,21);sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=34;sun.shadow.camera.bottom=-34;
    sun.shadow.camera.near=1;sun.shadow.camera.far=90;sun.shadow.bias=-.00025;scene.add(sun);
    [[-21,17,-24],[21,17,-24],[-21,17,24],[21,17,24]].forEach((p,i)=>{
      cylinder(scene,.095,.13,13,[p[0],6.5,p[2]],mat("#25394c",{metalness:.55,roughness:.4}),8);
      const light=new T.PointLight(i%2?0xb7e7ff:0xe7f4ff,95,56,2);light.position.set(p[0],13.3,p[2]);scene.add(light);
      const panel=new T.Mesh(new T.BoxGeometry(2.1,.22,.8),new T.MeshBasicMaterial({color:0xe8f9ff}));panel.position.set(p[0],13.1,p[2]);scene.add(panel);
    });
    const coords=[];for(let i=0;i<180;i++)coords.push((Math.random()-.5)*86,5+Math.random()*22,(Math.random()-.5)*90);
    const particles=new T.BufferGeometry();particles.setAttribute("position",new T.Float32BufferAttribute(coords,3));
    scene.add(new T.Points(particles,new T.PointsMaterial({color:0xd9f2ff,size:.075,transparent:true,opacity:.55})));
  }
  function buildActors(){
    playerModel=footballer("YOU","#20c9ec","#dffaff",false,"away");
    rivalModel=footballer("RIVAL","#e34b69","#ffdce4",false,"toward");
    keeperHome=footballer("KEEPER","#f4b83e","#fff0b0",true,"away");
    keeperAway=footballer("KEEPER","#45c8ad","#dcfff6",true,"toward");
    scene.add(playerModel,rivalModel,keeperHome,keeperAway);
    teammateModels=[[.24,.7],[.36,.62],[.64,.62],[.76,.7]].map(()=>footballer("TEAMMATE","#20c9ec","#dffaff",false,"away"));
    rivalSupportModels=[[.24,.3],[.36,.38],[.64,.38],[.76,.3]].map(()=>footballer("RIVAL","#e34b69","#ffdce4",false,"toward"));
    teammateModels.forEach(p=>scene.add(p));rivalSupportModels.forEach(p=>scene.add(p));
    ball=makeBall();scene.add(ball);
    ballShadow=new T.Mesh(new T.CircleGeometry(.46,32),new T.MeshBasicMaterial({color:0x02080d,transparent:true,opacity:.36,depthWrite:false}));
    ballShadow.rotation.x=-Math.PI/2;ballShadow.position.y=.035;scene.add(ballShadow);
    const trailGeometry=new T.BufferGeometry();
    trailGeometry.setAttribute("position",new T.BufferAttribute(new Float32Array(6),3));
    flightTrail=new T.Line(trailGeometry,new T.LineBasicMaterial({color:0x8deaff,transparent:true,opacity:.72,depthWrite:false}));
    flightTrail.visible=false;scene.add(flightTrail);
    aimMarker=new T.Mesh(new T.RingGeometry(.34,.49,48),new T.MeshBasicMaterial({color:0x9cff58,transparent:true,opacity:.9,side:T.DoubleSide}));
    aimMarker.rotation.x=-Math.PI/2;aimMarker.position.y=.045;scene.add(aimMarker);
    cameraTarget=new T.Vector3(0,0,0);
  }
  function resize(){
    if(!renderer||!sourceCanvas||!wrap)return;
    const rect=sourceCanvas.getBoundingClientRect(),wr=wrap.getBoundingClientRect();if(rect.width<2||rect.height<2)return;
    glCanvas.style.left=(rect.left-wr.left)+"px";glCanvas.style.top=(rect.top-wr.top)+"px";
    glCanvas.style.width=rect.width+"px";glCanvas.style.height=rect.height+"px";
    hud.style.left=(rect.left-wr.left)+"px";hud.style.top=(rect.top-wr.top)+"px";hud.style.width=rect.width+"px";hud.style.height=rect.height+"px";
    const w=Math.round(rect.width),h=Math.round(rect.height);
    if(w!==lastWidth||h!==lastHeight){lastWidth=w;lastHeight=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  }
  function place(model,x,y,facing,time,highlight){
    model.position.set((x-.5)*30,0,(y-.5)*40);model.rotation.y=facing==="toward"?Math.PI:0;model.visible=true;
    const d=model.userData,phase=time*8.5+d.phase;
    d.legs[0].rotation.x=Math.sin(phase)*.46;d.legs[1].rotation.x=-Math.sin(phase)*.46;
    d.arms[0].rotation.x=-Math.sin(phase)*.28;d.arms[1].rotation.x=Math.sin(phase)*.28;
    model.position.y=.035+Math.abs(Math.sin(phase*2))*.025;
    d.halo.visible=Boolean(highlight);d.halo.material.opacity=highlight?.74:.16;d.label.visible=!d.isKeeper;
  }
  function shotPoint(a,t,keeperMode){
    const eased=1-Math.pow(1-t,2);
    const fromX=Number.isFinite(a.fromX)?a.fromX:.5;
    const toX=Number.isFinite(a.toX)?a.toX:.5;
    const toY=Number.isFinite(a.toY)?a.toY:.27;
    const startX=(fromX-.5)*12,endX=(toX-.5)*8.6;
    const startZ=keeperMode?7.5:10.5,endZ=keeperMode?-18.15:-21.25;
    const endHeight=.24+clamp((.42-toY)/.36,0,1)*2.68;
    const startHeight=keeperMode?1.45:.36;
    const curve=Math.sin(Math.PI*t)*(Number(a.curve)||0)*18;
    const arc=(keeperMode?3.8:4.5)*Math.sin(Math.PI*t);
    return new T.Vector3(startX+(endX-startX)*eased+curve,
      startHeight+(endHeight-startHeight)*eased+arc,startZ+(endZ-startZ)*eased);
  }
  function updateFlightTrail(a,t,keeperMode){
    if(!flightTrail)return;
    if(t>=.98){flightTrail.visible=false;return;}
    const head=shotPoint(a,t,keeperMode),tail=shotPoint(a,Math.max(0,t-.18),keeperMode);
    const attr=flightTrail.geometry.attributes.position;
    attr.setXYZ(0,tail.x,tail.y,tail.z);attr.setXYZ(1,head.x,head.y,head.z);
    attr.needsUpdate=true;flightTrail.geometry.computeBoundingSphere();flightTrail.visible=t>.015;
  }
  function updateBallShadow(){
    if(!ballShadow||!ball)return;
    const height=Math.max(0,ball.position.y-.28);
    ballShadow.position.set(ball.position.x,.035,ball.position.z);
    const scale=1+height*.12;ballShadow.scale.set(scale,scale,1);
    ballShadow.material.opacity=Math.max(.09,.36-height*.055);
  }
  function updateHUD(s){
    if(!hudMode||!s)return;const h=s.mode==="headtohead";
    hudMode.textContent=h?"APEX STRIKERS · 5v5":"APEX STRIKERS · "+String(s.mode||"MATCH").toUpperCase();
    hudScore.textContent=h?(s.match.playerGoals+"  :  "+s.match.rivalGoals):(s.score+" · "+s.attemptLabel);
    hudClock.textContent=h?("MATCH "+Math.floor(s.match.clock||0)+"'"):(s.selectedPlayer||"PLAYER").toUpperCase();
    hudStatus.textContent=s.finished?"FULL TIME":(h?(s.match.hasBall?"POSSESSION · YOU":"POSSESSION · RIVAL"):"3D MATCH ENGINE · LIVE");
  }
  function safeState(){try{return getState?getState():null;}catch(_){return null;}}
  function render(now){
    raf=requestAnimationFrame(render);if(!renderer||document.hidden)return;
    const rect=sourceCanvas.getBoundingClientRect();if(rect.width<2||rect.height<2)return;
    if(rect.width!==lastWidth||rect.height!==lastHeight)resize();
    const s=safeState();if(!s)return;const time=now/1000,h2h=s.mode==="headtohead",m=s.match||{};
    updateHUD(s);
    if(s.selectedPlayer&&s.selectedPlayer!==lastPlayerLabel){
      const old=playerModel.userData.label.material.map;
      playerModel.userData.label.material.map=textTexture(s.selectedPlayer,512,112,{background:"rgba(4,12,22,.82)",color:"#f5fbff",fontSize:55});
      playerModel.userData.label.material.needsUpdate=true;if(old)old.dispose();lastPlayerLabel=s.selectedPlayer;
    }
    if(h2h){
      playerModel.visible=true;rivalModel.visible=true;keeperHome.visible=true;keeperAway.visible=true;
      place(playerModel,m.player.x===undefined?.5:m.player.x,m.player.y===undefined?.72:m.player.y,"away",time,true);
      place(rivalModel,m.rival.x===undefined?.5:m.rival.x,m.rival.y===undefined?.28:m.rival.y,"toward",time,false);
      const own=[[.24,.7],[.36,.62],[.64,.62],[.76,.7]],opp=[[.24,.3],[.36,.38],[.64,.38],[.76,.3]];
      teammateModels.forEach((p,i)=>place(p,own[i][0],own[i][1],"away",time,false));
      rivalSupportModels.forEach((p,i)=>place(p,opp[i][0],opp[i][1],"toward",time,false));
      keeperHome.position.set(0,0,19.2);keeperHome.rotation.y=0;keeperAway.position.set(0,0,-19.2);keeperAway.rotation.y=Math.PI;
      keeperHome.userData.label.visible=false;keeperAway.userData.label.visible=false;cameraTarget.set((m.player.x-.5)*2.8,0,(m.player.y-.5)*2.2);
      aimMarker.visible=false;flightTrail.visible=false;ball.position.set((m.ball.x-.5)*30,.33,(m.ball.y-.5)*40);
    }else{
      teammateModels.forEach(p=>p.visible=false);rivalSupportModels.forEach(p=>p.visible=false);rivalModel.visible=false;keeperHome.visible=false;keeperAway.visible=true;
      if(s.mode==="goalkeeping"||s.mode==="survival"){playerModel.visible=false;keeperAway.position.set(0,0,-19.2);keeperAway.userData.label.visible=true;}
      else{place(playerModel,.5,.76,"away",time,true);keeperAway.position.set(0,0,-19.2);keeperAway.userData.label.visible=true;}
      keeperAway.rotation.y=Math.PI;
      const keeperMode=s.mode==="goalkeeping"||s.mode==="survival";
      const dive=s.keeperMotion;
      if(dive){
        const raw=clamp((now-dive.start)/(dive.duration||450),0,1);
        const e=1-Math.pow(1-raw,2),side=Number(dive.side)||0,airborne=Math.sin(Math.PI*e);
        keeperAway.position.x=side*4.9*e;keeperAway.position.y=.08+.56*airborne;
        keeperAway.rotation.z=-side*1.18*e;keeperAway.rotation.x=-.34*e;
        const arms=keeperAway.userData.arms,legs=keeperAway.userData.legs;
        arms[0].rotation.set(-.62*e,0,side*.86*e);arms[1].rotation.set(-.62*e,0,side*1.08*e);
        legs[0].rotation.set(-.48*e,0,-side*.38*e);legs[1].rotation.set(.62*e,0,side*.55*e);
      }else{
        keeperAway.position.x=0;keeperAway.position.y=0;keeperAway.rotation.z=0;keeperAway.rotation.x=0;
        keeperAway.userData.arms.forEach(a=>a.rotation.set(0,0,0));
        keeperAway.userData.legs.forEach(l=>l.rotation.set(0,0,0));
        keeperAway.userData.legs[0].rotation.x=Math.sin(time*8)*.12;keeperAway.userData.legs[1].rotation.x=-Math.sin(time*8)*.12;
      }
      aimMarker.visible=!keeperMode&&!s.finished;
      if(aimMarker.visible)aimMarker.position.set(((s.aim.x===undefined?.5:s.aim.x)-.5)*30,.05,((s.aim.y===undefined?.25:s.aim.y)-.5)*40);
      const a=s.ballAnim;
      if(a){
        const t=clamp((now-a.start)/(a.duration||650),0,1);
        ball.position.copy(shotPoint(a,t,keeperMode));updateFlightTrail(a,t,keeperMode);
      }else{
        flightTrail.visible=false;
        const bx=keeperMode?.5:.522,by=keeperMode?.2:.735;
        ball.position.set((bx-.5)*30,.32,(by-.5)*40);
      }
    }
    const moving=Boolean(s.ballAnim);
    ball.rotation.x+=moving?.055:.009;ball.rotation.z+=moving?.043:.012;
    updateBallShadow();
    const focusX=h2h?(m.player.x-.5)*30:0,focusZ=h2h?(m.player.y-.5)*40:0;
    camera.position.x+=(focusX*.28-camera.position.x)*.055;
    camera.position.y+=((h2h?23:28)-camera.position.y)*.045;
    camera.position.z+=((h2h?focusZ+29:38)-camera.position.z)*.045;
    camera.lookAt(focusX*.42,0,focusZ);renderer.render(scene,camera);
  }
  function init(canvas,getter){
    if(active)return true;if(!T||!canvas||!canvas.parentElement)return false;
    try{
      sourceCanvas=canvas;wrap=canvas.parentElement;getState=getter;
      if(getComputedStyle(wrap).position==="static")wrap.style.position="relative";
      glCanvas=document.createElement("canvas");glCanvas.className="apex-3d-canvas";glCanvas.setAttribute("aria-hidden","true");wrap.appendChild(glCanvas);
      hud=document.createElement("div");hud.className="apex-3d-hud";
      hud.innerHTML='<div class="apex-3d-scoreboard"><div class="apex-3d-hud-top"><span class="apex-3d-hud-brand">APEX <b>STRIKERS</b></span><span class="apex-3d-hud-live"><i></i> LIVE ENGINE</span></div><div class="apex-3d-hud-middle"><span class="apex-3d-hud-mode">MATCH</span><strong class="apex-3d-hud-score">0 : 0</strong><span class="apex-3d-hud-clock">00:00</span></div><div class="apex-3d-hud-status">3D MATCH ENGINE · LIVE</div></div>';
      wrap.appendChild(hud);hudMode=hud.querySelector(".apex-3d-hud-mode");hudScore=hud.querySelector(".apex-3d-hud-score");hudClock=hud.querySelector(".apex-3d-hud-clock");hudStatus=hud.querySelector(".apex-3d-hud-status");
      renderer=new T.WebGLRenderer({canvas:glCanvas,antialias:true,alpha:false,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
      renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;
      if("outputColorSpace" in renderer)renderer.outputColorSpace=T.SRGBColorSpace;
      scene=new T.Scene();camera=new T.PerspectiveCamera(47,1,.1,180);camera.position.set(0,23,29);camera.zoom=cameraZoom;camera.updateProjectionMatrix();
      buildScene();buildActors();resize();sourceCanvas.classList.add("apex-2d-hidden");
      glCanvas.addEventListener("webglcontextlost",e=>{e.preventDefault();sourceCanvas.classList.remove("apex-2d-hidden");glCanvas.style.display="none";hud.style.display="none";active=false;});
      if(window.ResizeObserver){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(sourceCanvas);resizeObserver.observe(wrap);}
      window.addEventListener("resize",resize,{passive:true});active=true;raf=requestAnimationFrame(render);return true;
    }catch(error){
      if(sourceCanvas)sourceCanvas.classList.remove("apex-2d-hidden");if(glCanvas)glCanvas.remove();if(hud)hud.remove();
      renderer=null;active=false;console.warn("Apex 3D renderer unavailable; using the 2D fallback.",error);return false;
    }
  }
  function sync(){if(active)updateHUD(safeState()||{});}
  function setZoom(value){cameraZoom=clamp(Number(value)||1.25,1,1.9);if(camera){camera.zoom=cameraZoom;camera.updateProjectionMatrix();}return cameraZoom;}
  function getZoom(){return cameraZoom;}
  window.ApexMatch3D={init,resize,sync,setZoom,getZoom,get active(){return active;}};
})();