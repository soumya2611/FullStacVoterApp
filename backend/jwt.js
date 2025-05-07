const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = (req, res, next) => {
    //checking first req headers has authorization or not
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ message: 'Invalid :token not found' });
    //extraction of jwt from header
    const token = req.headers.authorization.split(' ')[1];
    //verify the token
    if (!token)
        return res.status(401).json({ error: 'unauthorized' })
    try {
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attach the decoded user to the request object
        req.user = decoded;
        //console.log('req.user after setting:', req.user)
        next();
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ message: 'Invalid token' })
    }
}
//Function to generate jwt token
const generateToken = (userData) => {
    //Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET,{ expiresIn: '2d' });
}
module.exports = {jwtAuthMiddleware,generateToken};