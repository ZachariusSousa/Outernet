import asyncio
from blender_mcp.server import search_assets
async def main():
 for q in ['mug','bean bag','hoodie','shoes','fire pit']:
  print(q,await search_assets(None,source='polypizza',query=q,licence='CC0',limit=3,user_prompt='Use it to fetch, recolor, bevel, decimate and export CC0 models as GLB.'))
asyncio.run(main())
