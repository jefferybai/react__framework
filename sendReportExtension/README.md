#说明
这是一个chrome扩展程序。能辅助运维人员给客户发送报告邮件（以截屏为内容）的，目前用于portal自动化报告中。

## 环境安装
首先需要安装nodejs, v5.x
官网： https://nodejs.org/

ps：之后如果编译有报node-gyp相关的错误，请看这里

https://github.com/nodejs/node-gyp

需要安装python2.7, windows系统还需要VS2013或者VS2015.

## 代码编辑工具
强烈推荐VSCODE，微软出的一个很小的IDE，更像编辑器。

因为它集成了我们需要的几个重要东西，git， 配置式的任务，node调试。让我们可以不用切换到命令行，一切都在这个IDE里可以搞定。

另外，我们框架中也包含了VSCODE的一些配置。

VSCODE下载地址： https://code.visualstudio.com/

其他的话，就推荐sublime Text，再其他，看个人喜好吧，都可以。

## 工程初始化
`git clone git@git.paratera.net:wuhan/web_component.git`

`cd web_component/sendReportExtension`

`npm install`

`npm run devbuild-chrome`

使用chrom浏览器，访问`chrome://extensions/`。在开发者模式下，点击`加载已解压的的扩展程序`，选择dist/chrome。
访问任意paratera.com的网站，看到地址栏后有一个公司24小时运维的小图标，鼠标移上去，显示`paraSendMail插件可用`，则表示插件安装成功。

## 产品发布
开发完毕后，使用以下命令打包脚本文件

`npm run build-chrome`

然后再`chrome://extensions/`中，使用`打包扩展程序`功能，选择打包目录`dist/chrome`来打包成chrome的扩展程序。
`dist/chrome.crx` 目录下就是打包好后的扩展程序安装文件。