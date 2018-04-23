import { initWeb3Service } from './web3';
import EAC from 'eac.js-lib';

const web3Service = initWeb3Service(false, typeof window !== 'undefined' && window.web3);

const eacService = EAC(web3Service);

export const services = {
  eacService,
  web3Service
};
