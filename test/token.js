const { balance } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
describe("Token:", function () {
    before(async () => {
        [owner, addr1, addr3, addr4, addr5] = await ethers.getSigners();

        UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        Factory = await UniswapV2Factory.deploy(owner.address);
        await Factory.deployed();

        WETH9 = await ethers.getContractFactory("Weth");
        WETH = await WETH9.deploy();
        await WETH.deployed();
        UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
        Router = await UniswapV2Router02.deploy(Factory.address, WETH.address);
        await Router.deployed();

        Token = await ethers.getContractFactory("WhiteHatDAOToken");
        Token = await Token.deploy();
        expect(await Token.balanceOf(owner.address)).to.equal('1000000000000000000');

        // await Factory.createPair(Token.address, WETH.address);
        await Token.approve(Router.address, 1000000);
        await WETH.approve(Router.address, 1000000);
        await Router.addLiquidity(Token.address, WETH.address, 1000000, 1000000, 0, 0, owner.address, 2540723465);
    })

    it("Name:", async () => {
        expect(await Token.name()).to.equal("White Hat DAO Token");
    })

    it("Symbol:", async () => {
        expect(await Token.symbol()).to.equal("WHDT");
    })

    it("ownerBalance:", async () => {
        expect(await Token.balanceOf(owner.address)).to.equal('999999999999000000');
    })

    it("decimals", async () => {
        expect(await Token.decimals()).to.equal(10);
    })
    
    it("should transfer properly", async () => {
        const beforeBalance = await Token.balanceOf(owner.address)
        await Token.transfer(addr1.address, 10000);
        await sleep(5000);

        expect(await Token.balanceOf(addr1.address)).to.equal(10000)
        expect(await Token.balanceOf(owner.address)).to.equal(BigInt(beforeBalance) - BigInt(10000))
    })

    it("admin can add uniswap pair of the token", async () => {
        const pairAddress = await Factory.getPair(Token.address, WETH.address);
        await Token.addLiquidityPairAddress(pairAddress)
        expect(await Token.liquidityPair(pairAddress)).to.equal(true);
    })

    it("only admin can uniswap pair of the token", async () => {
        const pairAddress = await Factory.getPair(Token.address, WETH.address);        
        await expect(Token.connect(addr1).addLiquidityPairAddress(pairAddress)).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("admin can blacklist a user", async () => {
        await Token.restrictUser([addr5.address]);
        await expect(Token.transfer(addr5.address, 100000)).to.be.revertedWith("You are restricted for transfer");
    })
    it("admin can remove user from blacklist", async () => {
        await Token.removeFromRestrictedUser([addr5.address]);
        await Token.transfer(addr5.address, 100);
    })

    it("only owner can set buy sell percentage", async () => {
        await expect(Token.connect(addr1).setSellTax(20)).to.be.revertedWith("Ownable: caller is not the owner");
        await expect(Token.connect(addr1).setBuyTax(20)).to.be.revertedWith("Ownable: caller is not the owner");

    })

    it("tax should not more than 10 percent", async () => {
        await expect(Token.connect(owner).setSellTax(1001)).to.be.revertedWith("Limit exceed(can not set more than 10 percent)");
        await expect(Token.connect(owner).setBuyTax(1001)).to.be.revertedWith("Limit exceed(can not set more than 10 percent)");

    })
   
    it("admin should set Buy percentage", async () => {
        await Token.setBuyTax(75);
        expect(await Token.buyTax()).to.equal(75)
    })

    it("admin should set sell percentage", async () => {
        await Token.setSellTax(50);
        expect(await Token.sellTax()).to.equal(50)
    })

    it("Tax should not cut for the owner to sell token", async () => {
        await Token.approve(Router.address, 100000);
        const outAmount = await Router.getAmountsOut(100000, [Token.address, WETH.address]);
        const ownerBeforeWethBalance = await WETH.balanceOf(owner.address);
        await Router.swapExactTokensForTokens(100000, 0, [Token.address, WETH.address], owner.address, 2540723465);
        expect(await WETH.balanceOf(owner.address)).to.equal(BigInt(ownerBeforeWethBalance) + BigInt(outAmount[1]))
    })
   

    it("Tax should cut for the other users to sell token ", async () => {
        await Token.transfer(addr3.address, 1000000);
        await Token.connect(addr3).approve(Router.address, 1000000);
        const afterTaxAmountShouldOut = 1000000 - (1000000 * 0.5 / 100);
        const outAmount = await Router.getAmountsOut(afterTaxAmountShouldOut, [Token.address, WETH.address]);
        const ownerBeforeWethBalance = await WETH.balanceOf(addr3.address);
        await Router.connect(addr3).swapExactTokensForTokensSupportingFeeOnTransferTokens(1000000, 0, [Token.address, WETH.address], addr3.address, 2540723465);        
        expect(await WETH.balanceOf(addr3.address)).to.equal(BigInt(ownerBeforeWethBalance) + BigInt(outAmount[1]))
    })

    it("admin should set sell percentage", async () => {
        await Token.setSellTax(0);
        expect(await Token.sellTax()).to.equal(0)
    })

    it("Tax should cut for the other users  because its zero now", async () => {
        await Token.transfer(addr3.address, 1000000);
        await Token.connect(addr3).approve(Router.address, 1000000);
        const outAmount = await Router.getAmountsOut(1000000, [Token.address, WETH.address]);
        const ownerBeforeWethBalance = await WETH.balanceOf(addr3.address);
        await Router.connect(addr3).swapExactTokensForTokensSupportingFeeOnTransferTokens(1000000, 0, [Token.address, WETH.address], addr3.address, 2540723465);        
        expect(await WETH.balanceOf(addr3.address)).to.equal(BigInt(ownerBeforeWethBalance) + BigInt(outAmount[1]))
    }) 

    it("Tax should not cut for the owner to Buy token", async () => {
        await WETH.approve(Router.address, 100000);
        const outAmount = await Router.getAmountsOut(100000, [WETH.address, Token.address]);
        const ownerBeforeWethBalance = await Token.balanceOf(owner.address);
        await Router.swapExactTokensForTokens(100000, 0, [WETH.address, Token.address], owner.address, 2540723465);
        expect(await Token.balanceOf(owner.address)).to.equal(BigInt(ownerBeforeWethBalance) + BigInt(outAmount[1]))
    })

    it("Tax should  cut for the other users to Buy token ", async () => {
        await WETH.transfer(addr4.address, 100000);
        await WETH.connect(addr4).approve(Router.address, 100000);
        const outAmount = await Router.getAmountsOut(100000, [WETH.address, Token.address]);
        const afterTaxAmountShouldOut = outAmount[1] - (Math.floor(outAmount[1] * 0.75 / 100));
        await Router.connect(addr4).swapExactTokensForTokensSupportingFeeOnTransferTokens(100000, 0, [WETH.address, Token.address], addr4.address, 2540723465);        
        expect(await Token.balanceOf(addr4.address)).to.equal(afterTaxAmountShouldOut);
    })

    it("admin can exclude user from fees", async () => {
        await Token.excludeFromFee([addr4.address]);
        expect(await Token.isExcludedFromFee(addr4.address)).to.be.equal(true)
    })

    it("Tax should  cut for the excluded users to Buy token ", async () => {
        await WETH.transfer(addr4.address, 100000);
        await WETH.connect(addr4).approve(Router.address, 100000);
        const outAmount = await Router.getAmountsOut(100000, [WETH.address, Token.address]);
        const beforeTokenBalance = await Token.balanceOf(addr4.address)
        await Router.connect(addr4).swapExactTokensForTokensSupportingFeeOnTransferTokens(100000, 0, [WETH.address, Token.address], addr4.address, 2540723465);       
        expect(await Token.balanceOf(addr4.address)).to.equal(BigInt(beforeTokenBalance) + BigInt(outAmount[1]));
    })

    it("admin can include user for fees", async () => {
        await Token.includeInFee([addr4.address]);
        expect(await Token.isExcludedFromFee(addr4.address)).to.be.equal(false)
    })

    it("Tax should  cut for the other users to Buy token ", async () => {
        await WETH.transfer(addr4.address, 100000);
        await WETH.connect(addr4).approve(Router.address, 100000);
        const outAmount = await Router.getAmountsOut(100000, [WETH.address, Token.address]);
        const afterTaxAmountShouldOut = outAmount[1] - (Math.floor(outAmount[1] * 0.75 / 100));
        const beforeTokenBalance = await Token.balanceOf(addr4.address)
        await Router.connect(addr4).swapExactTokensForTokensSupportingFeeOnTransferTokens(100000, 0, [WETH.address, Token.address], addr4.address, 2540723465);       
        expect(await Token.balanceOf(addr4.address)).to.equal(BigInt(beforeTokenBalance) + BigInt(afterTaxAmountShouldOut));
    })
})


