const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.users

const auth = async (req, res, next) => {
    try {
        const token = req.header('authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'secrettoken')
        const user = await User.findOne({ where: { id: decode.id } })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth