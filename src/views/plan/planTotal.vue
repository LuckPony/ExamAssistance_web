<template>
  <div class="plan-container">
    <a-row justify="center" align="middle">
      <a-col :span="12" :offset="6">
        <span style="font-size:25px">
          ⏳距离考试1还剩<span style="font-size: 40px;font-weight:800;">{{ day1 }}</span>天
        </span>
      </a-col>
      <a-col :span="12" :offset="6">
        <span style="font-size:25px">
          ⏳距离考试2还剩<span style="font-size: 40px;font-weight:800;">{{ day2 }}</span>天
        </span>
      </a-col>
    </a-row>

    <div class="plan-list">
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
          <a-button type="dashed" @click="OpenModifyExamData">修改考试日期</a-button>
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
        <template #bodyCell="{ column, record }" class="table-cell">
          <template v-if="column.key === 'action'" >
            <a-button type="primary" @click="planFinished(record)" :disabled="record.finished" class="finish-button">完成</a-button>
            <a-button class="delete-button" type="primary" @click="delPlan(record)" >删除</a-button>
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

    <!-- 修改考试日期弹窗 -->
    <a-modal v-model:open="openModifyExamData" title="修改考试日期" @ok="modifyExamData" @cancel="">
      <a-form>
        <a-form-item label="考试1日期">
          <a-date-picker v-model:value="Day1" placeholder="请选择考试1日期" />
        </a-form-item>
        <a-form-item label="考试2日期">
          <a-date-picker v-model:value="Day2" placeholder="请选择考试2日期" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { getExam, putExam } from "@/servers/api/exam";
import { deletePlan, getPlanDeatil, getPlanFuzzyInquiry, postPlan, putPlan } from "@/servers/api/plan";
import { useUserStore } from "@/stores/user";
import { message, Pagination, type TableColumnsType } from "ant-design-vue";
import dayjs from "dayjs";
import { ref, onMounted, h } from "vue";

const useStore = useUserStore();

onMounted(() => {
  const userInfo = useStore.getUserInfo();
  

  getPlanDeatil({ user_id: userInfo.id }).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      const planData = res.data[i];
      obtainTableData(planData);
    }
    //按照开始时间排序
    tableData.value.sort((a, b) => dayjs(a.begintime).valueOf() - dayjs(b.begintime).valueOf());
  });

  getExam({ user_id: userInfo.id ?? 0 }).then((res) => {
    if (day1.value){
      day1.value = dayjs(res.data.date1).diff(dayjs(), "day");
      day1.value = isNaN(day1.value) ? 0 : day1.value;
    }
    if (day2.value){
      day2.value = dayjs(res.data.date2).diff(dayjs(), "day");
      day2.value = isNaN(day2.value) ? 0 : day2.value;
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
  remainingDays: string;
};

const tableData = ref<TableData[]>([]);
const obtainTableData = (planData: API.plan) => {
  const now = dayjs();
  const Days = now.diff(dayjs(planData.begin_time), "minute");
  const Days2 = now.diff(dayjs(planData.deal_time), "minute");

  let remainingDays;
  if (Days < 0) {
    remainingDays = "🩶 尚未开始";
  } else if (Days2 >= 0) {
    remainingDays = "💜 已结束";
  } else {
    const transDays = -Days2;
    remainingDays = `💚 还剩${Math.floor(transDays / 1440)}天`;
  }

  tableData.value.push({
    id: planData.id ?? 0,
    planname: planData.planname ?? "",
    content: planData.description ?? "",
    begintime: planData.begin_time ?? "",
    dealtime: planData.deal_time ?? "",
    finished: planData.finished ?? false,
    remainingDays: remainingDays,
  });
};

// 月份选项
const months = ref([
  { label: "全部", value: "" },
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

const columns: TableColumnsType<TableData> = [
  { title: "编号", dataIndex: "planid", key: "planid", width: "80px", customRender: ({ index }: { index: number }) => (pagination.value.current - 1) * pagination.value.pageSize + index + 1 },
  { title: "计划名称", dataIndex: "planname", key: "planname", width: "150px" },
  { title: "计划内容", dataIndex: "content", key: "content", width: 300, customCell: () => ({ style: { whiteSpace: "normal", wordBreak: "break-word" } }) },
  { title: "开始时间", dataIndex: "begintime", key: "begintime", width: "150px", customRender: ({ text }: { text: string }) => text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "--" },
  { title: "截止时间", dataIndex: "dealtime", key: "dealtime", width: "150px", customRender: ({ text }: { text: string }) => text ? dayjs(text).format("YYYY-MM-DD HH:mm") : "--" },
  { title: "状态", dataIndex: "remainingDays", key: "remainingDays", width: "100px" },
  { title: "是否完成", dataIndex: "finished", key: "finished", width: "100px", customRender: ({ text }: { text: boolean }) => (text ? "✅" : "❌") },
  { title: "操作", key: "action", width: 170 },
];

const pagination = ref({ current: 1, pageSize: 5, total: 0, showTotal: (total: number) => `共 ${total} 条记录` });
const handleTableChange = (paginationInfo: any) => {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
};

// 筛选条件
const beginMonth = ref(null);
const dealMonth = ref(null);

const inquery = () => {
  tableData.value = [];
  getPlanFuzzyInquiry({ begin_month: beginMonth.value ?? "", deal_month: dealMonth.value ?? "", user_id: useStore.getUserInfo().id }).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      const planData = res.data[i];
      obtainTableData(planData);
    }
  });
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
  openAddPlan.value = !openAddPlan.value;
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

// 完成按钮
const planFinished = (record: any) => {
  putPlan({ id: record.id }, { finished: true }).then((res) => {
    if (res.code === 200) {
      message.success("计划已完成");
      location.reload();
    } else {
      message.error("计划完成失败");
    }
  });
};

// 删除功能
const delPlan = (record: any) => {
  deletePlan({ id: record.id }).then((res) => {
    if (res.code === 200) {
      message.success("计划删除成功");
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      message.error("计划删除失败");
    }
  });
};

// 修改考试日期弹窗
const openModifyExamData = ref(false);
const Day1 = ref<any>();
const Day2 = ref<any>();
const day1 = ref<number>(0);
const day2 = ref<number>(0);

const OpenModifyExamData = () => {
  openModifyExamData.value = !openModifyExamData.value;
};

const modifyExamData = () => {
  putExam({ user_id: useStore.getUserInfo().id, date1: Day1.value, date2: Day2.value }).then((res: any) => {
    day1.value = dayjs(res.data.date1).diff(dayjs(), "day")??0;
    day1.value = isNaN(day1.value) ? 0 : day1.value;
    day2.value = dayjs(res.data.date2).diff(dayjs(), "day")??0;
    day2.value = isNaN(day2.value) ? 0 : day2.value;
    
  });
  message.success("修改成功");
  setTimeout(() => {
    OpenModifyExamData();
  }, 500);
};
</script>

<style scoped>
.plan-container {
  background-color: #f0f2f5;
  position: relative;
  height: 100vh;
  overflow: scroll;
  padding: 20px;
  padding-bottom: 0px;
  min-width:600px;
}

.plan-list {
  background: #fff;
  border-radius: 8px;
}
.finish-button:not(:disabled) {
  background-color: green ;
}
.finish-button:not(:disabled):hover {
  background-color: #409eff !important ;
}

.delete-button  {
  margin-left: 0px;
  background-color:red ;
}

h3 {
  margin-left: 10px;
}
.table-cell{
  display: flex;
  align-items: center; 
  flex-wrap: wrap;     
  gap: 10px;          
  height: 100%;        
}
</style>
