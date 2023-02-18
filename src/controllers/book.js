import * as services from '../services';
import { internalServerError } from '../middlewares/handle_errors';

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};
