import {cpSync} from 'node:fs';
export default {plugins:[{name:'copy-world-art',closeBundle(){cpSync('art','dist/art',{recursive:true})}}]};
