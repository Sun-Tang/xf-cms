<template>
  <div class="login-body">
    <!--登录框div-->
    <div class="login-container">
      <!--登录框头部logo部分-->
      <div class="head">
        <img
          class="logo"
          src="https://s.weituibao.com/1582958061265/mlogo.png"
        />
        <div class="name">
          <div class="title">新蜂商城</div>
          <div class="tips">Vue3.0 后台管理系统</div>
        </div>
      </div>
      <el-form
        label-position="top"
        :rules="loginRules"
        :model="loginForm"
        ref="loginFromRef"
        class="login-form"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm"
            >立即登录</el-button
          >
          <el-checkbox v-model="loginForm.checked" @change="!loginForm.checked"
            >下次自动登录</el-checkbox
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { login } from "@/api/index";
import { localSet } from "@/utils/index";
import { ref } from "vue";

const loginForm = ref({
  username: "admin",
  password: "123456",
  checked: true,
});
const loginRules = ref({
  username: [{ required: "true", message: "账户不能为空", trigger: "blur" }],
  password: [{ required: "true", message: "密码不能为空", trigger: "blur" }],
});

const loginFromRef = ref(null);
// 表单提交方法
const submitForm = async () => {
  loginFromRef.value.validate((valid) => {
    if (!valid || !loginForm.value.checked) return;
    // /adminUser/login 登录接口路径
    login(loginForm.value.username, loginForm.value.password).then((res) => {
      console.log(res);
      // 返回的时候会有一个 token，这个令牌就是我们后续去请求别的接口时要带上的，否则会报错，非管理员。
      // 这里我们将其存储到 localStorage 里面。
      localSet("token", res.data);
      // 此处登录完成之后，需要刷新页面
      window.location.href = "/";
    });
  });
};
</script>

<style scoped>
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
}
.login-container {
  width: 420px;
  height: 500px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 20px 0;
}
.head img {
  width: 100px;
  height: 100px;
  margin-right: 20px;
}
.head .title {
  font-size: 28px;
  color: #1baeae;
  font-weight: bold;
}
.head .tips {
  font-size: 12px;
  color: #999;
}
.login-form {
  width: 70%;
  margin: 0 auto;
}
.login-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form >>> .el-form-item {
  margin-bottom: 0;
}
</style>
