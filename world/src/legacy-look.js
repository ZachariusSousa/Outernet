export const look={
 palette:{background:'#202630',cream:'#eee3cf'},ui:{font:'14px system-ui',text:'#eee3cf',panel:'#202630ed',border:'#968c7755',radius:'12px',fadeSeconds:.6,fadeDelay:3000,idleOpacity:.3},
 motion:{walk:2.5,planeBase:1.5,planeLatencyDivisor:100,planeMin:1.5,planeMax:4,planeArc:180,tool:1.2,poof:.4,shimmer:5},
 agents:{size:270,bob:5,squash:.025,blinkMin:3,blinkMax:6,blinkDuration:.14,hop:24,turn:.13,sit:.8,sleep:.55,hover:15,tints:[0,.025,-.025],rim:4},
 light:{fire:{strength:.8,flicker:.12},lamp:{strength:.6,flicker:.03},night:.35,bloom:0,threshold:.8},
 grade:{warmth:0,contrast:1,saturation:1,vignette:0,grain:0},
 view:{parallax:8,followZoom:1.3,ease:.08},
 weather:{far:{count:45,speed:18,size:4},near:{count:24,speed:35,size:7},dust:14,steam:6},
 effects:{height:280,font:'48px sans-serif',planeWidth:140,planeHeight:90},
 placement:{radius:20,lineWidth:5,font:'32px sans-serif',spot:'#76dfbd',path:'#e2bb73',foot:'#df87ba'},
};
// Locked block-art presentation. Artwork geometry lives in SVG; placement in scene.json.
look.agents.size=128;look.agents.bob=4;look.agents.hop=8;look.agents.hover=4;
look.agents.sit=1;look.agents.sleep=1;look.agents.squash=0;
look.grid={step:8,small:4};look.view.top=144;look.view.bottom=96;look.view.parallax=0;
look.effects.height=136;look.effects.planeWidth=64;look.effects.planeHeight=48;
look.props={size:32};look.weather.far.size=4;look.weather.near.size=8;
