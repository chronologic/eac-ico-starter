import { initWeb3Service } from './web3';
import { initEACService } from './eac';

const web3Service = initWeb3Service(false, typeof window !== 'undefined' && window.web3);
const eacService = initEACService(web3Service);

export const services = {
  eacService,
  web3Service
};
