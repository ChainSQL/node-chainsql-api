const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const r = new ChainsqlAPI();

var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "aBP8JEiNXr3a9nnBFDNKKzAoGNezoXzsa1N8kQAoLU5F5HrQbFvs"
};

r.connect('ws://127.0.0.1:6006', function(err, data) {
	if (err) {
		console.log('连接失败. ', JSON.stringify(e));
        return
	}
    console.log('连接成功');
	var tb = 'peersafe';
	r.as({
		"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
	});

	// r.as({
	// 	"secret": "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	// 	"address": "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q"
	// });
	//createTable(tb, false); //创建表
	// 
	// insertData(tb); //插入数据
	// del(tb)//删除数据
	// updateData(tb)//更新数据
	// getData(tb);//获取数据
	// assign(tb, user); //授权表
	// transaction();//事务
	 subTable(tb,'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh');
	// unsubTable('rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh', tb);
	 // getLedger();
});

function createTable(table, confidential) {
	r.setRestrict(false);
	// 创建表
	// r.createTable(table, [{
	// 	"field": "id",
	// 	"type": "int",
	// 	"length": 11,
	// 	"PK": 1,
	// 	"NN": 1,
	// 	"UQ": 1,
	// 	"AI": 1
	// }, {
	// 	"field": "name",
	// 	"type": "varchar",
	// 	"length": 46,
	// 	"default": "null"
	// }], {
	// 	confidential: confidential
	// }).submit(function(err, data) {
	// 	console.log('create', data)
	// });
	r.createTable(table, [{
		"field": "id",
		"type": "int",
		"length": 11,
		"PK": 1,
		"NN": 1,
		"UQ": 1,
		"AI": 1
	}, {
		"field": "name",
		"type": "varchar",
		"length": 46,
		"default": "null"
	}], {
		confidential: confidential
	}).submit({
		expect: 'validate_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})
};

function createTable_with_foreignkey(table, confidential) {
    r.createTable(table, [{
		"field": "id",
		"type": "int",
		"length": 11,
		"PK": 1,
		"NN": 1,
		"UQ": 1,
		"AI": 1
	}, {
		"field": "oid",
		"type": "int",
		"length": 1,
        "FK":1,
		"NN": 1,
        "REFERENCES":{"table":"goods","field":"id"}
	}], {
		confidential: confidential
	}).submit({
		expect: 'validate_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})
}

function insertData(tb) {
	// r.table(tb).insert({
	// 	name: 'xiaopeng1'
	// }).submit(function(err, data) {
	// 	console.log('insert', data);
	// });
	r.table(tb).insert({
		age: 'xiaopeng1'
	}).submit({
		expect: 'db_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})

};

function updateData(tb) {
	// r.table(tb).get({
	// 	name: 'xiaopeng'
	// }).update({
	// 	name: 'feipeng'
	// }).submit(function(err, data) {
	// 	console.log('update', data)
	// });
	r.table(tb).get({
		name: 'xiaopeng'
	}).update({
		name: 'feipeng'
	}).submit({
		expect: 'db_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})
};

function getData(tb) {
	r.table(tb).get({
		$or: [{
			id: 2
		}, {
			name: 'feipeng'
		}],
		$limit: {
			index: 0,
			total: 9
		}
	}).submit(function(err, data) {
		console.log(err)
		console.log('get', data)
	});
	// r.table(tb).get({
	// 	$or: [{
	// 		id: 2
	// 	}, {
	// 		name: 'feipeng'
	// 	}],
	// 	$limit: {
	// 		index: 0,
	// 		total: 9
	// 	}
	// }).submit().then(function(data) {
	// 	console.log('data',data);
	// }).catch(function(e) {
	// 	console.log('err',e)
	// })
}

function getData_with_groupby(tb) {
    try {
        r.table(tb).get({
            $or: [{
                id: 2
            }, {
                name: 'feipeng'
            }]
        })
        .groupby(['id','name'])
        .submit(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        });
    } catch (e){
        console.log('getData_with_groupby: ' + e)
    }
}


function getData_with_groupby_and_having(tb) {
    try {
        r.table(tb).get({
            $or: [{
                id: 2
            }, {
                name: 'feipeng'
            }]
        })
        .groupby(['id','name'])
        .having({'id':{'$gt':100}})
        .submit(function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log(data)
            }
        });
    } catch (e){
        console.log('getData_with_groupby: ' + e)
    }

}

function del(tb) {
	// r.table(tb).get({
	// 	id: 1
	// }).delete().submit(function(err, data) {
	// 	console.log('del', data)
	// });
	r.table(tb).get({
		id: 1
	}).delete().submit({
		expect: 'db_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})
}

function assign(tb, user) {
	// r.grant(tb, user.address, {
	// 	update: true
	// }, user.publickKey).submit(function(err, data) {
	// 	console.log('assign', data)
	// });
	r.grant(tb, user.address, {
		update: true
	}, user.publickKey).submit({
		expect: 'validate_success'
	}).then(function(data) {
		console.log(data)
	}).catch(function(e) {
		console.log(e)
	})
}

function transaction() {
	r.beginTran();
	r.table('aad').insert({
		name: 'feipeng'
	});
	r.table('aad').get({
			name: 'feipeng'
		}).update({
			name: 'xiaopeng'
		})
		// r.commit(function(err, data) {
		// 	console.log(err, data)
		// });
    try {
        api.commit({
            expect: 'db_success'
		}).then(function(data) {
            console.log(data);
		}).catch(function(error) {
            console.log(error);
		});        
    } catch (e) {
        console.log('transaction. exception: ', e);
    };
}

function subTable(tb, owner) {
	var event = r.event;
	event.subscriptTable(tb, owner, function(err, data) {
		console.log(err, data)
	}).then(function(data) {
		console.log('subTable success.');
	}).catch(function(error) {
		console.log('subTable failure.');
	});
	
	setTimeout(function() {
		unsubTable(owner, tb);
	},2000);
}

function unsubTable(tb, owner) {
	try {
		var event = r.event;
		event.unsubscriptTable(tb, owner)
		.then(function(data) {
			console.log('unsubTable success.');
		})
		.catch(function(error) {
			console.log('unsubTable failure. ', error);
		});		
	} catch (error) {
		console.log('unsubTable: ', error);
	}

}

function getLedger() {
	r.getLedger({
		ledgerVersion: 22
	}, function(err, data) {
		console.log(err, data)
	})
}