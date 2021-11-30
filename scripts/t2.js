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
    const [owner, user, one, two] = await ethers.getSigners()

    const ContractYuteng = await ethers.getContractFactory("Yuteng")
    const ContractSwapToken = await ethers.getContractFactory("SwapToken")

    const contractYuteng = await ContractYuteng.deploy(owner.address, 21000000, {
      value: ethers.utils.parseEther('10')
    });
    await contractYuteng.deployed()
    const YutengAddress = contractYuteng.address


    const contractSwapToken = await ContractSwapToken.deploy();
    await contractSwapToken.deployed()
    const swapTokenAddress = contractSwapToken.address

    console.log('Yuteng合约地址', YutengAddress)
    console.log('SwapToken合约地址:', swapTokenAddress)


    //第一步授权余额
    const ownerContract = new ethers.Contract(YutengAddress, ContractYuteng.interface, owner)
    const result = await ownerContract.approve(swapTokenAddress, 2000)
  
    //第二步合约转账
    const ownerContract2 = new ethers.Contract(swapTokenAddress, ContractSwapToken.interface, user)
    await ownerContract2.transferFrom(YutengAddress, owner.address, two.address, 1000)

     //获得合约的以太余额
    let contractBalanceYuteng = await contractYuteng.provider.getBalance(YutengAddress)
    let balanceFormatYuteng = ethers.utils.formatEther(contractBalanceYuteng)
    console.log("Yuteng合约以太余额", balanceFormatYuteng)

    let contractBalanceSwapToken = await contractSwapToken.provider.getBalance(contractSwapToken.address)
    let balanceFormatSwapToken = ethers.utils.formatEther(contractBalanceSwapToken)
    console.log("SwapToken合约以太余额", balanceFormatSwapToken)

    let userBalanceWei = await contractSwapToken.provider.getBalance(user.address)
    let userBalanceFormat = ethers.utils.formatEther(userBalanceWei)
    console.log("user账户以太余额", user.address, userBalanceFormat)

}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
