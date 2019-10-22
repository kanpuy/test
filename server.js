const app = require('express')()
const bodyParser = require('body-parser')
const logger = require('morgan')

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ussd"
});
app.get('/testconnection', function(req,res,next){
  connection.connect(function(error){
    if (!!error) {
      console.log('Connection failed');
      res.send('Connection failed');
    }else{
      console.log('Connection Successful!!!');
      res.send('Connection Successful!!!');
    }
  });
});

app.get('/select', function(req, res, next){
  connection.query('SELECT * FROM users', function(error, rows, fields){
    if (!!error) {
      console.log('Error in the query!!');
      res.send('Error in the query!!');
    }else{
      console.log('SUCCESS!!');
      console.log(rows);
      res.send('Hello world, '+rows[0].name);
    }
  });
});

app.get('/insert', function(req, res, next){
  var sql="INSERT INTO users(id_no, phoneNo, name, email) VALUES  ('34111910','nicodemus ndunda','0798169211','nicodemusndunda677@gmail.com')";
  connection.query(sql, function(error, result){
    if (!!error) {
      console.log('Error in the query!!');
      res.send('Error in the query!!');
    }else{
      console.log('1 record inserted!!');
      res.send('1 record inserted!!');
    }
  });
})

const port = process.env.PORT || 3030

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('This is tutorial App on creating your first USSD app in 5 minutes or less by Ajala Abdulsamii <kgasta@gmail.com>')
})

app.post('*', (req, res) => {
  let {sessionId, serviceCode, phoneNumber, text} = req.body
  if (text == '') {
    // This is the first request. Note how we start the response with CON
    let response = `CON What would you want to check?
    1. My Account
    2. My phone number
    3. Registration`

    res.send(response)
  } else if (text == '1') {
    // Business logic for first level response
    let response = `CON Choose account information you want to view
    1. Account number
    2. Account balance`
    res.send(response)
  } else if (text == '2') {
    // Business logic for first level response
    let response = `END TT Your phone number is ${phoneNumber}`
    res.send(response)
  } else if (text='3'){
     //Business logic for first level response
     let response = `CON Enter your details as follows separated by comma Id number, Name, Email`
  } else if (text == '1*1') {
    // Business logic for first level response
    let accountNumber = 'ACC001'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your account number is ${accountNumber}`
    res.send(response)
  } else if (text == '1*2') {
    // This is a second level response where the user selected 1 in the first instance
    let balance = 'MGN 10,000'
    // This is a terminal request. Note how we start the response with END
    let response = `END Your balance is ${balance}`
    res.send(response)
  } else {
    res.status(git400).send('Bad request!')
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
