const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require('fs')
let users = [];
// set engine
app.set('view engine', 'ejs');

// offer root dict
app.use(express.static('public'));

// render the ejs
app.get('/', function (req, res) {
    res.render('chatbox');
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

    // monitoring chat message
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

    // monitoring socket log out/exits
    socket.on('disconnect', function () {
        console.log('a user disconnected')
        socket.emit('disconnected')
        //io.emit('login user', users)
    });



socket.on('del_user', function (delname) {
  console.log('del_user event received with delname = ' + delname);

  let index = users.indexOf(delname);
  if (index !== -1) {
    users.splice(index, 1);
    console.log(delname + ' has been deleted');
    io.emit('console message', 'user: ' + delname + ' exits');
    io.emit('login user', users);
  } else {
    console.log('can not find ' + delname);
    socket.emit('del_user_error', 'User ' + delname + ' not found');
  }
});
});

// 启动服务器
server.listen(3000, function () {
    console.log('listening on  http://192.168.56.1:3000');
})

//use socket to delete user in list
//     socket.on('del_user', function (delname) {
//         console.log('del_user event received with delname = ' + delname);
//
//         users.forEach(function (item,index,arr){
//         if (item === delname) {
//             arr.splice(index,1);
//             console.log(delname+'has been deleted')
//         }
//         else{
//             console.log('can not find'+delname)
//         }
//         console.log(users);
//     });
//         let off_msg = 'user: ' + delname + ' exits';
//         io.emit('console message', off_msg);
//         io.emit('login user', users);
//
//     })
// use socket to delete user in list