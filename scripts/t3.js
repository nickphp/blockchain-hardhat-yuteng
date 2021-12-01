//安全帽模块
const { ethers } = require("hardhat")

//abiDataFormat
const abiDataFormat = (data) => {
    return  '0x' + data.slice(10, data.length)
}

/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
   const [owner] = await ethers.getSigners()
    console.log("开始部署合约...")
    const Contract = await ethers.getContractFactory("T3")
    // const contract = await Contract.deploy();
    // await contract.deployed()
    const ownerContract = new ethers.Contract('0xfC715ff870Af7782945406f27f0f93a71d53446a', Contract.interface, owner)
    const last = await ownerContract.getLatestPrice();
    console.log(ethers.utils.formatUnits(last,8))
  }



//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
