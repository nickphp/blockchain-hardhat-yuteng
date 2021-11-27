//安全帽模块
const { ethers, upgrades  } = require("hardhat")

//文件操作模块,用于写入部署成功的合约地址
const fs = require("fs")

//安全帽配置文件,获取可升级合约名称
const {contractName} = require("../hardhat.config")

//升级合约相关配置
const config = require("../contract.config.json") 

/**
 * 可升级合约主函数
 * @returns 
 */
async function main() {
    /**
     * 为了防止主合约再次被部署 部署成功的合约将不再部署
     * 可将改代码注释强行绕过该控制行为
     */
    if (config.deploy == true) {
        console.log("可升级合约已部署")
        console.log("您是要强制部署可升级合约吗")
        console.log("如果是请将contract.config.js中的deploy设置为false")
        return false
    }

    //获取工厂合约
    const ContractFactory = await ethers.getContractFactory(contractName)
    //正式部署可升级合约
    console.log('可升级合约开始部署...')
    const contract = await upgrades.deployProxy(ContractFactory)

    //等待部署完成
    await contract.deployed()
    console.log('可升级合约部署已完成')
    console.log("可升级合约地址:", contract.address)  

    //部署完成后将合约地址写入配置文件,用于升级合约自动引入代理合约地址
    config.proxyAddress = contract.address 
    config.deploy = true
    fs.writeFileSync('contract.config.json', JSON.stringify(config)) 
    console.log("可升级合约地址已写入文件contract.config.json")
}
  
//可升级合约
main().then(() => process.exit(0)).catch(error => {
    console.error(error)
    process.exit(1)
});