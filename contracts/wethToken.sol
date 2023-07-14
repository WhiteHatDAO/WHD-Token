// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract Weth is ERC20, ERC20Permit {
    constructor()
        ERC20("MyToken", "MTK")
        ERC20Permit("Busd")
    {

        _mint(msg.sender, 1000000*10**18);
    }
}