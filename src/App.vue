<template>
    <div class="layout">
        <el-container v-if="showMenu"
                      class="container">
            <el-aside class="aside">
                <!--系统名称+logo-->
                <div class="head">
                    <div>
                        <img src="//s.weituibao.com/1582958061265/mlogo.png"
                             alt="logo" />
                        <span>vue3 admin</span>
                    </div>
                </div>
                <!--一条为了美观的线条-->
                <div class="line" />
                <el-menu background-color="#222832"
                         text-color="#fff"
                         :router="true"
                         active-text-color="#ffd04b"
                         :default-active="defaultActive">
                    <!--一级栏目-->
                    <el-sub-menu index="1">
                        <template #title>
                            <span>Dashboard</span>
                        </template>
                        <!--二级栏目-->
                        <el-menu-item-group>
                            <el-menu-item index="/">
                                <el-icon>
                                    <shopping-cart />
                                </el-icon>
                                首页
                            </el-menu-item>
                            <el-menu-item index="/add">
                                <el-icon>
                                    <shopping-cart />
                                </el-icon>
                                添加商品
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="2">
                        <template #title>
                            <span>首页配置</span>
                        </template>
                        <!--二级栏目-->
                        <el-menu-item-group>
                            <el-menu-item index="/bannersetting">
                                <el-icon>
                                    <picture-filled />
                                </el-icon>
                                轮播图设置
                            </el-menu-item>
                            <el-menu-item index="/goodssetting">
                                <el-icon>
                                    <star-filled />
                                </el-icon>
                                热销商品设置
                            </el-menu-item>
                            <el-menu-item index="/productsetting">
                                <el-icon>
                                    <present />
                                </el-icon>
                                新品上线设置
                            </el-menu-item>
                            <el-menu-item index="/recommendsetting">
                                <el-icon>
                                    <pointer />
                                </el-icon>
                                为你推荐设置
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu index="4">
                        <template #title>
                            <span>系统管理</span>
                        </template>
                        <!--二级栏目-->
                        <el-menu-item-group>
                            <el-menu-item index="/alteruser">
                                <i class="iconfont icon-password"></i>
                                修改密码
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </el-aside>
            <el-container class="content">
                <Header />
                <div class="main">
                    <router-view />
                </div>
                <Footer />
            </el-container>
        </el-container>
        <el-container v-else
                      class="container">
            <router-view />
        </el-container>
    </div>
</template>

<script setup>
    import Header from "@/components/Header.vue";
    import Footer from "@/components/Footer.vue";
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { ShoppingCart } from "@element-plus/icons-vue";
    import { localGet, pathMap } from "@/utils";

    const noMenu = ["/login"];
    const router = useRouter();
    const showMenu = ref(true);
    // 控制默认激活的menu
    const defaultActive = ref("/");
    // 监听路由的变化
    router.beforeEach((to, from, next) => {
        if (to.path == "/login") {
            // 如果路径是 /login 则正常执行
            showMenu.value = !noMenu.includes(to.path);
            next();
        } else {
            // 如果不是 /login，判断是否有 token
            if (!localGet("token")) {
                // 如果没有，则跳至登录页面
                next({ path: "/login" });
            } else {
                // 否则继续执行
                showMenu.value = !noMenu.includes(to.path);
                // 设置激活的菜单
                defaultActive.value = to.path;
                next();
            }
        }
        document.title = pathMap[to.name];
    });
</script>

<style scoped>
    .layout {
        min-height: 100vh;
        background-color: #ffffff;
    }

    .container {
        height: 100vh;
    }

    .aside {
        width: 200px !important;
        background-color: #222832;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
    }

    .head > div {
        display: flex;
        align-items: center;
    }

    .head img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
    }

    .head span {
        font-size: 20px;
        color: #ffffff;
    }

    .line {
        border-top: 1px solid hsla(0, 0%, 100%, 0.05);
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    .content {
        display: flex;
        flex-direction: column;
        max-height: 100vh;
        overflow: hidden;
    }

    .main {
        height: calc(100vh - 100px);
        overflow: auto;
        padding: 10px;
    }

    :deep(.el-submenu, .el-submenu__title) {
        background: #222832;
    }
    /* 自定义图标样式 */
    .icon-password {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 1em;
        margin-right: 5px;
        color: #909399;
        font-size: 18px;
    }
</style>

<style>
    /* 引入自定义字体图标 */
    @import "./assets/style/iconfont.less";
    html,
    body,
    #app {
        min-height: 100%;
        overflow-x: hidden;
        background-color: #f4f4f4;
    }

    #app {
        margin: 0 auto;
        background: #fff;
    }
</style>
