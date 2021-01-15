const express = require('express');
const server = express();

server.use(express.static(`${__dirname}/public`));

server.get("/", (_req, res) => {
    res.sendFile('/index.html');
});
 
 const port = process.env.PORT || 4000;

 server.listen(port, () => {
     console.log(`Server listening at ${port}`);
 });