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
          allowClear
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
          allowClear
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
      <a-col :span="1.5">
        <a-button type="default" @click="transformAddPlan">新增计划</a-button>
      </a-col>
      <a-col :span="6">
        <a-button type="dashed" @click="inquery">修改考试日期</a-button>
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
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-button type="primary" @click="planFinished(record)" :disabled="record.finished" >完成</a-button>
        
        <a-button class="delete-button" type="primary" @click="delPlan(record)">删除</a-button>
      </template>
    </template>
    </a-table>
    </div>    
    <a-modal v-model:open="openAddPlan" title="新增计划" @ok="addPlan" @cancel="">
      <a-form>
        <a-form-item label="计划名称">
          <a-input v-model:value="addPlanname" placeholder="请输入计划名称"  />
        </a-form-item>
        <a-form-item label="计划内容">
          <a-input v-model:value="addContent" placeholder="请输入计划内容"  />
        </a-form-item>
        <a-form-item label="计划进行时间">
          <a-range-picker v-model:value="addTime" show-time />
        </a-form-item>
      </a-form>
    </a-modal>      
        
  </div>

</template>

<script setup lang="ts">

import { deletePlan, getPlanDeatil, getPlanFuzzyInquiry, postPlan, putPlan } from "@/servers/api/plan";
import { useUserStore } from "@/stores/user";
import { message, Pagination, type TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { ref, computed, onMounted, h } from "vue";
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
  id: number;
  planname: string;
  content: string;
  begintime: string;
  dealtime: string;
  finished: boolean;
}
const tableData = ref<TableData[]>([]);
const obtainTableData = (planData:API.plan) => { 
  
  tableData.value.push(
    {
      id: planData.id??0,
      planname: planData.planname??'',
      content: planData.description??'',
      begintime: planData.begin_time??'',
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
  { title: "编号", dataIndex: "planid", key: "planid", width: "80px" , customRender:({index}:{index:number}) => {return (pagination.value.current - 1) * pagination.value.pageSize + index + 1} },
  { title: "计划名称", dataIndex: "planname", key: "planname",width:"150px" },
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
  { title: "制定日期", dataIndex: "begintime", key: "createtime",width: "150px",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD") : "--"},
  { title: "截止日期", dataIndex: "dealtime", key: "dealtime",width: "150px",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD") : "--"},
  { title: "是否完成", dataIndex: "finished", key: "finished", width:"100px",customRender: ({ text }: { text: boolean }) => (text ? "✅ " : "❌ "), },
  {title: "操作",key: "action",width:170}
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
// 设置筛选条件
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

//设置新增计划弹窗
const openAddPlan = ref<boolean>(false);
const addPlanname = ref<string>('');
const addContent = ref<string>('');
const addTime = ref<any>([]);

const transformAddPlan = () => { 
  openAddPlan.value = !openAddPlan.value
};
const addPlan = () => { 
  const planData = { 
    planname: addPlanname.value,
    description: addContent.value,
    user_id: useStore.getUserInfo().id,
    begin_time: addTime.value[0],
    deal_time: addTime.value[1],
  };
  
  postPlan({id:"0"}, planData).then((res) => { //此处的id后端接口中没用到，只是为了复用接口
    if (res.code === 200) { 
      message.success('添加计划成功');
      setTimeout(() => { 
        location.reload();
        transformAddPlan();
      }, 500);
      
    } else { 
      message.error('添加计划失败');
  }
});
};
//设置完成按钮功能
const planFinished = (record: any) => {
  console.log(record);
  
  putPlan({id:record.id}, {finished: true}).then((res) => { 
    if (res.code === 200) { 
      message.success('计划已完成');
      location.reload();
    } else { 
      message.error('计划完成失败');
      console.log(res);
  }
  });
}

//设置删除功能
const delPlan = (record: any) => {
  deletePlan({ id: record.id }).then((res) => { 
    if (res.code === 200) { 
      message.success('计划删除成功');
      setTimeout(() => { 
        location.reload();
      }, 500);
    } else { 
      message.error('计划删除失败');
      console.log(res);
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
.delete-button{
  margin-left: 10px;
}
h3{
  margin-left:10px;
}

</style>