import db from '../models';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// băm password để lưu vào db
const hashPassword = (password) => bcryptjs.hashSync(password, bcryptjs.genSaltSync(8));

export const register = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            // element thứ 2 (boolean): true là create, false là đã tồn tại
            const response = await db.User.findOrCreate({
                // tìm xuống database ở cột data email
                where: { email },
                // nếu data ở where chưa có, tạo một data mới
                defaults: {
                    email,
                    password: hashPassword(password)
                }
            });

            // mã hóa data bằng jsonwebtoken
            const accessToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                          email: response[0].email,
                          role_code: response[0].role_code
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '15s' }
                  )
                : null;
            const refreshToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      { expiresIn: '15d' }
                  )
                : null;

            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Resgister successfully' : 'Your email has been registered',
                access_token: accessToken ? `Bearer ${accessToken}` : null,
                refresh_token: refreshToken
            });
            if (refreshToken) {
                await db.User.update(
                    {
                        refresh_token: refreshToken
                    },
                    {
                        where: { id: response[0].id }
                    }
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                // khi set raw: true, response trả về object với
                // những data cần thiết, còn ko set hoặc raw: false
                // thì data là 1 instance với rấ nhiều data ko cần
                // thiết
                raw: true
            });

            // check password
            // cơ chế: nó sẽ nhận vào password mà người dùng đăng nhập vào và so sánh password đó
            // với password của user tương ứng đã được mã hóa từ response trả về
            const isCheckedPassword = response && bcryptjs.compareSync(password, response.password);

            const accessToken = isCheckedPassword
                ? jwt.sign(
                      {
                          id: response.id,
                          email: response.email,
                          role_code: response.role_code
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '15s' }
                  )
                : null;
            const refreshToken = isCheckedPassword
                ? jwt.sign(
                      {
                          id: response.id
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      { expiresIn: '5d' }
                  )
                : null;

            // - Đăng nhập thành công khi token tồn tại
            // - Trường hợp token ko tồn tại => isCheckedPassword = false, check response:
            //  + Nếu response = true (mà isCheckedPassword = false) => check password bị sai => line 60
            //  + Nếu response = false => Email chưa tồn tại
            resolve({
                err: accessToken ? 0 : 1,
                mes: accessToken
                    ? 'Login successfully'
                    : response
                    ? 'Password incorrect'
                    : "Email isn't resgistered",
                access_token: accessToken ? `Bearer ${accessToken}` : null,
                refresh_token: refreshToken
            });
            if (refreshToken) {
                await db.User.update(
                    {
                        refresh_token: refreshToken
                    },
                    {
                        where: { id: response.id }
                    }
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const refreshToken = (refresh_token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { refresh_token }
            });
            if (response) {
                jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH_TOKEN, (err) => {
                    if (err) {
                        resolve({
                            err: 1,
                            mes: 'Refresh token expired, please login again'
                        });
                    } else {
                        const accessToken = jwt.sign(
                            {
                                id: response.id,
                                email: response.email,
                                role_code: response.role_code
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: '15s' }
                        );
                        resolve({
                            err: accessToken ? 0 : 1,
                            mes: accessToken ? 'Success' : 'Generate fail',
                            access_token: accessToken ? `Bearer ${accessToken}` : null,
                            refresh_token: refresh_token
                        });
                    }
                });
            }
        } catch (error) {
            reject(error);
        }
    });
