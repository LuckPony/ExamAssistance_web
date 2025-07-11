import router from "@/router"
import { defineStore } from "pinia"
import { ref } from "vue"


export interface UserInfo{
    id?:string | number
    username?:string
    email?:string
    phone?:string
    token?:string
    [key:string]:any
}

export const useUserStore = defineStore('user', () => {  //defineStore 定义一个pinia状态管理
    const userInfo = ref<UserInfo>({}) //定义一个userInfo状态，初始值为空对象
    const isLogin = ref<boolean>(false) //定义一个isLogin状态，初始值为false

    //初始化用户信息，从localStorage中获取
    function initUserInfo() {
        const storedUserInfo = localStorage.getItem('user')
        if (storedUserInfo) {
            userInfo.value = JSON.parse(storedUserInfo)
            isLogin.value = true
        }else{
            router.push('/')
        }
    }
    //获取用户信息
    function getUserInfo() {
        if (!isLogin.value) {
            initUserInfo()
        }
        return userInfo.value
    }

    //设置用户信息
    function setUserInfo(info: UserInfo) {
        userInfo.value = info
        localStorage.setItem('user', JSON.stringify(info))
    }
    
    //更新用户信息
    function updateUserInfo(info: UserInfo) {
        userInfo.value = { ...userInfo.value, ...info }
        localStorage.setItem('user', JSON.stringify(userInfo.value))
    }

    //清楚用户信息
    function clearUserInfo() {
        userInfo.value = {}
        localStorage.removeItem('user')
        isLogin.value = false
    }
    return {
        userInfo,
        isLogin,
        initUserInfo,
        getUserInfo,
        setUserInfo,
        updateUserInfo,
        clearUserInfo
    }



})