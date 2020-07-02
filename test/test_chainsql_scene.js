const ChainsqlAPI = require('../src/index');
const api = new ChainsqlAPI();

const functionEntry = function(fun, arguments) {
    this.fun = fun;
    this.arguments = arguments;
}

const functionChain = function(callback) {
    this.callback = callback;
    this.functionlist = []; // list of functionEntry
    this.stack_head = -1;
    this.stack_tail = -1;
    this.default_callback = null;
}

functionChain.prototype.push = function(entry) {
    this.functionlist.push(entry);
    this.stack_tail++;
}

functionChain.prototype.pop = function() {
    if ((this.stack_head++) > this.stack_tail) {
        return null;
    }
    
    return this.functionlist[this.stack_head];
}

functionChain.prototype.setDefaultCallback = function(callback) {
    this.default_callback = callback;
}

functionChain.prototype.callDefaultCallback = function() {
    if (this.default_callback) {
        this.default_callback.fun(this.default_callback.arguments.tableName);
    }
}

funcChain = new functionChain();

var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "02F039E54B3A0D209D348F1B2C93BE3689F2A7595DDBFB1530499D03264B87A61F"
};

function setup_invoke(tableName) {       
      
    funcChain.push(new functionEntry(createTable,{tableName:tableName}));
    
	funcChain.push(new functionEntry(createAccountAndActive,{tableName:''}));
	
    funcChain.push(new functionEntry(assign,{tableName:tableName,user:user}));
    
    funcChain.push(new functionEntry(insertRecord,{tableName:tableName}));
    funcChain.push(new functionEntry(expectValue,
                    {tableName:tableName,
                    expect:[{id:1,age:3,name:'peersafe'},
                    {id:2,age:10,name:'guichuideng'}],
                    message:'insert'}));
                    
    funcChain.push(new functionEntry(updateRecord,{tableName:tableName}));
    funcChain.push(new functionEntry(expectValue,
                    {tableName:tableName,
                    expect:[{id:1,age:3,name:'zongxiang'},
                    {id:2,age:10,name:'guichuideng'}],
                    message:'update.'}));
    
    funcChain.push(new functionEntry(deleteRecord,{tableName:tableName}));
    funcChain.push(new functionEntry(expectValue,{tableName:tableName,expect:[{id:2,age:10,name:'guichuideng'}],message:'delete.'}));
    
    funcChain.push(new functionEntry(transaction,{tableName:tableName}));
    funcChain.push(new functionEntry(expectValue,
                    {tableName:tableName,
                    expect:[{id:2,age:10,name:'guichuideng'},
                    {id:4,age:33,name:'zhouxingchi'}],
                    message:'transaction.'}));
                  
    newTableName = 'new_' + tableName;
    funcChain.push(new functionEntry(renameTable,{tableName:tableName,newTableName:newTableName}));
    
    funcChain.push(new functionEntry(dropTable,{tableName:newTableName}));
	
	
}

Function.prototype.getName = function(){
    return this.name || this.toString().match(/function\s*([^(]*)\(/)[1]
}

function invoke() {
    var f = funcChain.pop();
    if(f != null) {
        if (f.fun.getName() === 'assign') {
            f.fun(f.arguments.tableName,f.arguments.user); 
        } else if (f.fun.getName() === 'renameTable') {
            f.fun(f.arguments.tableName,f.arguments.newTableName);
        } else {
            f.fun(f.arguments.tableName);   
        }
    }
}

function invoke_expect() {
    var f = funcChain.pop();
    if(f != null) {
        f.fun(f.arguments.tableName,f.arguments.expect, f.arguments.message);
    }
}

api.connect('ws://127.0.0.1:6006',function(error, data) {
    if (error) {
        console.log('Connect ChainSQL failure.' + error)
        exit();
    } else {
        console.log('Connect ChainSQL successfully. ')
    }
    
    api.as({
		"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
	});
    
    var tableName = 'abcefg';
    setup_invoke(tableName);
    invoke();

	//createTable_using_callback(tableName);
	//dropTable_using_callback(tableName);
});

function exit() {
    process.exit()
}

function createTable(tableName) {
    api.setRestrict(false);
    api.createTable(tableName, [{
		"field": "id",
		"type": "int",
		"length": 11,
		"PK": 1,
		"NN": 1,
		"UQ": 1,
		"AI": 1
	}, {
		"field": "age",
		"type": "int",
		"length": 11,
		"default": 0
	}, {
		"field": "name",
		"type": "varchar",
		"length": 46,
		"default": "null"
	}], {
		confidential: false
	}).submit({
		expect: 'validate_success'
	}).then(function(data) {
        if (data.status === 'validate_success') {
            console.log('ok     : create table.');
            // insert record
            invoke();
        }
	}).catch(function(e) {
        console.log('failure: create table. ' + JSON.stringify(e));
        exit();
	});
}

function createTable_using_callback(tableName) {
    api.setRestrict(false);
    api.createTable(tableName, [{
		"field": "id",
		"type": "int",
		"length": 11,
		"PK": 1,
		"NN": 1,
		"UQ": 1,
		"AI": 1
	}, {
		"field": "age",
		"type": "int",
		"length": 11,
		"default": 0
	}, {
		"field": "name",
		"type": "varchar",
		"length": 46,
		"default": "null"
	}], {
		confidential: false
	}).submit(function(error, data) {
		if(error) {
			console.log('createTable_using_callback ', error);
		} else {
			console.log('createTable_using_callback ', data);
		}
	});
}

function dropTable(tableName) {
    api.dropTable(tableName)
    .submit({
        expect: 'validate_success'
    }).then(function(data) {
        if (data.status === 'validate_success') {
            console.log('ok     : drop table.');
            exit();
        }
    }).catch(function(e) {
        console.log('failure: drop table. ' + JSON.stringify(e));
        exit();
    });
}

function dropTable_using_callback(tableName) {
    api.dropTable(tableName)
    .submit(function(error, data) {
		if(error) {
			console.log('dropTable_using_callback ', error);
		} else {
			console.log('dropTable_using_callback ', data);
		}
	});
}

function renameTable(oldTableName, newTableName) {
    api.renameTable(oldTableName,newTableName)
    .submit({
        expect: 'validate_success'
    }).then(function(data) {
        if (data.status === 'validate_success') {
            console.log('ok     : rename table.');
            invoke();
        }
    }).catch(function(e) {
        console.log('failure: rename table. ' + JSON.stringify(e));
        exit();
    });    
}

function insertRecord(tableName) {
    api.table(tableName).insert([{
		age: 3,
        name: 'peersafe'
	},{
        age: 10,
        name: 'guichuideng'
    }]).submit({
		expect: 'db_success'
	}).then(function(data) {
        if (data.status === 'db_success') {          
            // invoke expectValue
            invoke_expect();
        }
	}).catch(function(e) {
        console.log('failure: insert table. ' + JSON.stringify(e));
        exit();
	})
}

function updateRecord(tableName) {
    api.table(tableName).get({
		id: 1
	}).update({
		name: 'zongxiang'
	}).submit({
		expect: 'db_success'
	}).then(function(data) {
        if (data.status === 'db_success') {
            //console.log("update record successfully.");
            // invoke expectValue
            invoke_expect();
        }
	}).catch(function(e) {
		//console.log("update record unsuccessfully." + JSON.stringify(e));
        console.log('failure: update table. ' + JSON.stringify(e));
        exit();
	});
}

function deleteRecord(tableName) {
    api.table(tableName).get({
		id: 1
	}).delete().submit({
		expect: 'db_success'
	}).then(function(data) {
        if (data.status === 'db_success') {
            //console.log("delete record successfully.");
            invoke_expect();
        }
	}).catch(function(e) {
        console.log('failure: delete record. ' + JSON.stringify(e));
        exit();
	})
}

function expectValue(tableName, expect, message) {
    if (Object.prototype.toString.call(expect) != '[object Array]') {
        console.log('type is ', Object.prototype.toString.call(expect));
        throw new Error('Type of expect must be array in function `expectValue`.');
    }
    
    api.table(tableName).get([])
    .submit(function(err, result) {
		var data = result.lines;
        if (err) {
            console.log(err)   
        } else {
            if (expect.length != data.length) {
				console.log('failure: ' + message);
                console.log('Expect count of record is ' + expect.length + ',but it is ' + data.length);
                console.log(data);
                exit(0);
            }
            
            compare = function(left, right) {
                if (/*left.id === right.id && */ left.age === right.age && left.name === right.name) {
                    return true;
                }
                return false;
            };
            
            var exception = false;
            var exception_indx = 0;
            for (exception_indx = 0; exception_indx < expect.length; exception_indx++) {
                var expect_value = expect[exception_indx];
                var real_value = data[exception_indx];
                if (compare(expect_value,real_value) == false) {
                    exception = true;
                    break;
                }
            }
            
            if (exception) {
                console.log('failure: ' + message);
                console.log('\texpect: ' + JSON.stringify(expect[exception_indx]));
                console.log('\treal  : ' + JSON.stringify(data[exception_indx]));
                exit(0);
            } else {
                console.log('ok     : ' + message);
                invoke();
            }
        }
	});
}

function assign(tableName, user) {
	api.grant(tableName, user.address, {
		update: true
	}, user.publickKey).submit({
		expect: 'validate_success'
	}).then(function(data) {
        if (data.status === 'validate_success') {
            console.log('ok     : assign.');
            invoke();
        }
	}).catch(function(e) {
		console.log('failure: assign. ' + JSON.stringify(e));
        exit();
	})
}

function transaction(tableName) {
	api.beginTran();
	api.table(tableName).insert({
        age: 33,
		name: 'dahuaxiyou'
	});
    
	api.table(tableName).get({
        age: 33
    }).update({
        name: 'zhouxingchi'
    });
        
    try {
        api.commit({
            expect: 'db_success',
        }).then(function(data) {
            if (data.status === 'db_success') {
                invoke_expect();
            }
        }).catch(function(error){
            console.log('failure: transaction. ' + error);
        })        
    } catch (e) {
        console.log('ok     : transaction. exception: ', e);
    };
	
	/*
	try {
        api.commit(function(error, data) {
			if (error) {
				console.log('ok     : transaction. exception: ', e);
			} else {
				if (data.status === 'db_success') {
					invoke_expect();
				}
			}
		});        
    } catch (e) {
        console.log('ok     : transaction. exception: ', e);
    };
	*/
}

function createAccountAndActive() {
	var account = api.generateAddress();
	//console.log(account);
	api.activeAccount(account)
	.then(function(data) {
		if (data.status == 0) {
			console.log(JSON.stringify(account));
			console.log('ok		: activeAccount.', JSON.stringify(data));
			invoke();
		} else {
			console.log('failure	: activeAccount.', JSON.stringify(data));
			exit();
		}
	})
	.catch(function(error) {
		console.log('failure	: activeAccount.', JSON.stringify(error));
		exit();
	});
}
