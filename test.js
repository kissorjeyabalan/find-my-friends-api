var fmf = require('./src/index.js');

var fmf = new fmf();

kek();

async function kek() {
    await fmf.login('email', 'pass');
    var fid = await fmf.getLocationById('MTg3MDI1OTYwMg~~');
    console.log(fid);
}