# ExamAssistance_web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
更新日志：
2025.07.21
1. 改善登录用户名不区分大小写问题;
2. 解决当日规划待完成数没考虑手动完成的情况；
3. 解决计划筛选的默认值问题；
4. 增加退出登录的确认框提示;
5. 新增计划时添加了持续时间，可以通过开始时间和持续时间计算结束时间，也可以正常输入截止日期，会自动计算继续时间
6. 修复不能连续点击退出登录的问题

