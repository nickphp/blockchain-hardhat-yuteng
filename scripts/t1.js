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
    const [owner] = await ethers.getSigners() //获得签名
    const Contract = await ethers.getContractFactory("Yuteng") //合约
    const address = "0xdF46e54aAadC1d55198A4a8b4674D7a4c927097A" //合约地址
    
    const ownerContract = new ethers.Contract(address, Contract.interface, owner) //owner连接

    
    //解析授权委托调用,授权的数据
    const allowance = await ownerContract.allowance(owner.address, "0xf5c4a909455C00B99A90d93b48736F3196DB5621")
    console.log(allowance.toString());

}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
