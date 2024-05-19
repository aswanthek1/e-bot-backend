const { validEmail } = require("../../constants/constants")

exports.loginValidator = (req, res, next) => {
    const body = req.body;
    if(!validEmail.test(body.email)) {
        return res.status(400).json({message: 'Please enter a valid email'})
    }
    if(!body.password || body.password.includes(" ")) {
        return res.status(400).json({message: 'Cannot enter spaces in between password'})
    }
    if(!body.password || body.password.trim().length < 3 ) {
        return res.status(400).json({message: 'Password needs minimum 3 chars'})
    }
    next()
}

exports.registerValidator = (req, res, next) => {
    const body = req.body;
    if(!body.name ||  body.name.trim().length < 3) {
        return res.status(400).json({message: 'Name needs minimum 3 chars'})
    }
    if(!validEmail.test(body.email)) {
        return res.status(400).json({message: 'Please enter a valid email'})
    }
    if(!body.password || body.password.includes(" ")) {
        return res.status(400).json({message: 'Cannot enter spaces in between password'})
    }
    if(!body.password || body.password.trim().length < 3 ) {
        return res.status(400).json({message: 'Password needs minimum 3 chars'})
    }
    next()
}