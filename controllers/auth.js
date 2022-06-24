const jwt = require('jsonwebtoken')

const auth = function (req, res, next) {
    // { insert token to continue }
    const token = req.cookies.token

    if (!token) {
        res.status(401)
        res.render('login', { body: '' })
    } else {
        try {
            const userVerified = jwt.verify(token, JWT_SECRET)
            next()

        } catch (error) {
            res.status(401)
            res.render('login', { body: '' })
        }
    }
}

module.exports = auth