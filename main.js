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

    if (fulldate === `${day}/${month}/${year} 0:0:0`) {


        // get token prices
        let flagPrice = await coingeckoclient.simple.price({
            ids: ['for-loot-and-glory'],
            vs_currencies: ['usd']
        })

        let ethPrice = await coingeckoclient.simple.price({
            ids: ['ethereum'],
            vs_currencies: ['usd']
        })

        // setup token prices
        let nbrflagPrice = flagPrice['data']['for-loot-and-glory']['usd']
        let nbrEthPrice = ethPrice['data']['ethereum']['usd']

        // setup FLAG contract token
        let FLAGtokenContract = new web3.eth.Contract(ERC20ABI, flagAddress)

        // setup LP Token FLAG - MATIC contract
        let LPTokenMaticFlagContract = new web3.eth.Contract(ERC20ABI, LPFlagMaticContract)
        let LPMaticFlagBalance = await FLAGtokenContract.methods.balanceOf(LPFlagMaticContract).call();
        let LPMaticFlagBalanceResult = web3.utils.fromWei(LPMaticFlagBalance, 'ether');

        // get LP Token price
        let LPTokenMaticFlagTotalSupply = await LPTokenMaticFlagContract.methods.totalSupply().call();
        let LPTokenMaticFlagTotalSupplyResult = web3.utils.fromWei(LPTokenMaticFlagTotalSupply, 'ether');
        let LPMaticFlagValue = ((LPMaticFlagBalanceResult * nbrflagPrice) * 2) / LPTokenMaticFlagTotalSupplyResult

        console.log('lp token matic - flag : ' + LPMaticFlagValue + '$')

        // setup LP Token FLAG - WETH contract
        let LPTokenETHFlagContract = new web3.eth.Contract(ERC20ABI, LPFlagEthContract)
        let LPEthFlagBalance = await FLAGtokenContract.methods.balanceOf(LPFlagEthContract).call();
        let LPEthFlagBalanceResult = web3.utils.fromWei(LPEthFlagBalance, 'ether');

        // get LP Token price
        let LPTokenETHFlagTotalSupply = await LPTokenETHFlagContract.methods.totalSupply().call();
        let LPTokenETHFlagTotalSupplyResult = web3.utils.fromWei(LPTokenETHFlagTotalSupply, 'ether');
        let LPEthFlagValue = ((LPEthFlagBalanceResult * nbrflagPrice) * 2 / LPTokenETHFlagTotalSupplyResult)

        console.log('lp token weth - flag : ' + LPEthFlagValue + '$');

        // setup WETH contract token
        let WETHtokenContract = new web3.eth.Contract(ERC20ABI, wethaddress)

        // setup LP Token MATIC - WETH contract
        let LPTokenETHMaticContract = new web3.eth.Contract(ERC20ABI, LPMaticETHContract);
        let LPTokenEthMaticBalance = await WETHtokenContract.methods.balanceOf(LPMaticETHContract).call();
        let LPTokenEthMaticBalanceResult = web3.utils.fromWei(LPTokenEthMaticBalance, 'ether');

        // get LP Token price
        let LPTokenEthMaticTotalSupply = await LPTokenETHMaticContract.methods.totalSupply().call();
        let LPTokenEthMaticTotalSupplyResult = web3.utils.fromWei(LPTokenEthMaticTotalSupply, 'ether');
        let LPEthMaticValue = ((LPTokenEthMaticBalanceResult * nbrEthPrice) * 2 / LPTokenEthMaticTotalSupplyResult)

        console.log('lp token weth - matic : ' + LPEthMaticValue + '$')

        // setup LP token WETH - ZED contract
        let LPTokenETHZEDContract = new web3.eth.Contract(ERC20ABI, LPEthZedContract)

        // get WETH balance in LP WETH - ZED contract
        let LPTokenETHZEDBalance = await WETHtokenContract.methods.balanceOf(LPEthZedContract).call();
        let LPTokenETHZEDBalanceResult = web3.utils.fromWei(LPTokenETHZEDBalance, 'ether');

        // get LP Token price
        let LPTokenETHZEDTotalSupply = await LPTokenETHZEDContract.methods.totalSupply().call()
        let LPTokenETHZEDTotalSupplyResult = web3.utils.fromWei(LPTokenETHZEDTotalSupply, 'ether')
        let LPEthZedValue = ((LPTokenETHZEDBalanceResult * nbrEthPrice) * 2 / LPTokenETHZEDTotalSupplyResult)

        console.log('lp token weth - zed : ' + LPEthZedValue + '$')
    }
}, 1000);