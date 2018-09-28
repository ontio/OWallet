import { TEST_NET, MAIN_NET } from './consts'

export function varifyPositiveInt(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return false;
    }
    return true;
}

export function varifyOngValue(value) {
    if (!/^[0-9]+([.]{1}[0-9]{1,9})?$/.test(value)) {
        return false;
    }
    return true;
}

export function isHexString(str) {
    const regexp = /^[0-9a-fA-F]+$/;
    return regexp.test(str) && (str.length % 2 === 0);
}

export function getNodeUrl() {
    const net = localStorage.getItem('net');
    // return net === 'TEST_NET' ? TEST_NET + ':20334' : MAIN_NET + ':20334'
    return 'http://139.219.128.220:20334' //for test 
}
