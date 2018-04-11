import EAC from 'eac.js-lib';

let instance = null;

const additionalMethods = {};

export function initEACService(web3Service) {
  if (!instance) {
    instance = Object.assign(EAC(web3Service), additionalMethods);
  }

  return instance;
}
