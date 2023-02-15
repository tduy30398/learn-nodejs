import jwt from 'jsonwebtoken';
import { notAuth } from './handle_errors';

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return notAuth('Require authorization', res);
    }
    // Lấy token đã được mã hóa và tách phần token với bearer ra để lấy token
    const accessToken = token.split(' ')[1];
    // verify token để giải mã data, lấy lại data ban đầu của user
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return notAuth('Invalid access token', res);
        }
        req.user = user;
        next();
    });
};

export default verifyToken;
