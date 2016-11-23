Eemu-blog说明
===========

1.先确保本地安装了`node`和`Mongodb`<br>
2.将项目clone(或者download ZIP)下来之后，使用`cmd`命令，CD到项目根目录，npm install安装依赖的模块,此过程比较久<br>
``` cmd
    $ cd  F:\Ermu-blog
    $ npm install
```
3.新建一个blog文件夹，用来当作存放数据的文档(mongodb的做法，建议建在Mongodb的根目录下)，然后开启数据库服务<br>
``` cmd
    $ mongod --dbpath C:\mongodb\blog   
```
4.cd到Ermu-blog项目根目录，执行npm start<br>
```cmd
    $ cd  F:\Ermu-blog
    $ npm start  
```
5.在浏览器输入`localhost:3000`，完美运行<br>


待开发
===========

1. 根据标签查询文章

2. 添加个人信息userModel需要补充，提供修改用户信息的接口

3. 上传个人头像的接口

4. 其他三个模块需要开发

5. 增加一个吉他谱显示的页面，可以自动滚动那种


待修正
============

1. 用户信息存在服务端的session中，cookie由服务端生成

2. 上传图片支持多文件上传，现在同时上传两种会有bug

3. 上传图片需要进度条显示，需要写一个上传图片的插件。

4. 上传图片的压缩可以在服务器端实现，压缩之后在回调出来，显示。并不一定要使用canvas

5. routes/index.js需要重构一下，现在的写法不合适，回调太多了

6. 和数据库的connection有点不对劲，研究下

7. 把代码托管带github上面



