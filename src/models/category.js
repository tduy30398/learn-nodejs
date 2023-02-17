'use strict';
import { Model } from 'sequelize';

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Category.init(
        {
            code: DataTypes.STRING,
            value: {
                type: DataTypes.STRING,
                // chạy vào đây trước khi lưu data vào db
                set(value) {
                    // Viết hoa chữ cái đầu tiên của mỗi data
                    this.setDataValue('value', value.charAt(0).toUpperCase() + value.slice(1));
                }
            }
        },
        {
            sequelize,
            modelName: 'Category'
        }
    );
    return Category;
};
