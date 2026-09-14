import {mkdir,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const path of ['index.html','src','public'])await cp(path,`dist/${path}`,{recursive:true});
console.log('Built static game in dist/');
