const express = require('express')
const app = express()
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
bodyParser = require('body-parser');

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '../public'));
app.listen(3000, () => console.log('app listening on port 3000!'));

require('./routes/userRoutes.js')(app)
