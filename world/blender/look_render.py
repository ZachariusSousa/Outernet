# NYC render settings. All coordinates are Blender Z-up metres.
LOOK={
 'resolution':(960,1080),'samples':64,'seed':23,'bevel':.04,
 'camera':{'position':(46,-62,60),'target':(0,0,17),'scale':59,'near':.1,'far':220},
 'world':{'color':(.035,.07,.14),'strength':.25},
 'colors':{'wall':(.52,.56,.61),'floor':(.055,.07,.09),'wood':(.15,.09,.055),'concrete':(.105,.15,.22),'snow':(.55,.7,.88),'sofa':(.36,.41,.49),'red':(.28,.055,.09),'cream':(.72,.64,.49),'dark':(.018,.03,.055),'metal':(.11,.16,.22),'green':(.055,.18,.13)},
 'windows':{'fraction':.55,'colors':[(1,.57,.25),(.95,.74,.46),(.18,.38,.65)],'emission':.8},
 'lights':[
 {'name':'living lamp','position':(-3,2,33.8),'target':(-3,0,31),'color':(1,.63,.33),'power':230,'size':2},
 {'name':'island pendant','position':(2,2,34),'target':(2,2,31),'color':(1,.72,.45),'power':150,'size':1.5},
 {'name':'desk','position':(4,-2,33),'target':(4,-2,31),'color':(.35,.55,1),'power':60,'size':1},
 {'name':'night fill','position':(0,8,40),'target':(0,0,31),'color':(.28,.48,1),'power':800,'size':10},
 {'name':'terrace fire','position':(-8,0,32),'target':(-8,1,31),'color':(1,.35,.1),'power':210,'size':1},
 {'name':'street lamps','position':(-8,-8,6),'target':(0,-8,0),'color':(1,.52,.2),'power':900,'size':5}],
 'fog':{'density':.006,'color':(.18,.3,.48)},
 'grade':{'view':'AgX','exposure':.3,'gamma':1},
 'bands':4,'edge':{'strength':.18,'depth':.13,'normal':.4,'width':1},
 'palette':['111b30','18263e','223650','2d4562','3b5977','4d7090','628ba8','7fa6bf','a1c4d6','c8dfeb','e6eff3','263345','344252','465365','5b6979','738394','90a1ae','b4c1c9','d4d9d8','343339','4b4241','63534a','7e6856','9a8068','b69a7c','d5b68e','f3d4a2','ffe6b8','ffcc85','e9aa63','c2864c','98643c','70472f','50332b','362e32','463440','61404c','855262','ad6f7d','cd939c','24463f','365c50','4e7864','739a7d','9fb69a','3e4163','5e6487','9094b0'],
 'city':{'towers':[(-17,16,9,10,36),(2,24,10,9,45),(18,13,8,9,28),(-20,-2,7,8,22),(18,-3,7,8,19)],'window_step':2.4,'floor_step':2.8},
 'preview':{'crop':(280,600,360,250)}
}
LOOK['preview']['crop']=(320,160,340,240)
LOOK['cleanup']={'median_radius':1}
