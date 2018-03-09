# 基于 react + react-router + mobx 的 cnode 社区

## Web app 架构

### 工程架构

- 解放生产力

  去除重复性操作——文件复制、浏览器刷新

  ---

  源代码预处理（babel，preprocessor loader）
  自动打包，自动更新页面显示
  自动处理图片依赖，保证开发和正式环境的统一

- 围绕解决方案搭建环境

  React 是用 jsx 语法来编写模板

  Vue 是用 .vue 文件来写 vue 组件

  Angular 使用 typescript 来编写组件

  所以我们要针对不同的解决方案，搭建对应的开发环境

  ---

  不同的前端框架需要不同的运行架构
  预期可能出线的问题并规避：（css-modules css preprocessor[sass less stylus]）

- 保证项目质量

  代码规范

  ---

  code lint
  不同环境排除差异：.editorconfig、NODE_ENV 环境变量设置
  git commit 预处理

### 项目架构

- 技术选型

  react + react-router + mobx/redux

  vue + vue-router + vuex

- 数据解决方案

  mobx/redux

  XMLHttpRequest/axios/fetch

- 整体代码风格

## Web 开发常用网络优化

优化方法

- 合并资源文件，减少HTTP请求
- 压缩资源文件减小请求大小
- 利用缓存机制，尽可能使用缓存减少请求

## eslint 和 editorconfig

- 规范代码有利于团队协作

- 纯手工规范费时费力而且不能保证准确性

- 配合编辑器自动提醒错误，提高开发效率

### eslint

随着 ECMAScript 版本一直更新的 Js lint 工具，插件丰富，并且能够套用规范，规则非常丰富，能够满足大部分团队的需求。

### editorconfig

不同编辑器对文本格式会有一定的区别，如果不统一一些规范，可能你跟别人合作的时候每次更新下来别人的代码就会一大堆报错。
