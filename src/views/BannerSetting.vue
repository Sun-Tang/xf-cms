<template>
    <div class="banner_setting">
        <el-card class="box-card">
            <!-- header区域 -->
            <template #header>
                <div class="card-header">
                    <!-- 操控区 -->
                    <ToolBar @clickWhich="clickWhich"></ToolBar>
                </div>
            </template>
            <!-- body区域 -->
            <div class="card_bd">
                <!-- 表格区 -->
                <div class="table_area">
                    <el-table :data="tableList"
                              v-loading="loading"
                              height="100%"
                              stripe
                              @selection-change="changeSelects">
                        <el-table-column type="selection"
                                         min-width="10%"
                                         align="center"></el-table-column>
                        <el-table-column label="轮播图"
                                         min-width="15%"
                                         align="center">
                            <template #default="{ row }">
                                <el-image :src="row.carouselUrl"
                                          :preview-src-list="[row.carouselUrl]"
                                          :preview-teleported='true'
                                          lazy>
                                    <template #error>
                                        <el-image src="/src/assets/imgLoadError.jpeg"></el-image>
                                    </template>
                                    <template #placeholder>
                                        <div class="imgPlaceholderBox"
                                             v-loading="true"
                                             element-loading-text="Loading..."
                                             element-loading-background="rgba(0, 0, 0, 0.8)">
                                        </div>
                                    </template>
                                </el-image>
                            </template>

                        </el-table-column>
                        <el-table-column v-for="item in tableColumn"
                                         :key="item.label"
                                         :label="item.label"
                                         :prop="item.prop"
                                         :min-width="item['min-width']"
                                         align="center"></el-table-column>
                        <el-table-column label="添加时间"
                                         :formatter="formatterTime"
                                         min-width="15%"
                                         align="center"></el-table-column>
                        <el-table-column label="操作"
                                         min-width="15%">
                            <template #default="{row}">
                                <el-link type="success"
                                         :icon="Edit"
                                         @click="openDialog(row)">修改</el-link>
                                <el-popconfirm title="确定要删除本条数据吗？"
                                               @confirm="remove([row.carouselId])">
                                    <template #reference>
                                        <el-link type="primary"
                                                 :icon="Delete">删除</el-link>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                        <!-- 查询不出来数据，显示此查询按钮 -->
                        <template #empty
                                  v-if="showQuery">
                            数据获取失败, 请点击<el-link type="danger"
                                     @click="query">刷新</el-link>重试
                        </template>
                    </el-table>
                </div>
                <!-- 新增/修改 弹出form框 -->
                <add-or-alter :visible="visible"
                              :popTitle="popTitle"
                              :rowData="rowData"
                              :ruleForm="ruleForm"
                              :rules="rules"
                              @cancel="cancel"
                              @handleFormData="handleFormData"></add-or-alter>
                <!-- 分页器 -->
                <pagination :total="total"
                            :pageSize="pageSize"
                            :pageNumber='pageNumber'
                            @currPage="currPage"></pagination>
            </div>
        </el-card>
    </div>
</template>

<script setup>
    import { onMounted, reactive, ref, toRefs } from "vue";
    import { Edit, Delete } from "@element-plus/icons-vue";
    import { ElLoading, ElMessageBox } from "element-plus";
    import api from "@/api";
    import { formatTime } from "@/utils";
    // import ToolBar from "../components/ToolBar.vue";
    /* 初始化数据 */
    // 分页区数据-组件「pagination」
    const paginationData = reactive({
        // 总条数
        total: 100,
        // 每页的记录条数
        pageSize: 10,
        //当前页码
        pageNumber: 1,
    });
    // 不丢失响应式的解构,以便可以在模板中直接使用该变量
    const { total, pageSize, pageNumber } = toRefs(paginationData);
    // 弹出form框数据-组件「add-or-alter」
    // 排序值校验：必须为1至3位数字
    const checkRank = (_, value, callback) => {
        let reg = /^\d{1,3}$/;
        if (!reg.test(value)) {
            callback(new Error("排序值必须为1~3位数字"));
            return;
        }
        callback();
    };
    const popForm = reactive({
        visible: false,
        // 弹出Form框标题
        popTitle: "",
        // 收集表单数据
        ruleForm: {
            carouselUrl: "",
            redirectUrl: "",
            carouselRank: 1,
        },
        // 表单数据的初始化备份。点击表单弹出框取消按钮时，初始化数据
        ruleForm_bk: {},
        // 表单校验规则
        rules: {
            carouselUrl: [
                {
                    required: true,
                    message: "请上传图片",
                    trigger: "blur",
                },
            ],
            redirectUrl: [
                {
                    required: true,
                    // validator: checkURL,
                    message: "请输入URL",
                    trigger: "blur",
                },
            ],
            carouselRank: [
                {
                    required: true,
                    // 必须为1至3位数字
                    validator: checkRank,
                    trigger: "blur",
                },
            ],
        },
        // 表单row数据信息,用户循环渲染列数据
        rowData: [
            {
                id: "01",
                label: "图片",
                prop: "carouselUrl",
                // 展示的组件类型
                type: "img",
            },
            {
                id: "02",
                label: "跳转连接",
                prop: "redirectUrl",
                type: "input",
            },
            {
                id: "03",
                label: "排序值",
                prop: "carouselRank",
                type: "input",
            },
        ],
        //新增商品时，为空；修改商品时，为商品carouselId
        carouselId: "",
    });
    let { ruleForm_bk, rules, rowData } = popForm;
    const { visible, popTitle, ruleForm } = toRefs(popForm);
    // 表格数据
    const tableData = reactive({
        // 请求表格数据时的loading效果
        loading: false,
        // 表格数据
        tableList: [],
        // 循环渲染列需要的数据
        tableColumn: [
            {
                label: "跳转连接",
                prop: "redirectUrl",
                "min-width": "30%",
            },
            {
                label: "排序值",
                prop: "carouselRank",
                "min-width": "15%",
            },
        ],
        // 所有选中行的id
        selects: [],
        //当查询不到数据时，设置为true，显示手动点击查询按钮
        showQuery: false,
    });
    // 不丢失响应式的解构,以便可以在模板中直接使用该变量
    const { loading, tableList, tableColumn, showQuery } = toRefs(tableData);

    //组件tool-bar绑定的自定义事件，获取点击的哪个按钮
    const clickWhich = (type) => {
        switch (type) {
            // 新增
            case "newAdd":
                openDialog();
                break;
            // 批量删除
            case "batchDelete":
                removeItems();
                break;
            default:
                console.log(`兄弟, 咋不添加按钮「${type}」的相关处理逻辑呢~~~`);
                break;
        }
    };
    // 打开dialog,添加/修改商品
    const openDialog = (row) => {
        popForm.visible = true;
        popForm.popTitle = "添加商品";
        // 修改，从row中取出对应的信息，赋值给对应的文本框
        if (row) {
            let { carouselId, carouselUrl, redirectUrl, carouselRank } = row;
            popForm.ruleForm = {
                carouselUrl,
                redirectUrl,
                carouselRank,
            };
            popForm.carouselId = carouselId;
            popForm.popTitle = "修改商品";
        }
    };
    /* 表格操作 */
    // 发送数据请求
    const query = async () => {
        // 表格请求数据loading效果
        tableData.loading = true;
        // 分页器数据解构
        let { pageNumber, pageSize } = paginationData;
        try {
            let {
                resultCode,
                data: { totalCount, list },
            } = await api.home.carousels(pageNumber, pageSize);
            if (+resultCode !== 200) {
                tableData.tableList = [];
                ElMessage.error("请求异常, 请重试");
                tableData.loading = false;
                tableData.showQuery = true;
                return;
            }
            // 冻结，不用再做get/set劫持了
            tableData.tableList = Object.freeze(list);
            paginationData.total = totalCount;
            tableData.loading = false;
        } catch (_) {
            tableData.tableList = [];
            tableData.loading = false;
            tableData.showQuery = true;
        }
    };
    //当选择项发生变化时会触发该事件, 形参是个数组，每一项都是已选中的行记录对象
    const changeSelects = (val) => {
        let ids = val.map((item) => item.carouselId);
        tableData.selects = Object.freeze(ids);
    };
    // 格式化添加时间
    const formatterTime = (row) => {
        return formatTime(row.createTime, "{1}-{2} {3}:{4}");
    };
    // 删除某一条记录
    const remove = async (ids) => {
        try {
            let { resultCode } = await api.home.carouselsRemove(ids);
            if (+resultCode !== 0) {
                ElMessage.error("删除失败，请重试");
                return false;
            }
            ElMessage.success("删除成功");
            // 非第1页场景，若最后一页只有1条记录，删除后，则重新请求前一页数据
            if (
                paginationData.pageNumber !== 1 &&
                tableData.tableList.length === 1
            ) {
                paginationData.pageNumber--;
            }
            query();
            return true;
        } catch (_) {
            console.log("GoodsSetting组件内删除记录失败了", _);
            return;
        }
    };
    // 批量删除
    const removeItems = async () => {
        let selects = tableData.selects;
        if (selects.length <= 0) {
            ElMessage.error("未选中任何内容");
            return;
        }
        try {
            await ElMessageBox.confirm(
                "此操作将永久删除该文件, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            );
            remove(selects);
        } catch (_) {}
    };
    // 分页器子组件触发的事件，传递当前页码
    const currPage = (page) => {
        paginationData.pageNumber = page;
        // 重新获取数据
        query();
    };
    //组件add-or-alter绑定的自定义事件，关闭弹出的Form框
    const cancel = () => {
        popForm.visible = false;
        popForm.ruleForm = { ...ruleForm_bk };
    };
    //组件add-or-alter绑定的自定义事件，获取表单数据。并发送ajax请求
    const handleFormData = async (formDataObj, cancel) => {
        //发送ajax
        try {
            // 新增
            let sendfunc = api.home.carouselsInsert,
                // 提交到后台的表单数据
                data = { ...popForm.ruleForm, ...formDataObj };
            // 修改
            let carouselId = popForm.carouselId;
            if (carouselId) {
                sendfunc = api.home.carouselsUpdate;
                data.carouselId = carouselId;
            }
            // 新增 / 修改热销商品信息;
            let { resultCode } = await sendfunc(data);
            if (+resultCode !== 200) {
                ElMessage.error(`${carouselId ? "修改" : "新增"}商品失败, 请重试`);
                return;
            }
            ElMessage.success(`${carouselId ? "修改" : "新增"}商品成功`);
            // 再次初始化popForm.carouselId
            popForm.carouselId = "";
            //新增商品，重新渲染第1页；修改商品，重新渲染当前页
            paginationData.pageNumber = carouselId ? paginationData.pageNumber : 1;
            // 重新获取数据
            query();
            // 关闭弹框
            cancel();
        } catch (_) {
            console.log("失败了", _);
            return;
        }
    };
    /* 钩子函数 */
    onMounted(() => {
        // 查询表格数据
        query();
        // 备份form表单初始化数据,点击表单取消按钮时，恢复初始化数据
        ruleForm_bk = { ...popForm.ruleForm };
    });
</script>

<style lang="less" scoped>
    .banner_setting {
        position: relative;
        // 防止左右出现滚动条
        overflow-x: hidden;
        // 头部区域
        .card-header {
            padding: 16px 0;
        }
        // 内容区域
        .card_bd {
            .table_area {
                // 页面整体没有滚动条，只有表格区才有滚动条
                height: calc(100vh - 300px);
                min-height: 300px;
                margin-bottom: 70px;
                overflow-y: auto;
                .el-table {
                    box-sizing: border-box;
                    width: 100%;
                }
                .el-image,
                .imgPlaceholderBox {
                    display: block;
                    margin: 0 auto;
                    width: 80px;
                    height: 80px;
                }
                .el-link {
                    margin-right: 10px;
                }
                :deep(.el-table__empty-text) {
                    line-height: normal;
                    .el-link {
                        display: inline-block;
                        // vertical-align: top;
                        margin-right: 0;
                        color: red;
                        padding: 0 2px;
                        font-size: 20px;
                    }
                }
                :deep(.el-loading-spinner .el-loading-text) {
                    margin-top: -10px;
                }
            }
        }
    }
</style>
