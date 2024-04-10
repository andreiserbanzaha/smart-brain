
const _handleRegister = (req, res, db, bcrypt) => {

  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json('incorrect form submission');
  }

  const bcryptHash = bcrypt.hashSync(req.body.password);

  // to be removed
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  db.transaction(trx => {
    trx.insert({
      hash: bcryptHash,
      email: req.body.email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name: req.body.name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => res.json(user[0]))
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Unable to register! [' + err + ']'));
}

module.exports = {
  handleRegister: _handleRegister
};