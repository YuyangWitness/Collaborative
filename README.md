# Collaborative Online Judge System

 这是一个代码协作网站，可以通过该网站多人在同一道题目中进行代码的编辑，并且可以进行代码运行和获取结果反馈。
 
## 所用技术
- AngularJS进行前端框架
- NodeJS作为服务端语言，采用express框架
- mongodb为数据库
- WebSocket实现代码协作和实时更新
- Redis作为缓存，保存代码
- Nginx实现负载均衡，在代码运行和反馈功能中分发到不同服务器
- Restful API design
- Python和Docker实现代码的运行和反馈信息

## 模块功能
- 代码题目新增
- 代码题目列表展示
- 代码协作
- 代码运行和反馈

## Install
- 请预先装载Redis、Nginx、Python、python-pip、Node、nodemon以及npm
- clone or download该项目到你的电脑里
- 运行 ./launcher.sh
- 打开网站 http://localhost:3000