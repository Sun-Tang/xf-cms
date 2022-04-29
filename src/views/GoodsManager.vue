<template>
  <div class="goods_setting">
    <el-card class="box-card">
      <!-- header区域 -->
      <template #header>
        <div class="card-header">
          <!-- 操控区 -->
          <el-button type="primary" :icon="Plus" size="small"
            >新增商品</el-button
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
              min-width="10%"
            >
            </el-table-column>
            <el-table-column label="商品图片" align="center" width="150%">
              <template #default="scope">
                <img :src="scope.row.goodsCoverImg" />
              </template>
            </el-table-column>
            <el-table-column
              v-for="item in tableColumnTwo"
              :key="item.label"
              :label="item.label"
              :prop="item.prop"
              align="center"
              min-width="10%"
            >
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="20%">
              <el-link type="success">修改</el-link>
              <el-link type="primary">下架</el-link>
            </el-table-column>
            <!-- 查询不出来数据，显示此查询按钮 -->
            <template #empty v-if="showQuery">
              数据获取失败, 请点击<el-link type="danger" @click="query"
                >刷新</el-link
              >重试
            </template>
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
import { Plus } from "@element-plus/icons-vue";
import { ElLoading, ElMessageBox } from "element-plus";
import api from "@/api";
import { formatTime } from "@/utils";

/* 初始化数据 */
// 分页区数据-组件「pagination」
const paginationData = reactive({
  // 总条数
  total: 100,
  // 每页的记录条数
  pageSize: 10,
  //当前页码
  pageNumber: 1,
  goodsSellStatus: "",
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { total, pageSize, pageNumber } = toRefs(paginationData);

const tableData = reactive({
  // 请求表格数据时的loading效果
  loading: false,
  // 表格数据
  tableList: [],
  // 循环渲染列需要的数据
  tableColumn: [
    {
      label: "商品编号",
      prop: "goodsId",
      // "min-width": "10%",
    },
    {
      label: "商品名",
      prop: "goodsName",
      // "min-width": "10%",
    },
    {
      label: "商品简介",
      prop: "goodsIntro",
      // "min-width": "10%",
    },
  ],
  tableColumnTwo: [
    {
      label: "商品库存",
      prop: "stockNum",
      //"min-width": "10%",
    },
    {
      label: "商品售价",
      prop: "sellingPrice",
      //"min-width": "10%",
    },
    {
      label: "上架状态",
      prop: "goodsSellStatus",
    },
  ],
  // 所有选中行的id
  selects: [],
  //当查询不到数据时，设置为true，显示手动点击查询按钮
  showQuery: false,
});
// 不丢失响应式的解构,以便可以在模板中直接使用该变量
const { loading, tableList, tableColumn, tableColumnTwo, showQuery } =
  toRefs(tableData);

const query = async () => {
  // 表格请求数据loading效果
  tableData.loading = true;
  // 分页器数据解构
  let { pageNumber, pageSize, goodsSellStatus } = paginationData;
  try {
    let {
      resultCode,
      data: { totalCount, list },
    } = await api.home.getGoodsManagerList(
      pageNumber,
      pageSize,
      goodsSellStatus
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
      console.log(item.goodsCoverImg);
      item.goodsSellStatus =
        item.goodsSellStatus == 0
          ? "销售中"
          : item.goodsSellStatus == 1
          ? "已下架"
          : "";
    });
    paginationData.total = totalCount;
    tableData.loading = false;
  } catch (_) {
    tableData.tableList = [];
    tableData.loading = false;
    tableData.showQuery = true;
  }
};
const changeSelects = (val) => {
  let ids = val.map((item) => item.configId);
  tableData.selects = Object.freeze(ids);
};
// 分页器子组件触发的事件，传递当前页码
const currPage = (page) => {
  paginationData.pageNumber = page;
  // 重新获取数据
  query();
};
onMounted(() => {
  // 查询表格数据
  query();
});
</script>

<style lang="less" scoped>
.goods_setting {
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
      .cell {
        img {
          width: 100px;
          height: 100px;
        }
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

 
