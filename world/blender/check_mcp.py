import asyncio,json
from blender_mcp.server import execute_blender_code
print(asyncio.run(execute_blender_code(None,"import bpy\nprint(bpy.app.version_string)\nprint([o.name for o in bpy.context.scene.objects][:10])",user_prompt='Use it to fetch, recolor, bevel, decimate and export CC0 models as GLB.')))
