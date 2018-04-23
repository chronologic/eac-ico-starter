import BigNumber from 'bignumber.js';

export class TransactionStore {
  _eac;
  _web3;
  _eacScheduler;
  initializationEnded = false;
  initializationError = false;

  constructor(eac, web3) {
    this._web3 = web3;
    this._eac = eac;

    this.setup();
  }

  async setup() {
    try {
      this._eacScheduler = await this._eac.scheduler();
    } catch (error) {
      this.initializationError = true;
      this.initializationEnded = true;
      throw error;
    }

    await this._web3.connect();

    this.initializationEnded = true;
  }

  async schedule(
    toAddress,
    callData = '',
    callGas,
    callValue,
    windowSize,
    windowStart,
    callGasPrice,
    fee,
    payment,
    requiredDeposit,
    waitForMined = true,
    initialGasPrice
  ) {
    const endowment = this._eacScheduler.calcEndowment(
      new BigNumber(callGas),
      new BigNumber(callValue),
      new BigNumber(callGasPrice),
      new BigNumber(fee),
      new BigNumber(payment)
    );

    const options = {
      from: this._web3.eth.defaultAccount,
      gas: 1500000,
      value: endowment
    };

    if (initialGasPrice) {
      options.gasPrice = initialGasPrice;
    }

    this._eacScheduler.initSender(options);

    return await this._eacScheduler.timestampSchedule(
      toAddress,
      callData,
      callGas,
      callValue,
      windowSize,
      windowStart,
      callGasPrice,
      fee,
      payment,
      requiredDeposit,
      waitForMined
    );
  }
}
