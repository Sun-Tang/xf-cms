<template>
    <!-- 分页区 -->
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :page-size='pageSize'
                   v-model:currentPage="currentPage"
                   :hide-on-single-page='true'>
    </el-pagination>
</template>

<script setup>
    import { toRefs, ref, watch } from "vue";
    // 从父组件接收的参数：总条数、每页条数
    // 分页器默认当前是第一页
    const props = defineProps({
        // 分页器默认当前是第一页
        pageNumber: {
            type: Number,
            default: 1,
        },
        // 默认每页10条数据
        pageSize: {
            type: Number,
            default: 10,
        },
        // 总条数，必输
        total: {
            type: Number,
            required: true,
        },
    });
    // 默认是第1页
    const currentPage = ref(props.pageNumber);
    // 使用defineEmit定义当前组件含有的事件，并通过返回的emits去发布事件
    const emits = defineEmits(["currPage"]);
    // 监视分页改变
    watch(currentPage, (newPage) => {
        // 父组件需给该组件绑定 "currPage" 自定义事件。
        // 点击该组件内的按钮时，把当前点击页码发布出去
        emits("currPage", newPage);
    });
    // 监视props.pageNumber，同步父组件的当前页码
    watch(
        () => props.pageNumber,
        (newPage) => {
            currentPage.value = newPage;
        }
    );

    // 不丢失响应式的解构写法
    const { pageSize, total } = toRefs(props);
</script>

<style lang='less' scoped>
    // 说明：
    //  +该分页器组件为绝对定位，因此父组件需要设置定位
    //  +分页器高度为40px,且默认设置距离父组件底部20px距离
    //  +因此父组件padding-bottom至少应该设置为60px，分页器组件才不会覆盖父组件的内容
    .el-pagination {
        box-sizing: border-box;
        // 位于父容器底部，水平居中
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        height: 40px;
        font-weight: 700;
        z-index: 999;
    }
</style>
