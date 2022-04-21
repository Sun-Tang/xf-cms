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
];

export default routes;
