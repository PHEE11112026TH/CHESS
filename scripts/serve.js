import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.argv[2]||'.'),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+sep)||!types[extname(file)]){res.writeHead(403);res.end();return;}res.setHeader('Content-Type',types[extname(file)]);res.end(await readFile(file));}catch{res.writeHead(404);res.end('Not found');}}).listen(5173,'0.0.0.0',()=>console.log('Thai Checkers: http://localhost:5173'));
