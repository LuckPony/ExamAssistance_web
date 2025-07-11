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
                <a-button type="primary" html-type="submit">登录</a-button>
                或者
                <router-link to="/register">注册</router-link>
            </a-form-item>
        </a-form>

    </div>
</template>

<script setup lang = "ts">

import { reactive } from 'vue';
import {LockOutlined,UserOutlined} from '@ant-design/icons-vue';

    interface formParams{
        username: string
        password: string
    }
    const formData = reactive<formParams>({
        username: '',
        password: ''
    })
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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