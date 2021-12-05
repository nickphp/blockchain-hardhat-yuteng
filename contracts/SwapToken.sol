// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";
interface ERC20Interface {
    function transfer(address recipient, uint256 amount) external  returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external  returns (bool);
    function approve(address spender, uint256 amount) external  returns (bool);
}

/**
 * 简单token交换协议
 * 前提是必须对该合约进行授权
 */
contract SwapToken {
    ERC20Interface private erc20Interface; //合约接口实例
    mapping (address => bool) private _contracts; //交换合约地址列表
    address private _owner ; //合约拥有者
    mapping(address => mapping(address => uint)) private _approveCallState; //合约授权token列表
    mapping(address => mapping(address => uint)) private _tokenCallState; //合约转账token列表
    bool tokenToEthLock = false;
    bool tokenToTokenLock = false;



    /**
     * 初始化合约地址列表
     */
    constructor(address owner, address[] memory contracts) payable {
        //循环添加合约地址
        for (uint i = 0; i < contracts.length; i++) {
            _contracts[contracts[i]] = true;  //默认状态可用      
        }
        _owner = owner; //设置合约拥有者
    }

    //增加合约并设置状态
    function saveContract(address contractAddress, bool state) external returns(bool) {
        require(msg.sender == _owner, "No Auth"); //操作人检查
        _contracts[contractAddress] = state; 
        return true;
    }

    //使用token向合约兑换eth(必须已授权)
    function tokenToEth(address contractAddress, uint56 amount) external returns(bool) {
        require(_contracts[contractAddress] == true, "Invalid contract address"); //合约检查
        require(address(this).balance >= amount, "Balance out of bounds"); //余额越界
        require(!tokenToEthLock, "Reentrant call detected!");//重入锁检查
        tokenToEthLock = true; //开启锁
        bool transferFormRst = _transferFrom(contractAddress, msg.sender, address(this), amount); //转移币
        require(transferFormRst, "Sending eth failed");//转移结果检查
        (bool success, ) = payable(msg.sender).call{ value: amount }(''); // 
        require(success, "Sending eth failed");//发送结果检查
        tokenToEthLock = false;//重置锁
        return true;
    }

    //合约授权
    function approve(address contractAddress, uint256 amount) public virtual returns (bool) {
        erc20Interface = ERC20Interface(contractAddress); //获取合约对象
        return erc20Interface.approve(address(this), amount); 
    }

    //使用Eth向合约兑换token
    function ethToToken(address contractAddress, uint256 amount) external payable returns(bool) {
        require(_contracts[contractAddress] == true, "Invalid contract address"); //合约检查
        bool transferFormRst = _transfer(contractAddress, msg.sender, amount); //转移币
        require(transferFormRst, "Sending eth failed");//发送结果检查
        return true;
    }

    /**
     * 此方法演示两个token以太坊erc20 token交换
     * 使用一种token兑换另一种token
     * 核心思想解释
     * token兑换的前提是 两种token必须都已经授权
     * 两种资产必须在各自合约里面都有才能进行
     * target在实际的兑换中需要通过算法公式实现从哪些授权用户开始操作
     * 也就是SwapToken交换合约需要有一个账本记录用户授权的每个token的额度
     * 例如用户兑换使用YTC兑换1000USDT，有可能从三个或更多授权账户中取出进行授权操作
     * 将三个账户余额累加超过1000 余数部分返还给三个账户中那个账户(取决于业务模式)
     * 关于两个token对话的比率 可以通过手工喂价策略（这种策略不靠谱币的价格是时刻变化的）
     * 因此需要引入价格预言机获得两个token的当前交易时刻的价格，然后根据比率换算交换的额度
     */
    function tokenToToken(address contractA, uint256 amountA, address contractB, uint256 amountB, address target) external returns(bool) {
        require(_contracts[contractA] == true, "Invalid contract address a"); //合约地址检查
        require(_contracts[contractB] == true, "Invalid contract address b"); //合约地址检查
        require(!tokenToEthLock, "Reentrant call detected!");//重入锁检查
        tokenToTokenLock = true;

        //todo 两个地址的代币交换 这里使用的是授权模式 双方必须授权代币给当前swap合约才可以交换代币
        bool transferFormA = _transferFrom(contractA, msg.sender, target, amountA); //转移币 
        bool transferFormB = _transferFrom(contractB, target, msg.sender, amountB); //转移币

        require(transferFormA = true , "Sending eth failed a");//发送结果检查
        require(transferFormB = true , "Sending eth failed b");//发送结果检查
        tokenToTokenLock = false;
        return true;
        
    }

    /**
     * 合约向用户转币
     */
    function _transfer(address contractAddress, address recipient, uint256 amount) private returns(bool) {
        erc20Interface = ERC20Interface(contractAddress); //获取合约对象
	    bool result = erc20Interface.transfer(recipient, amount);//合约转token
        return result;
    }

    /**
     * 合约转移用户授权的币
     */
    function _transferFrom(address contractAddress, address holder, address recipient, uint256 amount) private returns(bool) {
        erc20Interface = ERC20Interface(contractAddress); //获取合约对象
	    bool result = erc20Interface.transferFrom(holder, recipient, amount);//合约转token
        return result;
    }

    /**
     * 接收代币合约授权通知
     */
    function receiveApproval(address from, uint256 _amount, bytes memory _data) external returns(bool) {
        //记录被授权通知余额
        _approveCallState[msg.sender][from] = _amount;
 
        //todo 解码数据 处理一些数据业务逻辑...
        uint256 payloadSize;
        uint256 payload;
        assembly {
            payloadSize := mload(_data)
            payload := mload(add(_data, 0x20))
        }
        payload = payload >> 8*(32 - payloadSize);
        console.log(payload);

        //返回执行结果
        return true;
    }

    /**
     * 接收代币合约转账通知
     */
    function receiveToken(address from, uint256 _amount, bytes memory _data) external returns(bool) {
        //维护代币合约账本信息
        _tokenCallState[msg.sender][from] = _amount;
      
        //todo 解码数据 处理一些数据业务逻辑... 
        uint256 payloadSize;
        uint256 payload;
        assembly {
            payloadSize := mload(_data)
            payload := mload(add(_data, 0x20))
        }
        payload = payload >> 8*(32 - payloadSize);
        console.log(payload);

        //返回结果
        return true;
    }
    
}