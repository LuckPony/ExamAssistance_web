<template>
  <div class="plan-container">
    <!-- 轮播 -->
    <a-carousel autoplay>
      <div><h3>有什么信念，就选择什么态度；有什么态度，就会有什么行为；有什么行为，就产生什么结果。要想结果变得好，必须选择好的信念。</h3></div>
      <div><h3>就快触及太阳的那一刻，突然从楼梯摔下去，放弃了。但是当你再加把劲，触摸到太阳的时候，你会发现一切都值得。</h3></div>
      <div><h3><img src="/src/assets/1.png" alt="plan1" width="100%" /></h3></div>
      <div><h3><img src="/src/assets/2.png" alt="plan1" width="100%" /></h3></div>
    </a-carousel>

    <!-- 总览数据 -->
    <a-row>
      <a-col :offset="0">
        <span style="font-size: 20px;">
          截止至
          <span style="font-size: 30px; font-weight: bold;">
            {{ dayjs().format("YYYY-MM-DD") }}
          </span>
          为止，您一共制定计划
          <span style="font-size: 40px; font-weight: 800; color: #409EFF;">
            {{ plans }}
          </span>
          项，完成了计划
          <span style="font-size: 40px; font-weight: 800; color: #67C23A;">
            {{ finishedPlans }}
          </span>
          项
        </span>
      </a-col>
    </a-row>

    <!-- 年份切换 -->
    <div class="year-selector">
      <a-button-group>
        <a-button
          v-for="year in yearList"
          :key="year"
          :type="year === selectedYear ? 'primary' : 'default'"
          @click="onYearChange(year)"
        >
          {{ year }}
        </a-button>
      </a-button-group>
    </div>

    <!-- 折线图 -->
    <div class="plan-echarts">
      <a-card title="📈 年度计划统计" class="plan-echarts-card">
        <div ref="lineChartRef" class="chart"></div>
      </a-card>
    </div>

    <!-- 柱状图 -->
    <div class="plan-echarts">
      <a-card title="📊 每月完成率统计" class="plan-echarts-card">
        <div ref="barChartRef" class="chart"></div>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPlanDeatil, getPlanFuzzyInquiry } from "@/servers/api/plan";
import { useUserStore } from "@/stores/user";
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

// 用户信息
const useStore = useUserStore();
const userInfo = useStore.getUserInfo();

// 总计划和完成计划数量
const plans = ref(0);
const finishedPlans = ref(0);

// 当前选择的年份
const selectedYear = ref(dayjs().year());
const yearList = ref([
  dayjs().year() - 1, 
  dayjs().year(), 
  dayjs().year() + 1
]);

// ECharts 图表容器
const lineChartRef = ref<HTMLDivElement | null>(null);
const barChartRef = ref<HTMLDivElement | null>(null);

// 12个月数据
const monthlyData = ref({
  months: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月"
  ],
  createdPlans: Array(12).fill(0),    // 制定数
  finishedPlans: Array(12).fill(0),   // 完成数
  completionRate: Array(12).fill(0)   // 完成率(%)
});

// 初始化折线图
const initLineChart = () => {
  if (lineChartRef.value) {
    const myChart = echarts.init(lineChartRef.value);
    const option = {
      tooltip: { trigger: "axis" },
      legend: { data: ["计划制定数", "计划完成数"] },
      toolbox: { feature: { saveAsImage: {} } },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: { type: "category", boundaryGap: false, data: monthlyData.value.months },
      yAxis: { type: "value" },
      series: [
        {
          name: "计划制定数",
          type: "line",
          data: monthlyData.value.createdPlans,
          smooth: true,
          lineStyle: { color: "#409EFF" }
        },
        {
          name: "计划完成数",
          type: "line",
          data: monthlyData.value.finishedPlans,
          smooth: true,
          lineStyle: { color: "#67C23A" }
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", () => myChart.resize());
  }
};

// 初始化柱状图
const initBarChart = () => {
  if (barChartRef.value) {
    const myChart = echarts.init(barChartRef.value);
    const option = {
      tooltip: { trigger: "axis", formatter: "{b} : {c}%" },
      xAxis: {
        type: "category",
        data: monthlyData.value.months
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value}%" }
      },
      series: [
        {
          name: "完成率",
          type: "bar",
          data: monthlyData.value.completionRate,
          itemStyle: {
            color: "#67C23A"
          },
          barWidth: "50%"
        }
      ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", () => myChart.resize());
  }
};

// 获取数据
const fetchData = async (year: number) => {
  // 统计总数（不分年份）
  const totalRes = await getPlanDeatil({ user_id: userInfo.id });
  plans.value = totalRes.data.length;

  const finishedRes = await getPlanDeatil({ user_id: userInfo.id, finished: true });
  finishedPlans.value = finishedRes.data.length;

  // 获取每月数据
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const promises = months.map((month, index) => {
    return getPlanFuzzyInquiry({
      user_id: userInfo.id,
      begin_month: month,
      // year // 👈 后端支持年份后加上这个参数
    })
    .then((res) => {
      const created = res.data?.length || 0;
      const finished = res.data?.filter((plan: any) => plan.finished).length || 0;

      monthlyData.value.createdPlans[index] = created;
      monthlyData.value.finishedPlans[index] = finished;

      // 计算完成率
      monthlyData.value.completionRate[index] =
        created === 0 ? 0 : parseFloat(((finished / created) * 100).toFixed(1));
    });
  });

  await Promise.all(promises);
  initLineChart();
  initBarChart();
};

// 切换年份
const onYearChange = (year: number) => {
  selectedYear.value = year;
  fetchData(year);
};

onMounted(() => {
  fetchData(selectedYear.value);
});
</script>

<style scoped>
.plan-container {
  background-color: #f0f2f5;
  position: relative;
  height: 100vh;
  overflow: scroll;
  padding: 20px;
  padding-bottom: 0px;
}

:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}
:deep(.slick-slide h3) {
  color: #fff;
}

.year-selector {
  margin: 15px 0;
  text-align: center;
}

.plan-echarts-card {
  margin-top: 20px;
  text-align: center;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>
