import Web3 from 'web3/index';
import { Networks } from '../config/web3Config.js';

let instance = null;

export default class Web3Service {
  web3 = null;
  tokenInstance = null;
  initialized = false;
  connectedToMetaMask = null;
  accounts = null;
  netId = null;

  constructor(props) {
    Object.assign(this, props);
  }

  async init() {
    if (!this.initialized) {
      await this.connect();
      this.initialized = true;
      return true;
    }

    return false;
  }

  async connect() {
    let { web3 } = this;
    if (!web3) {
      if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider);
        this.connectedToMetaMask = true;
      } else {
        return;
      }
    }

    this.web3 = web3;

    if (!this.connectedToMetaMask || !this.web3.isConnected()) {
      // Do not proceed if not connected to metamask
      return;
    }

    this.accounts = web3.eth.accounts;

    web3.eth.defaultAccount = this.accounts[0];

    web3.version.getNetwork((error, netId) => {
      this.netId = parseInt(netId, 10);
    });
  }

  async awaitInitialized() {
    const that = this;
    if (!this.initialized) {
      let Promises = new Promise((resolve /*, reject*/) => {
        setTimeout(async function() {
          resolve(await that.awaitInitialized());
        }, 2000);
      });
      return Promises;
    } else return true;
  }

  get network() {
    if (typeof Networks[this.netId] === 'undefined') {
      return Networks[0];
    }

    return Networks[this.netId];
  }
}

export function initWeb3Service(isServer, source) {
  if (isServer) {
    return new Web3Service(source);
  }

  if (instance === null) {
    instance = new Web3Service(source);
  }

  return instance;
}
