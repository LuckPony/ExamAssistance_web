import {generateService} from '@umijs/openapi'

generateService({ 
  schemaPath: 'http://127.0.0.1:5000/swagger.json',    // 可以是.json文件，也可以是远程json地址
  serversPath: './src/servers', // 生成api请求文件,填写本地路径
  requestLibPath: "import request from '@/utils/request'", //  指定request的导入路径
})