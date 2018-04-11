import { services } from './services';

import { Schedule } from './lib/schedule';
import { Utils } from './lib/utils';

const { web3Service } = services;

async function setup() {
  try {
    if (window && window.web3) {
      await web3Service.init();
    }
  } catch (error) {
    throw error;
  }

  window['Schedule'] = Schedule;
  window['ScheduleUtils'] = Utils;
}

window['ScheduleSetup'] = setup;
