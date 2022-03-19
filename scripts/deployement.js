const hre = require("hardhat");

async function main() {
  const Distributor = await hre.ethers.getContractFactory("Distributor");
  const distributor = await Distributor.deploy();

  console.log("Distributor deployed to:", distributor.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
