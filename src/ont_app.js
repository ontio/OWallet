const STATUS_CODES = {
  SW_DENY: 0x6985,
  SW_WRONG_P1P2: 0x6a86,
  SW_WRONG_DATA_LENGTH: 0x6a87,
  SW_INS_NOT_SUPPORTED: 0x6d00,
  SW_CLA_NOT_SUPPORTED: 0x6e00,
  SW_WRONG_RESPONSE_LENGTH: 0xb000,
  SW_DISPLAY_BIP32_PATH_FAIL: 0xb001,
  SW_DISPLAY_ADDRESS_FAIL: 0xb002,
  SW_DISPLAY_AMOUNT_FAIL: 0xb003,
  SW_WRONG_TX_LENGTH: 0xb004,
  SW_TX_PARSING_FAIL: 0xb005,
  SW_TX_HASH_FAIL: 0xb006,
  SW_BAD_STATE: 0xb007,
  SW_SIGNATURE_FAIL: 0xb008,
  SW_PERSON_MSG_PARSING_FAIL: 0xb009,
  SW_PERSON_MSG_HASH_FAIL: 0xb00a,
  SW_WRONG_PERSON_MSG_LENGTH: 0xb00b,
  SW_TX_PAYLOAD_PARSING_FAIL: 0xb00c,
  SW_OEP4_TX_PARSING_FAIL: 0xb00d,
  SW_OEP4_TX_PAYLOAD_PARSING_FAIL: 0xb00e,
  OK: 0x9000,
};

const MAX_PAYLOAD = 255;
const LEDGER_CLA = 0x80;
const P1_NON_CONFIRM = 0x00;
// const P1_CONFIRM = 0x01;
const P2_MORE = 0x80;
const P2_EXTEND = 0x00;

const INS = {
  GET_VERSION: 0x03,
  GET_ADDR: 0x05,
  SIGN: 0x02,
  SIGN_OFFCHAIN: 0x07,
};

class Ont {
  constructor(transport, scrambleKey = "ONT") {
    this.transport = transport;
    transport.decorateAppAPIMethods(this, ["getPublicKey", "signMessage", "signOffchainMessage"], scrambleKey);
  }
  async #sendToDevice(path, instruction, msgBuffer) {
    console.log(path, instruction, msgBuffer);
    const versionReply = await this.getVersion();
    if (versionReply.toString("hex") !== "0102059000") {
      throw new Error("Unsupported app version");
    }

    try {
      const acceptStatusList = [STATUS_CODES.OK];
      const pathBuffer = this.#pathToBuffer(path);
      // const msgBuffer = Buffer.from(msg, "hex");
      let custom_p1 = 0x00;

      const firstReply = await this.transport.send(
        LEDGER_CLA,
        instruction,
        custom_p1,
        P2_MORE,
        pathBuffer,
        acceptStatusList
      );
      console.log("firstReply", firstReply);

      custom_p1++;

      if (msgBuffer.length > MAX_PAYLOAD) {
        while (msgBuffer.length - (custom_p1 - 1) * MAX_PAYLOAD > MAX_PAYLOAD) {
          const buf = msgBuffer.slice((custom_p1 - 1) * MAX_PAYLOAD, custom_p1 * MAX_PAYLOAD);
          await this.transport.send(LEDGER_CLA, instruction, custom_p1, P2_MORE, buf, acceptStatusList);
          custom_p1++;
        }
      }

      const lastBuf = msgBuffer.slice((custom_p1 - 1) * MAX_PAYLOAD);
      const reply = await this.transport.send(LEDGER_CLA, instruction, custom_p1, P2_EXTEND, lastBuf, [
        STATUS_CODES.OK,
      ]);
      return reply;
    } catch (error) {
      throw this._convertTransportError(error);
    }
  }

  // eslint-disable-next-line no-dupe-class-members
  #pathToBuffer(path) {
    const PATH_REGEX = /^(\d+'?(\/\d+'?)*)$/;
    if (!PATH_REGEX.test(path.trim())) {
      throw new Error("Invalid path format");
    }
    const segments = path
      .replace(/^m\//, "") // delete "m/"
      .split("/")
      .map((segment) => {
        if (segment.endsWith("'")) {
          return (parseInt(segment.slice(0, -1), 10) | 0x80000000) >>> 0;
        } else {
          return parseInt(segment, 10) >>> 0;
        }
      });

    const length = segments.length;
    const uint8Array = new Uint8Array(1 + length * 4);

    uint8Array[0] = length;
    segments.forEach((value, index) => {
      const offset = 1 + index * 4;
      uint8Array[offset] = (value >> 24) & 0xff;
      uint8Array[offset + 1] = (value >> 16) & 0xff;
      uint8Array[offset + 2] = (value >> 8) & 0xff;
      uint8Array[offset + 3] = value & 0xff;
    });

    return uint8Array;
  }

  // eslint-disable-next-line no-dupe-class-members
  #getSignFromRelay(reply) {
    const dataLength = reply[0];
    const dataBuf = reply.slice(1, dataLength + 1);
    let r_length = dataBuf[3];
    let r = dataBuf.slice(4, 4 + r_length);
    if (r_length === 33 && r[0] === 0) {
      r = r.slice(1);
    }
    let s = dataBuf.slice(r_length + 6);

    const sign = Buffer.concat([r, s]).toString("hex");
    return sign;
  }

  async getVersion() {
    const result = await this.transport.send(LEDGER_CLA, INS.GET_VERSION, P1_NON_CONFIRM, P2_EXTEND, Buffer.alloc(0), [
      STATUS_CODES.OK,
    ]);
    return result;
  }

  async getPublicKey(path) {
    console.log("getPublicKey-path", path);
    
    try {
      const pathBuffer = this.#pathToBuffer(path);
      let result = await this.transport.send(LEDGER_CLA, INS.GET_ADDR, P1_NON_CONFIRM, P2_EXTEND, pathBuffer, [
        STATUS_CODES.OK,
      ]);
      result = result.slice(1, result[0] + 1);
      return result.toString("hex");
    } catch (error) {
      throw this._convertTransportError(error);
    }
  }

  async signMessage(path, msg) {
    const msgBuffer = Buffer.from(msg, "hex");
    const reply = await this.#sendToDevice(path, INS.SIGN, msgBuffer);

    if (reply <= 2) {
      throw new Error("No more data but Ledger did not return signature!");
    }
    const dataLength = reply[0];
    const dataBuf = reply.slice(1, dataLength + 1);

    let r_length = dataBuf[3];
    let r = dataBuf.slice(4, 4 + r_length);
    if (r_length === 33 && r[0] === 0) {
      r = r.slice(1);
    }
    let s = dataBuf.slice(r_length + 6);

    const sign = Buffer.concat([r, s]).toString("hex");
    return sign;
  }

  async signOffchainMessage(path, msg) {
    const msgBuffer = Buffer.from(msg, "hex");

    const relay = await this.#sendToDevice(path, INS.SIGN_OFFCHAIN, msgBuffer);
    const sign = this.#getSignFromRelay(relay);
    return sign;
  }

  _convertTransportError(error) {
    switch (error.statusCode) {
      case STATUS_CODES.SW_DENY:
        error.message = "Rejected by user";
        break;
    }
    return error;
  }
}

module.exports = Ont;
