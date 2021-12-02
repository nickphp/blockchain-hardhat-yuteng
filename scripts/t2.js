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
    const [owner, user] = await ethers.getSigners()

    console.log("开始部署USDT合约...")
    const ContractUsdt = await ethers.getContractFactory("Usdt")
    const contractUsdt = await ContractUsdt.deploy(owner.address, 1000000000);
    await contractUsdt.deployed()
    const usdtAddress = contractUsdt.address
    console.log('Usdt合约地址:', usdtAddress)

    return false

    console.log("开始部署YTC合约...")
    const ContractYuteng = await ethers.getContractFactory("Yuteng")
    const ContractSwapToken = await ethers.getContractFactory("SwapToken")
    const contractYuteng = await ContractYuteng.deploy(owner.address, 21000000);
    await contractYuteng.deployed()
    const YutengAddress = contractYuteng.address
    console.log('Yuteng合约地址', YutengAddress)

    console.log("开始部署SwapToken合约...")
    const contractSwapToken = await ContractSwapToken.deploy(owner.address, [
      YutengAddress,usdtAddress
    ],  {
      value: ethers.utils.parseEther('0.1')
    });
    await contractSwapToken.deployed()
    const swapTokenAddress = contractSwapToken.address
    console.log('SwapToken合约地址:', swapTokenAddress)

    //添加新合约
    // const ownerContract = new ethers.Contract(swapTokenAddress, ContractSwapToken.interface, owner)
    // const result = await ownerContract.saveContract(YutengAddress, false)


    //第一步授权给合约token(在用户UI界面调用授权)
    const ownerContract = new ethers.Contract(YutengAddress, ContractYuteng.interface, owner)
    const result1 = await ownerContract.approve(swapTokenAddress, 1000000) //授权合约100万ytc token
    console.log("owner开始授权交换合约YTC 1000000枚...")
    await result1.wait()

    console.log("user开始授权交换合约USDT 100000枚...")
    const userContractUsdt = new ethers.Contract(usdtAddress, ContractUsdt.interface, user)
    const result2 = await userContractUsdt.approve(swapTokenAddress, 100000) //授权合约10万usdt token
    await result2.wait()

    //兑换token为ETH 首先必须完成第一步已授权合约
    const ownerContract2 = new ethers.Contract(swapTokenAddress, ContractSwapToken.interface, owner)
    //await ownerContract2.saveContract(YutengAddress, true) //合约保存
    //await ownerContract2.tokenToEth(YutengAddress, 820000); //换eth
    // await ownerContract2.ethToToken(YutengAddress, 1000); //换token

    const userContractUsdt3 = new ethers.Contract(swapTokenAddress, ContractSwapToken.interface, user)
    //await userContractUsdt3.tokenToEth(usdtAddress, 60000); //换eth

    //token交换 YTC兑换usdt 兑换角色为onwer 10000个币兑换成1000
    console.log("开始交换token...")
    const result3 = await ownerContract2.tokenToToken(YutengAddress, 10000, usdtAddress, 1000, user.address); //换eth
    await result3.wait()

    //查看owner账户剩余授权
    const allowance = await ownerContract.allowance(owner.address, swapTokenAddress)
    console.log("owner授权"+swapTokenAddress+"剩余授权YTC token", allowance.toString());

    const allowance2 = await userContractUsdt.allowance(user.address, swapTokenAddress)
    console.log("user授权"+swapTokenAddress+"剩余授权USDT token", allowance2.toString());

    //token兑换成eth

     //获得合约的以太余额
    let contractBalanceYuteng = await contractYuteng.provider.getBalance(YutengAddress)
    let balanceFormatYuteng = ethers.utils.formatEther(contractBalanceYuteng)
    console.log("Yuteng合约以太余额", balanceFormatYuteng)

    let contractBalanceSwapToken = await contractSwapToken.provider.getBalance(contractSwapToken.address)
    let balanceFormatSwapToken = ethers.utils.formatEther(contractBalanceSwapToken)
    console.log("SwapToken合约以太余额", balanceFormatSwapToken)

    let ownerBalance = await contractYuteng.provider.getBalance(owner.address)
    let ownerBalanceFormat = ethers.utils.formatEther(ownerBalance)
    console.log("owner账户以太余额", ownerBalanceFormat)


      //user账户的token余额
      const userToken = await contractYuteng.balanceOf(user.address)
      console.log("user账户的YTC token余额", userToken.toString())
  
      //拥有者token余额
      const ownerToken = await contractYuteng.balanceOf(owner.address)
      console.log("owner账户的YTC token余额", ownerToken.toString())
  
      // //one账户的余额
      // const oneToken = await contractYuteng.balanceOf(one.address)
      // console.log("one账户的YTC token余额", oneToken.toString())
      
      // //two账户的token余额
      // const twoToken = await contractYuteng.balanceOf(two.address)
      // console.log("two账户的YTC token余额", twoToken.toString())

      //合约账户的token余额
      const contractToken = await contractYuteng.balanceOf(swapTokenAddress)
      console.log("合约账户的YTC token余额", contractToken.toString())

      const contractToken22 = await contractUsdt.balanceOf(swapTokenAddress)
      console.log("合约账户的USDT token余额", contractToken22.toString())

      const contractToken33 = await contractUsdt.balanceOf(owner.address)
      console.log("owner账户的USDT token余额", contractToken33.toString())


  
//   const provider = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/<infura_project_id>")
//   const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
//   const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331"
//   const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider)
//   const roundData = await priceFeed.latestRoundData()

// console.log(roundData)

  }



//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
