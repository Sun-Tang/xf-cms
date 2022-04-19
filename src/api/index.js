import http from "./http";

const test = () => http.get('/api/news_latest')

const test1 = time => {
    return http.get('/api/news_latest', {
        params: {
            time
        }
    })
}