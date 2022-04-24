<template>
    <el-dialog width="30%"
               draggable
               :title="props.popTitle"
               :model-value="props.visible"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="cancel">
        <el-form label-width="100px"
                 status-icon
                 :model="ruleForm"
                 :rules="rules"
                 ref="formInstance">
            <el-form-item v-for="(item, index) in rowData"
                          :label="item.label"
                          :prop="item.prop"
                          :key="item.id">
                <el-upload class="avatar-uploader"
                           v-if="item.type === 'img'"
                           action="/api/upload/file"
                           :on-success="fileSuccess"
                           :on-error="fileError"
                           :headers="headers"
                           accept=".jpg,.jpeg,.png,.gif"
                           :show-file-list="false"
                           v-model="ruleForm.carouselUrl">
                    <img class="avatar-uploader-img"
                         :src="ruleForm.carouselUrl"
                         v-if="ruleForm.carouselUrl" />
                    <i class="el-icon-plus avatar-uploader-icon"
                       v-else></i>
                </el-upload>
                <el-input v-model.trim="ruleForm[formItem[index]]"
                          v-else></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary"
                       @click="submit">确认提交信息</el-button>
            <el-button @click="cancel">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, toRefs } from "vue";
    import { localGet } from "@/utils";
    // 使用defineEmit定义当前组件含有的事件，并通过返回的emits去发布事件
    const emits = defineEmits(["cancel", "handleFormData"]);
    // 从父组件接收的props
    const props = defineProps({
        visible: {
            type: Boolean,
            required: true,
        },
        popTitle: {
            type: String,
            required: true,
        },
        ruleForm: {
            type: Object,
            required: true,
        },
        rules: {
            type: Object,
            required: true,
        },
        rowData: {
            type: Array,
            required: true,
        },
    });
    // props解构，以便在模板中可以直接使用
    const { rules, rowData } = props;
    let { ruleForm } = toRefs(props);
    // 获取表单实例
    const formInstance = ref(null);
    /* 表单操作 */
    // 关闭dialog
    const cancel = () => {
        // 触发cancel自定义事件，关闭dialog
        emits("cancel");
        // 重置表单内容
        formInstance.value.resetFields();
    };
    // 提交表单
    const submit = async () => {
        try {
            // 表单验证
            await formInstance.value.validate();
            // 触发自定义事件，把收集到的表单数据发送给父组件
            emits("handleFormData", ruleForm, cancel);
            // 关闭dialog
            cancel();
        } catch (_) {
            console.log("AddOrAlter组件内submit失败了", _);
            return;
        }
    };
    // 返回一个数组，每一项是都是表单属性名
    const formItem = Reflect.ownKeys(ruleForm.value);
    /* el-upload处理 */
    // 上传图片携带token
    const headers = {
        token: localGet("token"),
    };
    // 图片上传成功
    const fileSuccess = (response) => {
        let { resultCode, data } = response;
        if (+resultCode === 200) {
            // 文件上传成功，data是图片在服务器的url地址
            ruleForm.value.carouselUrl = data;
            return;
        }
    };
    // 图片上传失败
    const fileError = () => {
        ElMessage.error("上传图片失败, 请稍后再试");
    };
</script>

<style lang="less" scoped>
    :depp(.el-dialog__body) {
        padding: 10px 20px;
    }
    .avatar-uploader-icon,
    .avatar-uploader-img {
        display: block;
        box-sizing: border-box;
        width: 120px;
        height: 120px;
        line-height: 120px;
        font-size: 24px;
        color: #8c939d;
        border: 1px dashed #d9d9d9;
        cursor: pointer;
    }
</style>
