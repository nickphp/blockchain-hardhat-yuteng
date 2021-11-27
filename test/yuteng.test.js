const { expect } = require('chai') //断言模块 
const { ethers} = require('hardhat') //安全帽模块
const fs = require("fs")


describe('Yuteng合约测试', () => {
  /**
   * 测试执行前的钩子函数
   */
  before(async () => { 
    //获取签名器
    const [deployer,owner, user, one, two] = await ethers.getSigners();
    this.deployer = deployer
    this.owner = owner
    this.user = user
    this.one = one
    this.two = two



    //获取合约工厂对象
    const Contract = await ethers.getContractFactory('Yuteng')
    this.Contract = Contract;

    //部署
    this.contract = await Contract.deploy(owner.address, ethers.utils.parseEther('100000000000'));
    await this.contract.deployed();

    //写合约地址到配置文件
    console.log('合约地址:', this.contract.address)



    //读取授权token余额
    // console.log("读取授权给合约的token余额")
    // const allowance =  await this.contract2.allowance(owner.address, this.contract.address)
    // const allowanceFormat = ethers.utils.formatEther(allowance)
    // console.log(allowanceFormat)
  });

  /**
   * 测试合约余额
   */
  // it('合约余额测试', async () => {
  //   const contractBalance = await this.contract.balanceOf(this.owner.address)
  //   expect(contractBalance.toString()).to.be.equal(ethers.utils.parseEther('1000000000000').toString())
  // })

  /**
   * 普通用户向合约发送以太
   */
   it('普通用户向合约发送以太', async () => {
    //user用户发送以太币到合约
    await this.user.sendTransaction({
      to: this.contract.address, value: ethers.utils.parseEther('10')
    })
    
    //one账号发送以太币到合约
    await this.one.sendTransaction({
      to: this.contract.address, value: ethers.utils.parseEther('25')
    })

    //two账号发送以太币到合约
    // await this.two.sendTransaction({
    //   to: this.contract.address, value: ethers.utils.parseEther('88')
    // })

    //限制兑换
    // const twoContract = new ethers.Contract(this.contract.address, this.Contract.interface, this.two)
    // await twoContract.exchangeToken()

    // //one账户授权6.5个以太给合owner
    // const oneContract = new ethers.Contract(this.contract.address, this.Contract.interface, this.one)
    // await oneContract.approve(this.owner.address, ethers.utils.parseEther('6.5'))

    // //two账户授权15个以太给owner
    // const twoContract = new ethers.Contract(this.contract.address, this.Contract.interface, this.two)
    // await twoContract.approve(this.owner.address, ethers.utils.parseEther('15'))

    // //读取one账户授权给owner的token数
    // const allowanceOne =  await oneContract.allowance(this.one.address, this.owner.address)
    // console.log("one账户授权给合约 %s", allowanceOne.toString())

    // //读取two账户授权给owner的token数
    // const allowanceTwo =  await twoContract.allowance(this.two.address, this.owner.address)
    // console.log("one账户授权给合约 %s", allowanceTwo.toString())

    // const ownerContract = new ethers.Contract(this.contract.address, this.Contract.interface, this.owner)
    // //合约操作one账户的token授权余额，将one用户token转给deployer
    // await ownerContract.transferFrom(this.one.address, this.deployer.address, ethers.utils.parseEther('6.5'))
    
    // //合约操作two账户的token授权余额，将用户token转给deployer
    // await ownerContract.transferFrom(this.two.address, this.deployer.address, ethers.utils.parseEther('12'))

    // //读取two账户授权给owner剩余token数
    // const allowanceTwoSurplus =  await twoContract.allowance(this.two.address, this.owner.address)
    // console.log("one账户剩余授权 %s", allowanceTwoSurplus.toString())

    // //普通用户的token余额
    // const userToken = await this.contract.balanceOf(this.user.address)
    // console.log("user账户的token余额", userToken.toString())

    // //拥有者token余额
    // const ownerToken = await this.contract.balanceOf(this.owner.address)
    // console.log("owner账户的余额", ownerToken.toString())

    //one账户的余额
    const oneToken = await this.contract.balanceOf(this.one.address)
    console.log("one账户的token余额", oneToken.toString())
    
    //two账户的token余额
    const twoToken = await this.contract.balanceOf(this.two.address)
    console.log("two账户的token余额", twoToken.toString())
    
    //deployre账户的token余额
    const deployerToken = await this.contract.balanceOf(this.deployer.address)
    console.log("deployer账户的token余额", deployerToken.toString())

    //合约账户拥有token余额
    const ownerToken = await this.contract.balanceOf(this.contract.address)
    console.log("合约账户的token余额", ownerToken.toString())

    //获得合约的以太余额
    const contractBalance = await this.contract.provider.getBalance(this.contract.address)
    const balanceFormat = ethers.utils.formatEther(contractBalance)
    console.log("当前合约以太余额", balanceFormat)

    expect(1).to.be.equal(1)
  })
})
