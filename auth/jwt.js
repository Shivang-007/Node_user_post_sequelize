const jwt = require('jsonwebtoken')

const createToken = (user) => {
    const token = jwt.sign({ id: user.id }, 'secrettoken', { expiresIn: '24h' })
    return token
}

module.exports = { createToken }