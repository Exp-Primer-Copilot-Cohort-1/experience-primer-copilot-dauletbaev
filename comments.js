// Create web server application with Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, 'data/comments.json');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/comments') {
        fs.readFile(commentsPath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Server error');
                return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/comments') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const newComment = JSON.parse(body);

            fs.readFile(commentsPath, 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Server error');
                    return;
                }

                const comments = JSON.parse(data);
                comments.push(newComment);

                fs.writeFile(commentsPath, JSON.stringify(comments), err => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Server error');
                        return;
                    }

                    res.end('OK');
                });
            });
        });
    } else {
        res.statusCode = 404;
        res.end('Not found');
    }
});
