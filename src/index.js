'use strict';

const { eosPush, eosPull } = require('./lib/eos');
const config = require('./config.json');

const contractCoin = "eosfakercoin";
const contractFomo = "eosfakerfomo";
const contractDivi = "eosfakerdivi";

main();
// withdraw();
setInterval(main, 60 * 60 * 1000); // ever 1hour do it
setInterval(withdraw, 24 * 60 * 60 * 1000); // ever 1day do it

// check and hold the fomo
async function main() {
  try {
    let result;
    result = await eosPull.getTableRows({ "scope": contractFomo, "code": contractFomo, "table": "states", "json": true });
    let state = result.rows[0];
    console.log(new Date, { state });
    if (state.bidder != config.eosAccount) {
      let bid = parseInt(state.bid);
      let newBid = parseInt(bid * 1.01) + ".0000 FKC";

      let actions = [
        {
          account: contractCoin,
          name: 'transfer',
          authorization: [{
            actor: config.eosAccount,
            permission: config.permission
          }],
          data: {
            "from": config.eosAccount,
            "to": contractFomo,
            "quantity": newBid,
            "memo": "1"
          }
        }
      ];
      result = await eosPush.transact({ actions }, { blocksBehind: 3, expireSeconds: 30 });
      console.log(new Date, { actions, result });
    }
  } catch (e) {
    console.error(new Date, { e });
  }
}

async function withdraw() {
  try {
    let result;
    let actions;
    
    // dice withdraw
    actions = [
      {
        account: contractDivi,
        name: 'withdraw',
        authorization: [{
          actor: config.eosAccount,
          permission: config.permission
        }],
        data: {
          "account": config.eosAccount
        }
      }
    ];
    result = await eosPush.transact({ actions }, { blocksBehind: 3, expireSeconds: 30 });
    console.log(new Date, { actions, result });

    // fomo claim
    actions = [
      {
        account: contractFomo,
        name: 'claim',
        authorization: [{
          actor: config.eosAccount,
          permission: config.permission
        }],
        data: {
          "account": config.eosAccount
        }
      }
    ];
    result = await eosPush.transact({ actions }, { blocksBehind: 3, expireSeconds: 30 });
    console.log(new Date, { actions, result });
  } catch (e) {
    console.error(new Date, { e });
  }
}
