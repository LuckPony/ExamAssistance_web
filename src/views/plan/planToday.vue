<template>
  <div class = "plan-container">
    <a-row justify="center" align="middle">
      <a-col :span="12" :offset="6">
        <span style = "font-size:25px">
          Today：<span style="font-size: 30px;font-weight:800;">{{currentData}}--{{ currentWeek }}</span>
        </span>
      </a-col>
      <a-col :span="12" :offset="10">
        <span style = "font-size:25px">
          <span style="font-size: 40px;font-weight:800;">{{ currentTime }}</span>
        </span>
      </a-col>
      <a-col :span="6" :offset="20">
        <span style = "font-size:25px">
          新的一天也要元气满满呢！
        </span>
      </a-col>
    </a-row>
    <div class="plan-list"> <!--TailwindCSS写法-->
    <!-- 筛选区域 -->
     <h3>
        今天您一共存在<span style="font-size: 30px; font-weight: 800; color: #409EFF;">{{ plansToday }}</span>项计划，
        还有<span style="font-size: 30px; font-weight: 800; color: #67C23A;">{{ plansTodayUnFinished }}</span>项计划待完成!
        继续加油欧~~~
    
    </h3>
    <a-row :gutter="16" class="mb-4">
      <a-col :span="1.5">
        <a-button type="default" @click="transformAddPlan">新增计划</a-button>
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

    <!-- 新增计划弹窗 -->
    <a-modal v-model:open="openAddPlan" title="新增计划" @ok="addPlan" @cancel="">
      <a-form>
        <a-form-item label="计划名称">
          <a-input v-model:value="addPlanname" placeholder="请输入计划名称" />
        </a-form-item>

        <a-form-item label="计划内容">
          <a-input v-model:value="addContent" placeholder="请输入计划内容" />
        </a-form-item>

        <a-form-item label="开始日期">
          <a-date-picker
            v-model:value="addStartTime"
            placeholder="请选择开始日期"
            show-time
            @change="handleStartDateChange"
          />
        </a-form-item>

        <a-form-item label="持续天数">
          <a-input-number
            v-model:value="durationDays"
            :min="1"
            placeholder="输入天数"
            style="width: 100%"
            @change="handleDurationChange"
          />
        </a-form-item>

        <a-form-item label="截止日期">
          <a-date-picker
            v-model:value="addEndTime"
            placeholder="请选择截止日期"
            show-time
            @change="handleEndDateChange"
          />
        </a-form-item>
      </a-form>
    </a-modal>      
        
  </div>
</template>

<script setup lang="ts">

import { getExam, putExam } from "@/servers/api/exam";
import { deletePlan, getPlanDeatil, getPlanFuzzyInquiry, postPlan, putPlan } from "@/servers/api/plan";
import { useUserStore } from "@/stores/user";
import { message, type TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { ref, onMounted, onUnmounted } from "vue";
const useStore = useUserStore();
onMounted(() => {   //相当于周期钩子函数，周期开始就运行
  const userInfo = useStore.getUserInfo();
  const todayStart = dayjs().startOf('day'); //获取当天开始时间00:00:00
  const todayEnd = dayjs().endOf('day'); //获取当天结束时间23:59:59
  
  
  getPlanDeatil({ user_id: userInfo.id}).then((res) => { 
    console.log(userInfo.id);
    plansToday.value = res.data.length;//显示总计划数
    let j= 0;
    for (let i = 0; i < res.data.length; i++) { 
      const planData = res.data[i];
      //开始时间在今天截止时间之前，结束时间在今天开始之后
      if (dayjs(planData.begin_time).diff(todayEnd, "minute") <= 0 && dayjs(planData.deal_time).diff(todayStart, "minute") >= 0){
        console.log(dayjs(planData.deal_time).diff(dayjs(), "day"))
        obtainTableData(planData);
        if (dayjs(planData.deal_time).diff(dayjs(), "minute") > 0 && planData.finished === false) {
            plansTodayUnFinished.value = plansTodayUnFinished.value + 1;
        }
        j++;
      } 
    }
    plansToday.value = j;
    tableData.value.sort((a, b) => dayjs(a.begintime).valueOf() - dayjs(b.begintime).valueOf());
    
  });
  
  timer = window.setInterval(() => {
    currentTime.value = dayjs().format("HH:mm:ss"); 
  }, 1000);

});
onUnmounted(() => {
    clearInterval(timer); // 组件卸载时清除定时器,防止内存泄漏
});
type TableData = {
  id: number;
  planname: string;
  content: string;
  begintime: string;
  dealtime: string;
  finished: boolean;
  remainingDays: string;
}
const tableData = ref<TableData[]>([]);
const obtainTableData = (planData:API.plan) => { 
  const now = dayjs();
  
  const Days = now.diff(dayjs(planData.begin_time), "minute");
  const Days2 = now.diff(dayjs(planData.deal_time), "minute");
  let remainingDays;
  if (Days < 0) {
    remainingDays = "🩶 尚未开始"
  }
  else if(Days2>0){
    remainingDays = "💜 已结束"
  }
  else{
    const transDays = -Days2;
    remainingDays = `💚 还剩${Math.floor(transDays / 1440)}天`;
  }
  
  tableData.value.push(
    {
      id: planData.id??0,
      planname: planData.planname??'',
      content: planData.description??'',
      begintime: planData.begin_time??'',
      dealtime: planData.deal_time??'',
      finished: planData.finished??false,
      remainingDays:remainingDays,
    }
  );
  
};

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
  { title: "开始时间", dataIndex: "begintime", key: "createtime",width: "150px",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "--"},
  { title: "截止时间", dataIndex: "dealtime", key: "dealtime",width: "150px",customRender: ({ text }: { text: string }) =>text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "--"},
  { title: "状态", dataIndex: "remainingDays", key: "remainingDays",width: "100px", },
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
// 新增计划弹窗
const openAddPlan = ref(false);
const addPlanname = ref("");
const addContent = ref("");
const addStartTime = ref<any>(null);
const addEndTime = ref<any>(null);
const durationDays = ref<number | null>(null);
const handleStartDateChange = (value: any) => {
  if (durationDays.value) {
    addEndTime.value = dayjs(value).add(durationDays.value, "day");
  }
};

const handleDurationChange = (value: number) => {
  if (addStartTime.value) {
    addEndTime.value = dayjs(addStartTime.value).add(value, "day");
  }
};

const handleEndDateChange = (value: any) => {
  if (addStartTime.value) {
    durationDays.value = dayjs(value).diff(dayjs(addStartTime.value), "day");
  }
};

const transformAddPlan = () => { 
  openAddPlan.value = !openAddPlan.value
};
const addPlan = () => {
  if (!addStartTime.value || !addEndTime.value) {
    message.error("请填写完整的时间");
    return;
  }

  const planData = {
    planname: addPlanname.value,
    description: addContent.value,
    user_id: useStore.getUserInfo().id,
    begin_time: addStartTime.value,
    deal_time: addEndTime.value,
  };

  postPlan({ id: "0" }, planData).then((res) => {
    if (res.code === 200) {
      message.success("添加计划成功");
      setTimeout(() => {
        location.reload();
        transformAddPlan();
      }, 500);
    } else {
      message.error("添加计划失败");
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

//设置时间显示
const currentData = ref(dayjs().format('YYYY-MM-DD'));
const currentWeek = ref(dayjs().format('dddd'));//默认是英文，可以通过 dayjs.locale("zh-cn"); 设置全局中文
const currentTime = ref(dayjs().format('HH:mm:ss'));
let timer:number;//定时器，用于定时刷新时间

//设置计划统计
const plansToday = ref<number>(0);
const plansTodayUnFinished = ref<number>(0);
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