const { expect } = require('chai') //断言模块 
const { ethers} = require('hardhat') //安全帽模块

//安全帽配置文件,获取可升级合约名称
const {contractName} = require("../hardhat.config")

//合约地址
const {proxyAddress} = require("../contract.config.json") 

describe('YutengV1合约测试', () => {
  /**
   * 测试执行前的钩子函数
   */
  before(async () => { 
    //获取签名器
    const [owner] = await ethers.getSigners();

    //获取合约工厂对象
    const Contract = await ethers.getContractFactory(contractName)

    //合约实例
    this.contract = new ethers.Contract(proxyAddress, Contract.interface, owner)
  });

  /**
   * 获取score状态测试
   */
  it('测试score等于0', async () => {
    const score = await this.contract.score()
    expect(score.toString()).to.be.equal('0')
  })

  /**
   * 修改score状态测试
   * 这条测试将通过不过,因为setScore方法不存在
   */
  it('修改score等于100', async () => {
    await this.contract.setScore(100)
    const score = await this.contract.score()
    expect(score.toString()).to.be.equal('100')
  })
})
