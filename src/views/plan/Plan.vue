<template>
  <div class = "plan-container">
    <a-row justify="center" align="middle">
      <a-col :span="12" :offset="6">
        <span style = "font-size:25px">
          ⏳距离考试1还剩<span style="font-size: 40px;font-weight:800;">100</span>天
        </span>
      </a-col>
      <a-col :span="12" :offset="6">
        <span style = "font-size:25px">
          ⏳距离考试1还剩<span style="font-size: 40px;font-weight:800;">50</span>天
        </span>
      </a-col>
    </a-row>
     <div class="plan-list"> <!--TailwindCSS写法-->
    <!-- 筛选区域 -->
     <h3>查询计划：</h3>
    <a-row :gutter="16" class="mb-4">
      <a-col :span="6">
        <a-select
          v-model:value="beginMonth"
          placeholder="请选择制定月份"
          style="width: 100%"
          @change="inquery"
        >
        >
          <a-select-option
            v-for="month in months"
            :key="month.value"
            :value="month.value"
          >
            {{ month.label }}
          </a-select-option>
        </a-select>
      </a-col>

      <a-col :span="6">
        <a-select
          v-model:value="dealMonth"
          placeholder="请选择截止月份"
          style="width: 100%"
          @change="inquery"
         
        >
          <a-select-option
            v-for="month in months"
            :key="month.value"
            :value="month.value"
          >
            {{ month.label }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>

    <!-- 计划列表 -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      row-key="id"
      bordered
      :pagination="pagination"
      @change="handleTableChange"
    >
    </a-table>
  </div>    
        
        
  </div>

</template>

<script setup lang="ts">

import { getPlanDeatil, getPlanFuzzyInquiry } from "@/servers/api/plan";
import { useUserStore } from "@/stores/user";
import { Pagination, type TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { ref, computed, onMounted } from "vue";
const useStore = useUserStore();
onMounted(() => {
  const userInfo = useStore.getUserInfo();
  
  getPlanDeatil({ user_id: userInfo.id}).then((res) => { 
    console.log(userInfo.id);
    
    for (let i = 0; i < res.data.length; i++) { 
      const planData = res.data[i];
      obtainTableData(planData);
    }
    
    
  });
});
type TableData = {
  planname: string;
  content: string;
  createtime: string;
  dealtime: string;
  finished: boolean;
}
const tableData = ref<TableData[]>([]);
const obtainTableData = (planData:API.plan) => { 
  
  tableData.value.push(
    {
      planname: planData.planname??'',
      content: planData.description??'',
      createtime: planData.begin_time??'',
      dealtime: planData.deal_time??'',
      finished: planData.finished??false,
    }
  );
};

// 12个月份选项
const months = ref([
  { label: "", value: "" },
  { label: "1 月", value: "01" },
  { label: "2 月", value: "02" },
  { label: "3 月", value: "03" },
  { label: "4 月", value: "04" },
  { label: "5 月", value: "05" },
  { label: "6 月", value: "06" },
  { label: "7 月", value: "07" },
  { label: "8 月", value: "08" },
  { label: "9 月", value: "09" },
  { label: "10 月", value: "10" },
  { label: "11 月", value: "11" },
  { label: "12 月", value: "12" },
]);


// 表格列配置
const columns: TableColumnsType<TableData> = [
  { title: "编号", dataIndex: "planid", key: "planid", customRender:({index}:{index:number}) => {return (pagination.value.current - 1) * pagination.value.pageSize + index + 1} },
  { title: "计划名称", dataIndex: "planname", key: "planname" },
  { 
    title: "计划内容", dataIndex: "content", key: "content",
    width: 300, // 固定列宽
    customCell: () => {
    return {
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    };
  },
  },
  { title: "制定日期", dataIndex: "createtime", key: "createtime",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD") : "--"},
  { title: "截止日期", dataIndex: "dealtime", key: "dealtime",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD") : "--"},
  { title: "是否完成", dataIndex: "finished", key: "finished" },
];
const pagination = ref({  //用于分页控制编号换页后也能够继续递增
  current: 1,
  pageSize: 5,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条记录`
});
const handleTableChange = (paginationInfo: any) => { //监听分页动作
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
};
const beginMonth = ref(''); 
const dealMonth = ref(''); 
const inquery = (value: any) => { //筛选函数
  // 根据筛选条件过滤数据
  tableData.value = [];//清空数据
  getPlanFuzzyInquiry({begin_month:beginMonth.value, deal_month:dealMonth.value, user_id:useStore.getUserInfo().id}).then((res) => { 
    console.log(res);
    for (let i = 0; i < res.data.length; i++) { 
      const planData = res.data[i];
      obtainTableData(planData);
    }
  });
 

  
};

</script>

<style scoped>
.plan-container {
  background-color: #f0f2f5;
  position:relative;
    height: 100vh;
    overflow:scroll;
    padding: 20px;
    padding-bottom: 0px;
}

h1 {
  margin-top: 1rem;
  color: #333;
}
.plan-list {
  background: #fff;
  border-radius: 8px;
}

</style>