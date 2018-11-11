pragma solidity ^0.4.4;

contract DBTest {
    /*
    * @param tableName eg: "test1"
    * @param raw eg: "[{\"field\":\"id\", \"type\" : \"int\", \"length\" : 11, \"PK\" : 1, \"NN\" : 1, \"UQ\" : 1}, { \"field\":\"account\", \"type\" : \"varchar\" }, { \"field\":\"age\", \"type\" : \"int\" }]"
    */
	function create(string tableName, string raw) public returns(bool) {
		return msg.sender.create(tableName, raw);
	}
	/*
	* @param tableName eg: "test1"
	*/
	function drop(string tableName) public returns(bool) {
	    return msg.sender.drop(tableName);
	}
	
	/*
	* @param owner table's owner'
	* @param tableName eg: "test1"
	* @param raw eg: "[{\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\", \"id\":0}, {\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\",   \"id\":1}, {\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\", \"id\":2}]"
	*/
	function insert(address owner, string tableName, string raw) public returns(bool) {
	    return owner.insert(tableName, raw);
	}
	
	/*
	* @param tableName eg: "test1"
	* @param raw eg: "[{\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\", \"id\":0}, {\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\",   \"id\":1}, {\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\", \"id\":2}]"
	*/
	function insert(string tableName, string raw) public returns(bool) {
	    return msg.sender.insert(tableName, raw);
	}
	
	/*
	* @param owner table's owner'
	* @param tableName "test1"
	* @param raw eg: "{\"id\":1}"
	*/
	function deletex(address owner, string tableName, string raw) public returns(bool) {
	    return owner.deletex(tableName, raw);
	}
	
	/*
	* @param tableName "test1"
	* @param raw eg: "{\"id\":1}"
	*/
	function deletex(string tableName, string raw) public returns(bool) {
	    return msg.sender.deletex(tableName, raw);
	}
	
	/*
	* @param owner table's owner'
	* @param tableName eg: "test1"
	* @param rawUpdate eg: "{\"age\":15}"
	* @param rawGet eg: "{\"id\": 2}"
	*/
	function update(address owner, string tableName, string rawUpdate, string rawGet) public returns(bool) {
	    return owner.update(tableName, rawUpdate, rawGet);
	}
	
	/*
	* @param tableName eg: "test1"
	* @param rawUpdate eg: "{\"age\":15}"
	* @param rawGet eg: "{\"id\": 2}"
	*/
	function update(string tableName, string rawUpdate, string rawGet) public returns(bool) {
	    return msg.sender.update(tableName, rawUpdate, rawGet);
	}
	
	/*
	* @param tableName eg: "test1"
	* @param tableNameNew eg: "testNew1"
	*/
	function rename(string tableName, string tableNameNew) public returns(bool) {
	    return msg.sender.rename(tableName, tableNameNew);
	}
	
	/*
	* @param toWho ethereum address to be granted. need convert chainsql addr 2 ethereum addr .eg:  "0xzzzzzzzzzzzzzzzzzzzzBZbvji"
	* @param tableName eg: "test1"
	* @param raw eg: "{\"insert\":false, \"delete\":false}"
	*/
	function grant(address toWho, string tableName, string raw) public returns(bool) {
	    return msg.sender.grant(toWho, tableName, raw);
	}
	
	function sqlTransaction(string tableName) public returns(bool) {
	    db.beginTrans();
	    msg.sender.create(tableName, "[{\"field\":\"id\", \"type\" : \"int\", \"length\" : 11, \"PK\" : 1, \"NN\" : 1, \"UQ\" : 1}, { \"field\":\"account\", \"type\" : \"varchar\" }, { \"field\":\"age\", \"type\" : \"int\" }]");
        msg.sender.insert(tableName, "[{\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\", \"id\":1}, {\"account\":\"zU42yDW3fzFjGWosdeVjVasyPsF4YHj224\",   \"id\":2}]");
        msg.sender.deletex(tableName, "{\"id\":1}");
        msg.sender.update(tableName, "{\"account\":\"id==2\"}", "{\"id\": 2}");
        return db.commit();
	}
	
    /*
	* @param owner table's owner'
	* @param tableName eg: "test1"
	* @param raw eg: ""
    */
    function get(address owner, string tableName, string raw) public view returns(uint256) {
        return owner.get(tableName, raw);
    }
    
    /*
	* @param tableName eg: "test1"
	* @param raw eg: ""
    */
    function get(string tableName, string raw) public view returns(uint256) {
        return msg.sender.get(tableName, raw);
    }
	
	function getRowSize(uint256 handle) public view returns(uint) {
	    return db.getRowSize(handle);
	}
	
	function getColSize(uint256 handle) public view returns(uint) {
	    return db.getColSize(handle);
	}
	
    /*
	* @param handle representative the result of get
	* @param raw eg: "0, 1, 2, ... rowSize-1"
	* @param key eg: "id"
    */
	function getValueByKey(uint256 handle, uint row, string key) public view returns(string) {
	    return db.getValueByKey(handle, row, key);
	}
	
    /*
	* @param handle representative the result of get
	* @param raw eg: "0, 1, 2, ... rowSize-1"
	* @param col eg: "0, 1, 2, ... colSize-1"
    */
	function getValueByIndex(uint256 handle, uint row, uint col) public view returns(string) {
	    return db.getValueByIndex(handle, row, col);
	}
}