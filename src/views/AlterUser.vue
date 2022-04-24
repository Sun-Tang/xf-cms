<template>
    <div class="alter_user">
        <!-- 修改登录名和昵称 -->
        <el-card class="box-card">
            <el-form ref="acctRuleFormRef"
                     :model="acctForm.ruleForm"
                     status-icon
                     :rules="acctForm.rules"
                     label-width="120px">
                <el-form-item label="登录名："
                              prop="loginUserName">
                    <el-input v-model.trim="acctForm.ruleForm.loginUserName"
                              autocomplete="off"
                              show-word-limit
                              maxlength="10" />
                </el-form-item>
                <el-form-item label="昵称："
                              prop="nickName">
                    <el-input v-model.trim="acctForm.ruleForm.nickName"
                              autocomplete="off"
                              show-word-limit
                              maxlength="10" />
                </el-form-item>
                <el-form-item>
                    <el-button type="danger"
                               @click="acctSubmit">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <!-- 修改密码 -->
        <el-card class="box-card">
            <el-form ref="pwdRuleFormRef"
                     :model="pwdForm.ruleForm"
                     :rules="pwdForm.rules"
                     label-width="120px">
                <el-form-item label="原密码："
                              prop="originalPassword">
                    <el-input v-model.trim="pwdForm.ruleForm.originalPassword"
                              type="password"
                              placeholder="Please input password"
                              show-password />
                </el-form-item>
                <el-form-item label="新密码："
                              prop="newPassword">
                    <el-input v-model.trim="pwdForm.ruleForm.newPassword"
                              type="password"
                              placeholder="Please input password"
                              show-password />
                </el-form-item>

                <el-form-item>
                    <el-button type="danger"
                               @click="pwdSubmit">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
    import { onMounted, reactive, ref } from "vue";
    import { ElMessage } from "element-plus";
    import api from "@/api";
    import { getUser } from "@/api";
    /* 修改登录名和昵称 相关逻辑 */
    // 校验登录名和昵称
    const checkName = (_, value, callback) => {
        let reg = /^([\u4e00-\u9fa5\w-]{1,10})$/;
        if (!reg.test(value)) {
            callback(
                new Error(
                    "用户名/昵称必须由中文、字母、数字、下划线、横杠组成, 且必须为1~10位"
                )
            );
            return;
        }
        callback();
    };
    // 登录名和昵称
    const acctForm = reactive({
        ruleForm: {
            loginUserName: "",
            nickName: "",
            // 原用户名和昵称备份
            loginUserName_bk: "",
            nickName_bk: "",
        },
        rules: {
            loginUserName: [
                {
                    required: true,
                    validator: checkName,
                    trigger: "blur",
                },
            ],
            nickName: [
                {
                    required: true,
                    validator: checkName,
                    trigger: "blur",
                },
            ],
        },
    });
    // 账户表单实例
    const acctRuleFormRef = ref(null);
    // 账户表单提交
    const acctSubmit = async () => {
        try {
            // 表单校验
            await acctRuleFormRef.value.validate();
            // 登录名和昵称和原来相同，报错
            let {
                loginUserName: name1,
                nickName: name2,
                loginUserName_bk,
                nickName_bk,
            } = acctForm.ruleForm;
            if (name1 === loginUserName_bk && name2 === nickName_bk) {
                ElMessage.error("登录名和昵称和原来相同");
                return;
            }
            // 发送ajax
            let {
                ruleForm: { loginUserName, nickName },
            } = acctForm;
            // 响应拦截器已经有提示框，此处无需再次提示
            await api.alterAcct(loginUserName, nickName);
        } catch (err) {
            console.log(err);
            let res = "";
            if (err.loginUserName && err.nickName) {
                res = "用户名和昵称输入不正确";
            } else if (err.loginUserName) {
                res = "用户名输入不正确";
            } else if (err.nickName) {
                res = "昵称输入不正确";
            }
            if (res) ElMessage.error(res);
        }
    };
    /* 修改密码 相关逻辑 */
    // 校验密码
    const checkPwd = (_, value, callback) => {
        let reg = /^[\w-]{1,10}$/;
        if (!reg.test(value)) {
            callback(
                new Error("密码必须由字母、数字、下划线、横杠组成, 且必须为1~10位")
            );
            return;
        }
        callback();
    };
    // 密码初始化数据
    const pwdForm = reactive({
        ruleForm: {
            newPassword: "",
            originalPassword: "",
            // 原密码备份
            password_bk: "",
        },
        rules: {
            newPassword: [
                {
                    required: true,
                    validator: checkPwd,
                    trigger: "blur",
                },
            ],
            originalPassword: [
                {
                    required: true,
                    validator: checkPwd,
                    trigger: "blur",
                },
            ],
        },
    });
    // 密码表单实例
    const pwdRuleFormRef = ref(null);
    // 密码表单提交
    const pwdSubmit = async () => {
        try {
            // 表单校验
            await pwdRuleFormRef.value.validate();
            // 原密码和新密码相同，报错
            let {
                newPassword: pwd1,
                password_bk: pwd2,
                originalPassword: pwd3,
            } = pwdForm.ruleForm;
            console.log(pwd1, pwd2, pwd3);
            if (pwd3 !== pwd2) {
                ElMessage.error("原密码输入不正确");
                return;
            }
            if (pwd1 === pwd2) {
                ElMessage.error("原密码和新密码相同");
                return;
            }
            // 发送ajax
            let {
                ruleForm: { newPassword, originalPassword },
            } = pwdForm;
            // 响应拦截器已经有提示框，此处无需再次提示
            await api.alterpwd(newPassword, originalPassword);
        } catch (err) {
            console.log(err);
            let res = "";
            if (err.originalPassword && err.newPassword) {
                res = "原密码和新密码输入不正确";
            } else if (err.originalPassword) {
                res = "原密码输入不正确";
            } else if (err.newPassword) {
                res = "新密码输入不正确";
            }
            if (res) ElMessage.error(res);
        }
    };
    // 钩子函数
    onMounted(async () => {
        let {
            resultCode,
            data: { loginUserName, nickName, loginPassword },
        } = await getUser();
        if (+resultCode !== 200) {
            return;
        }
        // 赋值初始化数据
        acctForm.ruleForm.loginUserName = loginUserName;
        acctForm.ruleForm.nickName = nickName;
        // 备份数据
        acctForm.ruleForm.loginUserName_bk = loginUserName;
        acctForm.ruleForm.nickName_bk = nickName;
        pwdForm.ruleForm.password_bk = Object.freeze(loginPassword);
    });
</script>

<style lang='less' scoped>
    .alter_user {
        .box-card {
            margin-bottom: 20px;
        }
        .el-form {
            width: 370px;
            .el-form-item {
                margin-bottom: 31px;
            }
        }
    }
</style>
