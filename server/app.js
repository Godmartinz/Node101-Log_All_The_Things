const express = require('express');
const fs = require('fs');
const app = express();


app.use((req, res, next) => {
    // write your logging code here
    let agent=req.headers['user-agent'].replace(',','');
    let time= new Date().toISOString();
    let method=req.method;
    let resource= req.originalUrl;
    let version= req.protocol.toUpperCase() + '/' + req.httpVersion;
    let status=res.statusCode;

    let logEntry= `${agent},${time},${method},${resource},${version},${status},\n`;

    console.log(logEntry);

    fs.appendFile('./server/log.csv', logEntry, 'utf8', (err)=>{
        if(err) throw err;

    });
    next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
 res.status(200).send('OK');
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile('./server/log.csv', 'utf8', (err, logEntry)=>{
        if (!!err) throw err;
        console.log(logEntry);

    let logs=[];
    let lineEntry=logEntry.split('\n');

    lineEntry.shift();
    lineEntry.forEach(line => {
        lineItems= line.split(',');
        let log= {
            'Agent': lineItems[0],
            'Time': lineItems[1],
            'Method': lineItems[2],
            'Resource': lineItems[3],
            'Version': lineItems[4],
            'Status': lineItems[5]
        }
        
            logs.push(log);
        
    });
    res.status(200).json(logs);
    res.end();
    });
    
});


module.exports = app;
