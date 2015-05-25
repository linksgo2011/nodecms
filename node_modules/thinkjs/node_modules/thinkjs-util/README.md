thinkjs-util
============

```
var util = require('thinkjs-util');
```

下面所有方法都是在util下的。

### Promise

thinkjs中的Promise使用了[es6-promise](http://www.html5rocks.com/en/tutorials/es6/promises/) 库，是个全局对象， 含有如下的方法：

* `all(array)` 
* `resolve(promise | thenable | obj)` 
* `reject(obj)`
* `race(array)`

### Class(superCls, prop)

* superCls `function` 父类
* prop `function | object` 如果是function，则执行这个function，并获取结果
* return `function`

通过该函数动态创建一个类，可以实现类继承和自动调用init方法的功能，同时实例化类的时候可以省去`new`。如果只传了一个参数，则认为是prop。


```js
//A为通过Class动态创建的一个类
var A = Class(function(){
    return {
        init: function(name){
            this.name = name;
        },
        getName: function(){
            return "A " + this.name;
        }
    }
});
//实例化类A，可以不写new
var instance = A("welefen");
var name = instance.getName(); /*name is `A welefen`*/
```

通过Class函数创建的类支持继承，含有以下2个静态方法：

* `extend(obj)` 扩展方法到类的原型上
* `inherits(superCls)` 指定该类的父类

子类可以继承父类的方法，同时可以对方法进行重写。

```js
var B = Class(A, {}); //B类从A类继承而来
//B类的实例化
var instance = B("welefen");
var name = instance.getName(); /*name is `A welefen`*/
B.extend({ 
    getName: function(){ //B类对getName方法进行了重写
        return "B " + this.name;
    }
});
var name = instance.getName(); /*name is `B welefen`*/
```

也可以在重写的方法里调用父类的方法，如：

```js
var C = Class(A, {
    getName: function(){
        var name = this.super("getName");
        return "C " + name;
    }
}); //从A类继承
var instance = C("welefen");
var name = instance.getName(); /*name is `C A welefen`*/
```

如果有多级继承，想跨级调用父类的方法时，只能通过apply的方式调用原形链上的方法，如：

```js
var D = Class(C, {
    getName: function(){
        var name = A.prototype.getName.apply(this, arguments);
        return 'D' + name;
    }
}); //从C类继承
var instance = D('welefen');
var name = instnace.getName(); /*name is `D A welefen`*/;
```

`注意：` 不可用下面的方式来继承

```js
var A = Class();
var B = Class({getName: function(){}}).inherits(A); //此时B不含有getName方法
```


### extend(target, source1, source2, ...)

* target `object` 
* source1  `object`
* return  `object`

将source1, source2等对象上的属性或方法复制到target对象上，类似于jQuery里的$.extend方法。

默认为深度复制，可以将第一个参数传`false`进行浅度复制。  

`注意`： 赋值时，忽略值为undefined的属性。


### isBoolean(obj)

* `obj` 要检测的对象
* `return` true OR false

检测一个对象是否是布尔值。

```js
//判断是否是布尔值
isBoolean(true); //true
isBoolean(false); //true
```


### isNumber(obj)

检测一个对象是否是数字。

```js
isNumber(1); //true
isNumber(1.21); //true
```

### isObject(obj)

检测是否是对象

```js
isObject({}); //true
isObject({name: "welefen"}); //true
```

### isString(obj)

检测是否是字符串

```js
isString("xxx"); // true
isString(new String("xxx")); //true
```

### isFunction(obj)

检测是否是函数

```js
isFunction(function(){}); //true
isFunction(new Function("")); //true
```

### isDate(obj)

检测是否是日期对象

```js
isDate(new Date()); //true
```

### isRegexp(obj)

检测是否是正则

```js
isRegexp(/\w+/); //true
isRegexp(new RegExp("/\\w+/")); //true
```

### isError(obj)

检测是否是个错误

```js
isError(new Error("xxx")); //true
```

### isEmpty(obj)

检测是否为空

```js
//检测是否为空
isEmpty({}); //true
isEmpty([]); //true
isEmpty(""); //true
isEmpty(0); //true
isEmpty(null); //true
isEmpty(undefined); //true
isEmpty(false); //true
```

### isArray(obj)

检测是否是数组

```js
isArray([]); //true
isArray([1, 2]); //true
isArray(new Array(10)); //true
```

### isIP4(obj)

检测是否是IP4

```js
isIP4("10.0.0.1"); //true
isIP4("192.168.1.1"); //true
```

### isIP6(obj)

检测是否是IP6

```js
isIP6("2031:0000:130f:0000:0000:09c0:876a:130b"); //true
isIP6("2031:0000:130f::09c0:876a:130b"); //true
```

### isIP(obj)

检测是否是IP

```js
isIP("10.0.0.1"); //true
isIP("192.168.1.1"); //true
isIP("2031:0000:130f:0000:0000:09c0:876a:130b"); //true ip6
```

### isFile(file)

检测是否是文件，如果在不存在则返回false

```js
isFile("/home/welefen/a.txt"); //true
isFile("/home/welefen/dirname"); //false
```

### isDir(dir)

检测是否是目录，如果不存在则返回false

```js
isDir("/home/welefen/dirname"); //true
```

### isBuffer(buffer)

检测是否是Buffer

```js
isBuffer(new Buffer(20)); //true
```

### isNumberString(obj)

是否是字符串类型的数字

```js
isNumberString(1); //true
isNumberString("1"); //true
isNumberString("1.23"); //true
```

### isPromise(promise)

检测是否是个promise

```js
isPromise(new Promise(function(){})); //true
isPromise(getPromise()); //true
```

### isWritable(p)

判断文件或者目录是否可写，如果不存在则返回false

### mkdir(p, mode)

递归的创建目录

* `p` 要创建的目录
* `mode` 权限，默认为`0777`

```js
//假设/home/welefen/a/b/不存在
mkdir("/home/welefen/a/b");
mkdir("home/welefne/a/b/c/d/e"); //递归创建子目录
```

### chmod(p, mode)

修改目录权限，如果目录不存在则直接返回

```js
chmod("/home/welefen/a", 0777);
```

### ucfirst(name)

将首字符变成大写，其他变成小写

```js
ucfirst("welefen"); // Welefen
ucfirst("WELEFEN"); // Welefen
```

### md5(str)

获取字符串的md5值，如果传入的参数不是字符串，则自动转为字符串

```js
md5("welefen"); //59dff65d54a8fa28fe372b75d459e13b
```

### getPromise(obj, reject)

获取一个promise对象。默认为`resolve promise`，如果reject参数为true，那么返回`reject promise`。

如果obj是promise，那么直接返回。

```js
getPromise([]); //resolve promise
getPromise(new Error(""), true); //reject promise
var promise = getPromise("");
getPromise(promise); //
```

### getDefer()

获取一个`Deferred`对象，对象含有如下的属性或者方法：

* `resolve` 方法：将promise resolve
* `reject` 方法：将promise reject
* `promise` 属性：Deferred对应的Promise

```js
//把读取文件内容变成promise
var fs = require("fs");
function getFileContent(file){
    var deferred = getDefer();
    fs.readFile(file, "utf8", function(err, content){
        //如果有错误，那么reject
        if(err){
            deferred.reject(err);
        }else{
            //成功读取到内容
            deferred.resolve(content);
        }
    })
    return deferred.promise;
};

getFileContent("/home/welefen/a.txt").then(function(content){
    //
}).catch(function(err){
    console.log(err.stack);
})
```

`deferred.promise`默认为`pedding`状态，`pedding`状态的promise不会执行后续的then，也不会执行catch。如果想阻止后面的代码继续执行，那么可以返回一个`pedding promise`。

```js
//返回一个pedding promise
var getPeddingPromise = function(){
    var deferred = getDefer();
    return deferred.promise;
}
getPeddingPromise().then(function(){
    //这里的代码不会执行
}).catch(function(){
    //这里的代码也不会执行
})
```

### getObject(name, value)

在项目中，经常会遇到要动态创建一个对象。如：

```js
var data = {};
//name和value从其他地方动态读取出来的
data[name] = value;
//有时候还要设置多个
data[name1] = value1;
```

为了方便创建对象，可以通过`getObject`来完成。

```js
//单个属性
var data = getObject(name, value);
//多个属性
var data = getObject([name, name1], [value, valu1]);
//更多的属性
var data = getObject([name, name1, name2, name3], [value, value1, value2, value3]);
```

### arrToObj(arr, key, valueKey)

在项目中，经常会从数据库中查询多条数据，然后对数据进行一些操作。如：根据特定的key进行去除等。我们一般借助对象来完成此类操作，这时候需要把数组转化为对象。

可以借助arrToObj来完成。

```js

//从数据库中查询出来的数据对象
var arr = [{id: 10, name: "name1", value: "value1"}, {id: 11, name: "name2", value: "value2"}];
//把id值作为key生成一个对象
/* data = {10: {id: 10, name: "name1", value: "value1"}, 11: {id: 11, name: "name2", value: "value2"}} */
var data = arrToObj(arr, "id");
//把id值作为key，只需要name的值
//data = {10: "name1", 11: "name2"}
var data = arrToObj(arr, "id", "name");
//只获取id的值
// ids = [10, 11];
var ids = arrToObj(arr, "id", null);
```
