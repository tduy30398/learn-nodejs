import express from 'express';
import cors from 'cors';
import initRoutes from './src/routes';
require('dotenv').config();
require('./connection_database');

const app = express();

// sử dụng middleware
app.use(
    cors({
        // đây là url mà ta cho phép lấy data
        origin: process.env.CLIENT_URL,
        // chỉ chấp nhận các method được định nghĩa dưới đây: CRUD
        methods: ['POST', 'GET', 'PUT', 'DELETE']
    })
);

// giúp server đọc được data đc gửi lên từ client
app.use(express.json());

// nếu data client gửi lên ko phải là string mà là array hoặc
// object thì sẽ chạy vô đây để đọc data và convert qua json
app.use(
    express.urlencoded({
        extended: true
    })
);

initRoutes(app);

const PORT = process.env.PORT || 8888;

// chạy app
const listener = app.listen(PORT, () => {
    console.log(`Server is running at port: ${listener.address().port}`);
});
