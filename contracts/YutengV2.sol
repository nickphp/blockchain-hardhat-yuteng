// contracts/YutengV1.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract YutengV2 {
    uint256  public score;

    event SendBalance(address from, address to, uint value, uint number);

    //向合约发送以太币在包含数据时调用
    fallback() external payable {
        emit SendBalance(msg.sender, address(this), msg.value, 101);
    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable {
        emit SendBalance(msg.sender, address(this), msg.value, 102);
    }

    /**
     * 新增方法
     * 修改score
     */
    function setsCcore(uint256 newScore) external {
        score = newScore;
    }
}