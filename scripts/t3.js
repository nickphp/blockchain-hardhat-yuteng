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


  const ethUsdAddress = '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7'
  const usdtUsdAddress = '0xEca2605f0BCF2BA5966372C99837b1F182d3D620'

   const [owner] = await ethers.getSigners()
   const Contract = await ethers.getContractFactory("T3")


    console.log("开始部署ETH/USD")
    const contract = await Contract.deploy(ethUsdAddress);
    await contract.deployed()
    const address = contract.address;
    console.log(contract.address)

    console.log("开始部署USDT/USD")
    const contract2 = await Contract.deploy(usdtUsdAddress);
    await contract2.deployed()
    const address2 = contract2.address;
    console.log(contract2.address)
    return false

    const ownerContract = new ethers.Contract('0xe128E08fDFD03760Ea22b4c2a4a3fA2c1a76C0DC', Contract.interface, owner)
    const [a, b ,c ,d ,e] = await ownerContract.getLatestPrice();
    console.log("ETH/USD 兑换比例", ethers.utils.formatUnits(b,8))
    const ownerContract2 = new ethers.Contract('0x21C3c284E08eEf25265720207ac3Ed39Ce2bD8fD', Contract.interface, owner)
    const [a2, b2 ,c2,d2 ,e2] = await ownerContract2.getLatestPrice();
    console.log("USDT/USD 兑换比例", ethers.utils.formatUnits(b2,8))
    const usdtAmount = 10000 / parseFloat(ethers.utils.formatUnits(b2,8));
    console.log("10000枚USDT可以兑换USD", usdtAmount)

    const ethFloat = parseFloat(ethers.utils.formatUnits(b2,8)) * usdtAmount / parseFloat(ethers.utils.formatUnits(b,8))
    console.log(usdtAmount +"USD可以兑换的ETH额度为", ethFloat)
    console.log("转换成以太坊单位(wei)数量为", ethers.utils.parseEther(ethFloat.toString()).toString())
 }



//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
