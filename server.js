const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Initialisations
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// Database
const pg = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'postgres',
    database : 'smartbrain'
  }
})


// Routes
app.get('/', (req, res) => {
  res.json(database.users);
})

app.post('/signin', (req, res) => {
  const { email, password} = req.body;

  pg.select('email', 'hash').from('login')
    .where({email})
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if(isValid) {
        pg.select('*').from('users')
          .where({email})
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to Signin'))
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  pg.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name: name,
        joined: new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  pg.select('*').from('users').where({id})
  .then(user => {
    if(user.length) {
      console.log(user);
      res.json(user[0])
    } else {
        res.status(400).json('There is no such user')
    }
  })
  .catch(err => {
    res.status(400).json('An error occured while sending a request')
  })
})

app.put('/image', (req, res) => {
  const  { id }  = req.body;
  pg('users')
  .where({id})
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('Unable to get entries count'))
})


// Server listening
app.listen(5000, () => {
    console.info('App is running on port 5000')
})
