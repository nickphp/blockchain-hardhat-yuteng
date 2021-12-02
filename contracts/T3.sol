// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "hardhat/console.sol";

contract T3 {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD
     * Address: 0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7
     */
    constructor(address addr1) {
        priceFeed = AggregatorV3Interface(addr1);
        //11
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (uint80, int, uint, uint, uint80) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return (roundID, price, startedAt, timeStamp, answeredInRound);
    }
}
