<template>
<div class="container">
    <img src="@/assets/planLogo.jpg" width="50" height="50" alt="logo">
  <a-menu @select="handleClick" v-model:selectedKeys="current" mode="horizontal" :items="items" class="menu"  />
</div>

</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import{ Modal, type MenuProps } from 'ant-design-vue';
import router from '@/router';
import { useUserStore } from '@/stores/user';

const current = ref<string[]>(['plan']);
const userStore = useUserStore();


const items = ref<MenuProps['items']>([
  {
    key: 'plan',
    icon: () => h(MailOutlined),
    label: '首页',
    title: '首页',
  },
  {
    key: 'planTotal',
    icon: () => h(AppstoreOutlined),
    label: '计划',
    title: '计划',
  },
  {
    key: 'planToday',
    icon: () => h(SettingOutlined),
    label: '当日规划',
    title: '当日规划',
  },
  { key: 'myInfo',
    icon: () => h(UserOutlined),    
    label: '我的信息',    
    title: '我的信息',  },
  {
    key: 'logout',
    icon: () => h(LogoutOutlined),
    label: '退出登录',
    title: '退出登录',
  },
]);

const handleClick = (e: any) => {
  console.log('click ', e);
  if(e.key ==='plan'){
    router.push('/plan');
  }
  if (e.key === 'planTotal') {
    // 处理分析
    router.push('/planTotal');
  }
  if (e.key === 'planToday') {
    // 处理分析
    router.push('/planToday');
  }
  if (e.key === 'myInfo') {
    // 处理用户管理
    router.push('/myInfo');
  }
  if (e.key === 'logout') {
    // 弹出确认提示
    Modal.confirm({
      title: '确认退出登录吗？',
      icon: h(ExclamationCircleOutlined),
      content: '退出后需要重新登录才能访问系统。',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // 用户点击确定
        userStore.clearUserInfo();
        router.push('/');
        location.reload();
      },
      onCancel() {
        current.value = [];//清空选中项，避免高亮停留，防止出现点击同一个 key 不触发 select事件的问题
        console.log('取消退出');
      },
    });
    return;
  }
  
  
  // 添加路由
  router.replace('/'+e.key);
  // 重置当前选中项
  current.value = [e.key];
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: row;
  white-space: space-between;

}
.menu {
  height: 100%;
  width: 100%;
}
</style>