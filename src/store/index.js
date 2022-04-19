import { createStore, createLogger } from "vuex"
const env = process.env.NODE_ENV
const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    plugins: env !== 'production' ? [createLogger()] : []
})
export default store