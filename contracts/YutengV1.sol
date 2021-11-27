// contracts/YutengV1.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract YutengV1 {
    uint256  public score;

    //向合约发送以太币在包含数据时调用
    fallback() external payable {
        
    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable {
        
    }

}