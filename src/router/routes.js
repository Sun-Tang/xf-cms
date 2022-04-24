const routes = [
    {
        path: "/",
        name: "index",
        meta: {},
        component: () => import("@/views/Index.vue"),
    },
    {
        path: "/add",
        name: "add",
        component: () => import("@/views/AddGood.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/Login.vue"),
    },
    {
        // 轮播图
        path: "/bannersetting",
        name: "bannersetting",
        component: () => import("@/views/BannerSetting.vue"),
    },
    {
        // 热销商品
        path: "/goodssetting",
        name: "goodssetting",
        component: () => import("@/views/GoodsSetting.vue"),
    },
    {
        // 新品上线
        path: "/productsetting",
        name: "productsetting",
        component: () => import("@/views/ProductSetting.vue"),
    },
    {
        // 为你推荐
        path: "/recommendsetting",
        name: "recommendsetting",
        component: () => import("@/views/RecommendSetting.vue"),
    },
    {
        // 修改账户
        path: "/alteruser",
        name: "alteruser",
        component: () => import("@/views/AlterUser.vue"),
    },
];

export default routes;
