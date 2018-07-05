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
    
    function return2int() returns(uint,uint){
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