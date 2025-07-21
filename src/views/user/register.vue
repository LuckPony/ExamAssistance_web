<template>
  <div class="register-container">
    <div class="register">
      <h2>备考辅助系统用户注册</h2>
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
        <!-- 密码 -->
        <div class="form-item">
          <label for="password">邮箱</label>
          <div class="input-wrapper">
            <mail-filled class="icon" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="请输入邮箱"
              v-model="formData.email"
              autocomplete="email"
              required
            />
          </div>
        </div>
        <!-- 登录按钮 -->
        <div class="register-form-button">
          <button type="submit" :disabled="disabled" class="btn">注册</button>
          <span>或者</span>
          <router-link to="/">登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { postUserRegister } from '@/servers/api/user'
import { message } from 'ant-design-vue'
import { ref, computed } from 'vue'
    const router = useRouter()
    const formData = ref({
        username: '',
        password: '',
        email: ''
    })
    const disabled = computed(() => {
        return !formData.value.username || !formData.value.password || !formData.value.email
    })
    const onSubmit = () => {
        postUserRegister(formData.value).then(res => {
            console.log(res)
            if (res.code === 200) {
                message.success('注册成功,即将返回登录')
                setTimeout(() => {
                router.push('/') 
                }, 1500)
                
            }
            else if (res.code === 500) {
                message.error("用户名已存在")
            } 
            else {
                message.error("注册信息有误，请重试")
            }
        })
    }
        
    
</script>

<style scoped>
.register-container {
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

.register {
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

.register-form-button {
  text-align: center;
  margin-top: 16px;
}
</style>