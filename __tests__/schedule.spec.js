import { Schedule } from '../app/lib/schedule';
import { assert } from 'chai';

describe('Schedule Library', function() {
  it('is possible to instantiate schedule class', function() {
    const schedule = new Schedule({});

    assert.ok(schedule);
  });

  it('correctly computes callData', function() {
    const EXAMPLE_METHOD_SIGNATURE = 'buyRecipient(address)';
    const EXPECTED_METHOD_ID = '0x11a4c710';
    const EXAMPLE_ADDRESS = '0xe87529a6123a74320e13a6dabf3606630683c029';

    const EXPECTED_CALL_DATA = `${EXPECTED_METHOD_ID}000000000000000000000000${EXAMPLE_ADDRESS.slice(
      2
    )}`;

    const schedule = new Schedule({});

    assert.equal(schedule.callData, null);

    schedule.callMethodSignature = EXAMPLE_METHOD_SIGNATURE;
    schedule.callMethodArguments = [EXAMPLE_ADDRESS];

    assert.equal(schedule.callData, EXPECTED_CALL_DATA);
  });
});
