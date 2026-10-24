from PIL import Image,ImageDraw
p='world/art/textures/tv-screen.png';im=Image.new('RGB',(128,64),'#101b30');d=ImageDraw.Draw(im)
for x,w,h in [(2,12,22),(18,15,30),(38,10,18),(52,14,40),(72,12,25),(90,17,32),(112,12,20)]:
 d.rectangle((x,50-h,x+w,50),fill='#2c405c')
 for y in range(53-h,48,7):
  for u in range(x+3,x+w-1,5):d.rectangle((u,y,u+1,y+1),fill='#98856e')
d.line((0,54,127,54),fill='#49617d');im.save(p)
