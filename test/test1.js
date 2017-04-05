const ChainsqlAPI = require('../src/index').ChainsqlAPI;
const r = new ChainsqlAPI();
var user = {
	secret: "ssnqAfDUjc6Bkevd1Xmz5dJS5yHdz",
	address: "rBuLBiHmssAMHWQMnEN7nXQXaVj7vhAv6Q",
	publickKey: "02F039E54B3A0D209D348F1B2C93BE3689F2A7595DDBFB1530499D03264B87A61F"
};

r.connect('ws://192.168.0.197:6007', function(err, data) {
	if (err) {
		console.log('连接成功');
	}
	r.as({
		"secret": "snoPBrXtMeMyMHUVTgbuqAfg1SUTb",
		"address": "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
	});
	// createTable('aagdddd', false);//创建表
	// 
	// insertData('aagdd');//插入数据
	// del('aagdddd')//删除数据
	// updateData('aagdddd')//更新数据
	// getData('aagdddd');//获取数据
	// assign('aagdddd',user);//授权表
	// transaction();//事务
});

function createTable(table, confidential) {
	r.setRestrict(true);
	// 创建表
	r.create(table, [{
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
	}, function(err, data) {
		console.log('create', data)
	});
};

function insertData(tb) {
	r.table(tb).insert({
		name: 'xiaopeng'
	}).submit(function(err, data) {
		console.log('insert', data)
	});

};

function updateData(tb) {
	r.table(tb).get({
		name: 'xiaopeng'
	}).update({
		name: 'feipeng'
	}).submit(function(err, data) {
		console.log('update', data)
	});
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
}

function del(tb) {
	r.table(tb).get({
		id: 1
	}).delete().submit(function(err, data) {
		console.log('del', data)
	});
}

function assign(tb, user) {
	r.assign(tb, user.address, [r.perm.update], user.publickKey, function(err, data) {
		console.log('assign', data)
	});
}

function transaction() {
	r.beginTran();
	r.table('aagdddd').insert({
		name: 'feipeng'
	});
	r.table('aagdddd').get({
		name: 'feipeng'
	}).update({
		name: 'xiaopeng'
	})
	r.commit(function(err, data) {
		console.log(err, data)
	});
}