# 简介

- 简易云音乐播放器，它是一个模仿网易云音乐PC端简约版的音乐播放器。

## 介绍

- 这个项目是我在国庆节期间编写的一个模仿网易云音乐PC端的简易版音乐播放器，从一号到六号，整整花了差不多一周时间，十月一号吃了十根力诚麻辣肠+一个梨子导致头疼了两天。
- 项目采用 jQuery + 原生DOM操作 编写，我正在学习面向对象编程思想，每个功能都有一个类，可能封装不是友好，毕竟现在还在努力学习中。
- 项目构建采用前端工程化工具 webpack 打包，利用了 babel postcss 让项目在低版本浏览器中拥有良好的兼容性。
- 项目后端采用 Node 和 Express Web 框架编写的数据转发到网易云官方的接口，这个后端项目是我正在运营的一个小软件的项目，目前使用人数日活跃大概在一千左右。（**统计查看密码123456**）[查看项目](http://tools.wgudu.com/)
- 如需要修改播放列表歌曲，可以在 `index.js` 下 `getPlaylist` 传入歌单ID 或者修改 `utlis.js` 下的 `getPlaylist` 方法默认歌单ID

## 接口地址

- 请把 `http://127.0.0.1:3000` 替换成 `http://tools.wgudu.com:3000 `即可，所有接口必须带上 `version` 参数，值大于 `2.0` 即可 [查看接口](https://docs.apipost.cn/preview/1d639e41528dc6c3/34ca9e82bc17bd23)

## 启动项目

- 下载依赖包 `npm install`
- 进入开发模式 `npm run dev`
- 构建项目 `npm run build`

## 在线演示

- [查看演示](http://tools.wgudu.com:3000/)