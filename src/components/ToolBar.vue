<template>
    <!-- 操控区 -->
    <div class="tool_bar">
        <el-button type="primary"
                   :icon="Plus"
                   size="small"
                   @click="clickBtn('newAdd')">新增</el-button>
        <el-button type="danger"
                   :icon="Delete"
                   size="small"
                   @click="clickBtn('batchDelete')">批量删除</el-button>
    </div>
</template>

<script setup>
    import { Plus, Delete } from "@element-plus/icons-vue";
    // 使用defineEmit定义当前组件含有的事件，并通过返回的emits去发布事件
    const emits = defineEmits(["clickWhich"]);
    // 父组件需给该组件绑定 "clickWhich" 自定义事件。
    // 点击该组件内的按钮时，把点击的哪个按钮类型给发布出去
    const clickBtn = (type) => {
        emits("clickWhich", type);
    };
</script>

<style lang="less" scoped>
    .tool_bar {
        position: absolute;
        top: 15px;
        left: 20px;
        z-index: 999;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 40px;

        .el-button {
            height: 80%;
        }
    }
</style>
