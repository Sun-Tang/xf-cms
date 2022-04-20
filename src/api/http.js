import axios from 'axios';
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import { localGet } from '@/utils/index'

axios.defaults.baseURL = process.env.NODE_ENV == "production" ? "http://backend-api-02.newbee.ltd/manage-api/v1" : "/api";
// 携带 cookie，对目前的项目没有什么作用，因为我们是 token 鉴权
axios.defaults.withCredentials = true
// 请求头，headers 信息
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['token'] = localGet('token') || ''
// 默认 post 请求，使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(res => {
    return res
})
axios.interceptors.response.use(res => {
    if (typeof res.data !== 'object') {
        ElMessage.error('服务端异常！')
        return Promise.reject(res)
    }
    if (res.data.resultCode != 200) {
        if (res.data.message) ElMessage.error(res.data.message)
        if (res.data.resultCode == 419) {
            router.push({ path: '/login' })
        }
        return Promise.reject(res.data)
    }
    return res.data;
}, reason => {
    ElMessage.error(reason)
    return Promise.reject(reason);
})
export default axios