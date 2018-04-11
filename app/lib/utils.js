import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';

import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && window.web3 && window.web3.currentProvider) {
  web3 = new Web3(window.web3.currentProvider);
}

export class Utils {
  static ADDITIONAL_GAS_PRICE_HANDICAP = new BigNumber('5000000000'); // 5 gwei

  static castGweiToWei(gweiAmount) {
    if (!web3) {
      throw 'Casting Gwei to Wei failed. Web3 not present.';
    }

    return web3.toWei(gweiAmount, 'gwei');
  }

  static isWeb3Enabled() {
    return Boolean(typeof window !== 'undefined' && window.web3);
  }

  static isMetaMaskEnabled() {
    return Boolean(
      Utils.isWeb3Enabled &&
        window &&
        window.web3.currentProvider &&
        window.web3.currentProvider.isMetaMask
    );
  }

  static isWalletLocked() {
    return !web3.eth.accounts[0];
  }

  static getABIEncodedParams(parameterTypes, parameterValues) {
    if (!parameterTypes) {
      throw 'Parameters types are needed for encoding ABI params.';
    }

    if (!parameterValues) {
      throw 'Parameters values are needed for encoding ABI params.';
    }

    return abi.rawEncode(parameterTypes, parameterValues).toString('hex');
  }

  static getRecommendedGasPrice() {
    return new Promise(resolve => {
      web3.eth.getGasPrice((error, gasPrice) => {
        resolve(gasPrice.add(this.ADDITIONAL_GAS_PRICE_HANDICAP));
      });
    });
  }
}
