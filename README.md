

# Report 

## 1. Introduction

- Website name: self introduction and chat application 

- Student ID: 50079685

- Name: Jia Xu Li （李佳栩）

- Completion time: 2023.5.3

  

## 2. Overall design

My website contains 3 pages, including root page, second page and chat box page. In terms of root page, it shows basic information about me, like name, major, email address and so on. I tried to use black, blue and white in this page to make it cool and outstanding, in order to serve as the main page. As regard to second page, I prefer to demonstrate my detail info, which shares my hobbies and the subjects I learned. I use one of my favorite picture I take as the background, and put some picture of me and the song I sang on this page. When it comes to chat box page, I've tried my best to make it looks perfect, but it doesn't work like what I thought it would be. I spend large amount of time on figuring out the logical relationship between server and user client, and finally use EJS engine and Socket.io to connect them.



## 3. Challenges discussed

- Not familiar with JavaScript language, which cause me spend a lot of time on correcting syntax.

- Unfamiliar with using Embedded JavaScript templating engine.

- Hard to do the version control, but I solve it by using Github repository.

- It's complicated to move the code from another device to Codio and make it run. I really waste a great amount of time on it.

  

  

## 4. Chat application Key Code 



### 4.1 User message Interaction 

In order to make sure the written messages can be seen by all the users, I use socket.on to monitor the message that sent by clients, after receiving chat message from the client side, I use a txt.file to mark down all the chat and return all chat history to client side by using io.emit.

```javascript
//code in index_server.js 
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
```

### 4.2 Online user list display

To shows a list of users currently within a chat and send a notification to the other users when a user exits or joins. I used a dynamic list to store the name of connected user. The list will add the client name who logs in and delete the name who logs out, and then used io.emit to send system message to the client to announce them.

when client joins, I use a socket.on to receive log in user's name and check whether user already in the list. if already exist do nothing, if not, add to list and announce to the client side by use io.emit sending message to console message box in client side, and return the new list to front side.

```javascript
//code in index_server.js
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
```

when client log out, it will trigger the event del_user, then system will check whether the name of the user is in the list. If yes, it will delete the user in the list, and return the new list to front side. if not throw an error to the front side. 

```javascript
//code in index_server.js
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
```

### 4.3 Button hide

To prevent user's operation error, I add some dynamic effects to simplify the chat box. Log out will be hide at first, when user click log in button it will appear, meanwhile, when user click log out button the log out button will invisible again.

```javascript
//code in chatbox.ejs 
// hide input name box after enter your name
    function hidetext() {
      mychar.style.display = 'none';
      mycharlab.style.display = 'none';
    }
    function hidebutton() {
      //hide sign out button again
      mysignout.style.display = 'none'
    }
    function delname() {
      //show input name box
      mychar.style.display = 'inline';

      mycharlab.style.display = 'inline';
      socket.emit('del_user', login_user.innerText)
    }
```



### 4.4 Typing monitor

In order to check whether the user are typing,  I used a Event Listener to monitor user's typing state, and set a timeout to	 automatically check each 1 second.  If the user is typing in chatbox, it will sent a message to typing event by socket.emit() function.  Then the socket monitor in server will receive the message and send it back to all the other user online.

```javascript
//code in chatbox.ejs 
// create an EventListener to monitor user's typing state
    messageInput.addEventListener("keyup", function () {
      if (isTyping) return;
      userName = mychar.value
      socket.emit('typing', userName);
      isTyping = true;
      // each 1 second have a check
      setTimeout(function () {
        socket.emit('typing', userName);
        isTyping = false
      }, 1000)
    })


```

```javascript
//code in index_server.js
socket.on('typing',function(e){
        var messg = e+' is typing'
        console.log(messg)
        io.emit('typing',messg)
    })
```

The front side will receive the message and show it only 5 seconds on the web page.

```javascript
//code in chatbox.ejs 
// recieve the message form server and show it in html
    socket.on('typing', function (messg) {
      var type_check = document.getElementById('type_check')
      type_check.innerHTML = messg;
      // The message only show 3 seconds
      setTimeout(function () {
        type_check.innerHTML = ' '
      }, 3000)
```







## 5. References sources 

- JavasScript Reference:[JavaScript 参考 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
- How to delete element in list:[JS 删除数组中某个元素的几种方式_js数组删除某个元素_百里狂生的博客-CSDN博客](https://blog.csdn.net/Li_dengke/article/details/105249837)
- How to use EJS engine: [EJS在html中的基本使用方法_ejs引入html页面_蓝心高飛的博客-CSDN博客](https://blog.csdn.net/qq_34171965/article/details/82116058)
- Bootstrap3:https://v3.bootcss.com
- [JavaScript setTimeout() 用法详解 | 菜鸟教程 (runoob.com)](https://www.runoob.com/w3cnote/javascript-settimeout-usage.html)
