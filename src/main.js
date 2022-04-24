import { createApp } from "vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./assets/reset.min.css";
import App from "./App.vue";
// 全局引入图标组件
import { Present, PictureFilled, StarFilled, Pointer} from "@element-plus/icons-vue";

import "./../theme/index.css";

const app = createApp(App);

app.use(ElementPlus);
// 全局注册图标组件
app.component("present", Present);
app.component("picture-filled", PictureFilled);
app.component("star-filled", StarFilled);
app.component("pointer", Pointer);
// 路由
app.use(router);
app.use(store);
app.mount("#app");
