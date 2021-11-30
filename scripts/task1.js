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

    const Contract = await ethers.getContractFactory("Yuteng")
    console.log('Yuteng合约部署...')
    const contract = await Contract.deploy(owner.address, 21000000, {
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
    const oneContract = new ethers.Contract( contract.address,  Contract.interface, one)

    await oneContract.exchangeToken({value: 1000000}) 
    
    //授权余额
    await oneContract.approve(contractSwapToken.address, 2000)
    const allowance = await oneContract.allowance(one.address, contractSwapToken.address) //授权余额\
    console.log("one approve token", allowance.toString())


    console.log("owner token", (await userContract.balanceOf(owner.address)).toString())
    console.log("user token", (await userContract.balanceOf(user.address)).toString())
    console.log("one token", (await userContract.balanceOf(one.address)).toString())
    console.log("contarct token", (await userContract.balanceOf(contractAddress)).toString())

    // let oneBalance = await contractSwapToken.provider.getBalance(one.address)
    // let oneBalanceFormat = ethers.utils.formatEther(oneBalance)
    // console.log("one账户以太余额", one.address, oneBalanceFormat)

    
    // let ownerBalanceWei = await contractSwapToken.provider.getBalance(owner.address)
    // let ownerBalanceFormat = ethers.utils.formatEther(ownerBalanceWei)
    // console.log("owner账户以太余额", owner.address, ownerBalanceFormat)


    // let userBalanceWei = await contractSwapToken.provider.getBalance(user.address)
    // let userBalanceFormat = ethers.utils.formatEther(userBalanceWei)
    // console.log("user账户以太余额", user.address, userBalanceFormat)
    
      //获得合约的以太余额
    //let contractBalanceYuteng = await contract.provider.getBalance(contract.address)
    // let balanceFormatYuteng = ethers.utils.formatEther(contractBalanceYuteng)
    // console.log("Yuteng合约以太余额", balanceFormatYuteng)

    // let contractBalanceSwapToken = await contractSwapToken.provider.getBalance(contractSwapToken.address)
    // let balanceFormatSwapToken = ethers.utils.formatEther(contractBalanceSwapToken)
    // console.log("SwapToken合约以太余额", balanceFormatSwapToken)



}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
