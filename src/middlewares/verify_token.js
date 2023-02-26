import jwt, { TokenExpiredError } from 'jsonwebtoken';
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
            const isChecked = err instanceof TokenExpiredError;
            if (isChecked) {
                return notAuth('Access token expired', res, true);
            } else {
                return notAuth('Access token invalid', res, false);
            }
        }
        req.user = user;
        next();
    });
};

export default verifyToken;
