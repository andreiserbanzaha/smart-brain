
const _handleProfileGet = (req, res, db) => {

  db.select('*').from('users').where({ id: req.params.id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('User not found');
      }
    })
    .catch(() => {
      res.status(400).json('Error. Could not get user!');
    })
}

module.exports = {
  handleProfileGet: _handleProfileGet
};