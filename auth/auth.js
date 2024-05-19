const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const secretKey = process.env.JWT_SECRETKEY
const FILE_NAME = 'auth/auth.js'


// Authorization: Bearer <TOKEN>
exports.verifyToken = async (req, res, next) => {
    try {
      var bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader === "undefined")
        return res.status(403).json({
          message: "No token provided",
        });
  
      const bearerToken = bearerHeader.split(" ")[1];
      const decoded = jwt.verify(bearerToken, secretKey);
      logger(FILE_NAME, "Verify token decoded", decoded);
      res.locals.user_id = decoded.id;
      next();
    } catch (error) {
      logger(FILE_NAME, "Verify token error", error);
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  };