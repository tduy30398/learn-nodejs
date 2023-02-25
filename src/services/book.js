import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';
const cloudinary = require('cloudinary').v2;

import db from '../models';

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
                ...queries,
                attributes: {
                    exclude: ['category_code', 'description']
                },
                include: [
                    { model: db.Category, as: 'categoryData', attributes: ['id', 'code', 'value'] }
                ]
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

// CREATE (in CRUD)
export const createNewBook = (body, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.findOrCreate({
                where: {
                    title: body?.title
                },
                defaults: {
                    ...body,
                    image: fileData?.path,
                    id: uuid()
                }
            });

            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Created' : 'Name already exists'
            });
            if (fileData && !response[1]) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        } catch (error) {
            reject(error);
            if (fileData) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        }
    });

// UPDATE (in CRUD)
export const updateBook = ({ bookId, ...body }, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            // Nếu cập nhật lại image thì cập nhật lại url của ảnh
            if (fileData) {
                body.image = fileData?.path;
            }
            const response = await db.Book.update(body, {
                where: { id: bookId }
            });
            resolve({
                err: response[0] > 0 ? 0 : 1,
                mes: response[0] > 0 ? `Update ${response[0]} books successfully` : 'Update fail'
            });
            if (fileData && !response[0] === 0) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        } catch (error) {
            reject(error);
            if (fileData) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        }
    });

// DELETE (in CRUD)
export const deleteBook = ({ bookIdList }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.destroy({
                where: { id: bookIdList }
            });
            resolve({
                err: response > 0 ? 0 : 1,
                mes: response > 0 ? `Deleted ${response} books successfully` : 'Delete fail'
            });
        } catch (error) {
            reject(error);
        }
    });
