import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

// lấy info của user đang đăng nhập
export const getCurrent = async (req, res) => {
    try {
        const { id } = req.user;
        const response = await services.getOne(id);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
