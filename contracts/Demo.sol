// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Demo {
    uint age = 68;
    
    function getAge() public view returns(uint){
        return age; 
    }
    
    function setAge(uint newAge) public returns(uint) {
        age = newAge;
        return age;
    }
}


contract DemoInterface {
    function getAge() public view returns(uint);
    function setAge(uint newAge) public returns(uint);
}


contract User {
    string username = "zhangsan";
    DemoInterface demoContract;
    
    constructor(address contractAddress) payable public {
        demoContract = DemoInterface(contractAddress);
    }

    function getContractAge () public view returns(uint) {
       return  demoContract.getAge();
    }
    
    function setContractAge (uint newAge) public returns(uint) {
       return demoContract.setAge(newAge);
    }
}



