// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
contract T4 {

    uint age;
    constructor() {
        age = 18;
    }

    function getCuurentAge() public view returns (uint) {
        return age;
    }
}
