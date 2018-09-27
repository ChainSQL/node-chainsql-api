pragma solidity ^0.4.4;

contract test {
    event multiplylog(uint number, uint result);
    //event memChangelog(uint mem);
    uint mem;
    
    function test() payable {}
    
    function multiply(uint a) returns(uint d){
        uint result = a * 7;
        multiplylog(a, result);
        return result;
    }
    
    function setMem(uint newMem){
        mem = newMem;
        //memChangelog(mem);
    }
    function getMem() returns(uint){
        return mem;
    }
    
	//合约给用户转账，指定amount
    function transferToUser(address to,uint amount) public payable {
        to.transfer(amount);
    }
    // 合约给用户转账，使用msg.value
    function userTransferUser(address to) public payable {
        to.transfer(msg.value);
    }
    function getBalance(address user) public view returns (uint) {
        return user.balance;
    }
    function getMsgSender() public view returns(address, uint){
        return (msg.sender,6);
    }

    function return2int() public pure returns(uint,uint){
        uint a1 = 256;
        uint a2 = 56;
        return (a1, a2);
    }
    
    function returnString() returns(string){
        //string public str1;
        //return str1;
		return "stringTest1foralongStringMorethan32Byte41";
    }
    
    function returnMixType() returns(uint, string){
        uint a3 = 666;
        return (a3,"stringTest2forMixTypeReturn");
    }
    
    function getTxOrigin() returns(address){
        return tx.origin;
    }
}