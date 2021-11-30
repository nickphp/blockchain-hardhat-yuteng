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
    
    //授权余额
    const ownerResult = await ownerContract.approve(contractSwapToken.address, ethers.utils.parseEther('1.355'))
//    await ownerContract.transferToContract(ethers.utils.parseEther('1.355'))
//     await ownerContract.transferFrom(ethers.utils.parseEther('1.355'))
//     console.log("查询owner授权余额", callResult2.toString())
console.log((await ownerContract.allowance(owner.address, contract.address)).toString())

    const ownerBalance = await userContract.balanceOf(owner.address)
    const userBalance = await userContract.balanceOf(user.address)
    const contractToken = await userContract.balanceOf(contractAddress)

    console.log("owner token", ownerBalance.toString())
    console.log("user token", userBalance.toString())
    console.log("contarct token", contractToken.toString())

    let oneBalance = await contractSwapToken.provider.getBalance(one.address)
    let oneBalanceFormat = ethers.utils.formatEther(oneBalance)
    console.log("one账户以太余额", one.address, oneBalanceFormat)

    
    let ownerBalanceWei = await contractSwapToken.provider.getBalance(owner.address)
    let ownerBalanceFormat = ethers.utils.formatEther(ownerBalanceWei)
    console.log("owner账户以太余额", owner.address, ownerBalanceFormat)


    let userBalanceWei = await contractSwapToken.provider.getBalance(user.address)
    let userBalanceFormat = ethers.utils.formatEther(userBalanceWei)
    console.log("user账户以太余额", user.address, userBalanceFormat)
    
      //获得合约的以太余额
    let contractBalanceYuteng = await contract.provider.getBalance(contract.address)
    let balanceFormatYuteng = ethers.utils.formatEther(contractBalanceYuteng)
    console.log("Yuteng合约以太余额", balanceFormatYuteng)

    let contractBalanceSwapToken = await contractSwapToken.provider.getBalance(contractSwapToken.address)
    let balanceFormatSwapToken = ethers.utils.formatEther(contractBalanceSwapToken)
    console.log("SwapToken合约以太余额", balanceFormatSwapToken)

    const result3 = await ownerContract.test()
    console.log("msg.sender上下文地址", result3.toString())


}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
