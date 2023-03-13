// TEST_SERVER_PORT=3000 START_BLOCK_NUMBER=100000 BLOCK_INTERVAL=12 node app/test-server.js

import http from 'http';
const port = process.env.PORT || 3000;
let blockNumber = parseInt(process.env.START_BLOCK_NUMBER || '100000', 10);
const blockInterval = parseInt(process.env.BLOCK_INTERVAL || '12', 10) * 1000;

const server = http.createServer((req, res) => {
    const result = {
        jsonrpc: '2.0',
        id: 1,
        result: '0x' + blockNumber.toString(16)
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
});

server.listen(port, () => {
    console.log(`Test RPC emulation server running on port ${port}`);
    setInterval(() => {
        blockNumber++;
    }, blockInterval);
});
