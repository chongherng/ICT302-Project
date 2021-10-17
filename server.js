const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "/../public/views"));
app.use(express.static("public"))

app.get('/', (req, res) => {
    console.log("Request for index.html");
    res.sendFile(path.join(__dirname + "/public/views/index.html"));
})

app.listen(3000);
