// Step 1 HD-2D art direction. Object geometry is data here so it can be tuned without module rewrites.
export const look={
 textures:{density:32,palette:['#101b30','#1b2b43','#2c405c','#49617d','#7696b0','#b3c9da','#e2e9ec','#f5e8cf','#c6b69e','#98856e','#6e5b49','#423b37','#e3b476','#ffcf8a','#ffad57','#a86f42','#9173c4','#bba2df','#4c3f6c','#354e43','#53715b','#859879','#833f51','#b77183']},
 render:{pixelRatio:1.25,exposure:1.05,shadowSize:1024,bevel:.035,bevelSegments:1,segments:8,roughness:.94},
 camera:{fov:24,near:.1,far:250,target:[0,.7,0],yaw:40,tilt:37,close:38,farDistance:100,orbit:20,orbitSensitivity:.004,spring:.06,zoomEase:.07},
 post:{bloom:{strength:.48,radius:.35,threshold:1.1},focus:{aperture:.00008,maxblur:.004},fog:{color:'#14243d',near:38,far:145},vignette:.18},
 lighting:{ambient:{sky:'#8eadd9',ground:'#302a37',strength:.5},rgb:'#af68ff',rgbPower:2.5,screenPower:1.8,bulbPower:3.2,glassOpacity:.13,lights:[
 {position:[-4,3,-2],color:'#ffce8a',strength:32,range:10,shadow:true},
 {position:[3,3,-3],color:'#ffbf77',strength:22,range:8},
 {position:[4,1.8,1],color:'#9c7dff',strength:10,range:6},
 {position:[-7,1,3],color:'#ff9944',strength:22,range:7},
 {position:[0,8,0],color:'#829fdb',strength:55,range:25},
 {position:[0,1,-4],color:'#729cf0',strength:8,range:5}]},
 weather:{count:400,area:[26,16,24],speed:.6,size:.065,drift:.15,color:'#cbd9ed'},
 materials:{wood:'wood',floor:'parquet',cream:'fabric',dark:'metal',rug:'rug',snow:'snow',stone:'stone',wall:'concrete',green:'leaf',screen:'tv-screen',rgb:'white',bulb:'white',glass:'white',red:'velvet'},
 colors:{wood:'#c6b69e',floor:'#ffffff',cream:'#f5e8cf',dark:'#354158',rug:'#c6b69e',snow:'#e2e9ec',stone:'#b3c9da',wall:'#b3c9da',green:'#859879',screen:'#ffffff',rgb:'#ffffff',bulb:'#ffcf8a',glass:'#b3c9da',red:'#833f51'},
 ui:{background:'#101b30',text:'#f5e8cf',muted:'#8ea4c0',font:'13px system-ui',top:28,left:32},
 // Parts: [position, dimensions, material, optional primitive]. All sizes are metres.
 models:{
 shell:[[[0,-.22,0],[19,.4,15],'stone'],[[0,.015,0],[14,.12,10],'floor'],[[0,1.8,-5],[14,3.6,.12],'wall'],[[7,1.8,-2],[.12,3.6,6],'wall'],[[0,3.55,-4.85],[14,.1,.1],'rgb'],[[6.85,3.55,-2],[.1,.1,6],'rgb'],[[0,-1,0],[18,1,14],'wall']],
 sofa:[[[0,.35,0],[4.7,.6,1.55],'cream'],[[0,.95,-.65],[4.7,.8,.25],'cream'],[[-2.2,.75,0],[.35,.7,1.65],'cream'],[[2.2,.75,0],[.35,.7,1.65],'cream'],[[-1.55,.4,1.1],[1.35,.65,1.5],'cream'],[[-1.5,.72,-.05],[1.3,.18,1.1],'cream'],[[0,.72,-.05],[1.3,.18,1.1],'cream'],[[1.5,.72,-.05],[1.3,.18,1.1],'cream'],[[-1.35,1.05,-.4],[.7,.55,.2],'red'],[[1.1,1.05,-.4],[.7,.55,.2],'dark']],
 coffee:[[[0,.5,0],[2.3,.15,1.35],'wood'],[[-.8,.24,0],[.12,.5,1],'dark'],[[.8,.24,0],[.12,.5,1],'dark'],[[0,.61,0],[.9,.06,.7],'rug'],[[.65,.65,.25],[.25,.12,.2],'red']],
 tv:[[[0,.35,0],[3.8,.65,.7],'wood'],[[0,1.9,-.2],[3.4,1.9,.16],'dark'],[[0,1.9,-.1],[3.2,1.7,.03],'screen'],[[0,1.9,-.3],[3.6,2.1,.05],'rgb'],[[1.25,.8,0],[.3,.45,.35],'cream']],
 island:[[[0,.5,0],[3.2,1,1.25],'wood'],[[0,1.07,0],[3.5,.16,1.5],'stone'],[[.6,1.2,0],[.6,.15,.35],'green']],
 stool:[[[0,.65,0],[.55,.15,.55],'wood'],[[0,.3,0],[.1,.6,.1],'dark'],[[0,.04,0],[.45,.08,.45],'dark']],
 kitchen:[[[0,.5,0],[5.8,1,.75],'dark'],[[0,1.05,0],[6,.1,.9],'stone'],[[-2,1.7,0],[1.4,3.3,.9],'stone'],[[.4,2.5,0],[2.4,.85,.6],'dark'],[[.4,2.02,.2],[2.3,.035,.1],'bulb']],
 desk:[[[0,.86,0],[3.3,.12,1],'wood'],[[-1.4,.4,0],[.12,.8,.7],'dark'],[[1.4,.4,0],[.12,.8,.7],'dark'],[[-.7,1.45,-.2],[1.25,.8,.08],'screen'],[[.7,1.45,-.2],[1.25,.8,.08],'screen'],[[0,1,-.48],[3,.05,.05],'rgb'],[[0,.96,.2],[1,.05,.3],'dark']],
 beanbag:[[[0,.35,0],[1.1,.65,1.1],'red','sphere']],
 planter:[[[0,.3,0],[.65,.6,.65],'stone'],[[0,1,0],[.7,1.1,.6],'green','cone']],
 pine:[[[0,.4,0],[.8,.7,.8],'wood'],[[0,1.1,0],[1.2,1.4,1.2],'green','cone'],[[0,1.25,0],[.8,1.2,.8],'snow','cone']],
 lamp:[[[0,.8,0],[.06,1.6,.06],'dark'],[[0,1.65,0],[.5,.55,.5],'bulb'],[[0,.04,0],[.4,.08,.4],'dark']],
 firepit:[[[0,.25,0],[1.2,.5,1.2],'dark'],[[0,.55,0],[.8,.15,.8],'bulb']],
 lounger:[[[0,.35,0],[.8,.15,1.8],'cream'],[[0,.42,0],[.85,.06,1.8],'snow'],[[0,.18,0],[.55,.3,1.4],'dark']],
 dining:[[[0,.8,0],[1.7,.12,1.2],'wood'],[[0,.4,0],[.4,.8,.4],'dark']],
 bookshelf:[[[0,1,0],[1.3,2,.5],'wood'],[[0,1,.28],[1.1,1.8,.05],'rug']],
 railing:[[[0,.65,0],[.07,1.3,.07],'dark'],[[0,1.3,0],[2.1,.07,.07],'dark'],[[0,1.37,0],[2.1,.08,.12],'snow'],[[0,.7,0],[2,1.1,.03],'glass'],[[0,1.16,0],[.09,.12,.09],'bulb']],
 snowbank:[[[0,0,0],[2,.12,1.2],'snow']],
 rug:[[[0,.09,0],[5.5,.02,4],'rug']]
 }
};
// Screenshot-driven refinements: restrained glow, snowy deck and visible glazing.
look.lighting.rgbPower=1.4;look.lighting.screenPower=.65;look.lighting.bulbPower=1.8;
look.models.tv=look.models.tv.filter(p=>p[2]!=='rgb');
look.models.tv.push([[0,2.9,-.12],[3.5,.05,.06],'rgb'],[[0,.9,-.12],[3.5,.05,.06],'rgb'],[[-1.75,1.9,-.12],[.05,2,.06],'rgb'],[[1.75,1.9,-.12],[.05,2,.06],'rgb']);
look.models.shell=look.models.shell.filter(p=>!(p[2]==='wall'&&p[0][1]===1.8));
look.models.shell.push([[0,1.8,-5],[14,3.6,.06],'glass'],[[7,1.8,-2],[.06,3.6,6],'glass'],[[-8,.055,0],[2.2,.1,14],'snow'],[[0,.055,6],[16,.1,2],'snow'],[[8,.055,0],[1.8,.1,14],'snow']);
for(let x=-7;x<=7;x+=2)look.models.shell.push([[x,1.8,-5],[.08,3.6,.12],'dark']);
look.models.shell.push([[7,1.8,-3],[.12,3.6,.08],'dark'],[[7,1.8,0],[.12,3.6,.08],'dark']);
look.colors.green='#ffffff';
look.ui.title='Somewhere above the snow.';look.ui.eyebrow='OUTERNET / MIDTOWN';look.ui.subtitle='Penthouse study · HD-2D scene review';look.ui.hint='Scroll to pull back · Drag to look around';
look.weather.opacity=.7;look.weather.bottom=-1;
look.lighting.flicker={amount:.025,speed:1.4};
look.camera.scrollSensitivity=.02;
look.ui.titleSize=28;look.ui.smallSize=10;look.ui.captionSize=11;look.ui.footerBottom=18;
// Step 1 review revisions and step 2 city art direction.
look.camera.fov=20;look.camera.tilt=55;look.camera.close=57;look.camera.farDistance=220;look.camera.farTarget=[0,-17,0];look.camera.farTilt=43;look.camera.far=500;
look.post.fog.near=85;look.post.fog.far=260;look.post.bloom.threshold=1.8;look.lighting.screenPower=.12;look.lighting.bulbPower=2.8;
look.colors.wall='#f5e8cf';look.colors.floor='#ffcf8a';look.render.segments=12;
look.models.shell=[[[0,-.3,0],[14,.4,10],'stone'],[[0,-.06,0],[14,.12,10],'floor'],[[0,1.8,-5],[14,3.6,.18],'wall'],[[7,1.8,-2],[.18,3.6,6],'wall'],[[0,.12,-4.84],[14,.24,.1],'dark'],[[6.84,.12,-2],[.1,.24,6],'dark'],[[0,3.5,-4.7],[14,.28,.65],'wall'],[[6.7,3.5,-2],[.65,.28,6],'wall'],[[0,3.32,-4.57],[14,.06,.08],'rgb'],[[6.57,3.32,-2],[.08,.06,6],'rgb'],[[-7,1.5,-1.6],[.06,3,6.5],'glass'],[[-7,3,-1.6],[.1,.1,6.5],'dark'],[[-7,-.25,0],[.45,.15,10],'stone'],[[0,-.22,5],[14,.16,.4],'stone']];
look.models.sofa.push([[.3,.9,-.4],[.65,.5,.2],'red'],[[-1,.78,.35],[1.2,.08,1.2],'rug']);
look.models.coffee=[[[0,.5,0],[2.4,.15,2.4],'wood','cylinder'],[[0,.25,0],[.7,.5,.7],'dark','cylinder'],[[0,.62,0],[.8,.08,.65],'rug'],[[.5,.68,.3],[.45,.1,.3],'red'],[[-.5,.67,-.2],[.5,.1,.3],'cream'],[[.4,.7,-.5],[.4,.2,.4],'wood','sphere']];
look.models.rug=[[[0,-.1,0],[5.8,.03,5.8],'rug','cylinder']];
look.models.planter=[[[0,.35,0],[.75,.7,.75],'stone','cylinder'],[[0,1.1,0],[.1,1,.1],'wood','cylinder'],[[.2,1.3,0],[.8,.5,.7],'green','sphere'],[[-.2,1.6,0],[.7,.6,.6],'green','sphere'],[[.1,1.9,0],[.6,.6,.6],'green','sphere']];
look.models.firepit=[[[0,.25,0],[1.3,.5,1.3],'dark','cylinder'],[[0,.54,0],[.9,.15,.9],'bulb','cone']];
look.models.dining=[[[0,.8,0],[1.5,.12,1.5],'wood','cylinder'],[[0,.4,0],[.2,.8,.2],'dark','cylinder']];
look.models.chair=[[[0,.45,0],[.6,.12,.6],'wood'],[[0,.8,-.25],[.6,.6,.1],'wood'],[[-.22,.22,0],[.07,.45,.5],'dark'],[[.22,.22,0],[.07,.45,.5],'dark']];
look.models.pendant=[[[0,2.9,0],[.035,1.2,.035],'dark','cylinder'],[[0,2.3,0],[.48,.48,.48],'bulb','sphere']];
look.models.bulkhead=[[[0,1,0],[2.4,2,2],'wall'],[[0,2.1,0],[2.7,.25,2.3],'snow'],[[0,.8,1.03],[1,1.6,.05],'dark']];
look.models.bay=[[[0,.5,0],[1.7,.7,1.2],'cream'],[[0,1.8,.6],[1.8,2.6,.04],'glass'],[[-.9,1.8,0],[.05,2.6,1.2],'glass'],[[.9,1.8,0],[.05,2.6,1.2],'glass'],[[0,3.1,0],[1.9,.1,1.4],'dark']];
look.models.art=[[[0,1.8,0],[.9,1.2,.12],'wood'],[[0,1.8,.08],[.75,1.05,.02],'rug']];
look.models.kitchen.push([[1.8,2.2,0],[1.4,1.8,.7],'dark'],[[-.5,1.6,.2],[1.5,.08,.65],'wood'],[[-.8,1.8,.2],[.2,.3,.25],'cream'],[[-.3,1.8,.2],[.3,.3,.25],'green']);
look.models.tablelamp=[[[0,.45,0],[.65,.9,.65],'wood','cylinder'],[[0,1,0],[.08,.3,.08],'dark','cylinder'],[[0,1.3,0],[.4,.4,.4],'bulb','sphere']];
look.models.lounger.push([[0,.5,0],[.9,.18,1.85],'snow','sphere']);look.models.pine.push([[0,1.9,0],[.55,.8,.55],'snow','cone']);
look.models.railing=look.models.railing.filter(p=>p[2]!=='snow');look.models.railing.push([[0,1.38,0],[2.1,.15,.2],'snow','capsule']);
look.models.sunken=[[[0,-.18,0],[6.4,.1,4.8],'floor']];
look.city={floorY:-32,width:17,depth:13,height:31,segments:12,windowSpacing:1.6,floorSpacing:2.2,windowSize:[.7,1.1,.05],litFraction:.55,seed:23,windowColors:['#ffcf8a','#e3b476','#7696b0','#1b2b43'],emission:1.6,stone:'#49617d',snow:'#b3c9da',trafficCount:14,peopleCount:24,streetZ:16,laneWidth:3,roadWidth:12,roadLength:100,carSpeed:3,personSpeed:.4,steamCount:12,steamRise:.6,riverZ:-60,riverWidth:100};
look.lighting.interior={min:[-6.8,-.5,-4.8],max:[6.8,3.5,4.8],color:'#ffb969',strength:.4};
look.lighting.lights.push({position:[-1,2,3],color:'#ffce8a',strength:14,range:6},{position:[3,2,-2],color:'#ffce8a',strength:14,range:6});
look.terrace={left:-7,right:7,back:-5,front:7,outerLeft:-10,radius:2,level:-.42,railSegments:12,snowCap:.16};
look.models.terrace=[];
// Low-poly arc pieces for the large rounded terrace corner and matching planter.
for(let i=0;i<12;i++){const a=i/12*Math.PI/2;const x=-8-2*Math.cos(a),z=5+2*Math.sin(a);look.models.terrace.push([[x,-.5,z],[.8,.2,.8],'snow','sphere'],[[x,.25,z],[.06,1.4,.06],'dark','cylinder'],[[x,.97,z],[.75,.16,.2],'snow','capsule'],[[x,.85,z],[.1,.12,.1],'bulb']);}
look.models.terrace.push([[-8.5,-.5,0],[3,.2,10],'snow'],[[0,-.5,6],[16,.2,2],'snow'],[[-8.1,-.39,0],[.8,.035,8],'stone'],[[-8,-.4,4],[1.8,.2,1],'snow','sphere'],[[-8.7,-.1,5.3],[1.1,.5,1.1],'stone','cylinder'],[[-8.7,.2,5.3],[1.2,.2,1.2],'snow','sphere']);
look.models.steps=[[[0,-.14,0],[2,.16,.6],'stone'],[[0,-.3,.5],[2,.16,.6],'stone']];
look.lighting.rgbPower=3;look.lighting.screenPower=.025;
look.models.shell=look.models.shell.filter(p=>p[2]!=='floor');
look.models.shell.push([[0,-.18,1.3],[6.4,.12,4.8],'floor'],[[-5.3,-.06,0],[3.4,.12,10],'floor'],[[5.3,-.06,0],[3.4,.12,10],'floor'],[[0,-.06,-3.2],[7.2,.12,3.6],'floor'],[[0,-.06,4.5],[7.2,.12,1],'floor']);
look.models.rug=[[[0,-.09,0],[5.8,.025,5.8],'rug','cylinder']];
look.models.sunken=[];
look.models.shell.push([[0,3.3,-4.33],[14,.08,.06],'rgb'],[[6.33,3.3,-2],[.06,.08,6],'rgb']);
look.models.art=[[[0,1.8,0],[.9,1.2,.12],'wood'],[[0,1.8,.08],[.75,1.05,.02],'rug']];
look.city.stone='#7696b0';
look.post.fog.near=180;look.post.fog.far=550;look.lighting.ambient.strength=.95;look.lighting.ambient.ground='#607088';
look.models.shell[0][0][1]=-.56;
look.city.windowFlickerPeriod=13;look.city.antennaPeriod=1.3;look.city.signalPeriod=9;
look.terrace.railRadius=.045;look.terrace.planterRadius=.23;look.terrace.capRadius=.09;
// Continuous curved rail/cap replaces the individual arc beads.
look.models.terrace=look.models.terrace.filter(p=>p[0][1]!==.97);
// Claude look pass 1: flatter lens (less fisheye on nearby towers), warmer inside, haze for depth, quieter city windows.
look.camera.fov=12;look.camera.close=95;look.camera.farDistance=365;look.camera.far=900;
look.post.fog={color:'#1c2744',near:160,far:620};
look.post.bloom.strength=.6;look.post.bloom.threshold=1.4;
look.render.exposure=1;
look.lighting.ambient={sky:'#5d6f9e',ground:'#3a3040',strength:.6};
look.lighting.interior.color='#ffb060';look.lighting.interior.strength=.75;
look.colors.rug='#a8977f';
look.city.windowColors=['#ffcf8a','#ffb35c','#e3b476','#1b2b43','#26344d'];look.city.litFraction=.45;
// The cool sky fill sat right above the room and turned the floor blue; move it out over the terrace.
look.lighting.lights[4]={position:[-12,9,9],color:'#829fdb',strength:16,range:22};
look.lighting.ambient.strength=.35;look.lighting.interior.strength=1.3;

look.colors.floor='#ffffff';
look.colors.floor='#d6c2a6';look.lighting.interior.strength=1;look.colors.rug='#7a7488';
look.colors.floor='#bfb3a6';look.lighting.lights[3].color='#ffbb7a';look.lighting.lights[3].strength=16;
look.post.fog={color:'#243152',near:240,far:760};
