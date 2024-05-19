# 开发者文档

> 开始编写SciBot插件

## 第一个插件

编写SciBot的插件其实并不难，让我们从简单的init和注册监听器开始。

在开始之前，请先引入本地依赖：[GitHub仓库](https://github.com/QuantumOriginal/Scibot-Dependencies)

```kotlin
class PluginMain : Plugin {
    var sender: SimpleSender? = null
    var logger: SimpleLogger? = null
    /*
    This is the sample plugin of SciBot.
    Define Main class and Plugin Name in resources/plugin.yml
    use @GroupHandler to create an event handler.
    implements Plugin interface to create a main class.
     */
    override suspend fun start() {
        logger?.log("hello,World", Level.INFO)
        this.sender = sender
        this.logger = logger
        sender?.plainSend("hello,world", Sender.Type.GROUP,946085440)
    }
    @Annonations.GroupHandler(MessageConstructor.Types.PLAIN)
    fun doSomething(event: Events.MajorEvent) {
        println("MyPlugin called")
        event.msgArr.forEach { any ->
            if (any is Events.PlainMessage) {
                logger?.log("Received message: ${any.message} from ${event.sender.uid}")
            }
        }
    }
    fun getLogger(logger: SimpleLogger ){
        this.logger = logger
    }
    fun getSender(sender: SimpleSender ){
        this.sender = sender
    }
}
```
让我们来看看这段代码做了什么。

在开头，它定义了PluginMain类来继承Plugin，并且重写了自己的start()方法。这定义了插件的主入口，SciBot会自动调用它。

但是，你还需要在插件的resource目录中定义plugin的一些信息来让SciBot的插件管理器认识你的插件。
```yml
main-class: PluginMain
plugin-name: SamplePlugin
```
其中，main-class是你的插件主类，plugin-name是你自定义的插件名称。它会显示在插件列表中，分配给你的Logger也会使用此前缀。

你会发现，我们在插件开头定义了`sender`和`logger`，它们是可以在插件启动时调用`getSender()`和`getLogger()`来获取instance的实例。

其中，`sender`类型是`SimpleSender`,`logger`类型是`SimpleLogger`.

以下是它们提供的方法

```kotlin
interface SimpleSender{
    suspend fun plainSend(content: String, operation: Sender.Type, id: Long)
    suspend fun send(msgArrs: MutableList<Any>, operation: Sender.Type, id: Long)
}
interface SimpleLogger{
    fun log(msg: String, level: Level? = Level.INFO)
    fun debug(msg: String)
}
```
没错，sender是异步的，它不会阻塞主线程。
### Logger

在logger中，有两个函数实现，其中log可以传入两个参数:`msg`和`level`，msg是一个标准String类型，用于定义日志信息，level是简单的enum：`java.util.logging.Level`，用于定义插件消息等级。

SciBot的消息等级只接受三个：
- SEVERE    表示出现错误
- WARNING   表示警告
- INFO      正常的日志记录

同时，debug方法只有在SciBot配置中开启`debug`才会在CLI中显示。它包含了一些可能需要的debug信息，您可以在插件的任意位置使用这些方法。

### Sender

Sender同样有两个方法。

`plainsend`: 接受一个String字符串，一个`operation`枚举，一个`id`对象。

`send`: 接受一个`MutableList<Any>`，一个`operation`枚举，一个`id`对象。

`operation`枚举代表消息类型，`PRIVATE`和`GROUP`分别代表私聊和群聊，`id`是一个Long格式的数字，用于定义群聊号/QQ号。

如果您需要发送简单的字符串消息，使用plainsend即可。send接受的MutableList是一个Events的集合，包括了多个消息类型。例如一个简单的多个消息List:

```kotlin
    val msgArr : MutableList<Any> = mutableListOf(
        Events.PlainMessage("这是文字"),
        Events.PicMessage("https://example.com/1.png", false),
        Events.AtMessage(123456)
    )
```
关于具体消息类型的定义，请参考具体的消息段解释，您只需要知道它可以同时组合多个消息类型。

### 消息监听器

在SciBot插件中，您只需要为一个函数加上`@GorupHandler`或者`@PrivateHandler`即可将它们注册为监听器。

```kotlin
    @Retention(AnnotationRetention.RUNTIME)
    @Target(AnnotationTarget.FUNCTION, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.PROPERTY_SETTER)
    annotation class GroupHandler(val type:Types = Types.PLAIN)

    @Retention(AnnotationRetention.RUNTIME)
    @Target(AnnotationTarget.FUNCTION, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.PROPERTY_SETTER)
    annotation class PrivateHandler(val type: Types = Types.PLAIN)
```
它们都可以传入一个附带的enum来指定自己要接收到的消息类型。

作为一个监听器，你只需要设置一个传参。

```kotlin
@Annonations.GroupHandler(MessageConstructor.Types.PLAIN)
fun doSomething(event: Events.MajorEvent) {
    println("MyPlugin called")
    for (any in event.msgArr) {
        if(any is Events.PlainMessage) {
            println("recived message: ${any.message} from ${event.sender.uid}")
        }
    }
}
```
MajorEvent包含了一个Sender对象和一个msgArr字符串，格式和Sender中的那个MutableList一样。
对于Sender，有以下属性：
```kotlin
data class Sender(val uid:Long , val nickname:String, val role:String? = "private")
```
其中，`uid`是QQ号,`nickname`是昵称，如果是群聊消息，`role`代表这个用户在群聊中的角色。可选值有 `owner` 或 `admin` 或 `member`。

当然，`@PrivateHandler`仅用于接受私聊消息，所以可以无视role字段。

目前为止，您已经简单实现了一个在启动时发送HelloWorld并且Log的插件。