// contracts/Yuteng.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//ERC20 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "hardhat/console.sol";

/**
 * Usdt测试合约
 */
contract Usdt is ERC20 {    
    /**
     * 合约构造函数
     * 铸造的token全部交给合约自身
     * 无任何私有账号持有token
     */
    constructor(address owner, uint256 initTotalSupply) payable ERC20("Usdt Token", "USDT") {
        _mint(owner, initTotalSupply);
    }

    //向合约发送以太币在包含数据时调用
    fallback() external payable {

    }

    //向合约发送以太币 不包含数据时调用
    receive() external payable {
 
    }

}