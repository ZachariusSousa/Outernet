import {cpSync,mkdirSync,readdirSync,readFileSync} from 'node:fs';
// Only the active modular art ships. Source sheets and retired experiments stay local.
export default {plugins:[{name:'copy-world-art',closeBundle(){
 mkdirSync('dist/art/nyc/sprites',{recursive:true});
 const {assets}=JSON.parse(readFileSync('art/nyc/scene.json','utf8'));
 for(const name of [assets.backdrop,assets.shell,'layout.json','scene.json','CREDITS.md'])cpSync('art/nyc/'+name,'dist/art/nyc/'+name);
 for(const name of readdirSync('art/nyc/sprites'))if(name.endsWith('.png')||name==='manifest.json')cpSync('art/nyc/sprites/'+name,'dist/art/nyc/sprites/'+name);
 for(const name of ['sprites','props','planes'])cpSync('art/agents/'+name,'dist/art/agents/'+name,{recursive:true});
}}]};
