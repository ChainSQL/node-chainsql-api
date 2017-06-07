'use strict'

const permission = {
	lsfSelect: 65536,
	lsfInsert: 131072,
	lsfUpdate: 262144,
	lsfDelete: 524288,
	lsfExecute: 1048576
}

const opType = {
	t_create: 1,
	t_drop: 2,
	t_rename: 3,
	t_assign:4,
	t_assignCancel: 5,
	r_insert: 6,
	r_get: 7,
	r_update: 8,
	r_delete: 9,
	t_assert:10,
	t_grant: 11,
	t_recreate:12
}
exports.permission = permission;
exports.opType = opType;