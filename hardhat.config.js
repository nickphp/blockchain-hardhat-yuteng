//hardhat项目依赖组件
require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');

/**
 * hardhat配置项
 * 具体更多详情，请参考hardhat官网说明
 */
module.exports = {
  contractName: "YutengV1", //默认第一个版本的合约名称,用于可升级合约部署
  solidity: "0.8.4", //使用的solidity库的版本
  networks: {
    /**
     * 本地hardhat节点
     * 启动节点命令 npx hardhat node
     */
    local: {
      url: 'http://127.0.0.1:8545', //本地RPC地址
      //本地区块链账户地址(每次重启本地节点，账户数据会重置)
      accounts: [
        // 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (第一个账户地址及秘钥)
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        // 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (第二个账户地址及秘钥)
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        // 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (三个账户地址及秘钥)
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
        // 0x90f79bf6eb2c4f870365e785982e1f101e93b906 (第四个个账户地址及秘钥)
        '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
        // 0x15d34aaf54267db7d7c367839aaf71a00a2c6a65 (第五个账户地址及秘钥)
        '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
      ]
    },
    /**
     * 币安智能链测试网络
     * 部署命令 npx hardhat run scripts/[部署文件名].js --network bsc
     * url 币安智能链JSON-RPC接口地址
     * accounts: 钱包秘钥
     */
     bsc: {
      url: "https://data-seed-prebsc-2-s3.binance.org:8545",
      accounts: [
        "23e53579e20a9fb57b9cfcbcce8126c32bb2dc1e3d9472495410a1182161371e",
        "c793779f8793081549035dc4f85a207430de872f578f48359aa6ca8229a35f01"
      ]
    },
    /**
     * gateio测试网 https://explorer.gatechain.io/testnet/
     * 部署命令 npx hardhat run scripts/[部署文件名].js --network gt
     * 通过metamask或者任意生成兼容ETH的工具生成账号和秘钥
     * 这里我使用的是metask不要使用官方提供的客户端工具生成账号，使用那个公钥获得的测试币是无法用的
     * 官方测试RPC地址 http://docs.gatechain.io/integration/rpc-node-list/#meteora
     */
    gt: {
      url: "https://meteora.gatenode.cc:6061",
      accounts: ["f0e1cf693537bbaf46a286d5b545179da5dd29a1b6aaf17e9a17d064b722cf51"],
      chainId: 85 //EVM RPC（链ID：85）
    }
  },
  mocha: {
    timeout: 60000
  }
};

