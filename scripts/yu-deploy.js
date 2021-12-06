//安全帽模块
const { ethers} = require("hardhat")

/**
 * 合约主函数
 * @returns 
 */
async function main() {
    //获取签名器
    const [owner] = await ethers.getSigners()

    //获取工厂合约
    const Contract = await ethers.getContractFactory("YuToken")
    
    //等待合约部署
    console.log('合约部署YT...')
    const contract = await Contract.deploy(owner.address, ethers.utils.parseEther('2100000000000'));
    await contract.deployed()
    console.log('合约部署YT已完成')
    console.log('合约地址:', contract.address)
}

//合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})