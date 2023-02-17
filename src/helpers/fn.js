export const generateCode = (value) => {
    let output = '';
    // Bỏ dấu khi value là 1 chuỗi tiếng việt có dấu
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .forEach((item) => {
            // charAt method (sử dụng với string) trả về kí tự tại index truyền vào
            output += item.charAt(1) + item.charAt(0);
        });

    // Viết hoa + thêm length phía sau để mã hóa
    return output.toUpperCase() + value.length;
};
