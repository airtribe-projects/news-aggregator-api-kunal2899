const jwt = require('jsonwebtoken');

const isAuthenticated = () => async (req, res, next) => {
  try {
      const { authorization: bearerToken = '' } = req.headers;
      if (!bearerToken) throw new Error('No token found!');
      req.token = bearerToken.slice(7);
      const SECRET_KEY = process.env.JWT_SECRET;
      jwt.verify(req.token, SECRET_KEY);
      next();
    } catch (err) {
      console.error("Error in middlewares.isAuthenticated --- ", err);
      return res.status(401).send({ message: "Not authenticated!" });
    }
};

module.exports = isAuthenticated;