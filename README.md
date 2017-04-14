# chainsql-driver

### 基本操作

C
```javaScript
c -> c
```
ChainSQL的操作对象

Example:
```javaScript
const ChainsqlAPI = require('chainsql').ChainsqlAPI;
const c = new ChainsqlAPI();
```

connect
```javaScript
c.connect(url)
```
创建一个新的连接到ChainSQL节点;如果无法建立连接,就会抛出ReqlDriverError

Example:
```javaScript
c.connect("ws://127.0.0.1:6006");
```

as
```javaScript
c.as({"secret":"xxx","address": "xxx"});
```
提供操作者的身份

Example:
```javaScript
c.as({"secret":"ssFw56mwiuVD43CJ81p4dsUXMAnJF","address": "r3p9EUN8hxnbNvCaqrrXY3QnN7ji8bPf5Y"});
```

use
```javaScript
c.use(address);
```
切换表的所有者（即后续操作的上下文），默认表的所有者为操作者

Example:
```javaScript
c.use("r3p9EUN8hxnbNvCaqrrXY3QnN7ji8bsdf");
```

setRestrict
```javaScript
c.setRestrict(bool);
```
设置是否使用限制模式，默认为非限制模式；在限制模式下，语句共识通过的条件是期望的快照HASH与预期一致

Example:
```javaScript
c.setRestrict(true);
```

submit
```javaScript
c.submit();
```
提交操作，执行查询操作时，返回json类型

Example:
```javaScript
c.table("marvel").submit();
```

### 表操作

tableCreate
```javaScript
c.createTable(tableName, raw[, options])
```
创建一个表，ChainSql表是一个JSON文档的集合  
tableName:所创建表名  
options:为表指定其它的参数，目前支持如下参数  
confidential:true/false, 如果为true，表示该表是机密的，所有对该表的操作都是加密的，只有授权的用户才能解密查看
raw:创建表的字段名称必须为Json格式数据，例如
```json
"{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1}",
"{'field':'name','type':'varchar','length':50,'default':null}",
"{'field':'age','type':'int'}"
```
Example
```javaScript
c.createTable("dc_universe",[
{'field':'id','type':'int','length':11,'PK':1,'NN':1,'UQ':1,'AI':1},
{'field':'name','type':'varchar','length':50,'default':null},
{'field':'age','type':'int'}]);
```