import { TransactionStore } from './TransactionStore';
import { services } from '../services';

const { eacService, web3Service } = services;

export const transactionStore = new TransactionStore(eacService, web3Service);

export const stores = {
  transactionStore
};
