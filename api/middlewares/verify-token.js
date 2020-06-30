const jwt = require('jsonwebtoken');
const userService = require('../services/user')
let userServiceInstance = new userService();
import config from '../../config/config'


async function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        if (!decoded.username) {

            let user = await userServiceInstance.getUser(decoded);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized access' });
            }
            req.userId = decoded.userId;
        }

        next();
    });
}


module.exports = verifyToken;