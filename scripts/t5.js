//安全帽模块
const { ethers } = require("hardhat")

/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
  //获得第一个签名器和第二个签名器
  const [one,two] = await ethers.getSigners()

  //获取当前区块高度
  console.log(await one.provider.getBlockNumber())
  
  //获取账户余额
  const balance = await one.provider.getBalance(one.address)
  console.log(balance.toString()) //显示(wei)
  console.log(ethers.utils.formatEther(balance)) //显示eth

  //eth转换wei
  console.log(ethers.utils.parseEther("1.25").toString())

  // 向two地址发送2个以太币。等待确认 再次查看以太余额
  const tx = await one.sendTransaction({ to: two.address, value: ethers.utils.parseEther("2.0") })
  await tx.wait()
  console.log(ethers.utils.formatEther(await one.provider.getBalance(one.address)))
  
  //usdt合约地址
  const usdtAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

  // ERC-20通用合约ABI接口
  const usdtAbi = [
    //代币名称
    "function name() view returns (string) ", 
    //代币符号
    "function symbol() view returns (string)",
    // 获取账户余额
    "function balanceOf(address) view returns (uint)",
    // 将你的一些代币发送给其他人
    "function transfer(address to, uint amount)",
    //代币交易事件
    "event Transfer(address indexed from, address indexed to, uint256 value)",
  ]

  // 合约对象
  const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, one.provider)

  //当任何转账发生时接收一个事件
  usdtContract.on("Transfer", (from, to, amount, event) => { 
    console.log(`${from} sent ${amount}wei to ${to}`)
    //console.log(event)
  })

  //过滤器 监听指定账户接收代币交易事件
  filterTo = usdtContract.filters.Transfer(null, two.address)
  filterFrom = usdtContract.filters.Transfer(one.address, null)
  usdtContract.on(filterTo, (from, to, amount, event) => { 
    console.log(`I got ${amount}wei from ${from}`)
  })

  //过滤器 查询指定from最后10个发送交易快
  const filterFromHis = await usdtContract.queryFilter(filterFrom, -10)
  // console.log(filterFromHis)

  //过滤器 查询指定to最后2个接收交易快
  const filterToAll = await usdtContract.queryFilter(filterTo, -2)
  //console.log(filterToAll)


  console.log(await usdtContract.name()) //代币名称
  console.log(await usdtContract.symbol()) //代币符号
  console.log((await usdtContract.balanceOf(one.address)).toString()) //代币余额 one账户
  console.log((await usdtContract.balanceOf(two.address)).toString()) //代币余额 two账户
  
  //one账户转账到two账户 连接到one签名器发送交易 检查one和two账户代币余额
  const usdtWithSigner = usdtContract.connect(one);
  const tx1 = await usdtWithSigner.transfer(two.address, 500)
  await tx1.wait()
  console.log((await usdtContract.balanceOf(one.address)).toString()) //代币余额 one账户
  console.log((await usdtContract.balanceOf(two.address)).toString()) //代币余额 two账户


  //使用签名器对字符串进行签名
  const signatureMessage = await one.signMessage("USDT NB PLUS");
  console.log(signatureMessage)

  //使用字节数组签名
  const messageBytes = ethers.utils.toUtf8Bytes("USDT NB PLUS")
  const signatureBytes = await one.signMessage(messageBytes)
  console.log(signatureBytes)


  //二进制数据进行签名
  const messageBytes2 = ethers.utils.arrayify('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
  const signatureBytes2 = await one.signMessage(messageBytes2)
  console.log(signatureBytes2)

}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
