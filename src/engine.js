export const row = i => Math.floor(i / 8);
export const coord = i => 'abcdefgh'[i % 8] + (8 - row(i));
const inside = (r,c) => r>=0 && r<8 && c>=0 && c<8;
export function initialBoard(){return Array.from({length:64},(_,i)=>(row(i)+i%8)%2===1?(row(i)<2?-1:row(i)>5?1:0):0);}
function jumps(board,from){
  const p=board[from],side=Math.sign(p),king=Math.abs(p)===2,out=[];
  for(const dr of king?[-1,1]:[-side]) for(const dc of [-1,1]){
    let r=row(from)+dr,c=from%8+dc;
    while(inside(r,c)&&!board[r*8+c]&&king){r+=dr;c+=dc;}
    if(!inside(r,c)||Math.sign(board[r*8+c])!==-side)continue;
    const victim=r*8+c;r+=dr;c+=dc;
    if(inside(r,c)&&!board[r*8+c])out.push({to:r*8+c,victim});
  }return out;
}
export function moves(board,side){
  const captures=[];
  function extend(b,from,path,taken){
    const p=b[from];
    if(taken.length&&Math.abs(p)===1&&row(from)===(side===1?0:7)){captures.push({path,taken});return;}
    const next=jumps(b,from);
    if(!next.length){if(taken.length)captures.push({path,taken});return;}
    for(const {to,victim} of next){const n=b.slice();n[from]=0;n[victim]=0;n[to]=p;extend(n,to,[...path,to],[...taken,victim]);}
  }
  board.forEach((p,i)=>{if(Math.sign(p)===side)extend(board,i,[i],[]);});
  if(captures.length)return captures;
  const quiet=[];
  board.forEach((p,i)=>{
    if(Math.sign(p)!==side)return;
    const king=Math.abs(p)===2;
    for(const dr of king?[-1,1]:[-side])for(const dc of [-1,1]){
      let r=row(i)+dr,c=i%8+dc;
      while(inside(r,c)&&!board[r*8+c]){quiet.push({path:[i,r*8+c],taken:[]});if(!king)break;r+=dr;c+=dc;}
    }
  });return quiet;
}
export function apply(board,move){const b=board.slice(),from=move.path[0],to=move.path.at(-1),p=b[from];b[from]=0;for(const i of move.taken)b[i]=0;b[to]=Math.abs(p)===1&&row(to)===(p>0?0:7)?Math.sign(p)*2:p;return b;}
export const positionKey=(b,s)=>b.join(',')+':'+s;
export function chooseMove(board,side,depth=4,budget=700){
  const deadline=Date.now()+budget;
  const evaluate=(b,s)=>b.reduce((sum,p,i)=>sum+Math.sign(p)*s*(Math.abs(p)===2?320:p?100+(p>0?7-row(i):row(i))*5:0),0);
  function search(b,s,d,alpha,beta){
    const options=moves(b,s);if(!options.length)return -100000-d;
    if(d===0||Date.now()>deadline)return evaluate(b,s);
    let best=-Infinity;
    for(const m of options){const value=-search(apply(b,m),-s,d-1,-beta,-alpha);best=Math.max(best,value);alpha=Math.max(alpha,value);if(alpha>=beta)break;}return best;
  }
  const options=moves(board,side);let best=options[0],score=-Infinity;
  for(const m of options){const v=-search(apply(board,m),-side,depth-1,-Infinity,Infinity);if(v>score){score=v;best=m;}if(Date.now()>deadline)break;}
  return best;
}
