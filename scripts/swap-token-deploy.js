//安全帽模块
const { ethers } = require("hardhat")


/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
    //钱包
    const [owner, user] = await ethers.getSigners();

    //获取工厂合约
    const Contract = await ethers.getContractFactory("SwapToken")
    
    //等待合约部署
    console.log('合约部署...')
    const contract = await Contract.deploy('0x5FbDB2315678afecb367f032d93F642f64180aa3', {
        value: ethers.utils.parseEther('5.65')
      });
    await contract.deployed()
    console.log('合约部署已完成')
    console.log('合约地址:', contract.address)

    //获得合约的以太余额
    const contractBalance = await contract.provider.getBalance(contract.address)
    const balanceFormat = ethers.utils.formatEther(contractBalance)
    console.log("合约账户的以太余额", balanceFormat)

    //授权给账户owner授权给0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc地址22888000个token
    const ownerContract = new ethers.Contract(contract.address, Contract.interface, owner)
    //await ownerContract.exchangeToken({value: ethers.utils.parseEther('20')})


    // const result1 = await ownerContract.approve(ethers.utils.parseEther('2.8345'))

    const userContract = new ethers.Contract(contract.address, Contract.interface, user)
    // const userResult = await userContract.approve(ethers.utils.parseEther('555'))


    const result2 = await ownerContract.allowance()
    console.log("owner授权余额", result2.toString())

    const result4 = await userContract.allowance()
    console.log("user授权余额", result4.toString())

    const result3 = await ownerContract.test()
    console.log("msg.sender地址", result3.toString())
    console.log("授权人地址", owner.address)

    // // //调用转账函数
    //await ownerContract.transferToContract(2300800)
    await userContract.transferToContractTest(owner.address, user.address, 400000)


    const ownerBalance = await ownerContract.balanceOf(owner.address)
    const userBalance = await ownerContract.balanceOf(user.address)
    const contarctBalance = await ownerContract.balanceOf(contract.address)
    console.log("owner token", ownerBalance.toString())
    console.log("user token", userBalance.toString())
    console.log("contarct token", contarctBalance.toString())
}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})