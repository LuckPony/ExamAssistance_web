<template>
  <div class="login-container">
    <div class="login">
      <h2>备考辅助系统在线登录</h2>
      <!-- ✅ 用原生 form 替代 a-form -->
      <form method="POST" action="/api/login" @submit.prevent="onSubmit">
        <!-- 用户名 -->
        <div class="form-item">
          <label for="username">用户名</label>
          <div class="input-wrapper">
            <user-outlined class="icon" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="请输入用户名"
              v-model="formData.username"
              autocomplete="username"
              required
            />
          </div>
        </div>
        <!-- 密码 -->
        <div class="form-item">
          <label for="password">密码</label>
          <div class="input-wrapper">
            <lock-outlined class="icon" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="请输入密码"
              v-model="formData.password"
              autocomplete="current-password"
              required
            />
          </div>
        </div>
        <!-- 登录按钮 -->
        <div class="login-form-button">
          <button type="submit" :disabled="disabled" class="btn">登录</button>
          <span>或者</span>
          <router-link to="/register">注册</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { postUserLogin } from '@/servers/api/user';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import { message } from 'ant-design-vue';

interface formParams {
  username: string;
  password: string;
}
const formData = reactive<formParams>({
  username: '',
  password: ''
});

const disabled = computed(() => {
  return !(formData.username && formData.password);
});

const useStore = useUserStore();

const onSubmit = async () => {
  try {
    const res = await postUserLogin({
      username: formData.username,
      password: formData.password
    });

    if (res.code === 200) {
      // 保存用户信息
      localStorage.setItem('user', JSON.stringify(res.data[0]));
      useStore.setUserInfo({ ...res.data[0] });
        console.log(res);
      message.success('登录成功！');
      setTimeout(() => {
        router.push('/plan');
      }, 500);
    } else {
      message.error('账号密码错误，登录失败！');
      useStore.clearUserInfo();
      localStorage.removeItem('user');
    }
  } catch (err) {
    console.error(err);
    message.error('登录异常，请稍后再试！');
  }
};
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login {
  width: 400px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 4px;
  font-weight: bold;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 8px;
}

.input-wrapper .icon {
  margin-right: 8px;
  color: #1890ff;
}

.input-wrapper input {
  border: none;
  outline: none;
  flex: 1;
}

.btn {
  width: 100%;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  height: 40px;
  font-size: 16px;
  cursor: pointer;
}

.btn:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.login-form-button {
  text-align: center;
  margin-top: 16px;
}
</style>
