'use strict'

const permission = require('./config').permission;

function create(name,obj) {
	if(name == undefined || name.length > 64 || name.length == 0){
		throw new Error("tabla name not valid");
	}
	let result = [];
	if (!isArrayFn(obj)) {
		throw new Error('raw must be an Array');
	}

	let setFields = new Set();

	// let isHavePk = false;
	for (let i = 0; i < obj.length; i++) {
		if (!obj[i].field || !obj[i].type) {
			throw new Error('Raw must have  field and type');
		}


		// field must be unique
		if(setFields.has(obj[i].field)){
			throw new Error('Duplicate column name `'+obj[i].field+'`');
		}
		
		setFields.add(obj[i].field);

		switch(obj[i].type)
		{
			case "int":
			case "float":
			case "double":
			case "decimal":
			case "blob":
			case "text":
			case "datetime":
			case "date":
			break;
			case "varchar":
			case "char":
			if(!obj[i].length){
				throw new Error('The type varchar must have length');
			}
			break;
			default:
			throw new Error('invalid type '+obj[i].type);
		}
		// if (obj[i].PK) {
		// 	if (isHavePk) {
		// 		throw new Error('the table only have a PK');
		// 	}
		// 	node.PK = 1;
		// 	isHavePk = true;
		// }
	}
}

function assign(obj) {
	let result = 0;
	if (!isArrayFn(obj)) {
		throw new Error('flags must be an Array');
	}
	for (var i = 0; i < obj.length; i++) {
		if (permission[obj[i]]) {
			result = result | permission[obj[i]];
		}
	}
	if (result === 0) throw new Error('invalidate flags');
	console.log(result);
	return result;
}

function isArrayFn(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

exports.create = create;
exports.assign = assign;