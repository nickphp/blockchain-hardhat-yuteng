//demo.js

//获取当前账号
const Web3 = require("web3")
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")

const main = async () => {
    //获取账号列表
    const [one,two] = await web3.eth.getAccounts()
    console.log(one)

    //console.log(web3.eth.transactionBlockTimeout) //默认区块超时时间单位（秒）

    //用于通过HTTP连接。此选项定义 Web3 将等待确认交易已被网络挖掘的收据的秒数。注意：如果此方法超时，交易可能仍处于挂起状态。
    console.log(web3.eth.transactionPollingTimeout)//事务轮询超时时间单位（秒）

    //在节点中设置的用于挖矿奖励的 coinbase 地址 
    console.log(await web3.eth.getCoinbase())

    //检查节点是否正在挖掘。 true/false
    console.log(await web3.eth.isMining())

    //获取哈希率
    console.log(await web3.eth.getHashrate())

    //获取每秒哈系数
    console.log(await web3.eth.getHashrate())

    //返回gas价格
    console.log(await web3.eth.getGasPrice())

    //返回区块编号
    console.log(await web3.eth.getBlockNumber())

    //获取账号余额(wei)
    console.log(await web3.eth.getBalance(one))

    //获取特定地址的代码
    console.log(await web3.eth.getCode(two))

}

main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})

//执行演示 node demo.js
