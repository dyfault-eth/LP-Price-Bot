const Web3 = require('web3');
const web3 = new Web3('https://polygon-bor.publicnode.com');
const coingecko = require('coingecko-api');
const coingeckoclient = new coingecko();
const ERC20ABI = require('./ABI/ERC20ABI.json');

const wethaddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
const flagAddress = "0x9111d6446ac5b88a84cf06425c6286658368542f"
const LPFlagMaticContract = "0xcFe88814f8ef4BcEFeB4483046B7229511E8AA06"
const LPFlagEthContract = "0x30D50b36bE1Fe4BD1D78553F77937cAaBad37F7f"
const LPMaticETHContract = "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E"
const LPEthZedContract = "0x374552804F7CA26C307c8D31f4cC0d9215C87f46"

setInterval(async function() {

    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    let fulldate = `${day}/${month}/${year} ${hour}:${minute}:${second}`

    if (fulldate === `${day}/${month}/${year} 18:25:0`) {


        // get prices
        let maticPrice = await coingeckoclient.simple.price({
            ids: ['matic-network'],
            vs_currencies: ['usd']
        })

        let flagPrice = await coingeckoclient.simple.price({
            ids: ['for-loot-and-glory'],
            vs_currencies: ['usd']
        })

        let ethPrice = await coingeckoclient.simple.price({
            ids: ['ethereum'],
            vs_currencies: ['usd']
        })

        let nbrflagPrice = flagPrice['data']['for-loot-and-glory']['usd']
        let nbrEthPrice = ethPrice['data']['ethereum']['usd']
        let nbrMaticPrice = maticPrice['data']['matic-network']['usd']

        let FLAGtokenContract = new web3.eth.Contract(ERC20ABI, flagAddress)
        let LPTokenMaticFlagContract = new web3.eth.Contract(ERC20ABI, LPFlagMaticContract)
        let LPMaticFlagBalance = await FLAGtokenContract.methods.balanceOf(LPFlagMaticContract).call();
        let LPMaticFlagBalanceResult = web3.utils.fromWei(LPMaticFlagBalance, 'ether');

        let LPTokenMaticFlagTotalSupply = await LPTokenMaticFlagContract.methods.totalSupply().call();
        let LPTokenMaticFlagTotalSupplyResult = web3.utils.fromWei(LPTokenMaticFlagTotalSupply, 'ether');
        let LPMaticFlagValue = ((LPMaticFlagBalanceResult * nbrflagPrice) * 2) / LPTokenMaticFlagTotalSupplyResult

        console.log(LPMaticFlagValue)
    }
}, 1000);