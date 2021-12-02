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
  const Contract = await ethers.getContractFactory("T4")
  console.log("开始部署T4")
  const contract = await Contract.deploy();
  await contract.deployed()
  console.log(contract.address)
}



//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
