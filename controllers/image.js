
const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: "26c8120c9056421aac50883fa812f7a0"
});

const handleApiCall = (req, res) => {
  app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(response => {return res.json(response)})
      .catch(err => {
        return res.status(400).json('An error has occured')
      })
}

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

module.exports = {handleImage, handleApiCall}
