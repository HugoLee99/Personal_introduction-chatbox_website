const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs')
const path = require('path')
let users = [];
// set engine
app.set('view engine', 'ejs');

// offer root dict
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

// render the chat box page
app.get('/chatbox', function (req, res) {
    res.render('chatbox');
});
// render the main page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/root.html');
});

//render the second_page
app.get('/detail', function(req, res) {
  res.sendFile(__dirname + '/views/second_page.html');
});

//  monitoring socket connect
io.on('connection', function (socket) {
    console.log('a user connected');

    //  monitoring socket joins / submits their name
    socket.on('user name', function (username) {

        var flag = false
        // check whether user have been logged in
        users.find(function (value) {
            if (value === username) {
                flag = true
            }
        })
        //if not sent console message
        if (flag === false) {


            console.log(username + ' joins');
            users.push(username);
            console.log(users);
            login_msg = 'user: ' + username + ' joins';
            io.emit('login user', users);
            io.emit('console message', login_msg)
        }

    })

    // monitoring chat message and write it in txt file
    socket.on('chat message', function (msg, name) {
        console.log(name+'message: ' + msg);
        var message_back = name + ' : ' + msg + "\n";
        fs.appendFile('filename.txt', message_back, function (err) {
            if (err) throw err
            fs.readFile('filename.txt', 'utf8', function (err, data) {
                if (err) throw err;
                io.emit('chat message', data);
            })


        })
    });

    // monitoring user uncommon disconnect
    socket.on('disconnect', function () {
        console.log('a user disconnected')
        
        
    });

    // monitoring user message typing in message box
    socket.on('typing',function(e){
        var messg = e+' is typing'
        console.log(messg)
        io.emit('typing',messg)
    })

socket.on('del_user', function (delname) {
  console.log('del_user event received with delname = ' + delname);
  //find the del_user in users list
  let index = users.indexOf(delname);
  if (index !== -1) {
    users.splice(index, 1);
    console.log(delname + ' has been deleted');
    io.emit('console message', 'user: ' + delname + ' exits');
    io.emit('login user', users);
  } 
  // if not something went wrong 
  else {
    console.log('can not find ' + delname+' something went wrong!');
    err_message = 'User ' + delname + ' not found, something went wrong!'
    socket.emit('console message', err_message);
  }
});
});

// run the server
server.listen(3000, function () {
    console.log('listening on  http://localhost:3000');
})

