'use strict';

const config = require('../config.json');

// eosjs
const { Api, JsonRpc, RpcError } = require('eosjs');
const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const signatureProvider = new JsSignatureProvider([config.privateKey]);
const rpc = new JsonRpc(config.httpEndpoint, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// eosjs-api
const EosApi = require('eosjs-api');
const eos = EosApi({ httpEndpoint: config.httpEndpoint });

exports.eosPush = api;
exports.eosPull = eos;
