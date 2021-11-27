const { expect } = require('chai') //断言模块 
const { ethers} = require('hardhat') //安全帽模块


describe('Yuteng合约测试', () => {
  /**
   * 测试执行前的钩子函数
   */
  before(async () => { 
    //获取签名器
    const [deployer,owner, user] = await ethers.getSigners();
    this.deployer = deployer
    this.owner = owner
    this.user = user

    //获取合约工厂对象
    const Contract = await ethers.getContractFactory('Yuteng')
    //部署
    this.contract = await Contract.deploy(owner.address, ethers.utils.parseEther('1000000000000'));
    await this.contract.deployed();
    console.log('合约地址:', this.contract.address)

    //将发行的token授权给合约
    // this.contract2 = new ethers.Contract(this.contract.address, Contract.interface, owner)
    // console.log("发行的token授权给合约")
    // await this.contract2.approve(this.contract.address, ethers.utils.parseEther('20000000000'))

    //读取授权token余额
    // console.log("读取授权给合约的token余额")
    // const allowance =  await this.contract2.allowance(owner.address, this.contract.address)
    // const allowanceFormat = ethers.utils.formatEther(allowance)
    // console.log(allowanceFormat)
  });

  /**
   * 测试合约余额
   */
  it('合约余额测试', async () => {
    const contractBalance = await this.contract.balanceOf(this.owner.address)
    expect(contractBalance.toString()).to.be.equal(ethers.utils.parseEther('1000000000000').toString())
  })

  /**
   * 普通用户向合约发送以太
   */
   it('普通用户向合约发送以太', async () => {
     //构建交易数据
    let txValue = ethers.utils.parseEther('1.3') //本次发送的以太数量
    let tx = { to: this.contract.address, value: txValue }

    //执行交易发送
    console.log("开始发送交易...")
    let sendTxResult = await this.user.sendTransaction(tx)
    console.log("发送交易完成")

    //普通用户的token余额
    const userToken = await this.contract.balanceOf(this.user.address)
    console.log("普通用户Token余额", userToken.toString())

    //拥有者token余额
    const ownerToken = await this.contract.balanceOf(this.owner.address)
    console.log("拥有者token余额", ownerToken.toString())

  
    //获得合约以太余额
    const contractBalance = await this.contract.provider.getBalance(this.contract.address)
    const balanceFormat = ethers.utils.formatEther(contractBalance)
    console.log("当前合约以太余额", balanceFormat)

    expect(1).to.be.equal(1)
  })
})
