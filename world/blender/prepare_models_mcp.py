import json,asyncio,logging
from pathlib import Path
from blender_mcp.server import execute_blender_code
logging.getLogger('BlenderMCPServer').setLevel(logging.WARNING)
root=Path(__file__).resolve().parents[1]
selections={
'kenney-furniture':['loungeDesignSofa','loungeDesignSofaCorner','loungeSofaOttoman','tableCoffeeGlass','loungeChairRelax','televisionModern','cabinetTelevision','kitchenCabinet','kitchenCabinetUpper','kitchenFridge','kitchenStove','kitchenBar','stoolBar','desk','computerScreen','computerKeyboard','computerMouse','chairDesk','bookcaseOpen','pottedPlant','plantSmall1','lampRoundFloor','lampRoundTable','lampSquareCeiling','tableRound','chairRounded','loungeChair','pillow','books','sideTable','kitchenCoffeeMachine','laptop','rugRound'],
'kenney-cars':['taxi','sedan'], 'kenney-city':['planter','tree-small','tree-large']}
palette=json.loads((root.parent/'docs/world-integration/look-pre-cleanup.json').read_text(encoding='utf8'))['textures']['palette']
records=[]
for pack,names in selections.items():
 for name in names:
  source=next((root/'art/models'/pack/'source').rglob(name+'.glb'));out=root/'art/models'/pack/'soft';out.mkdir(exist_ok=True)
  records.append(dict(name=name,file=f'{pack}/soft/{name}.glb',original=str(source.relative_to(root/'art/models')),pack=pack,author='Kenney',license='CC0-1.0',url='https://kenney.nl/assets/'+{'kenney-furniture':'furniture-kit','kenney-cars':'car-kit','kenney-city':'city-kit-suburban'}[pack],source=str(source.resolve()),output=str((out/(name+'.glb')).resolve())))
# Repeatable code uses operators on imported objects only; the user's pre-existing scene is left alone.
code='import bpy, math\nfrom mathutils import Vector\nrecords='+repr(records)+'\npalette='+repr(palette)+'''
colors=[tuple(int(c[i:i+2],16)/255 for i in (1,3,5)) for c in palette]
for record in records:
 bpy.ops.object.select_all(action='DESELECT')
 before=set(bpy.data.objects)
 bpy.ops.import_scene.gltf(filepath=record['source'])
 imported=[o for o in bpy.data.objects if o not in before]
 for o in imported:
  if o.type!='MESH':continue
  if len(o.data.polygons)>50000:
   dec=o.modifiers.new('light decimation','DECIMATE');dec.ratio=.5
  bevel=o.modifiers.new('soft rim','BEVEL');bevel.width=.012;bevel.segments=3
  bevel.limit_method='ANGLE'
  o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
  for p in o.data.polygons:p.use_smooth=True
  for slot in o.material_slots:
   if not slot.material:continue
   m=slot.material.copy();slot.material=m
   if m.use_nodes:
    shader=m.node_tree.nodes.get('Principled BSDF')
    if shader:
     old=shader.inputs['Base Color'].default_value[:3]
     nearest=min(colors,key=lambda c:sum((c[i]-old[i])**2 for i in range(3)))
     shader.inputs['Base Color'].default_value=(*nearest,1)
     shader.inputs['Roughness'].default_value=.85
 for o in imported:o.select_set(True)
 bpy.ops.export_scene.gltf(filepath=record['output'],export_format='GLB',use_selection=True,export_apply=True)
 for o in imported:bpy.data.objects.remove(o,do_unlink=True)
 print('Exported '+record['name'])
'''
(root/'blender/soften_pack_assets.py').write_text(code,encoding='utf8')
result=asyncio.run(execute_blender_code(None,code,user_prompt='Use it to fetch, recolor, bevel, decimate and export CC0 models as GLB.'))
print(result)
(root/'art/models/models.json').write_text(json.dumps([{k:v for k,v in r.items() if k not in ['source','output']} for r in records],indent=2))
(root/'art/models/CREDITS.md').write_text('# Model credits\n\nKenney Furniture Kit 2.0, Car Kit 3.1 and City Kit Suburban 2.0 by Kenney, CC0 1.0. Official source URLs are recorded per model in models.json; original License.txt files are preserved inside each source pack. GLBs under soft/ were recolored and bevelled in Blender 4.2 through Blender MCP. Original artist geometry retained.\n')
