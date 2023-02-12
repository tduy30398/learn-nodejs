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
            const token = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                          email: response[0].email,
                          role_code: response[0].role_code
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '5d' }
                  )
                : null;

            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Resgister successfully' : 'Your email has been registered',
                access_token: token ? `Bearer ${token}` : null
            });
        } catch (error) {
            reject(error);
        }
    });

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                // khi set raw: true, respone trả về object với
                // những data cần thiết, còn ko set hoặc raw: false
                // thì data là 1 instance với rấ nhiều data ko cần
                // thiết
                raw: true
            });

            // check password
            // cơ chế: nó sẽ nhận vào password mà người dùng đăng nhập vào và so sánh password đó
            // với password của user tương ứng đã được mã hóa từ response trả về
            const isCheckedPassword = response && bcryptjs.compareSync(password, response.password);

            const token = isCheckedPassword
                ? jwt.sign(
                      {
                          id: response.id,
                          email: response.email,
                          role_code: response.role_code
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '5d' }
                  )
                : null;

            // - Đăng nhập thành công khi token tồn tại
            // - Trường hợp token ko tồn tại => isCheckedPassword = false, check respone:
            //  + Nếu respone = true (mà isCheckedPassword = false) => check password bị sai => line 60
            //  + Nếu respone = false => Email chưa tồn tại
            resolve({
                err: token ? 0 : 1,
                mes: token
                    ? 'Login successfully'
                    : response
                    ? 'Password incorrect'
                    : "Email isn't resgistered",
                access_token: token ? `Bearer ${token}` : null
            });
        } catch (error) {
            reject(error);
        }
    });
