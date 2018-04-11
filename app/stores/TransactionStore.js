import BigNumber from 'bignumber.js';

export const DEFAULT_LIMIT = 10;

export class TRANSACTION_STATUS {
  static SCHEDULED = 'Scheduled';
  static EXECUTED = 'Executed';
  static FAILED = 'Failed';
  static CANCELLED = 'Cancelled';
  static MISSED = 'Not executed';
}

export class TEMPORAL_UNIT {
  static BLOCK = 1;
  static TIMESTAMP = 2;
}

export class TransactionStore {
  _eac = null;
  _web3 = null;
  _eacScheduler = null;

  requestFactoryStartBlock = '5555500';

  constructor(eac, web3) {
    this._web3 = web3;
    this._eac = eac;

    this.setup();
  }

  async setup() {
    try {
      this._eacScheduler = await this._eac.scheduler();
    } catch (error) {
      throw error;
    }

    await this._web3.connect();
  }

  async getTransactions({ startBlock = this.requestFactoryStartBlock, endBlock = 'latest' }) {
    const requestFactory = await this._eac.requestFactory();

    let requestsCreated = await requestFactory.getRequests(startBlock, endBlock);

    requestsCreated = requestsCreated.map(request => this._eac.transactionRequest(request));

    return requestsCreated;
  }

  async getAllTransactions() {
    this.allTransactions = await this.getTransactions({});

    for (let transaction of this.allTransactions) {
      await transaction.fillData();
      transaction.resolved = await this.isTransactionResolved(transaction);
    }
  }

  async queryTransactions({ transactions, offset, limit, resolved }) {
    const processed = [];

    for (let transaction of transactions) {
      await transaction.fillData();

      const isResolved = await this.isTransactionResolved(transaction);

      if (isResolved === resolved) {
        processed.push(transaction);
      }
    }

    transactions = processed;

    const total = transactions.length;

    transactions = transactions.slice(offset, offset + limit);

    return {
      transactions,
      total
    };
  }

  async getTransactionsFiltered({
    startBlock,
    endBlock,
    limit = DEFAULT_LIMIT,
    offset = 0,
    resolved
  }) {
    let transactions = await this.getTransactions({ startBlock, endBlock });

    if (typeof resolved !== 'undefined') {
      return this.queryTransactions({
        transactions,
        offset,
        limit,
        resolved
      });
    }

    const total = transactions.length;

    transactions = transactions.slice(offset, offset + limit);

    return {
      transactions,
      total
    };
  }

  async getTxStatus(transaction) {
    let status = TRANSACTION_STATUS.SCHEDULED;

    if (transaction.wasCalled) {
      status = transaction.data.meta.wasSuccessful
        ? TRANSACTION_STATUS.EXECUTED
        : TRANSACTION_STATUS.FAILED;
    }

    if (transaction.isCancelled) {
      status = TRANSACTION_STATUS.CANCELLED;
    }

    if (await this.isTransactionMissed(transaction)) {
      status = TRANSACTION_STATUS.MISSED;
    }

    return status;
  }

  async isTransactionResolved(transaction) {
    const isMissed = await this.isTransactionMissed(transaction);

    return isMissed || transaction.wasCalled || transaction.isCancelled;
  }

  async isTransactionMissed(transaction) {
    const executionWindowClosed = await transaction.afterExecutionWindow();

    return executionWindowClosed && !transaction.wasCalled;
  }

  async getTransactionByAddress(address) {
    const txRequest = this._eac.transactionRequest(address, this._web3);

    return txRequest;
  }

  isTxUnitTimestamp(transaction) {
    return transaction.temporalUnit === TEMPORAL_UNIT.TIMESTAMP;
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
