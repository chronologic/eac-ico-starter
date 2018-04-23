import { Utils } from './utils';
import { stores } from '../stores/index';
import abi from 'ethereumjs-abi';
import { MAINNET_NETWORK_ID } from '../config/web3Config';

const { transactionStore } = stores;

export class Schedule {
  enabledInfoSelector;
  disabledInfoSelector;
  sendButtonSelector;
  wrongNetworkInfoSelector;

  windowStart;
  windowSize;
  toAddress;
  fee;
  payment;
  requiredDeposit;

  callValue;
  callGasPrice;
  callGasAmount;
  callMethodSignature;
  callMethodArguments;

  successHandler;
  networkId;

  constructor({
    windowStart,
    windowSize,
    toAddress,
    fee = 0,
    payment = 0,
    requiredDeposit = 0,
    callValue = 0,
    callGasPrice,
    callGasAmount = 0,
    callMethodSignature,
    callMethodArguments,
    successHandler = () => {},
    networkId = MAINNET_NETWORK_ID,
    enabledInfoSelector,
    disabledInfoSelector,
    lockedInfoSelector,
    sendButtonSelector,
    wrongNetworkInfoSelector
  }) {
    this.enabledInfoSelector = enabledInfoSelector;
    this.disabledInfoSelector = disabledInfoSelector;
    this.sendButtonSelector = sendButtonSelector;
    this.lockedInfoSelector = lockedInfoSelector;
    this.wrongNetworkInfoSelector = wrongNetworkInfoSelector;

    this.networkId = networkId;

    this.computeUIState();

    if (!this.web3Enabled) {
      return;
    }

    this.windowStart = windowStart;
    this.windowSize = windowSize;
    this.toAddress = toAddress;

    this.fee = fee;
    this.payment = payment;
    this.requiredDeposit = requiredDeposit;

    this.callValue = callValue;
    this.callGasPrice = callGasPrice || Utils.castGweiToWei(50);
    this.callGasAmount = callGasAmount;
    this.callMethodSignature = callMethodSignature;
    this.callMethodArguments = callMethodArguments;

    this.successHandler = successHandler;

    this.sendTransaction = this.sendTransaction.bind(this);
    this.attachSendClickHandler();
  }

  get web3Enabled() {
    return Utils.isWeb3Enabled();
  }

  get finalCallGasAmount() {
    return this.callGasAmount;
  }

  get callData() {
    if (!this.callMethodSignature) {
      return null;
    }

    return (
      '0x' + abi.simpleEncode(this.callMethodSignature, ...this.callMethodArguments).toString('hex')
    );
  }

  _showElement(element) {
    if (!element) {
      return;
    }

    element.style.display = 'block';
  }

  _hideElement(element) {
    if (!element) {
      return;
    }

    element.style.display = 'none';
  }

  _disableElement(element) {
    if (!element) {
      return;
    }

    element.disabled = true;
  }

  _enableElement(element) {
    if (!element) {
      return;
    }

    element.disabled = false;
  }

  get wrongNetworkSelected() {
    return transactionStore.initializationError || transactionStore._web3.netId !== this.networkId;
  }

  computeUIState() {
    if (typeof window === 'undefined') {
      return;
    }

    const sendButton = document.querySelector(this.sendButtonSelector);
    const disabledInfo = document.querySelector(this.disabledInfoSelector);
    const enabledInfo = document.querySelector(this.enabledInfoSelector);
    const lockedInfo = document.querySelector(this.lockedInfoSelector);
    const wrongNetworkInfo = document.querySelector(this.wrongNetworkInfoSelector);

    let checkAgain = false;

    if (transactionStore.initializationEnded) {
      if (this.wrongNetworkSelected) {
        this._showElement(wrongNetworkInfo);
        this._disableElement(sendButton);
        this._hideElement(enabledInfo);
        this._hideElement(lockedInfo);

        checkAgain = true;
      } else if (this.web3Enabled) {
        if (Utils.isWalletLocked()) {
          this._disableElement(sendButton);
          this._showElement(lockedInfo);
          this._hideElement(enabledInfo);
        } else {
          this._enableElement(sendButton);
          this._hideElement(lockedInfo);
          this._showElement(enabledInfo);
        }

        this._hideElement(disabledInfo);

        checkAgain = true;
      } else {
        this._disableElement(sendButton);
        this._hideElement(lockedInfo);
        this._showElement(disabledInfo);
      }
    } else {
      checkAgain = true;
    }

    if (checkAgain) {
      setTimeout(() => this.computeUIState(), 1000);
    }
  }

  attachSendClickHandler() {
    const sendButton = document.querySelector(this.sendButtonSelector);

    sendButton.onclick = this.sendTransaction;
  }

  async sendTransaction() {
    const initialGasPrice = await Utils.getRecommendedGasPrice();

    const transaction = await transactionStore.schedule(
      this.toAddress,
      this.callData,
      this.finalCallGasAmount,
      this.callValue,
      this.windowSize,
      this.windowStart,
      this.callGasPrice,
      this.fee,
      this.payment,
      this.requiredDeposit,
      false,
      initialGasPrice
    );

    this.successHandler(transaction);
  }
}
