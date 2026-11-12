(() => {
  "use strict";
  const T = window.THREE;
  let sourceCanvas=null,wrap=null,glCanvas=null,hud=null,renderer=null,scene=null,camera=null;
  let resizeObserver=null,lastWidth=0,lastHeight=0,active=false,raf=0,getState=null,lastRenderAt=0,lowPowerMode=false;
  let playerModel,rivalModel,keeperHome,keeperAway,teammateModels=[],rivalSupportModels=[],ball,ballShadow,flightTrail,aimMarker,aimGuide,cameraTarget;
  let hudMode,hudScore,hudClock,hudStatus,lastPlayerLabel="",cameraZoom=1,cameraMode="player";
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const FIELD_WIDTH=84,FIELD_LENGTH=130;
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
    const m=new T.Mesh(new T.CylinderGeometry(radius*.78,radius,direction.length(),14),material);
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
    const torso=new T.Mesh(new T.SphereGeometry(.5,28,22),kit);torso.scale.set(.88,1.08,.63);torso.position.y=1.48;torso.castShadow=true;root.add(torso);
    const shoulders=new T.Mesh(new T.SphereGeometry(.47,24,18),kit);shoulders.scale.set(1.03,.43,.72);shoulders.position.y=1.84;shoulders.castShadow=true;root.add(shoulders);
    const shortMesh=new T.Mesh(new T.SphereGeometry(.43,24,16),shorts);shortMesh.scale.set(1,.58,.72);shortMesh.position.y=.87;shortMesh.castShadow=true;root.add(shortMesh);
    const waist=new T.Mesh(new T.TorusGeometry(.39,.035,6,18),trim);waist.rotation.x=Math.PI/2;waist.position.y=1.08;root.add(waist);
    const stripe=new T.Mesh(new T.BoxGeometry(.085,.78,.025),trim);stripe.position.set(.18,1.48,-.424);root.add(stripe);
    const stripe2=stripe.clone();stripe2.position.x=-.18;root.add(stripe2);
    const band=new T.Mesh(new T.BoxGeometry(.79,.055,.08),trim);band.position.set(0,1.88,-.02);root.add(band);
    const collar=new T.Mesh(new T.TorusGeometry(.145,.022,8,24),trim);collar.rotation.x=Math.PI/2;collar.position.set(0,1.93,-.035);root.add(collar);
    const crest=new T.Mesh(new T.CircleGeometry(.075,20),trim);crest.position.set(.255,1.64,-.398);root.add(crest);
    cylinder(root,.105,.12,.22,[0,2.02,0],skin,10);
    const head=new T.Mesh(new T.SphereGeometry(.235,32,24),skin);head.scale.set(.94,1.08,.94);head.position.y=2.22;head.castShadow=true;root.add(head);
    const cap=new T.Mesh(new T.SphereGeometry(.246,28,20,0,Math.PI*2,0,Math.PI*.56),hair);cap.position.set(0,2.29,0);cap.castShadow=true;root.add(cap);
    const fringe=new T.Mesh(new T.SphereGeometry(.125,18,12),hair);fringe.scale.set(1.2,.48,.58);fringe.position.set(0,2.285,-.185);root.add(fringe);
    const sideHair=new T.Mesh(new T.SphereGeometry(.12,18,14),hair);sideHair.scale.set(.62,1.1,.85);sideHair.position.set(-.19,2.18,0);root.add(sideHair);const sideHair2=sideHair.clone();sideHair2.position.x=.19;root.add(sideHair2);
    const earMat=skin,earInner=mat("#87583f",{roughness:.88});[-1,1].forEach(side=>{const ear=new T.Mesh(new T.SphereGeometry(.055,14,12),earMat);ear.position.set(side*.225,2.19,-.005);root.add(ear);const inner=new T.Mesh(new T.SphereGeometry(.022,10,8),earInner);inner.position.set(side*.24,2.19,-.045);root.add(inner);});
    const eyeWhite=mat("#f1e9df",{roughness:.45}),eyeMat=mat("#171a20",{roughness:.35}),browMat=mat("#30251f",{roughness:.8});
    [-.075,.075].forEach(x=>{const white=new T.Mesh(new T.SphereGeometry(.027,14,12),eyeWhite);white.position.set(x,2.235,-.211);root.add(white);const eye=new T.Mesh(new T.SphereGeometry(.014,12,10),eyeMat);eye.position.set(x,2.235,-.235);root.add(eye);const brow=new T.Mesh(new T.SphereGeometry(.045,12,8),browMat);brow.scale.set(1.2,.24,.28);brow.position.set(x,2.275,-.215);root.add(brow);});
    const nose=new T.Mesh(new T.SphereGeometry(.035,14,12),skin);nose.scale.set(.72,.8,.72);nose.position.set(0,2.17,-.235);root.add(nose);
    const mouth=new T.Mesh(new T.TorusGeometry(.035,.006,5,14,Math.PI),browMat);mouth.position.set(0,2.115,-.222);mouth.rotation.set(0,Math.PI,0);root.add(mouth);
    const numberTexture=textTexture(isKeeper?"1":String((name.length*7)%27+1),256,256,{color:"#fff",fontSize:150,shadow:"#08131e",shadowBlur:9});
    const number=new T.Mesh(new T.PlaneGeometry(.36,.42),new T.MeshBasicMaterial({map:numberTexture,transparent:true,side:T.DoubleSide,depthWrite:false}));
    number.position.set(0,1.49,.466);root.add(number);
    const frontNumber=new T.Mesh(new T.PlaneGeometry(.28,.34),new T.MeshBasicMaterial({map:numberTexture,transparent:true,side:T.DoubleSide,depthWrite:false}));frontNumber.position.set(0,1.49,-.435);frontNumber.rotation.y=Math.PI;root.add(frontNumber);
    const sleeveCuffMat=trim;[-1,1].forEach(side=>{const cuff=new T.Mesh(new T.TorusGeometry(.105,.018,6,16),sleeveCuffMat);cuff.rotation.y=Math.PI/2;cuff.position.set(side*.49,1.46,0);root.add(cuff);});
    const arms=[],legs=[];
    [-1,1].forEach(side=>{
      const pivot=new T.Group();pivot.position.set(side*.43,1.78,0);root.add(pivot);
      segment(pivot,[0,0,0],[side*.11,-.42,-.025],.135,kit);
      segment(pivot,[side*.11,-.42,-.025],[side*.14,-.73,-.04],.105,skin);
      const hand=new T.Mesh(new T.SphereGeometry(isKeeper ? .13 : .09,14,10),isKeeper?trim:skin);hand.position.set(side*.14,-.76,-.04);pivot.add(hand);
      if(isKeeper){const gloveCuff=new T.Mesh(new T.CylinderGeometry(.115,.105,.09,14),trim);gloveCuff.position.set(side*.14,-.68,-.04);pivot.add(gloveCuff);}
      arms.push(pivot);
    });
    [-1,1].forEach(side=>{
      const pivot=new T.Group();pivot.position.set(side*.21,.75,0);root.add(pivot);
      segment(pivot,[0,0,0],[0,-.36,0],.145,shorts);segment(pivot,[0,-.34,0],[0,-.72,-.015],.095,socks);
      [-.52,-.60].forEach(y=>{const sockStripe=new T.Mesh(new T.TorusGeometry(.092,.012,5,16),trim);sockStripe.position.set(0,y,0);pivot.add(sockStripe);});
      const boot=new T.Mesh(new T.SphereGeometry(.15,20,16),boots);boot.scale.set(.78,.42,1.38);boot.position.set(0,-.78,-.14);pivot.add(boot);
      const sole=new T.Mesh(new T.SphereGeometry(.145,18,14),trim);sole.scale.set(.79,.16,1.35);sole.position.set(0,-.835,-.14);pivot.add(sole);
      const laceMat=mat("#c8d2df",{roughness:.55});for(let lace=0;lace<3;lace++){const cord=new T.Mesh(new T.BoxGeometry(.105,.009,.014),laceMat);cord.position.set(0,-.735-lace*.025,-.255);pivot.add(cord);}
      legs.push(pivot);
    });
    const nameLabel=label(root,name||"APEX PLAYER");
    const halo=new T.Mesh(new T.RingGeometry(.68,.79,48),new T.MeshBasicMaterial({color:accentColor||"#75eaff",transparent:true,opacity:.16,side:T.DoubleSide,depthWrite:false}));
    halo.rotation.x=-Math.PI/2;halo.position.y=.035;root.add(halo);
    root.rotation.y=facing==="toward"?Math.PI:0;
    root.scale.setScalar(isKeeper?1.48:1.42);root.userData={arms,legs,halo,label:nameLabel,isKeeper,phase:Math.random()*6.28,torso,head,kitMaterial:kit,sockMaterial:socks,trimMaterial:trim};return root;
  }
  function makeBall(){
    const group=new T.Group();
    const white=mat("#fbfdff",{roughness:.23,metalness:.025});
    const dark=mat("#152538",{roughness:.38,metalness:.09});
    const sphere=new T.Mesh(new T.SphereGeometry(.22,40,32),white);
    sphere.castShadow=true;sphere.receiveShadow=true;group.add(sphere);
    const shape=new T.Shape();
    for(let i=0;i<5;i++){
      const angle=i/5*Math.PI*2-Math.PI/2,x=Math.cos(angle)*.078,y=Math.sin(angle)*.078;
      if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);
    }
    shape.closePath();
    const panelGeometry=new T.ShapeGeometry(shape);
    const normals=[[0,0,1],[0,.94,.34],[.89,.30,.34],[-.89,.30,.34],[0,-.94,.34],[0,0,-1]];
    normals.forEach(v=>{
      const normal=new T.Vector3(v[0],v[1],v[2]).normalize();
      const panel=new T.Mesh(panelGeometry,dark);
      panel.position.copy(normal.clone().multiplyScalar(.216));
      panel.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);
      group.add(panel);
    });
    const seamMaterial=new T.MeshBasicMaterial({color:0x25364a,transparent:true,opacity:.72});
    for(let i=0;i<3;i++){
      const seam=new T.Mesh(new T.TorusGeometry(.18,.005,5,64),seamMaterial);
      seam.rotation.set(i*.92,(i+1)*.64,i*.48);group.add(seam);
    }
    return group;
  }
  function goal(z,direction){
    const root=new T.Group();scene.add(root);const frame=mat("#eaf6ff",{metalness:.55,roughness:.22});
    const net=new T.LineBasicMaterial({color:0xb9d9ec,transparent:true,opacity:.38});
    const x1=-10.4,x2=10.4,top=5.45,back=z+direction*5.2;
    segment(root,[x1,.1,z],[x1,top,z],.095,frame);segment(root,[x2,.1,z],[x2,top,z],.095,frame);
    segment(root,[x1,top,z],[x2,top,z],.095,frame);
    segment(root,[x1,.1,z],[x1,.1,back],.035,frame);segment(root,[x2,.1,z],[x2,.1,back],.035,frame);
    segment(root,[x1,top,z],[x1,top,back],.035,frame);segment(root,[x2,top,z],[x2,top,back],.035,frame);
    segment(root,[x1,.1,back],[x2,.1,back],.035,frame);segment(root,[x1,top,back],[x2,top,back],.035,frame);
    for(let i=0;i<=20;i++){const x=x1+(x2-x1)*i/20;root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x,.1,z),new T.Vector3(x,top,back)]),net));}
    for(let j=0;j<=10;j++){const y=.1+(top-.1)*j/10;root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x1,y,z),new T.Vector3(x2,y,z+direction*.1)]),net));root.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x1,y,back),new T.Vector3(x2,y,back)]),net));}
  }
  function seats(){
    const geo=new T.BoxGeometry(.62,.38,.92),material=new T.MeshStandardMaterial({color:0x45617c,roughness:.82});
    const colors=[0x45617c,0x7f4d76,0x3c7892,0xb2a0b5,0x586c8e,0x8b744d];
    function row(side,end){
      const count=end?34:32,rows=7,mesh=new T.InstancedMesh(geo,material,count*rows),d=new T.Object3D();let n=0;
      for(let r=0;r<rows;r++)for(let i=0;i<count;i++){
        if(!end)d.position.set(side*(47.5+r*.78),3.7+r*.58,-67+i*4.2);
        else {d.position.set(-43+i*2.55,3.7+r*.58,side*(73.5+r*.78));d.rotation.y=side<0?0:Math.PI;}
        d.scale.set(1,1,1);d.updateMatrix();mesh.setMatrixAt(n,d.matrix);
        if(mesh.setColorAt)mesh.setColorAt(n,new T.Color(colors[(i*3+r*5)%colors.length]));n++;
      }
      mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
      mesh.castShadow=false;mesh.receiveShadow=true;scene.add(mesh);
    }
    row(-1,false);row(1,false);row(-1,true);row(1,true);
  }
  
  function buildScene(){
    scene.background=new T.Color(0x071321);scene.fog=new T.Fog(0x071321,210,380);
    const ground=new T.Mesh(new T.PlaneGeometry(175,215),mat("#081521",{roughness:1}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-1.45;ground.receiveShadow=true;scene.add(ground);
    const turf=new T.Mesh(new T.PlaneGeometry(FIELD_WIDTH,FIELD_LENGTH),mat("#167743",{roughness:.94}));
    turf.rotation.x=-Math.PI/2;turf.receiveShadow=true;scene.add(turf);
    for(let i=0;i<12;i++){
      const stripe=new T.Mesh(new T.PlaneGeometry(FIELD_WIDTH/12,FIELD_LENGTH),new T.MeshStandardMaterial({color:i%2?0x0e6638:0x21854a,transparent:true,opacity:.42,roughness:1}));
      stripe.rotation.x=-Math.PI/2;stripe.position.set(-FIELD_WIDTH/2+(i+.5)*FIELD_WIDTH/12,.008,0);stripe.receiveShadow=true;scene.add(stripe);
    }
    const y=.035,W=FIELD_WIDTH,L=FIELD_LENGTH,mark=pts=>line(pts,0xeaf8ef,.9);
    mark([[-W/2,y,-L/2],[W/2,y,-L/2],[W/2,y,L/2],[-W/2,y,L/2],[-W/2,y,-L/2]]);
    mark([[-W/2,y,0],[W/2,y,0]]);
    const circle=[];for(let i=0;i<=96;i++){const a=i/96*Math.PI*2;circle.push([Math.cos(a)*9.15,y,Math.sin(a)*9.15]);}mark(circle);
    const boxMark=(halfWidth,depth,z,insideDirection)=>{
      const inner=z+insideDirection*depth;
      mark([[-halfWidth,y,z],[halfWidth,y,z],[halfWidth,y,inner],[-halfWidth,y,inner],[-halfWidth,y,z]]);
    };
    boxMark(20.16,16.5,-L/2,1);boxMark(9.16,5.5,-L/2,1);
    boxMark(20.16,16.5,L/2,-1);boxMark(9.16,5.5,L/2,-1);
    const sideStand=mat("#12263c",{roughness:.86});
    box(scene,[6.8,9,146],[-52,4.4,0],sideStand,false,true);
    box(scene,[6.8,9,146],[52,4.4,0],sideStand,false,true);
    box(scene,[100,9,6.8],[0,4.4,-76.5],sideStand,false,true);
    box(scene,[100,9,6.8],[0,4.4,76.5],sideStand,false,true);
    seats();
    const led=mat("#06334a",{emissive:0x0879a0,emissiveIntensity:1.4,roughness:.35});
    [-1,1].forEach(side=>box(scene,[.24,.72,114],[side*39.2,.44,0],led,false,false));
    box(scene,[74,.72,.24],[0,.44,-60.85],led,false,false);
    box(scene,[74,.72,.24],[0,.44,60.85],led,false,false);
    goal(-FIELD_LENGTH/2,-1);goal(FIELD_LENGTH/2,1);
    scene.add(new T.HemisphereLight(0xadcfff,0x15251b,1.02));
    const sun=new T.DirectionalLight(0xffffff,2.05);sun.position.set(-25,48,38);sun.castShadow=true;
    sun.shadow.mapSize.set(lowPowerMode?768:2048,lowPowerMode?768:2048);sun.shadow.camera.left=-78;sun.shadow.camera.right=78;sun.shadow.camera.top=88;sun.shadow.camera.bottom=-88;sun.shadow.camera.far=220;
    sun.shadow.camera.near=1;sun.shadow.camera.far=180;sun.shadow.bias=-.00025;scene.add(sun);
    [[-60,18,-80],[60,18,-80],[-60,18,80],[60,18,80]].forEach((p,i)=>{
      cylinder(scene,.12,.16,17,[p[0],8.5,p[2]],mat("#25394c",{metalness:.55,roughness:.4}),8);
      const light=new T.PointLight(i%2?0xb7e7ff:0xe7f4ff,145,78,2);light.position.set(p[0],17,p[2]);scene.add(light);
      const panel=new T.Mesh(new T.BoxGeometry(2.8,.28,1),new T.MeshBasicMaterial({color:0xe8f9ff}));panel.position.set(p[0],16.8,p[2]);scene.add(panel);
    });
    const coords=[];for(let i=0;i<260;i++)coords.push((Math.random()-.5)*120,7+Math.random()*25,(Math.random()-.5)*150);
    const particles=new T.BufferGeometry();particles.setAttribute("position",new T.Float32BufferAttribute(coords,3));
    scene.add(new T.Points(particles,new T.PointsMaterial({color:0xd9f2ff,size:.09,transparent:true,opacity:.55})));
  }
  
  function applyModelKit(model,shirtColor,accentColor){
    const data=model?.userData;if(!data)return;
    if(data.kitMaterial)data.kitMaterial.color.set(shirtColor);
    if(data.sockMaterial)data.sockMaterial.color.set(shirtColor);
    if(data.trimMaterial)data.trimMaterial.color.set(accentColor||"#eafaff");
  }
  function setKits(homeColor,accentColor,keeperColor,awayColor){
    const home=homeColor||"#20c9ec",accent=accentColor||"#dffaff",keeper=keeperColor||"#c7ff4a",away=awayColor||"#e34b69";
    applyModelKit(playerModel,home,accent);teammateModels.forEach(p=>applyModelKit(p,home,accent));
    applyModelKit(keeperHome,keeper,accent);applyModelKit(keeperAway,away,"#ffdce4");
    applyModelKit(rivalModel,away,"#ffdce4");rivalSupportModels.forEach(p=>applyModelKit(p,away,"#ffdce4"));
  }
  function buildActors(){
    playerModel=footballer("YOU","#20c9ec","#dffaff",false,"away");
    rivalModel=footballer("RIVAL","#e34b69","#ffdce4",false,"toward");
    keeperHome=footballer("KEEPER","#f4b83e","#fff0b0",true,"away");
    keeperAway=footballer("KEEPER","#45c8ad","#dcfff6",true,"toward");
    scene.add(playerModel,rivalModel,keeperHome,keeperAway);
    teammateModels=Array.from({length:4},()=>footballer("TEAMMATE","#20c9ec","#dffaff",false,"away"));
    rivalSupportModels=Array.from({length:4},()=>footballer("RIVAL","#e34b69","#ffdce4",false,"toward"));
    teammateModels.forEach(p=>scene.add(p));rivalSupportModels.forEach(p=>scene.add(p));
    ball=makeBall();scene.add(ball);
    ballShadow=new T.Mesh(new T.CircleGeometry(.36,32),new T.MeshBasicMaterial({color:0x02080d,transparent:true,opacity:.36,depthWrite:false}));
    ballShadow.rotation.x=-Math.PI/2;ballShadow.position.y=.035;scene.add(ballShadow);
    const trailGeometry=new T.BufferGeometry();
    trailGeometry.setAttribute("position",new T.BufferAttribute(new Float32Array(6),3));
    flightTrail=new T.Line(trailGeometry,new T.LineBasicMaterial({color:0x8deaff,transparent:true,opacity:.72,depthWrite:false}));
    flightTrail.visible=false;scene.add(flightTrail);
    aimMarker=new T.Mesh(new T.RingGeometry(.7,.96,56),new T.MeshBasicMaterial({color:0xc7ff4a,transparent:true,opacity:.95,side:T.DoubleSide}));
    aimMarker.rotation.x=0;aimMarker.position.y=2.2;scene.add(aimMarker);
    const guideGeometry=new T.BufferGeometry().setFromPoints([new T.Vector3(0,.28,30),new T.Vector3(0,2,-FIELD_LENGTH/2-.7)]);
    aimGuide=new T.Line(guideGeometry,new T.LineDashedMaterial({color:0xc7ff4a,dashSize:1.25,gapSize:.72,transparent:true,opacity:.8}));aimGuide.computeLineDistances();scene.add(aimGuide);
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
    model.position.set((x-.5)*FIELD_WIDTH,0,(y-.5)*FIELD_LENGTH);model.visible=true;
    const d=model.userData,previous=d.lastPosition;
    const deltaX=previous?(x-previous.x)*FIELD_WIDTH:0,deltaZ=previous?(y-previous.y)*FIELD_LENGTH:0;
    const moved=Math.hypot(deltaX,deltaZ);
    if(moved>.012)model.rotation.y=Math.atan2(-deltaX,-deltaZ);
    else if(!previous)model.rotation.y=facing==="toward"?Math.PI:0;
    d.lastPosition={x,y};
    const stride=moved>.018?.62:.075,phase=time*(moved>.018?12.5:2.1)+d.phase;
    d.legs[0].rotation.x=Math.sin(phase)*stride;d.legs[1].rotation.x=-Math.sin(phase)*stride;
    d.arms[0].rotation.x=-Math.sin(phase)*stride*.58;d.arms[1].rotation.x=Math.sin(phase)*stride*.58;
    model.position.y=moved>.018?Math.abs(Math.sin(phase*2))*.035:Math.sin(phase)*.008;
    if(d.torso){d.torso.rotation.z=Math.sin(phase)*.025;d.torso.rotation.x=moved>.018?-.055:Math.sin(phase)*.008;}
    if(d.head){d.head.rotation.x=Math.sin(phase*.5)*.012;d.head.rotation.z=-Math.sin(phase)*.012;}
    model.position.y=.035+(moved>.018?Math.abs(Math.sin(phase*2))*.045:Math.abs(Math.sin(phase*2))*.008);
    d.halo.visible=Boolean(highlight);d.halo.material.opacity=highlight?.74:.16;d.label.visible=!d.isKeeper;
  }
  function setActorLabel(model,value){
    if(!model||!model.userData||model.userData.displayLabel===value)return;
    const old=model.userData.label?.material?.map;
    if(model.userData.label?.material){
      model.userData.label.material.map=textTexture(value,512,112,{background:"rgba(4,12,22,.82)",color:"#f5fbff",fontSize:50});
      model.userData.label.material.needsUpdate=true;
      if(old)old.dispose();
      model.userData.displayLabel=value;
    }
  }
  function shotPoint(a,t,keeperMode){
    const eased=1-Math.pow(1-t,2);
    const fromX=Number.isFinite(a.fromX)?a.fromX:.5;
    const toX=Number.isFinite(a.toX)?a.toX:.5;
    const toY=Number.isFinite(a.toY)?a.toY:.27;
    const startX=(fromX-.5)*12,endX=(toX-.5)*22;
    const startZ=keeperMode?-36:30,endZ=-FIELD_LENGTH/2-.6;
    const endHeight=.22+clamp((.105-toY)/.097,0,1)*4.25;
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
    if(!hudMode||!s)return;const h=s.mode==="headtohead",m=s.match||{};
    hudMode.textContent=h?"APEX STRIKERS · 6v6":"APEX STRIKERS · "+String(s.mode||"MATCH").toUpperCase();
    hudScore.textContent=h?(m.playerGoals+"  :  "+m.rivalGoals):(s.score+" · "+s.attemptLabel);
    hudClock.textContent=h?("MATCH "+Math.floor(m.clock||0)+"'"):(s.selectedPlayer||"PLAYER").toUpperCase();
    hudStatus.textContent=s.finished?"FULL TIME":(h?(m.hasBall?"BALL · "+(m.controlledName||"YOU")+" · "+(m.controlledRating||"")+" OVR":m.rivalHasBall?"RIVAL POSSESSION":"BALL IN PLAY"):"3D MATCH ENGINE · LIVE");
  }
  function safeState(){try{return getState?getState():null;}catch(_){return null;}}
  function render(now){
    if(!active||!renderer)return;
    if(document.hidden||wrap?.closest("#gameScreen")?.classList.contains("hidden")){raf=0;return;}
    raf=requestAnimationFrame(render);
    if(now-lastRenderAt<1000/45)return;lastRenderAt=now;
    const rect=sourceCanvas.getBoundingClientRect();if(rect.width<2||rect.height<2)return;
    if(rect.width!==lastWidth||rect.height!==lastHeight)resize();
    const s=safeState();if(!s)return;const time=now/1000,h2h=s.mode==="headtohead",m=s.match||{};
    updateHUD(s);
    const activeName=h2h?(m.controlledName||s.selectedPlayer):s.selectedPlayer;
    const activeRating=h2h?(m.controlledRating||""):"";
    const activeLabel=activeName+(activeRating?" · "+activeRating+" OVR":"");
    setActorLabel(playerModel,activeLabel);
    if(activeLabel!==lastPlayerLabel)lastPlayerLabel=activeLabel;
    if(h2h){
      playerModel.visible=true;rivalModel.visible=true;keeperHome.visible=true;keeperAway.visible=true;
      setActorLabel(keeperHome,(s.selectedGoalkeeper||"GOALKEEPER")+" · "+(s.goalkeeperRating||"")+" OVR");
      setActorLabel(keeperAway,"AI GOALKEEPER");
      place(playerModel,m.player.x===undefined?.5:m.player.x,m.player.y===undefined?.72:m.player.y,"away",time,true);
      place(rivalModel,m.rival.x===undefined?.5:m.rival.x,m.rival.y===undefined?.28:m.rival.y,"toward",time,false);
      teammateModels.forEach((p,i)=>{
        const t=m.teammates?.[i];
        if(!t){p.visible=false;return;}
        p.visible=true;setActorLabel(p,t.name+" · "+t.ovr+" OVR");
        place(p,t.x,t.y,"away",time,false);
      });
      rivalSupportModels.forEach((p,i)=>{
        const t=m.rivalTeammates?.[i];
        if(!t){p.visible=false;return;}
        p.visible=true;setActorLabel(p,t.name+" · "+t.ovr+" OVR");
        place(p,t.x,t.y,"toward",time,false);
      });
      keeperHome.position.set(0,0,FIELD_LENGTH/2-1.2);keeperHome.rotation.y=0;
      keeperAway.position.set(0,0,-FIELD_LENGTH/2+1.2);keeperAway.rotation.y=Math.PI;
      const shot=m.lastShot,shotAge=shot?now-shot.start:9999;
      if(shot&&shotAge>=0&&shotAge<760){
        const diveT=clamp(shotAge/760,0,1),diveSide=shot.x<.43?-1:shot.x>.57?1:0;
        // Goalkeeper push-off, hand extension and low landing. Avoid the exaggerated vertical leap.
        const push=Math.sin(Math.min(1,diveT*2.15)*Math.PI/2);
        const recovery=clamp((diveT-.58)/.42,0,1);
        const reach=push*(1-recovery*.72),landing=Math.sin(Math.PI*diveT);
        keeperAway.position.x=diveSide*5.25*reach;
        keeperAway.position.y=.04+.42*landing;
        keeperAway.position.z=-FIELD_LENGTH/2+1.2-diveT*.55;
        keeperAway.rotation.z=-diveSide*1.18*reach;keeperAway.rotation.x=-.16*reach;
        keeperAway.userData.arms[0].rotation.set(-1.05*reach,0,diveSide*(.42+.52*reach));
        keeperAway.userData.arms[1].rotation.set(-1.12*reach,0,diveSide*(.62+.48*reach));
        keeperAway.userData.legs[0].rotation.set(-.28*reach,0,-diveSide*.28*reach);
        keeperAway.userData.legs[1].rotation.set(.38*reach,0,diveSide*.32*reach);
      }else{
        keeperAway.position.x=0;keeperAway.position.y=0;keeperAway.rotation.z=0;keeperAway.rotation.x=0;
        keeperAway.userData.arms.forEach(a=>a.rotation.set(0,0,0));keeperAway.userData.legs.forEach(l=>l.rotation.set(0,0,0));
      }
      keeperHome.userData.label.visible=false;keeperAway.userData.label.visible=false;cameraTarget.set((m.player.x-.5)*2.8,0,(m.player.y-.5)*2.2);
      // In H2H, preview the far-post target while the player has possession in the attacking half.
      const h2hTargetX=m.player.x<.5?.59:.41;
      const h2hPreview=Boolean(m.hasBall)&&m.player.y<=.53&&!m.shotAnim&&!s.finished;
      aimMarker.visible=h2hPreview;
      if(h2hPreview){
        const tx=(h2hTargetX-.5)*FIELD_WIDTH,ty=2.65,tz=-FIELD_LENGTH/2-.7;
        aimMarker.position.set(tx,ty,tz);
        aimGuide.geometry.setFromPoints([new T.Vector3((m.ball.x-.5)*FIELD_WIDTH,.28,(m.ball.y-.5)*FIELD_LENGTH),new T.Vector3(tx,ty,tz)]);aimGuide.computeLineDistances();aimGuide.visible=true;
      }else if(aimGuide)aimGuide.visible=false;
      const matchShot=m.shotAnim;
      if(matchShot){
        const t=clamp((now-matchShot.start)/(matchShot.duration||720),0,1),ease=1-Math.pow(1-t,2);
        const sx=(matchShot.fromX-.5)*FIELD_WIDTH,sz=(matchShot.fromY-.5)*FIELD_LENGTH;
        const ex=(matchShot.toX-.5)*FIELD_WIDTH,ez=-FIELD_LENGTH/2-.55;
        const height=.24+Math.sin(Math.PI*t)*3.35;
        ball.position.set(sx+(ex-sx)*ease,height,sz+(ez-sz)*ease);
        const tailT=Math.max(0,t-.16),tailEase=1-Math.pow(1-tailT,2);
        const attr=flightTrail.geometry.attributes.position;
        attr.setXYZ(0,sx+(ex-sx)*tailEase,.24+Math.sin(Math.PI*tailT)*3.35,sz+(ez-sz)*tailEase);
        attr.setXYZ(1,ball.position.x,ball.position.y,ball.position.z);
        attr.needsUpdate=true;flightTrail.geometry.computeBoundingSphere();flightTrail.visible=t>.02&&t<.98;
      }else{
        flightTrail.visible=false;
        ball.position.set((m.ball.x-.5)*FIELD_WIDTH,.24,(m.ball.y-.5)*FIELD_LENGTH);
      }
    }else{
      teammateModels.forEach(p=>p.visible=false);rivalSupportModels.forEach(p=>p.visible=false);rivalModel.visible=false;keeperHome.visible=false;keeperAway.visible=true;
      applyModelKit(keeperAway,s.goalkeeperKitColor||"#c7ff4a","#eafaff");
      if(s.mode==="goalkeeping"||s.mode==="survival"){playerModel.visible=false;setActorLabel(keeperAway,(s.selectedGoalkeeper||"GOALKEEPER")+" · "+(s.goalkeeperRating||"")+" OVR");keeperAway.position.set(0,0,-FIELD_LENGTH/2+1.2);keeperAway.userData.label.visible=true;}
      else{place(playerModel,.5,.76,"away",time,true);setActorLabel(keeperAway,(s.selectedGoalkeeper||"GOALKEEPER")+" · "+(s.goalkeeperRating||"")+" OVR");keeperAway.position.set(0,0,-FIELD_LENGTH/2+1.2);keeperAway.userData.label.visible=true;}
      keeperAway.rotation.y=Math.PI;
      const keeperMode=s.mode==="goalkeeping"||s.mode==="survival";
      const dive=s.keeperMotion;
      if(dive){
        const raw=clamp((now-dive.start)/(dive.duration||450),0,1);
        const e=1-Math.pow(1-raw,2),side=Number(dive.side)||0,airborne=Math.sin(Math.PI*e);
        keeperAway.position.x=side*4.4*e;keeperAway.position.y=.08+.56*airborne;
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
      aimMarker.visible=!keeperMode&&!s.finished&&!s.ballAnim;
      if(aimMarker.visible){
        const targetX=((s.aim.x===undefined?.5:s.aim.x)-.5)*22;
        const targetY=.22+clamp((.105-(s.aim.y===undefined?.055:s.aim.y))/.097,0,1)*4.25;
        aimMarker.position.set(targetX,targetY,-FIELD_LENGTH/2-.7);
        const startX=(.522-.5)*FIELD_WIDTH,startZ=(.735-.5)*FIELD_LENGTH;
        aimGuide.geometry.setFromPoints([new T.Vector3(startX,.28,startZ),new T.Vector3(targetX,targetY,-FIELD_LENGTH/2-.7)]);aimGuide.computeLineDistances();aimGuide.visible=true;
      }else if(aimGuide)aimGuide.visible=false;
      const a=s.ballAnim;
      if(a){
        const t=clamp((now-a.start)/(a.duration||650),0,1);
        ball.position.copy(shotPoint(a,t,keeperMode));updateFlightTrail(a,t,keeperMode);
      }else{
        flightTrail.visible=false;
        const bx=keeperMode?.5:.522,by=keeperMode?.2:.735;
        ball.position.set((bx-.5)*FIELD_WIDTH,.24,(by-.5)*FIELD_LENGTH);
      }
    }
    const moving=Boolean(s.ballAnim);
    ball.rotation.x+=moving?.085:.009;ball.rotation.z+=moving ? .043+(Math.abs(Number(s.ballAnim?.curve)||0)*.65) : .012;
    updateBallShadow();
    const focusX=h2h?(m.player.x-.5)*FIELD_WIDTH:0;
    const focusZ=h2h?((m.ball?.y??m.player.y)-.5)*FIELD_LENGTH:0;
    const playerZ=h2h?(m.player.y-.5)*FIELD_LENGTH:0;
    const keeperMode=s.mode==="goalkeeping"||s.mode==="survival";
    let camX=0,camY=38,camZ=72,lookX=0,lookY=0,lookAtZ=0;
    if(cameraMode==="sideline"){
      // FC Mobile-inspired sideline broadcast camera, following the ball.
      camX=FIELD_WIDTH*1.12;camY=FIELD_WIDTH*.78;camZ=focusZ+4;
      lookX=0;lookY=0;lookAtZ=focusZ-2;
    }else if(cameraMode==="broadcast"){
      camX=FIELD_WIDTH*1.48;camY=FIELD_LENGTH*.95;camZ=FIELD_LENGTH*.98;
      lookX=0;lookY=0;lookAtZ=0;
    }else if(cameraMode==="tactical"){
      camX=0;camY=FIELD_LENGTH*1.08;camZ=12;
      lookX=0;lookY=0;lookAtZ=0;
    }else if(cameraMode==="player"){
      camX=focusX;camY=4.8;camZ=playerZ+3.8;
      lookX=focusX;lookY=2.4;lookAtZ=playerZ-20;
    }else{
      camX=focusX*.72;camY=23;camZ=playerZ+25;
      lookX=focusX*.45;lookY=0;lookAtZ=playerZ-17;
    }
    if(!h2h&&keeperMode&&cameraMode!=="sideline"&&cameraMode!=="broadcast"&&cameraMode!=="tactical"){
      camZ=-FIELD_LENGTH/2+14;lookAtZ=-FIELD_LENGTH/2-8;
    }
    camera.position.x+=(camX-camera.position.x)*.085;
    camera.position.y+=(camY-camera.position.y)*.085;
    camera.position.z+=(camZ-camera.position.z)*.085;
    cameraTarget.lerp(new T.Vector3(lookX,lookY,lookAtZ),.09);
    camera.lookAt(cameraTarget);renderer.render(scene,camera);
  }
  function init(canvas,getter){
    if(active)return true;if(!T||!canvas||!canvas.parentElement)return false;
    try{
      sourceCanvas=canvas;wrap=canvas.parentElement;getState=getter;
      if(getComputedStyle(wrap).position==="static")wrap.style.position="relative";
      glCanvas=document.createElement("canvas");glCanvas.className="apex-3d-canvas";glCanvas.setAttribute("aria-hidden","true");wrap.appendChild(glCanvas);
      hud=document.createElement("div");hud.className="apex-3d-hud";
      hud.innerHTML='<div class="apex-3d-scoreboard"><div class="apex-3d-hud-top"><span class="apex-3d-hud-brand">APEX <b>STRIKERS</b></span><span class="apex-3d-hud-live"><i></i> LIVE</span></div><div class="apex-3d-hud-middle"><span class="apex-3d-hud-mode">MATCH</span><strong class="apex-3d-hud-score">0 : 0</strong><span class="apex-3d-hud-clock">00:00</span></div></div><div class="apex-3d-hud-status">BALL IN PLAY</div>';
      wrap.appendChild(hud);hudMode=hud.querySelector(".apex-3d-hud-mode");hudScore=hud.querySelector(".apex-3d-hud-score");hudClock=hud.querySelector(".apex-3d-hud-clock");hudStatus=hud.querySelector(".apex-3d-hud-status");
      lowPowerMode=window.matchMedia?.("(max-width: 800px)").matches||Number(navigator.hardwareConcurrency||8)<=4||Number(navigator.deviceMemory||8)<=4||Boolean(navigator.connection?.saveData);
      renderer=new T.WebGLRenderer({canvas:glCanvas,antialias:!lowPowerMode,alpha:false,powerPreference:"high-performance"});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,lowPowerMode?1:1.5));renderer.shadowMap.enabled=!lowPowerMode;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=!lowPowerMode;renderer.shadowMap.needsUpdate=true;
      renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.22;
      if("outputColorSpace" in renderer)renderer.outputColorSpace=T.SRGBColorSpace;
      scene=new T.Scene();camera=new T.PerspectiveCamera(47,1,.1,400);camera.position.set(0,23,29);camera.zoom=cameraZoom;camera.updateProjectionMatrix();
      buildScene();buildActors();resize();sourceCanvas.classList.add("apex-2d-hidden");
      glCanvas.addEventListener("webglcontextlost",e=>{e.preventDefault();cancelAnimationFrame(raf);sourceCanvas.classList.remove("apex-2d-hidden");glCanvas.style.display="none";hud.style.display="none";active=false;console.warn("Apex 3D context lost; switched to the 2D match view.");});
      if(window.ResizeObserver){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(sourceCanvas);resizeObserver.observe(wrap);}
      window.addEventListener("resize",resize,{passive:true});
      document.addEventListener("visibilitychange",()=>{if(!active||!renderer)return;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else if(!raf){raf=requestAnimationFrame(render);}});
      active=true;if(!document.hidden)raf=requestAnimationFrame(render);return true;
    }catch(error){
      if(sourceCanvas)sourceCanvas.classList.remove("apex-2d-hidden");if(glCanvas)glCanvas.remove();if(hud)hud.remove();
      renderer=null;active=false;console.warn("Apex 3D renderer unavailable; using the 2D fallback.",error);return false;
    }
  }
  function sync(){if(active)updateHUD(safeState()||{});}
  function setZoom(value){cameraZoom=clamp(Number(value)||1,.75,1.9);if(camera){camera.zoom=cameraZoom;camera.updateProjectionMatrix();}return cameraZoom;}
  function getZoom(){return cameraZoom;}
  function setCameraView(value){
    const allowed=["sideline","broadcast","behind","tactical","player"];
    if(!allowed.includes(value))return cameraMode;
    cameraMode=value;return cameraMode;
  }
  function getCameraView(){return cameraMode;}
  function resume(){if(active&&renderer&&!document.hidden&&!raf)raf=requestAnimationFrame(render);}
  function pause(){if(raf)cancelAnimationFrame(raf);raf=0;}
  window.ApexMatch3D={init,resize,sync,resume,pause,setZoom,getZoom,setCameraView,getCameraView,setKits,get active(){return active;}};
})();