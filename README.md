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