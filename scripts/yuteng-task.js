//安全帽模块
const { ethers } = require("hardhat")


/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
    const [owner, user] = await ethers.getSigners()
    const Contract = await ethers.getContractFactory('Yuteng')
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    const ownerContract = new ethers.Contract(contractAddress, Contract.interface, owner)
    const userContract = new ethers.Contract(contractAddress, Contract.interface, user)


    const result = await ownerContract.transferFrom(owner.address, user.address, 400000)
    // const result2 = await result.wait()

   

    const ownerBalance = await userContract.balanceOf(user.address)
    const userBalance = await userContract.balanceOf(user.address)
    const contractToken = await userContract.balanceOf(contractAddress)
    console.log("owner token", ownerBalance.toString())
    console.log("user token", userBalance.toString())
    console.log("contarct token", contractToken.toString())
   
       // //调用转账函数
       //await ownerContract.transferToContract(2300800)
      //  await userContract.transferToContractTest(owner.address, user.address, 400000)
   
   
      //  const ownerBalance = await ownerContract.balanceOf(owner.address)
      //  const userBalance = await ownerContract.balanceOf(user.address)
      //  const contarctBalance = await ownerContract.balanceOf(contract.address)
      //  console.log("owner token", ownerBalance.toString())
      //  console.log("user token", userBalance.toString())
      //  console.log("contarct token", contarctBalance.toString())
   //}

    // const userBalance = await ownerContract.balanceOf(user.address)
    // const contarctBalance = await ownerContract.balanceOf(contractAddress)
    // console.log("owner token", ownerBalance.toString())
    // console.log("user token", userBalance.toString())
    // console.log("contarct token", contarctBalance.toString())

    // //合约账户拥有token余额
    // const contractToken = await ownerContract.balanceOf(contractAddress)
    // console.log("合约账户的token余额", contractToken.toString())

    //获得合约的以太余额
    // const contractBalance = await ownerContract.provider.getBalance(contractAddress)
    // const balanceFormat = ethers.utils.formatEther(contractBalance)
    // console.log("合约账户的以太余额", balanceFormat)

    //owner账户授权3个以太给owner
    //await ownerContract.approve('0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc', ethers.utils.parseEther('2.66'))

    // const allowanceUserSurplus =  await ownerContract.allowance(owner.address, '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc')
    // console.log("user账户剩余授权 %s", allowanceUserSurplus.toString())
}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
