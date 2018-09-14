const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

// Constructors
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Database
let database = {
  users: [
    {
      id: '1',
      name: 'Van',
      email: 'van@gmail.com',
      password: 'yummyanime',
      entries: 0,
      joined: new Date()
    },
    {
      id: '2',
      name: 'Vahe',
      email: 'vahe@gmail.com',
      password: 'awesomebmw',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '945',
      hash: '',
      email: 'van@gmail.com'
    }
  ]
}


// Routes
app.get('/', (req, res) => {
  res.json(database.users);
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email &&
     req.body.password === database.users[0].password) {
    res.json(database.users[0])
  } else {
    res.status(400).json('error logging in')
  }
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  });
  database.users.push({
    id: '3',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  })
  if (found === false) {
    res.status(400).json('There is no such user')
  }
})

app.put('/image', (req, res) => {
  const  { id }  = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (found === false) {
    res.status(400).json('There is no such user')
  }
})


// Server listening
app.listen(5000, () => {
    console.info('App is running on port 5000')
})
