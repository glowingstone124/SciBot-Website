# 前言

> SciBot并非是一个独立实现的项目，它需要基于Onebot协议的前端项目来进行通信。

## 什么是SciBot? 

SciBot是一个基于Kotlin语言的OneBot SDK，旨在创建高效简单的OneBot开发逻辑。

## 对于一般用户

您可以在我们的插件市场(待启用)找到可能需要的插件。

## 对于开发者

SciBot提供了一系列API来协助您开发自己的插件并且部署到SciBot。请参阅[开发者文档](/dev)。

# 开始配置SciBot

在启动SciBot之后，它的目录结构看起来是这样：
```
-plugins
|
-config.yml
|
-logs
```
在这其中，`config.yml`控制了SciBot的行为，包括是否打开debug以及onebot实例的http地址。

目前版本的config.yml:
```yml
configuration_version: 0.1,
server_port: 25565, 
upload_url: 'http://example.com', 
log-dir: ./logs,
debug: true, 
auth: 123456abc
```
`upload_url`是onebot实例的上报地址

`server_port`是SciBot的http端口。Onebot需要使用这个端口的`/upload`来上报事件。

`debug`控制了debug模式的开启和关闭。

`auth`是onebot的authkey。

插件应当放置于`plugins`目录中。
