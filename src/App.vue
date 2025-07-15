<template>
  <div class="index">
    <!-- NavBar 固定在顶部 -->
    <NavBar v-if="!['/', '/register'].includes($route.path)" class="index-nav-bar" />
    <!-- RouterView 填充除 NavBar 外的区域 -->
    <div class="index-RouterView">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import NavBar from './layout/NavBar.vue';
import { useUserStore } from './stores/user';
const userStore = useUserStore();
userStore.initUserInfo();
</script>

<style>
/* 全局样式修正 */
html, body,#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* 防止水平滚动条 */
}

/* 父容器 index */
.index {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh; /* 填满整个屏幕 */
  
  
}

/* NavBar 固定 */
.index-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px; /* NavBar 高度 */
  background: #fff;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* RouterView 填充剩余空间 */
.index-RouterView {
  margin-top: 60px; /* 留出 NavBar 高度 */
  flex: 1;          /* 自动填充剩余空间 */
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto; /* 内容超出可滚动 */
}
</style>
