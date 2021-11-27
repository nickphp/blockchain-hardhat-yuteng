const { expect } = require('chai') //断言模块 
const { ethers} = require('hardhat') //安全帽模块

//合约地址
const {proxyAddress, upgradeContract} = require("../contract.config.json") 

//获取签名器
const eventListenr = async () => {
    //获得签名器
    const [deployer] = await ethers.getSigners()
    
    //获取合约工厂对象
    const Contract = await ethers.getContractFactory(upgradeContract)
    
    //合约实例
    //this.contract = new ethers.Contract(proxyAddress, Contract.interface, deployer)
    this.contract = new ethers.Contract('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', Contract.interface, deployer)

    //监听合约接收到ETH事件
    this.contract.on('SendBalance', (from, to, value, number, event) => {
        console.log("监听到合约接收到ETH")
        console.log("发送方", from)
        console.log('接收方', to)
        console.log("发送数量", ethers.utils.formatEther(value))
        console.log("事件编号", number.toString())
        //console.log(event)
    })
}
console.log("开始监听合约事件...")
eventListenr()

