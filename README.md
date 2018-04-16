# Ethereum Alarm Clock ICO Starter

[![Build Status](https://travis-ci.org/chronologic/eac-ico-starter.svg?branch=master)](https://travis-ci.org/chronologic/eac-ico-starter)

This JavaScript library allows you to easily schedule Ethereum transactions to happen in the future using Ethereum Alarm Clock.

You can create a scheduling functionality that, for the end user, will be just one button.

The primary use case is ICO contribution scheduling.

<img src="https://image.ibb.co/g1NcCS/output3.gif" />

# Usage in project

1. Embed `dist/js/eac-schedule.js` into your page.
2. Prepare parameters for scheduling:
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
        callMethodSignature: '0x11a4c710', // method signature hash beginning, you can get it from demo generator
        callMethodParameterTypes: ['address'],
        callMethodParameterValues: ['0xe87529a6123a74320e13a6dabf3606630683c029'], // parameter values, in this example user wallet address
        fee: FEE, // fee for scheduling paid for using EAC
        sendButtonSelector: '#send-btn',
        enabledInfoSelector: '#enabled-info', // show when MetaMask is enabled
        disabledInfoSelector: '#disabled-info', // show when there is no MetaMask
        lockedInfoSelector: '#locked-info', // show when MetaMask is locked
        successHandler // callback when transaction has been scheduled
    };
}
```
3. Include following code for the integration:
```
window.ScheduleSetup().then(function() {
    var Schedule = new window.Schedule(getOptions());
});
```

# Development guide

## How to build and run locally
0. Install NPM if not present on the system
1. Clone the repo
2. `npm install` - Install all NodeJS dependencies
3. `npm run dev` - Run the dev server
4. Check `localhost:8080` in your browser

This is a way to see access the demo locally and adjust the parameters to your specific contract use case.

To create a production bundle please run: `npm run build`.

## Testing
Please use `npm run test` to execute tests.
