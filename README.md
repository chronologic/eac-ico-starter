[<img src="https://s3.amazonaws.com/chronologic.network/ChronoLogic_logo.svg" width="128px">](https://github.com/chronologic)

_Note: Operational on the Kovan and Ropsten testnets. Mainnet release coming soon._

[![npm version](https://badge.fury.io/js/eac-ico-starter.svg)](https://badge.fury.io/js/eac-ico-starter)
[![Build Status](https://travis-ci.org/chronologic/eac-ico-starter.svg?branch=master)](https://travis-ci.org/chronologic/eac-ico-starter)

# Ethereum Alarm Clock ICO Starter

This JavaScript library allows you to easily schedule Ethereum transactions to happen in the future using Ethereum Alarm Clock.

You can create a scheduling functionality that, for the end user, will be just one button.

The primary use case is ICO contribution scheduling.

[Live demo.](https://chronologic.github.io/eac-ico-starter/)

<img src="https://image.ibb.co/g1NcCS/output3.gif" />

## Usage in project

1. Embed `dist/js/eac-schedule.js` into your page.
2. Prepare the parameters for scheduling:
```
function getOptions() {
    var FEE = '2242000000000000'; // IN WEI

    function successHandler(result) {
        var transactionHash = result.transactionHash;

        $('#txhash').html(transactionHash);
        $('#success-info').show();
    }

    return {
        callValue: '100000000000000000', // WEI
        toAddress: '0x1332283369b529aaae2ba378189814b3fe3d6f6b',
        windowStart: '1518530927', // UNIX TIMESTAMP
        windowSize: 86400, // in seconds
        callGasAmount: 200000,
        callMethodSignature: 'buyRecipient(address)', // signature of a method you wish to call
        callMethodArguments: ['0xe87529a6123a74320e13a6dabf3606630683c029'], // parameter values, in this example user wallet address
        fee: FEE, // fee for scheduling paid for using EAC
        sendButtonSelector: '#send-btn',
        enabledInfoSelector: '#enabled-info', // show when MetaMask is enabled
        disabledInfoSelector: '#disabled-info', // show when there is no MetaMask
        lockedInfoSelector: '#locked-info', // show when MetaMask is locked
        wrongNetworkInfoSelector: '#wrong-network-info', // show when MetaMask network is different than networkId
        successHandler // callback when transaction has been scheduled,
        networkId: 42 // id of the Ethereum network for the scheduling functionality
    };
}
```
3. Include the following code for the integration:
```
window.ScheduleSetup().then(function() {
    var Schedule = new window.Schedule(getOptions());
});
```

## Documentation

### Options

- `callValue` : `string` - Future transaction value in Wei. Say contribution amount of the user is 1 ETH. In that case, you should pass `'1000000000000000000'`, which is `10**18`.

- `toAddress` : `string` - Address to send the future transaction to. In terms of ICOs, it should be a smart contract address which has a method to buy tokens.

- `windowStart` : `number` - UNIX timestamp when the window for execution will be open. It should usually be the time after the start of the ICO, so that when the contribution is sent, it will be accepted by the smart contract.

- `windowSize` : `number` - Size of the execution window in seconds for the transaction.

- `callMethodSignature` : `string` - Signature of the contract method you wish to call. This method should exist in the smart contract with the `toAddress` address.

- `callMethodArguments` : `array` - Array of arguments to pass to a smart contract method call.

- `fee` : `string` - Fee (in Wei) paid to Ethereum Alarm Clock maintainers for using scheduling.

- `sendButtonSelector` : `string` - CSS selector for the button that, when clicked, will try to send a MetaMask transaction that will schedule the contribution.

- `enabledInfoSelector` : `string` - CSS selector for the container that will be shown when MetaMask is enabled.

- `disabledInfoSelector` : `string` - CSS selector for the container that will be shown when MetaMask is disabled.

- `lockedInfoSelector` : `string` - CSS selector for the container that will be shown when MetaMask is locked.

- `wrongNetworkInfoSelector` : `string` - CSS selector for the container that will be shown when MetaMask network is different than `networkId`.

- `successHandler` : `function(result)` - Function that will be called when a transaction has been sent. First argument is an object that contains the `transactionHash`.

- `networkId` : `number` - ID of the Ethereum network scheduling should work on. By default it is `1` - which is main net, `42` is Kovan.

## Development guide

### How to build and run locally
0. Install NPM if not present on the system
1. Clone the repo
2. `npm install` - Install all NodeJS dependencies
3. `npm run dev` - Run the dev server
4. Check `localhost:8080` in your browser

This is a way to see access the demo locally and adjust the parameters to your specific contract use case.

To create a production bundle please run: `npm run build`.

### Testing
Please use `npm run test` to execute tests.
