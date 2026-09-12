// Verify the actual demo's numerical helper at rank loss and under reflection.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '../assets/svd-visualizer.html'), 'utf8');
const helpers = html.slice(html.indexOf('function svd2x2('), html.indexOf("const NS="));
const context = {};
vm.createContext(context);
vm.runInContext(helpers, context);
let seed = 17;
const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2**32 * 6 - 3; };
const cases = [
  [0,0,0,0], [1,0,0,1], [-1,0,0,1], [0,2,1,0], [0,2,0,0],
  [1,1,2,2], [1,1,0,1], [0,0,0,-2], [1,0,0,1e-10],
  ...Array.from({length: 100}, () => Array.from({length: 4}, random)),
];
const dot = (a,b) => a.reduce((sum,x,i) => sum+x*b[i],0);
const close = (x,y) => assert(Math.abs(x-y) <= 1e-10 * Math.max(1,Math.abs(x),Math.abs(y)), `${x} != ${y}`);
for (const [a,b,c,d] of cases) {
  const {sigma1,sigma2,v1,v2,u1,u2} = context.svd2x2(a,b,c,d);
  assert(sigma1 >= sigma2-1e-12 && sigma2 >= 0);
  for (const [p,q] of [[v1,v2],[u1,u2]]) {
    close(dot(p,p),1); close(dot(q,q),1); close(dot(p,q),0);
  }
  const A = [[a,b],[c,d]];
  for (let row=0;row<2;row++) for (let col=0;col<2;col++) {
    close(sigma1*u1[row]*v1[col]+sigma2*u2[row]*v2[col],A[row][col]);
  }
  for (const x of [[1,0],[0,1],[.6,.8]]) {
    const z=context.applyVt(x,v1,v2);
    const result=context.applyU([sigma1*z[0],sigma2*z[1]],u1,u2);
    close(result[0],a*x[0]+b*x[1]); close(result[1],c*x[0]+d*x[1]);
  }
}
console.log(`Week 7 demo: ${cases.length} matrices passed orthogonality, reconstruction and vector transformation checks.`);
