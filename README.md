# 介绍
    
 学习nodejs入门项目。
 使用nodejs 开发定位于企业网站的简易CMS，目标为容易拓展、部署，前端开发者容易使用的CMS系统。

# 特性

* 使用nodejs 开发，为前端开发者准备的，前后端都使用JS，做个企业网站就很容易了
* 简单（其实是懒），主要是首页、根据数据模型的列表页、详情页，单页，满足一般企业站点需要
* 容易拓展，功能不满足可以容易拓展
* 多模板
* 支持不同模型列表、详情指定模板，更加灵活嵌入单页

# 安装

* check 到本地
* 安装nodejs 模块
        npm install # 根目录下执行
* 导入nodecms.sql 到你的数据库
* 修改config/connections.js 文件
        // 修改数据库连接地址
        someMysqlServer: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'nodecms'
        },
* 启动 
    
        node app.js

# 预览 

demo 地址 http://nodecms.duapp.com/

后台地址 /admin/user/login  <br>
默认用户 admin  admin


# 贡献代码

 120377843@qq.com
 



