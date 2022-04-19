import { isPlainObject } from '@vue/shared';
import axios from 'axios';
import qs from 'qs';
import { ElMessage } from 'element-plus'


const http = axios.create({
    baseURL: '',
    timeout: 60000,
    transformRequest: data => {
        if(isPlainObject(data)) return qs.stringify(data);
        return data;
    }
})
http.interceptors.request.use(config => {
    let token = localStorage.getItem('tk');
    if(token){
        config.headers['authorzation'] = token;
    }
    return config;
})
http.interceptors.response.use(response => {
    return response.data;
}, reason => {
    ElMessage.error(reason)
    return Promise.reject(reason);
})
export default http