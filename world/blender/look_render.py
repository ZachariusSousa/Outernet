# Render configuration. Blender Z-up metres; the flat floor is at z=12.
LOOK={
 'resolution':(480,270),'samples':48,'seed':9,'bevel':.035,
 'camera':{'position':(20,-26,25),'target':(0,2,10),'scale':26,'near':.1,'far':160},
 'world':{'color':(.045,.075,.14),'strength':.25},
 'colors':{'wall':(.38,.31,.23),'floor':(.20,.10,.045),'wood':(.11,.055,.025),'concrete':(.25,.29,.32),'snow':(.62,.72,.79),'sofa':(.23,.25,.14),'red':(.31,.045,.025),'cream':(.65,.57,.4),'dark':(.013,.022,.035),'metal':(.17,.21,.23),'green':(.06,.15,.10)},
 'windows':{'fraction':.48,'colors':[(1,.52,.17),(1,.7,.32),(.16,.38,.72)],'emission':2},
 'lights':[
 {'name':'living lamp','position':(-3,1,14.6),'target':(-3,1,12),'color':(1,.57,.25),'power':190,'size':1.8},
 {'name':'kitchen pendant','position':(2,1,14.6),'target':(2,1,12),'color':(1,.65,.3),'power':100,'size':1},
 {'name':'fluorescent','position':(4,3.8,14.2),'target':(4,2,12),'color':(.65,1,.82),'power':110,'size':1.5},
 {'name':'TV','position':(-4,-1,13.1),'target':(-3,2,12.5),'color':(.18,.42,1),'power':45,'size':.8},
 {'name':'desk','position':(4,-1.5,13.6),'target':(4,-1.5,12),'color':(1,.62,.27),'power':45,'size':.6},
 {'name':'blue night','position':(0,8,20),'target':(0,0,12),'color':(.25,.45,1),'power':450,'size':8},
 {'name':'street sodium','position':(-7,-6,6),'target':(0,0,9),'color':(1,.27,.05),'power':650,'size':3}],
 'fog':{'density':.008,'color':(.2,.29,.4)},
 'snow':{'count':340,'size':.055,'bounds':[(-15,15),(-7,25),(2,27)]},
 'grade':{'view':'AgX','exposure':1,'gamma':1},'dither':.6,'gradient_threshold':.035,
 'palette':['101724','172131','202d3c','2a3b4c','354a5a','455d6a','597582','77939e','a4b8bb','ced8cd','29272b','3d3430','514237','69533c','826645','a08052','bd9b64','e3bc7c','ffe0a3','ffbc63','dc8c42','ac5d2e','733d27','492d24','392b2c','602f2c','8b4030','ad5740','343c32','4b5540','69704e','929172']}
# Composition revision after inspecting the first 480px render.
LOOK['camera']['scale']=34
LOOK['camera']['target']=(0,1,8)
LOOK['grade']['exposure']=0
LOOK['windows']['emission']=.65
LOOK['world']['strength']=.12
