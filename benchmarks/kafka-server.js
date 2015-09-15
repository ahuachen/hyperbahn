// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var parseMessage = require('./kafka-message.js');

module.exports = KafkaServer;

function KafkaServer(listener) {
    var net = require('net');

    var server = net.createServer();
    server.on('connection', onConnection);
    var PORT = 10000 + Math.floor(Math.random() * 20000);

    server.listen(PORT);
    server.port = PORT;

    return server;

    function onConnection(socket) {
        socket.on('data', onMessage);

        function onMessage(buf) {
            try {
                var messages = parseMessage(buf);
                messages.forEach(function eachMessage(msg) {
                    listener(null, msg);
                });
            } catch (e) {
                listener(e);
            }
        }
    }
}