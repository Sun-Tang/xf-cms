<template>
  <el-card class="order-container">
    <div class="data">
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单状态</span>
          </div>
        </template>
        <div>
          {{ tableData.orderStatusString }}
        </div>
      </el-card>
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>创建时间</span>
          </div>
        </template>
        <div>
          {{ tableData.createTime }}
        </div>
      </el-card>
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单号</span>
          </div>
        </template>
        <div>
          {{ tableData.orderNo }}
        </div>
      </el-card>
    </div>
    <el-table :data="tableList" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="商品图片">
        <template #default="scope">
          <img
            style="width: 100px"
            :key="scope.row.goodsId"
            :src="scope.row.goodsCoverImg"
            alt="商品主图"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableData.tableColumn"
        :key="item.label"
        :label="item.label"
        :prop="item.prop"
        align="center"
        min-width="70%"
      >
      </el-table-column>
      <!-- <el-table-column prop="goodsId" label="商品编号"> </el-table-column>
      <el-table-column prop="goodsName" label="商品名"></el-table-column>
      <el-table-column prop="goodsCount" label="商品数量"> </el-table-column>
      <el-table-column prop="sellingPrice" label="价格"> </el-table-column> -->
    </el-table>
  </el-card>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from "vue";
import { useRoute } from "vue-router";
import api from "@/api";
import { or } from "@vueuse/core";

const route = useRoute();
const { id } = route.query;
console.log(route.query);
/* const state = reactive({
  data: {},
  tableData: [],
}); */
const tableData = reactive({
  orderStatusString: "",
  createTime: "",
  orderNo: "",
  data: {},
  tableList: [],
  tableColumn: [
    {
      label: "商品编号",
      prop: "goodsId",
    },
    {
      label: "商品名",
      prop: "goodsName",
    },
    {
      label: "商品数量",
      prop: "goodsCount",
    },
    {
      label: "价格",
      prop: "sellingPrice",
    },
  ],
});
const { orderStatusString, createTime, orderNo, data, tableList, tableColumn } =
  toRefs(tableData);
const query = async () => {
  /* api.home.getOrderDetail(id).then((res) => {
    console.log(res.data, "000000");
    tableData.data = res.data;
    let list = res.data.newBeeMallOrderItemVOS[0];
    tableData.tableList = Object.freeze(list);
  }); */
  try {
    let {
      resultCode,
      data: { orderStatusString, createTime, orderNo, newBeeMallOrderItemVOS },
    } = await api.home.getOrderDetail(id);
    if (+resultCode !== 200) {
      tableData.tableList = [];
      ElMessage.error("请求异常, 请重试");
      return;
    }
    // 冻结，不用再做get/set劫持了
    tableData.tableList = Object.freeze(newBeeMallOrderItemVOS);
    tableData.orderStatusString = orderStatusString;
    tableData.createTime = createTime;
    tableData.orderNo = orderNo;
  } catch (_) {
    tableData.tableList = [];
  }
};
onMounted(() => {
  query();
});
</script>

<style scoped>
.data {
  display: flex;
  margin-bottom: 50px;
}
.data .data-item {
  flex: 1;
  margin: 0 10px;
}
.el-table {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
.has-gutter th {
  border-right: 1px solid #ebeef5;
}

.has-gutter th:last-child {
  border-right: none;
}
.el-table__row td {
  border-right: 1px solid #ebeef5;
}
.el-table__row td:last-child {
  border-right: none;
}
</style>