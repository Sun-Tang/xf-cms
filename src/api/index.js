import axios from "./http"
// 安装 js-md5，密码需要 md5 加密，服务端是解密 md5 的形式
import md5 from 'js-md5'

export const login = (userName, password) => {
  return axios.post('/adminUser/login', {
    userName,
    passwordMd5: md5(password), // 密码需要 md5 加密
  })
}

export const getUser = () => axios.get("/adminUser/profile")

export const logoutDelete = () => axios.delete("/logout")