// Optional QA: npm install --no-save playwright, or use the provided runtime.
const assert=require('node:assert/strict');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');
 assert.equal(await page.locator('.piece').count(),16);
 await page.locator('[data-i="49"]').click();await page.locator('[data-i="40"]').click();
 await page.waitForFunction(()=>document.querySelector('#turn-count').textContent==='2 ตา');
 await page.reload();assert.equal(await page.locator('#turn-count').textContent(),'2 ตา');
 await page.selectOption('#mode','local');await page.click('#yes');
 assert.equal(await page.locator('#turn-count').textContent(),'0 ตา');
 await page.locator('[data-i="49"]').click();await page.locator('[data-i="40"]').click();
 assert.equal(await page.locator('#status').textContent(),'ตาสีดำ');
 await page.click('#resign');await page.click('#no');assert.equal(await page.locator('#status').textContent(),'ตาสีดำ');
 await page.click('#resign');await page.click('#yes');assert.match(await page.locator('#status').textContent(),/ชนะ/);
 await page.click('#new');await page.click('#yes');
 await page.screenshot({path:'/tmp/thai-checkers-desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/tmp/thai-checkers-mobile.png',fullPage:true});
 // Seed a two-jump position and verify the UI does not end the turn early.
 await page.evaluate(()=>{const b=Array(64).fill(0);b[42]=1;b[33]=-1;b[17]=-1;b[7]=-1;localStorage.setItem('thai-checkers-v1',JSON.stringify({board:b,side:1,mode:'local',history:[],positions:[],result:''}));});
 await page.reload();await page.locator('[data-i="42"]').click();await page.locator('[data-i="24"]').click();
 assert.match(await page.locator('#message').textContent(),/ต้องกินต่อ/);assert.equal(await page.locator('#turn-count').textContent(),'0 ตา');
 await page.locator('[data-i="10"]').click();assert.equal(await page.locator('#turn-count').textContent(),'1 ตา');
 assert.equal(await page.locator('.piece').count(),2);assert.deepEqual(errors,[]);
 console.log('PASS: AI response, reload persistence, local mode, resign/cancel, reset, multi-capture, mobile overflow, no browser errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
