const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const r = new ChainsqlAPI();
var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "02F039E54B3A0D209D348F1B2C93BE3689F2A7595DDBFB1530499D03264B87A61F"
};

r.connect('ws://192.168.0.197:6007', function(err, data) {
	if (!err) {
		console.log('连接成功');
	}
	var tb = 'aaf'
	r.as({
		"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
	});
	// r.as({
	// 	"secret": "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	// 	"address": "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q"
	// });
	// createTable(tb, true); //创建表
	// 
	// insertData(tb); //插入数据
	// del(tb)//删除数据
	// updateData(tb)//更新数据
	// getData(tb);//获取数据
	assign(tb, user); //授权表
	// transaction();//事务
	// subTable('aad','rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh');
});

function createTable(table, confidential) {
	r.setRestrict(true);
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
	// }).submit(function(err, data) {
	// 	console.log(err)
	// 	console.log('get', data)
	// });
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
	}).submit({
		expect: 'db_success'
	}).then(function(data) {
		console.log(data);
	}).catch(function(e) {
		console.log(e)
	})
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
	r.commit({
		expect: 'send_success'
	}).then(function(data) {
		console.log(data)
	}).catch(function(e) {
		console.log(e)
	})
}

function subTable(tb, owner) {
	var event = r.event;
	event.subTable(tb, owner, function(err, data) {
		console.log(err, data)
	})
}