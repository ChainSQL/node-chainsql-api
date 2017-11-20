'use strict'

const permission = require('./config').permission;

function create(obj) {
	let result = [];
	if (!isArrayFn(obj)) {
		throw new Error('raw must be an Array');
	}
	// let isHavePk = false;
	for (let i = 0; i < obj.length; i++) {
		let node = {};
		if (!obj[i].field || !obj[i].type) {
			throw new Error('Raw must have  field and type');
		}
        if(obj[i].type === 'int'){

        }else if(obj[i].type === 'int'){

        }else if(obj[i].type === 'float'){

        }else if(obj[i].type === 'double'){

        }else if(obj[i].type === 'decimal'){

        }else if(obj[i].type === 'varchar'){
           if(!obj[i].length){
           	throw new Error('The type varchar must have length');
           }
        }else if(obj[i].type === 'blob'){

        }else if(obj[i].type === 'text'){

        }else if(obj[i].type === 'datetime'){

        }else{
           throw new Error('invalid type '+obj[i].type)
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