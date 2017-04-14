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

rename
```javaScript
c.rename(tableName, NewTableName);
```
修改数据库中表的名字,tableName:表名；NewTableName:新的表名，两个名字都不能为空

Example:
```javaScript
c.rename("dc_universe","dc_name");
```

tableDrop
```javaScript
c.drop(tableName);
```
从数据库删除一个表。表和它的所有数据将被删除

Example：
```javaScript
c.drop("dc_universe");
```

### 数据操作

insert
```javaScript
c.table(tableName).insert(raw).submit();
```
向数据库中插入数据。raw类型必须是例子中的json格式的数据类型

Example:
```javaScript
c.table("posts").insert({name: 'peera',age: 22},{name: 'peerb',age: 21}).submit();
```

update
```javaScript
c.table(tableName).get(raw).update(raw).submit();
```
更新表中数据。如果get添加为空，则更新表中所有记录；其中raw为json格式字符串

Example：
```javaScript
c.table("posts").get({id: 1}).update({age:'52',name:'lisi'}).submit();
```

delete
```javaScript
c.table(tableName).get(raw).delete().submit();
```
从表中删除对应条件的数据，如果get条件为空，则删除所有数据

Example:  
删除id=1的记录
```javaScript
c.table("comments").get({id: 1}).delete().submit();
c.table("comments").delete({id: 1}).submit();
c.table("comments").delete().submit();
```

### 数据查询

get
```javaScript
c.table(tableName).get(raw).submit();
```
从数据库查询数据,后面可以进行其他操作，例如update、delete等

Example:  
查询 name = 'aa' 的记录
```javaScript
c.table("posts").get({name: 'aa'}).submit()
```

select
```javaScript
c.table(tableName).select(raw).submit()
```
从数据库查询数据.返回对应条件的数据;

Example:  
查询 name = 'aa' 的记录
```javaScript
c.table("posts").select({name: 'aa'}).submit();
```

limit
```javaScript
c.table(tableName).get(raw).limit({index:0,total:10}).withFields([*]).submit();
```
对数据库进行分页查询.返回对应条件的数据

Example:  
查询name='aa'的前10条记录
```javaScript
c.table("posts").get({name: 'aa'}).limit({index:0,total:10}).withFields([*]).submit();
```

order
```javaScript
c.table(tableName).get(raw).order([{id:1},{name:-1}]).withFields([*]).submit()
```
对查询的数据按指定字段进行排序

Example:  
id 升序，name 的降序排序
```javaScript
c.table("posts").get({name: 'aa'}).order({id:1},{name:-1}).withFields([*]).submit();
```

withFields
```javaScript
c.table(tableName).withFields([field1,dield2,...]).submit();
```
从数据库查询数据,并返回指定字段,必须个get配合使用

Example:  
查询name='aa'的记录.
```javaScript
c.table("posts").get({name: 'aa'}).withFields(['name','age']).submit();
```

### 权限管理

assign
```javaScript
c.assign(tableName, user,flags);
```
向用户授予数据表操作权限;  
user:所要授权的账户地址;flags(array):所要授权的权限;  
用户权限有以下几种：Select、Insert、Update、Delete;

Example:  
向用户授予 Insert、Delete操作权限.
```javaScript
c.assign("Table", "rEtepyQeAEgBLqXCaFRwZPK1LHArQfdKYr",[c.perm.insert,c.perm.delete]);
```

assignCancle
```javaScript
c.assignCancle(tableName, user,flags);
```
取消用户操作数据表的权限  
user:所要授权的账户地址;flags(array):所要授权的权限  
用户权限有以下几种：Select、Insert、Update、Delete  
Example:  
取消用户 Insert、Delete 的操作权限.
```javaScript
c.assignCancle("Table", "rEtepyQeAEgBLqXCaFRwZPK1LHArQfdKYr",[c.perm.insert,c.perm.delete]);
```

### 事务相关

beginTran
```javaScript
c.beginTran();
```
事务开始; 
在事务开始和结束之间的insert，update，delete，assert语句会包装在一个原子执行 
在事务上下文中，不在支持单个语句的submit

assert
```javaScript
c.table(tableName).get(jsonObj1).assert(jsonObj2);
```
事务中的断言操作，assert为true则继续，false则回滚事务;  
jsonObj1:查询条件;  
jsonObj2:断言表达;  
Example:  
判断id等于1的记录age是否等于52并且name等于lisi，如果是则继续，如果有一个条件不满足或记录不存在，则回滚事务
```javaScript
c.table("posts").get({id: 1}).assert({age:'52',name:'lisi'});
```

Example:  
判断id等于1的记录集的行数是否等于1，如果是则继续，如果不是或表不存在，则回滚事务
```javaScript
c.table("posts").get({id: 1}).assert({$rowcount:'1'});
```
Example:  
判断表posts是否存在，如果有则继续，如果不存在，则回滚事务
```javaScript
c.table("posts").assert({$IsExisted:'1'});
```

rollback
```javaScript
c.rollback();
```
回滚、撤销事务;  
用户明确指示撤销事务，回滚之前的所有本地操作，本次事务不会打包提交到区块链网络

commit
```javaScript
c.commit();
```
提交事务;  
本次事务期间的所有操作都会打包提交到区块链网络

Example:
```javaScript 
c.beginTran();
c.table("posts").insert({name: 'peera',age: 22},{name: 'peerb',age: 21});
c.table("posts").get({id: 1}).assert({age:22,name:'peera'});                      
c.table("posts").get({id: 1}).update({age:'52',name:'lisi'});
c.table("comments").delete({id: 1});
c.commit();
```

### 运算符

#### 比较运算符  
| 运算符 | 说明 | 语法 |
|--------|------|------|
| $eq | 字段值等于 | {"field":{"$eq":"value">} or {"field":"value"} |
| $ne | 字段值不等于 | {"field":{"$ne":"value"}} |
| $lt | 字段值小于 | {"field":{"$lt":"value"}} |
| $le | 字段值小于等于 | {"field":{"$le":"value"}} |
| $gt | 字段值大于 | {"field":{"$gt":"value"}} |
| $ge | 字段值大于等于 | {"field":{"$ge":"value"}} |
| $in | 字段值在指定的数组中 | {"field":{"$in":["value1","value2",...,"valueN"]}} |
| $nin | 字段值不在指定的数组中 | {"field":{"$nin":["value1","value2",...,"valueN"]}} |

#### 逻辑符  
| 运算符 | 说明 | 语法 |
|--------|------|------|
| $and | 逻辑与 | {$and:[{express1},{express2},...,{expressN}]} |
| $or | 逻辑或 | {$or:[{express1},{express2},...,{expressN}]} |

#### 模糊匹配  
| 语法 | 说明 |
|------|------|
|{"field":{"$regex":"/value/"}} | like "%value%" |
|{"field":{"$regex":"/^value/"}} | like "%value" |

### Examples:  
```sql
where id > 10 and id < 100
{$and:[{id:{$gt:10}},{id:{$lt:100}}]}

where name = 'peersafe' or name = 'zongxiang'
{$or:[{name:{$eq:'peersafe'}},{name:{$eq:zongxiang}}]}

where (id > 10 and name = 'peersafe') or name = 'zongxiang'
{$or:[{$and:[{id:{$gt:10}},{name:'peersafe'}]},{name:'zongxiang'}]}

where name like '%peersafe%'
{name:{$regex:'/peersafe/'}}

where name like '%peersafe'
{name:{$regex:'/^peersafe/'}}
```