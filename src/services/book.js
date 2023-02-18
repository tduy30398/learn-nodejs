import db from '../models';
import { Op } from 'sequelize';

// READ (in CRUD)
// limit là số data ở mỗi lần lấy
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            // raw: true => chỉ lấy object data chứ ko lấy instance của sequelize
            // nest: true => khi lấy data ở table khác từ table này, data lấy đc sẽ gom vào 1 object
            const queries = { raw: true, nest: true };
            // lấy data từ vị trí offset trở đi
            const offset = !page || +page <= 1 ? 0 : +page - 1;
            const finalLimit = +limit || +process.env.LIMIT_BOOK;
            // ví dụ limit = 5
            // nếu offset là 0 (page = 1 hoặc 0) thì queries.offset là 0 (lấy data từ vị trí 0)
            // nếu offset là 1 (page = 2) thì queries.offset = 5 => lấy 5 data từ vị trí thứ 5
            // nếu offset là 2 (page = 3) thì queries.offset = 10 => lấy 5 data từ vị trí thứ 10
            queries.offset = offset * finalLimit;
            queries.limit = finalLimit;
            if (order) {
                queries.order = [order];
            }
            if (name) {
                query.title = { [Op.substring]: name };
            }
            if (available) {
                query.available = { [Op.between]: available };
            }
            const response = await db.Book.findAndCountAll({
                where: query,
                ...queries
            });

            resolve({
                err: response.rows.length !== 0 ? 0 : 1,
                mes: response.rows.length !== 0 ? 'Success' : "Can't found books",
                bookData: response
            });
        } catch (error) {
            reject(error);
        }
    });
