import db from '../models';

export const getOne = (userId) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { id: userId },
                // lấy data về nhưng ko muốn lấy password về thì setting như sau
                attributes: {
                    exclude: ['password', 'role_code']
                },
                include: [{ model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value'] }]
            });

            resolve({
                err: response ? 0 : 1,
                mes: response ? 'Successfully' : 'User not found',
                userData: response
            });
        } catch (error) {
            reject(error);
        }
    });
