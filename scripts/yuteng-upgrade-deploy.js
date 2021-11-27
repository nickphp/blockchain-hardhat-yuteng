//安全帽模块
const { ethers, upgrades  } = require("hardhat")

//升级合约相关配置
const config = require('../contract.config.json')

/**
 * 升级合约主函数
 * @returns 
 */
async function main() {

    //升级的合约名称
    const upgradeContractName = config.upgradeContract 

    //代理合约地址
    const proxyContractAddress = config.proxyAddress

    //获取工厂合约
    const contractUpgrade = await ethers.getContractFactory(upgradeContractName)
    
    //等待合约升级部署
    console.log('合约升级...')
    await upgrades.upgradeProxy(proxyContractAddress, contractUpgrade)
    console.log('合约升级已完成')
    console.log('升级合约名称:', upgradeContractName)
    console.log('代理合约地址:', proxyContractAddress)
    
}

//升级合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})