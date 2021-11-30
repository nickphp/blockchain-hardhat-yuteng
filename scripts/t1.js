//安全帽模块
const { ethers } = require("hardhat")


/**
 * 部署合约主函数
 * @returns 
 */
async function main() {
    const [owner] = await ethers.getSigners()
    const Contract = await ethers.getContractFactory("SwapToken")
    const address = "0xcE0066b1008237625dDDBE4a751827de037E53D2"
    const ownerContract = new ethers.Contract(address, Contract.interface, owner)
    const result = await ownerContract.approve(address, ethers.utils.parseEther('1.355'))
   
    // const result5555 = await ownerContract.allowance(owner.address, address)


    // console.log(ethers.utils.RLP.decode(result.data))
    // let decoded = ethers.utils.RLP.decode(result);
    const AbiCoder = ethers.utils.AbiCoder;
    const ADDRESS_PREFIX_REGEX = /^(41)/;
    const ADDRESS_PREFIX = "41";

    async function decodeParams(types, output, ignoreMethodHash) {

        if (!output || typeof output === 'boolean') {
            ignoreMethodHash = output;
            output = types;
        }
    
        if (ignoreMethodHash && output.replace(/^0x/, '').length % 64 === 8)
            output = '0x' + output.replace(/^0x/, '').substring(8);
    
        const abiCoder = new AbiCoder();
    
        if (output.replace(/^0x/, '').length % 64)
            throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
        return abiCoder.decode(types, output).reduce((obj, arg, index) => {
            if (types[index] == 'address')
                arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
            obj.push(arg);
            return obj;
        }, []);
    }

    const result33 = await decodeParams([ "address", "uint256" ],  result.data, true)
    console.log(result33);



}

//普通合约部署执行
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
