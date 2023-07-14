pragma solidity >=0.5.0;

// SPDX-License-Identifier: GPL-3.0-or-later

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}
