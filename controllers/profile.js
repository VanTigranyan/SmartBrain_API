const handleProfile = (req, res, pg) => {
  const { id } = req.params;
  pg.select('*').from('users').where({id})
  .then(user => {
    if(user.length) {
      return res.json(user[0])
    } else {
        return res.status(400).json('There is no such user')
    }
  })
  .catch(err => {
    return res.status(400).json('An error occured while sending a request')
  })
}

module.exports = {handleProfile}
