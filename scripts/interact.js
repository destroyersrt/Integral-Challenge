const hre = require('hardhat');
require('dotenv').config();
const { DEPLOYER_PRIVATE_KEY, INFURA_PROJECT_ID } = process.env;

const provider = new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`)
const signer = new ethers.Wallet(`0x${DEPLOYER_PRIVATE_KEY}`, provider);

const contractJSON = require('../artifacts/contracts/Distributor.sol/Distributor.json');
const daiABI = require('../utils/DAI.json'); 

async function main() {

    const userAddresses = ['0x00B6e16A68Ca04C9539b5952651D50a92a58480F', '0xB116F194179418B24713a6535149eF637fa13325', '0xA8D6C8da89e5EbDA68F475e092b67d21C36654F9']

    const distributorAdd = '0xb2AFEC9376d3694468c7ca860768EA24076b6a36';
    const daiAddress = '0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD';
    const zeroAddress = '0x0000000000000000000000000000000000000000'
    const abi = contractJSON.abi;
    const amount = 100;

    const contractInstance = new ethers.Contract(distributorAdd, abi, signer);
    const daiInstance = new ethers.Contract(daiAddress, daiABI, signer);

    let options = {
        gasLimit: 1000000,
        gasPrice: ethers.utils.parseUnits('4', 'gwei')
    };

    let optionsWithValue = {
        gasLimit: 1000000,
        gasPrice: ethers.utils.parseUnits('4', 'gwei'),
        value: ethers.utils.parseEther("0.001")
    }


    // call to approve
    await daiInstance.approve(
        distributorAdd,
        amount,
        options
    ).then(res=>{
        console.log("here")
        console.log(res);
    }).catch(error=>{
        console.log(error);
    });

    // call to distribute ERC20 token
    await contractInstance.distribute(
        userAddresses,
        true,
        daiAddress,
        amount,
        options    
    ).then(res=>{
        console.log("here")
        console.log(res);
    }).catch(error=>{
        console.log(error);
    });

    // call to distribute ethers
    await contractInstance.distribute(
        userAddresses,
        false,
        zeroAddress,
        0,
        optionsWithValue    
    ).then(res=>{
        console.log("here")
        console.log(res);
    }).catch(error=>{
        console.log(error);
    });

    // call to collect fees
    await contractInstance.collectFees(
        options    
    ).then(res=>{
        console.log("here")
        console.log(res);
    }).catch(error=>{
        console.log(error);
    });


}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  