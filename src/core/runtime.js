import {get} from 'lodash'
import {
  Crypto
} from 'ontology-ts-sdk';


import {
  getClient
} from './network';


export async function getBalance(addr) {
    let address = new Crypto.Address(addr);

  const client = getClient();
  const response = await client.getBalance(address);
  const ont = Number(get(response, 'Result.ont'));
  const ong = Number(get(response, 'Result.ong'));

  return {
    ong,
    ont,
  };
}

export async function getUnboundOng(addr) {
    let address = new Crypto.Address(addr);

  const client = getClient();
  const response = await client.getUnboundong(address);
  const unboundOng = Number(get(response, 'Result'));
  return unboundOng;
}

export async function getGrantOng(addr) {
    let address = new Crypto.Address(addr);
    const client = getClient();
    const response = await client.getGrantOng(address);
    const grantOng = Number(get(response, 'Result'));
    return grantOng;
}

export async function invokeTx(tx) {
    const client = getClient();
    await client.sendRawTransaction(tx.serialize(), false, true);
}

export async function invokeReadTx(tx) {
    const client = getClient();
    await client.sendRawTransaction(tx.serialize(), true, true);
}