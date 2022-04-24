import axios from "./http";
// 安装 js-md5，密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from "js-md5";
//首页配置的接口汇总
import home from "./home";

export const login = (userName, password) => {
    return axios.post("/adminUser/login", {
        userName,
        passwordMd5: md5(password), // 密码需要 md5 加密
    });
};

export const getUser = () => axios.get("/adminUser/profile");

export const logoutDelete = () => axios.delete("/logout");
// 修改用户名和昵称
const alterAcct = (loginUserName, nickName) => axios.put("/adminUser/name", { loginUserName, nickName });
// 修改密码
const alterpwd = (newPassword, originalPassword) => axios.put("/adminUser/password", { newPassword: md5(newPassword), originalPassword: md5(originalPassword) });

export default {
    home,
    alterAcct,
    alterpwd,
};
