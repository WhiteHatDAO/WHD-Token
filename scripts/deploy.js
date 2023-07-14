
const hre = require("hardhat");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  [owner, addr1, addr3, addr4, addr5] = await hre.ethers.getSigners();

  


  let Token = await hre.ethers.getContractFactory("WhiteHatDAOToken");

  Token = await Token.deploy();

  console.log(
    `WhiteHatDAOToken  ${Token.address}`
  );

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

