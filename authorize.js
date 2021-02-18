const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  try {
    const token = req.header('Authorization').split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY)
    return next()
  } catch {
    res.sendStatus(401)
  }
}