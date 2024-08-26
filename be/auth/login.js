const User = require('../models/registermodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')

const login = async function (req, res) {
    try {
        const { email, password } = await req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                status: false,
                msg: 'email doesn\'t exist enter valid mail address or you don\'t have account please register'
            })
        }
        const token = jwt.sign({ id: user._id }, process.env.jwtPassword, { expiresIn: '30d' })
        const pass = await bcrypt.compareSync(password, user.password)
        if (!pass) {
            return res.status(400).json({
                staus: false,
                msg: 'invalid password'
            })
        }
        return res.status(200).json({
            token: token,
            msg: 'authentification error please refresh the page',
            user
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            msg: 'server error'
        })
    }
}

module.exports = login