const handleRegister = (req, res, pg, bcrypt) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  if(!name || !email || !password) {
    return res.status(400).json('Invalid form credentials')
  }

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
        return res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
}

module.exports = {handleRegister}
