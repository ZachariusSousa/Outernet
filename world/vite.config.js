import {cpSync,mkdirSync,existsSync,readdirSync} from 'node:fs';
// Ship only active Canvas assets. Retired 3D sources and evidence stay in the repo.
export default {plugins:[{name:'copy-world-art',closeBundle(){
 mkdirSync('dist/art/nyc',{recursive:true});
 for(const name of ['room.png','scene.json','CREDITS.md'])cpSync('art/nyc/'+name,'dist/art/nyc/'+name);
 if(existsSync('art/nyc/modular-v1')){mkdirSync('dist/art/nyc/modular-v1',{recursive:true});for(const file of readdirSync('art/nyc/modular-v1'))if(file.endsWith('.png')||file==='scene.json'||file==='CREDITS.md')cpSync('art/nyc/modular-v1/'+file,'dist/art/nyc/modular-v1/'+file)}
 for(const name of ['sprites','props','planes'])cpSync('art/agents/'+name,'dist/art/agents/'+name,{recursive:true});
}}]};
