const handleSignin = (req, res, pg, bcrypt) => {
  const { email, password } = req.body;

  pg.select("email", "hash")
    .from("login")
    .where({ email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        pg.select("*")
          .from("users")
          .where({ email })
          .then(user => {
            return res.json(user[0]);
          })
          .catch(err => {return res.status(400).json("Unable to Signin")});
      } else {
        return res.status(400).json("Wrong credentials");
      }
    })
    .catch(err => {return res.status(400).json("Wrong credentials")});
};
module.exports = { handleSignin };
