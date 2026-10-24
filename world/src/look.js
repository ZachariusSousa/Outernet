// Visual tuning only. Sprite/light placement is in layout.json; behavior in scene.json.
export const look = {
 art: {size:[480,360],sourcePixelScale:4,chromaKey:'#FF00FF',matte:'#141a2c',palette:['#141a2c','#1c2638','#2b3a52','#40516c','#60758c','#8a9baa','#cfdbe8','#e9f0f6','#302634','#4a3440','#674957','#866074','#aa7e93','#d7abc1','#402f2b','#604438','#85604a','#ac815c','#d0a572','#edd2a0','#f3e3c3','#fff0d0','#ffcf8a','#ffb35c','#c98150','#944c3d','#b5574a','#8f3b30','#39354e','#554969','#79659a','#ab87ce','#d1a9e5','#3f4f3e','#5e7059','#8b9d76','#2a2230','#f2a7bb','#e57b9b','#d8c08e','#b89660','#efe2c4','#9aa3ad','#3f444d','#eef0f3','#5e3b26','#8a5530','#b0703f','#f5efe2']},
 view:{defaultZoom:0,maxExtraZoom:2,header:82,footer:66,background:'#101522',panThreshold:4,parallax:.08},
 ui:{text:'#f3e3c3',muted:'#8a9baa',panel:'#1c2638',border:'#40516c',font:'13px ui-monospace, monospace',pixelFont:'8px monospace',cardWidth:270},
 light:{strength:.13,flickerSpeed:2.3,flickerAmount:.08,rgbColor:'#ab65ff',rgbGlow:.23,glows:{lamp:{color:'#ffcf8a',strength:.12},fire:{color:'#ff8a3d',strength:.18},tv:{color:'#60758c',strength:.06}},lines:{string:{enabled:true,color:'#ffcf8a',wire:'#604438',spacing:8,twinkle:.12,speed:1.6,size:1,glow:.16},fairy:{enabled:true,color:'#ffb35c',wire:'#604438',spacing:4,twinkle:.3,speed:2,size:1,glow:.12},rgb:{enabled:true,wire:'#554969',spacing:1,twinkle:.03,speed:1,size:1,glow:.18}}},
 glass:{color:'#60758c',alpha:.09,reflection:'#cfdbe8',reflectionAlpha:.16,lineWidth:1},
 // Outdoor buildings are movable sprites. Only sky and river belong to the backdrop.
 city:{sky:['#141a2c','#1c2638','#2b3a52'],river:'#1c2638',riverLight:'#60758c',windowColor:'#ffcf8a',twinkleAlpha:.18},
 weather:{depths:[{count:45,speed:5,size:1,alpha:.35,drift:2},{count:20,speed:10,size:1,alpha:.8,drift:4}],snowColor:'#e9f0f6',twinkleRate:.35,twinkleAlpha:.65,shimmer:.025,shimmerSpeed:.2,steam:{color:'#e9f0f6',alpha:.3,height:10,speed:2,count:3},dust:{color:'#ffcf8a',alpha:.4,count:9,speed:.35}},
 grade:{warmth:.025,warmthColor:'#ffb35c',contrast:1,vignette:.08,vignetteColor:'#141a2c',vignetteBands:3,vignetteStep:8},
 agents:{svgScale:.25,tints:[-.07,0,.07],bob:1,bobSpeed:2,hop:2,hopSpeed:9,blinkMin:3,blinkMax:7,blinkDuration:.16,hover:1,flapSpeed:5,sitLower:2,shadow:'#2a2230',shadowAlpha:.25,shadowWidth:22,spacing:36,footSpacing:32,walk:2.5,wanderMin:20,wanderMax:60,napChance:.22,snackChance:.25,tool:1.5,busyTool:.3,stickyLife:60,shimmer:8,toolPulse:.13,poof:.4,planeBase:1.5,planeLatencyDivisor:100,planeMin:1.5,planeMax:4,planeArc:24,planeFlutter:2,planeFlutterSpeed:18,effectRise:9,effectLife:1.3,effectHeight:28,itemSize:10,paper:'#f3e3c3',ink:'#40516c',sticky:'#ffcf8a',sparkle:'#fff0d0'},
 placement:{radius:3,hitRadius:6,lineWidth:1,font:'6px monospace',spot:'#8b9d76',path:'#60758c',foot:'#ffb35c',light:'#d1a9e5',window:'#cfdbe8',fillAlpha:.1},
 // Temporary colors for the placeholder shell, backdrop and sprite-sheet builder.
 placeholder:{label:'PLACEHOLDER ART',floor:'#85604a',floorSide:'#604438',wall:'#ac815c',wallShade:'#85604a',sofa:'#79659a',table:'#604438',screen:'#2b3a52',plant:'#5e7059',rug:'#554969',snow:'#cfdbe8',lamp:'#ffcf8a'}
};
