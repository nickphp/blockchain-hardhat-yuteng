const { expect } = require('chai') //断言模块 
const { ethers} = require('hardhat') //安全帽模块

//合约地址
const {proxyAddress, upgradeContract} = require("../contract.config.json") 

describe('YutengV2合约测试', () => {
  /**
   * 测试执行前的钩子函数
   */
  before(async () => { 
    //获取签名器
    const [owner] = await ethers.getSigners();
    this.owner = owner

    //获取合约工厂对象
    const Contract = await ethers.getContractFactory(upgradeContract)

    //合约实例
    this.contract = new ethers.Contract(proxyAddress, Contract.interface, owner)

    //监听合约接收到ETH事件
    console.log("合约SendBalance事件监听中...")
      this.contract.on('SendBalance', (from, to, value, number, event) => {
      console.log("SendBalance监听器触发")
      console.log("发送方", from)
      console.log('接收方', to)
      console.log("发送ETH数量", ethers.utils.formatEther(value))
      console.log("事件编号", number.toString())
      //console.log(event)
    })
  

    //实验
    // let blockInfo = await this.contract.provider.getTransactionReceipt(sendTxResult.hash)
    //let pendingBal = await this.contract.getBalance(proxyAddress, "pending")
    //console.log(pendingBal)
  });

  /**
   * 获取score状态测试
   */
//   it('测试score等于0', async () => {
//     const score = await this.contract.score()
//     console.log(typeof score.toString())
//     expect(score.toString()).to.be.equal('100')
//   })

  it('向合约发送ETH', async () => {
  
    //获得交易之前的余额
    const contractOldBalance = await this.contract.provider.getBalance(proxyAddress)

    //格式化旧余额显示为ETH单位
    let beforeBalance = ethers.utils.formatEther(contractOldBalance)
    console.log("本次交易之前余额为",beforeBalance)

    //构建交易数据
    let txValue = ethers.utils.parseEther('0.005765') //本次发送的以太数量
    let tx = { to: proxyAddress, value: txValue }

    //执行交易发送
    console.log("开始发送交易...")
    let sendTxResult = await this.owner.sendTransaction(tx)
    console.log("发送交易完成")

    //等待挖矿出块
    console.log("等待区块确认...")
    await sendTxResult.wait()
    console.log("区块确认完成")
    
    //获取交易之后的余额
    console.log("正在读取合约新的余额...")
    const contractNewBalance = await this.contract.provider.getBalance(proxyAddress)
    console.log("合约余额读取完成")

    //格式化新余额显示ETH单位
    let afterBalance = ethers.utils.formatEther(contractNewBalance)
    console.log("本次交易之后余额为",afterBalance)

    //大数处理 交易之前的余额+本次交易的数额=预期余额
    const expectBalance = ethers.BigNumber.from(contractOldBalance).add(txValue)
    
    //交易之后的余额和预期余额比较 相等通过验证
    expect(contractNewBalance.toString()).to.be.equal(expectBalance.toString())

  })


  /**
   * 修改score状态测试
   */
  // it('修改score', async () => {
  //   const setScoreTx = await this.contract.setsCcore(126)
  //   await setScoreTx.wait() //等待出块
  //   expect((await this.contract.score()).toString()).to.be.equal('126')
  // })

})
