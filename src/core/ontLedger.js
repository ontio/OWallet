import LedgerNode from '@ledgerhq/hw-transport-node-hid'
import asyncWrap from './asyncHelper'
import {utils, Crypto} from 'ontology-ts-sdk'
import * as elliptic from 'elliptic';

const VALID_STATUS = 0x9000
const MSG_TOO_BIG = 0x6d08
const APP_CLOSED = 0x6e00
const TX_DENIED = 0x6985
const TX_PARSE_ERR = 0x6d07

/**
 * Evaluates Transport Error thrown and rewrite the error message to be more user friendly.
 * @param {Error} err
 * @return {Error}
 */
const evalTransportError = err => {
    switch (err.statusCode) {
        case APP_CLOSED:
            err.message = 'Your ONT app is closed! Please login.'
            break
        case MSG_TOO_BIG:
            err.message = 'Your transaction is too big for the ledger to sign!'
            break
        case TX_DENIED:
            err.message = 'You have denied the transaction on your ledger.'
            break
        case TX_PARSE_ERR:
            err.message = 'Error parsing transaction. Make sure your ONT app version is up to date.'
            break
    }
    return err
}

const BIP44 = (acct = 0, neo = false) => {
    const acctNumber = acct.toString(16)
    const coinType = neo ? '80000378' : '80000400';

    return (
        '8000002C' +
         coinType +
        '80000000' +
        '00000000' +
        '0'.repeat(8 - acctNumber.length) +
        acctNumber
    )
}

export default class OntLedger {
    path: string;
    device: any;

    constructor(path: string) {
        this.path = path
    }

    /**
     * Initialises by listing devices and trying to find a ledger device connected. Throws an error if no ledgers detected or unable to connect.
     * @return {Promise<OntLedger>}
     */
    static async init() {
        const supported = await LedgerNode.isSupported()
        // if (!supported) { throw new Error(`Your computer does not support the ledger!`) }
        if (!supported) { throw 'NOT_SUPPORT' }
        const paths = await OntLedger.list()
        // if (paths.length === 0) throw new Error('USB Error: No device found.')
        if (paths.length === 0) throw 'NOT_FOUND'
        const ledger = new OntLedger(paths[0])
        return ledger.open()
    }

    static async list(): Promise<string[]> {
        return LedgerNode.list()
    }

    /**
     * Opens an connection with the selected ledger.
     * @return {Promise<OntLedger>}this
     */
    async open(): Promise<OntLedger> {
        try {
            this.device = await LedgerNode.open(this.path)
            return this
        } catch (err) {
            throw evalTransportError(err)
        }
    }

    /**
     * Closes the connection between the Ledger and the wallet.
     * @return {Promise<void>}}
     */
    close(): Promise<void> {
        if (this.device) return this.device.close()
        return Promise.resolve()
    }

    /**
     * Retrieves the public key of an account from the Ledger.
     * @param {number} [acct] - Account that you want to retrieve the public key from.
     * @return {string} Public Key (Unencoded)
     */
    async getPublicKey(acct: number = 0, neo: boolean): Promise<string> {
        const res = await this.send('80040000', BIP44(acct, neo), [VALID_STATUS])
        const uncompressed = res.toString('hex').substring(0, 130)
        const ec = new elliptic.ec(Crypto.CurveLabel.SECP256R1.preset);
        const keyPair = ec.keyFromPublic(uncompressed, 'hex');
        const compressed = keyPair.getPublic(true, 'hex');
        return compressed;
    }

    getDeviceInfo() {
        try {
            return this.device.device.getDeviceInfo()
        } catch (err) {
            throw evalTransportError(err)
        }
    }

    /**
     * Sends an message with params over to the Ledger.
     * @param {string} params - params as a hexstring
     * @param {string} msg - Message as a hexstring
     * @param {number[]} statusList - Statuses to return
     * @return {Promise<Buffer>} return value decoded to ASCII string
     */
    async send(
        params: string,
        msg: string,
        statusList: number[]
    ): Promise<Buffer> {
        if (params.length !== 8) throw new Error(`params requires 4 bytes`)
        // $FlowFixMe
        const [cla, ins, p1, p2] = params
            .match(/.{1,2}/g)
            .map(i => parseInt(i, 16))
        try {
            return await this.device.send(
                cla,
                ins,
                p1,
                p2,
                Buffer.from(msg, 'hex'),
                statusList
            )
        } catch (err) {
            throw evalTransportError(err)
        }
    }

    /**
     * Gets the ECDH signature of the data from Ledger using acct
     * @param {string} data
     * @param {number} [acct]
     * @return {Promise<string>}
     */
    async getSignature(data: string, acct: number = 0, neo: boolean = false): Promise<string> {
        data += BIP44(acct, neo)
        let response = null
        const chunks = data.match(/.{1,510}/g) || [];
        if (!chunks.length) throw new Error(`Invalid data provided: ${data}`)
        for (let i = 0; i < chunks.length; i++) {
            const p = i === chunks.length - 1 ? '80' : '00'
            // $FlowFixMe
            const chunk = chunks[i]
            const params = `8002${p}00`
            let [err, res] = await asyncWrap(
                this.send(params, chunk, [VALID_STATUS])
            )
            if (err) throw evalTransportError(err)
            response = res
        }
        if (response === 0x9000) {
            throw new Error(`No more data but Ledger did not return signature!`)
        }
        // $FlowFixMe
        return assembleSignature(response.toString('hex'))
    }
}

/**
 * The signature is returned from the ledger in a DER format
 * @param {string} response - Signature in DER format
 */
const assembleSignature = (response: string): string => {
    let ss = new utils.StringReader(response)
    // The first byte is format. It is usually 0x30 (SEQ) or 0x31 (SET)
    // The second byte represents the total length of the DER module.
    ss.read(2)
    // Now we read each field off
    // Each field is encoded with a type byte, length byte followed by the data itself
    ss.read(1) // Read and drop the type
    const r = ss.readNextBytes()
    ss.read(1)
    const s = ss.readNextBytes()

    // We will need to ensure both integers are 32 bytes long
    const integers = [r, s].map(i => {
        if (i.length < 64) {
            i = i.padStart(64, '0')
        }
        if (i.length > 64) {
            i = i.substr(-64)
        }
        return i
    })

    return integers.join('')
}

export const getPublicKey = async (acct: number = 0, neo: boolean = false): Promise<string> => {
    const ledger = await OntLedger.init()
    try {
        return await ledger.getPublicKey(acct, neo)
    } finally {
        await ledger.close()
    }
}

export const getDeviceInfo = async () => {
    const ledger = await OntLedger.init()
    try {
        return await ledger.getDeviceInfo()
    } finally {
        await ledger.close()
    }
}


export const legacySignWithLedger = async (
    unsignedTx: string,
    neo: boolean = false,
    acct: number = 0
): Promise<string> => {
    const ledger = await OntLedger.init()
    try {
        const signData = await ledger.getSignature(unsignedTx, acct, neo)
        return signData;
    } catch(err) {
        return Promise.reject(err)
    }
    finally {
        await ledger.close()
    }
}
