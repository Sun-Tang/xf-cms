<template>
  <div class="order_manager">
    <el-card class="box-card">
      <!-- header区域 -->
      <template #header>
        <div class="card-header">
          <!-- 操控区 -->
          <el-input
            style="width: 200px; margin-right: 10px"
            placeholder="请输入订单号"
            v-model="state.orderNo"
            @change="handleOption"
            size="small"
            clearable
          />
          <el-select
            @change="handleOption"
            v-model="state.orderStatus"
            size="small"
            style="width: 200px; margin-right: 10px"
          >
            <el-option
              v-for="item in state.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-s-home"
            @click="handleConfig()"
            >配货完成</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="el-icon-s-home"
            @click="handleSend()"
            >出库</el-button
          >
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleClose()"
            >关闭订单</el-button
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
              align="center"
              min-width="20%"
            ></el-table-column>
            <el-table-column label="操作" min-width="20%">
              <template #default="scope">
                <el-popconfirm
                  v-if="scope.row.orderStatus == '已支付'"
                  title="确定配货完成吗？"
                  @confirm="handleConfig(scope.row.orderId)"
                >
                  <template #reference>
                    <a style="cursor: pointer; margin-right: 10px">配货完成</a>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-if="scope.row.orderStatus == '配货成功'"
                  title="确定出库吗？"
                  @confirm="handleSend(scope.row.orderId)"
                >
                  <template #reference>
                    <a style="cursor: pointer; margin-right: 10px">出库</a>
                  </template>
                </el-popconfirm>
                <el-popconfirm
                  v-if="
                    scope.row.orderStatus == '待支付' ||
                    scope.row.orderStatus == '已支付' ||
                    scope.row.orderStatus == '配货成功'
                  "
                  title="确定关闭订单吗？"
                  @confirm="handleClose(scope.row.orderId)"
                >
                  <template #reference>
                    <a style="cursor: pointer; margin-right: 10px">关闭订单</a>
                  </template>
                </el-popconfirm>
                <router-link
                  :to="{
                    path: '/orderdetail',
                    query: { id: scope.row.orderId },
                  }"
                  >订单详情</router-link
                >
                <!--  <div @click="router.push('/orderdetail')">订单详情</div> -->
              </template>
            </el-table-column>
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
import { ElLoading, ElMessageBox, ElMessage } from "element-plus";
import api from "@/api";
import routes from "../router/routes";
import { useRouter } from "vue-router";

const router = useRouter();
const goDetail = () => {
  console.log(router, "router");
  router.push({
    path: "/orderdetail",
  });
};

/* 初始化数据 */
// 分页区数据-组件「pagination」

const state = reactive({
  loading: false,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  orderNo: "", // 订单号
  orderStatus: "", // 订单状态
  options: [
    {
      value: "",
      label: "全部",
    },
    {
      value: 0,
      label: "待支付",
    },
    {
      value: 1,
      label: "已支付",
    },
    {
      value: 2,
      label: "配货完成",
    },
    {
      value: 3,
      label: "出库成功",
    },
    {
      value: 4,
      label: "交易成功",
    },
    {
      value: -1,
      label: "手动关闭",
    },
    {
      value: -2,
      label: "超时关闭",
    },
    {
      value: -3,
      label: "商家关闭",
    },
  ],
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { total, pageSize, pageNumber } = toRefs(state);

const tableData = reactive({
  // 请求表格数据时的loading效果
  loading: false,
  // 表格数据
  tableList: [],
  // 循环渲染列需要的数据
  tableColumn: [
    {
      label: "订单号",
      prop: "orderNo",
    },
    {
      label: "订单总价",
      prop: "totalPrice",
    },
    {
      label: "订单状态",
      prop: "orderStatus",
    },
    {
      label: "支付方式",
      prop: "payType",
    },
    {
      label: "创建时间",
      prop: "createTime",
    },
  ],
  // 所有选中行的id
  selects: [],
  //当查询不到数据时，设置为true，显示手动点击查询按钮
  showQuery: false,
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { loading, tableList, tableColumn, showQuery } = toRefs(tableData);

const query = async () => {
  // 表格请求数据loading效果
  tableData.loading = true;
  // 分页器数据解构
  let { pageNumber, pageSize, orderNo, orderStatus } = state;
  try {
    let {
      resultCode,
      data: { totalCount, list },
    } = await api.home.getOrderManagerList(
      pageNumber,
      pageSize,
      orderNo,
      orderStatus
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
      item.orderStatus =
        item.orderStatus == 0
          ? "待支付"
          : item.orderStatus == -1
          ? "手动关闭"
          : item.orderStatus == -2
          ? "超时关闭"
          : item.orderStatus == 1
          ? "已支付"
          : item.orderStatus == 2
          ? "配货成功"
          : item.orderStatus == 3
          ? "出库成功"
          : item.orderStatus == 4
          ? "交易成功"
          : "";
      item.payType =
        item.payType == 0
          ? "未支付"
          : item.payType == 1
          ? "微信支付"
          : item.payType == 2
          ? "支付宝支付"
          : "";
    });

    state.total = totalCount;
    tableData.loading = false;
  } catch (_) {
    tableData.tableList = [];
    tableData.loading = false;
    tableData.showQuery = true;
  }
};
const handleOption = () => {
  state.currentPage = 1;
  query();
};
const changeSelects = (val) => {
  let ids = val.map((item) => item.orderId);
  tableData.selects = Object.freeze(ids);
};

const handleConfig = () => {
  api.home.checkDone(tableData.selects).then((res) => {
    console.log(res);
    ElMessage.success("配货完成");
    query();
  });
};
const handleSend = () => {
  api.home.checkOut(tableData.selects).then((res) => {
    console.log(res);
    ElMessage.success("出库成功");
    query();
  });
};

// 分页器子组件触发的事件，传递当前页码
const currPage = (page) => {
  state.pageNumber = page;
  // 重新获取数据
  query();
};

onMounted(() => {
  // 查询表格数据
  query();
});
</script>

<style lang="less" scoped>
.order_manager {
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
  .el-table__header {
    font-size: 16px;
  }
}
</style>

 
