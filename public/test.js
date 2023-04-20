const express = require('express');
const app = express();
const port = 3000
app.set('views engine','ejs');

let john = {
    color:'darkblue',name:'John Smith'
};
app.get('/',(req,res)=> {
    res.render('For_test.ejs',john)
});

app.listen(port, () => {
console.log(`Server is listening on port http://192.168.56.1:${port}`);
});
