import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>console.log(e.message));await page.goto('http://127.0.0.1:5173');await page.waitForTimeout(6000);await page.screenshot({path:process.argv[2]});await browser.close();
