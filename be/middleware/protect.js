const jwt = require('jsonwebtoken')

exports.middleware = async (req, res, next) => {
    try {
        const token = await req.header('Token')
        if (!token) {
            return res.json({
                msg: 'token not found'
            })
        }
        const verify = await jwt.verify(token, process.env.jwtPassword)
        req.user = verify
        next()
    } catch (error) {
        return res.json(error)
    }
}

// modules.exports = middleware 