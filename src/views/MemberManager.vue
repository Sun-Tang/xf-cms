<template>
  <div class="recommend_setting">
    <el-card class="box-card">
      <!-- header区域 -->
      <template #header>
        <div class="card-header">
          <!-- 操控区 -->
          <el-button
            type="success"
            :icon="Plus"
            size="small"
            @click="handleSolve"
            >解除禁用</el-button
          >
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            @click="handleForbid"
            >禁用账户</el-button
          >
        </div>
      </template>
      <!-- body区域 -->
      <div class="card_bd">
        <!-- 表格区 -->
        <div class="table_area">
          <el-table
            :data="tableList"
            v-loading="loading"
            height="100%"
            stripe
            @selection-change="changeSelects"
          >
            <el-table-column
              type="selection"
              min-width="10%"
              align="center"
            ></el-table-column>
            <el-table-column
              v-for="item in tableColumn"
              :key="item.label"
              :label="item.label"
              :prop="item.prop"
              :min-width="item['min-width']"
              align="center"
            ></el-table-column>
          </el-table>
        </div>
        <!-- 分页器 -->
        <pagination
          :total="total"
          :pageSize="pageSize"
          :pageNumber="pageNumber"
          @currPage="currPage"
        ></pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
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
  lockedFlag: "",
  isDeleted: "",
  //multipleSelection: [],
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { total, pageSize, pageNumber } = toRefs(paginationData);

// 表格数据
const tableData = reactive({
  // 请求表格数据时的loading效果
  loading: false,
  // 表格数据
  tableList: [],
  // 循环渲染列需要的数据
  tableColumn: [
    {
      label: "昵称",
      prop: "nickName",
      "min-width": "15%",
    },
    {
      label: "登录名",
      prop: "loginName",
      "min-width": "25%",
    },
    {
      label: "身份状态",
      prop: "lockedFlag",
      "min-width": "25%",
    },
    {
      label: "是否注销",
      prop: "isDeleted",
      "min-width": "25%",
    },
    {
      label: "注册时间",
      prop: "createTime",
      "min-width": "25%",
    },
  ],
  // 所有选中行的id
  selects: [],
  //当查询不到数据时，设置为true，显示手动点击查询按钮
  showQuery: false,
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { loading, tableList, tableColumn, showQuery } = toRefs(tableData);

// 发送数据请求
const query = async () => {
  // 表格请求数据loading效果
  tableData.loading = true;
  // 分页器数据解构
  let { pageNumber, pageSize, lockedFlag, isDeleted } = paginationData;
  try {
    let {
      resultCode,
      data: { totalCount, list },
    } = await api.home.getMemberManagerList(
      pageNumber,
      pageSize,
      lockedFlag,
      isDeleted
    );
    if (+resultCode !== 200) {
      tableData.tableList = [];
      ElMessage.error("请求异常, 请重试");
      tableData.loading = false;
      tableData.showQuery = true;
      return;
    }
    // 冻结，不用再做get/set劫持了
    tableData.tableList = Object.freeze(list);
    tableData.tableList.forEach((item) => {
      item.lockedFlag =
        item.lockedFlag == 0 ? "正常" : item.lockedFlag == 1 ? "禁用" : "";
      item.isDeleted = item.isDeleted == 0 ? "正常" : "";
    });
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
  console.log(val);
  let ids = val.map((item) => item.userId);
  tableData.selects = Object.freeze(ids);
  console.log(tableData.selects);
};

// 分页器子组件触发的事件，传递当前页码
const currPage = (page) => {
  paginationData.pageNumber = page;
  // 重新获取数据
  query();
};

const handleSolve = () => {
  if (!tableData.selects.length) {
    ElMessage.error("请选择项");
    return;
  }
  api.home.handleSolve(tableData.selects).then((res) => {
    console.log(res);
    ElMessage.success("解除成功");
    query();
  });
};
const handleForbid = () => {
  if (!tableData.selects.length) {
    ElMessage.error("请选择项");
    return;
  }
  api.home.handleForbid(tableData.selects).then((res) => {
    console.log(res);
    ElMessage.success("禁用成功");
    query();
  });
};

/* 钩子函数 */
onMounted(() => {
  // 查询表格数据
  query();
});
</script>

<style lang="less" scoped>
.recommend_setting {
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
