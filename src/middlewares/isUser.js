import jwt from 'jsonwebtoken';
import { USER, USER_JWT } from '../models/index.js';
import { SECRET } from '../../env.js';

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      error: true,
      message: 'Authorization Header Missing!',
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({
      error: true,
      message: 'Token must be non-null!',
    });
  }

  jwt.verify(token, SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(401).send({
        error: true,
        message: `${`${err.message}`}`,
      });
    }
    const user = await USER.findById(decodedToken.id);
    if (!user) {
      return res.status(401).send({
        error: true,
        message: 'Unauthorized!',
      });
    }
    const isValid = await USER_JWT.findOne({ token });
    if (!isValid) {
      return res.status(401).send({
        isUnAuthorized: true,
        message: 'Session Expired. Kindly Login Again!',
      });
    }
    req.user = user;
    next();
  });
};
