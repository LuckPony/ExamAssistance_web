<template>
    <div class="login">
        <h2>备考辅助系统在线登录 </h2>
        <a-form
            :model="formData"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item lable = "用户名" name="username" :rules="[{required: true, message: '请输入用户名'}]"> 
                <a-input placeholder="请输入用户名" v-model:value="formData.username" />
            </a-form-item>
            <a-form-item lable = "密码" name="password" :rules="[{required: true, message: '请输入密码'}]"> 
                <a-input placeholder="请输入密码" v-model:value="formData.password" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" html-type="submit">登录</a-button>
            </a-form-item>
        </a-form>

    </div>
</template>

<script setup lang = "ts">

import { reactive } from 'vue';

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

</style>