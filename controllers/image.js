const handleImage = (req, res, pg) => {
  const  { id }  = req.body;
  pg('users')
  .where({id})
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    return res.json(entries[0]);
  })
  .catch(err => { return res.status(400).json('Unable to get entries count')})
}

module.exports = {handleImage}
