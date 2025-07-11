<template>
    <div class="login">
        <h2>备考辅助系统在线登录 </h2>
        <a-form
            :model="formData"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item label = "用户名" name="username" :rules="[{required: true, message: '请输入用户名'}]"> 
                <a-input placeholder="请输入用户名" v-model:value="formData.username" >
                    <template #prefix>
                        <user-outlined> </user-outlined>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label = "密码" name="password" :rules="[{required: true, message: '请输入密码'}]"> 
                <a-input-password placeholder="请输入密码" v-model:value="formData.password" >
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item class="login-form-button">
                <a-button :disabled="disabled"  type="primary" html-type="submit">登录</a-button>
                或者
                <router-link to="/register">注册</router-link>
            </a-form-item>
        </a-form>

    </div>
</template>

<script setup lang = "ts">

import { computed, reactive } from 'vue';
import {LockOutlined,UserOutlined} from '@ant-design/icons-vue';
import { postUserLogin } from '@/servers/api/user';
import { useUserStore } from '@/stores/user';
import router from '@/router';
import { message } from 'ant-design-vue';

    const disabled = computed(() => {
        return !(formData.username && formData.password);
    })
    interface formParams{
        username: string
        password: string
    }
    const formData = reactive<formParams>({
        username: '',
        password: ''
    })
    const messageApi = message.useMessage();//获取message实例,进行全局提示
    const useStore = useUserStore();
    const onFinish = (values: any) => {
        postUserLogin(values).then((res)=>{
            console.log(res)
            localStorage.setItem('user',JSON.stringify(res.data)) // 存储用户信息到浏览器全局缓存
            //使用pinia存储用户信息
            useStore.setUserInfo({
                ...res.data
            })
            if(res.code === 200){ 
                message.success('登陆成功！');
                setTimeout(() => {
                    router.push('/plan');
                }, 1000); // 1秒后刷新，给用户时间看到提示 
            }else{
                message.error('账号密码错误，登陆失败！');
                useStore.clearUserInfo() // 清除用户信息
                localStorage.removeItem('user') // 清除浏览器全局缓存
                setTimeout(() => {
                    window.location.reload();
                }, 1000); // 1秒后刷新，给用户时间看到提示 
            }
            

        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        message.error('登陆失败！');
        
    };

    
</script>

<style scoped>
    .login{
        width:400px;
        height: 200px;
    }
    h2{
        text-align: center;
    }
    .login-form-button{
        text-align: center;
    }

</style>