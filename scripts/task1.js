//安全帽模块
const { ethers } = require("hardhat")


/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
    const [owner, user, one, two] = await ethers.getSigners()

    const Contract = await ethers.getContractFactory("Yuteng")
    console.log('Yuteng合约部署...')
    const contract = await Contract.deploy(owner.address, ethers.utils.parseEther('100000000000'), {
      value: ethers.utils.parseEther('10')
    });
    await contract.deployed()
    console.log('Yuteng合约部署已完成')
    console.log('Yuteng合约地址:', contract.address)


    
    console.log('SwapToken合约部署...')
    const ContractSwapToken = await ethers.getContractFactory("SwapToken")
    const contractSwapToken = await ContractSwapToken.deploy(contract.address, {
        value: ethers.utils.parseEther('50')
      });
    await contractSwapToken.deployed()
    console.log('SwapToken合约部署已完成')
    console.log('SwapToken合约地址:', contractSwapToken.address)
    const contractAddress = contractSwapToken.address
   
    const ownerContract = new ethers.Contract(contractAddress, ContractSwapToken.interface, owner)
    const userContract = new ethers.Contract(contractAddress, ContractSwapToken.interface, user)

    const result = await userContract.exchangeToken({value: ethers.utils.parseEther('100')}) 

    const ownerBalance = await userContract.balanceOf(user.address)
    const userBalance = await userContract.balanceOf(user.address)
    const contractToken = await userContract.balanceOf(contractAddress)
    console.log("owner token", ownerBalance.toString())
    console.log("user token", userBalance.toString())
    console.log("contarct token", contractToken.toString())

      //获得合约的以太余额
    let contractBalanceYuteng = await contract.provider.getBalance(contract.address)
    let balanceFormatYuteng = ethers.utils.formatEther(contractBalanceYuteng)
    console.log("Yuteng合约以太余额", balanceFormatYuteng)

    let contractBalanceSwapToken = await contractSwapToken.provider.getBalance(contractSwapToken.address)
    let balanceFormatSwapToken = ethers.utils.formatEther(contractBalanceSwapToken)
    console.log("SwapToken合约以太余额", balanceFormatSwapToken)
}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
