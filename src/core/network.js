import {WebsocketClient} from 'ontology-ts-sdk';
import store from '../store'
import { MAIN_NET_LIST, TEST_NET_LIST } from './consts'
let client;

let net = localStorage.getItem('net'); // 'TEST_NET' or 'MAIN_NET'
if(!net) {
    net = 'MAIN_NET'
    localStorage.setItem('net', net)
}

let node = localStorage.getItem('nodeAddress')
if(!node) {
    node = MAIN_NET_LIST[0]
    localStorage.setItem('nodeAddress', node)
}

const WS_PORT = '20335'

export function initNetwork() {
    reconnect()
  window.setInterval(async () => {
    try {
      await client.sendHeartBeat();
      store.commit('NETWORK_CONNECTED')
    } catch (e) {
      if (net) {
        reconnect();
      }

      store.commit('NETWORK_DISCONNECTED');
    }
  }, 5000);
}


function reconnect() {
  if (client !== undefined) {
    try {
      client.close();
    } catch (e) {
      // ignored
    }
  }

  const url = `${node}:${WS_PORT}`;
  client = new WebsocketClient(url, false, false);
}

export function getClient() {
  return client;
}
