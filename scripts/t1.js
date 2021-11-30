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
    const Contract = await ethers.getContractFactory("SwapToken") //合约
    const address = "0x998abeb3E57409262aE5b751f60747921B33613E" //合约地址
    const ownerContract = new ethers.Contract(address, Contract.interface, owner) //owner连接
    const abiCodeIns = new ethers.utils.AbiCoder(); //abi编码与解码器实例
    
    //解析授权委托调用,授权的数据
    const approve = await ownerContract.approve(address, 50000) //授权给合约token
    const approveDecode = abiCodeIns.decode([ "address", "uint256" ],  abiDataFormat(approve.data)) //低级调用解码
    console.log(approveDecode);

    //解析授权委托调用,获取授权余额 
    const allowance = await ownerContract.allowance(owner.address, address) //授权余额
    const allowanceDecode = abiCodeIns.decode(["address", "address"], abiDataFormat(allowance.data))//低级调动解码
    console.log(allowanceDecode)
}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
