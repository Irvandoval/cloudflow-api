/*
 *  Copyright (c) 2017 NiXPS, All rights reserved.
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

'use strict';
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
var request = require('request');
var serverCall = require('./cloudflowServerCall.js');

/**
 * @brief async implementation of the Cloudflow server call
 */
function asyncImplementation(context, command, checkResponse, cb, errorCB) {
    if (cb) {
        request({
            method: 'POST',
            uri: context.m_parent.m_address,
            body: command,
            json: true
        }, function (error, response, data) {
            if (error) throw new Error(error);
            else if (response.statusCode !== 200) throw new Error('HTTP error, code: ' + response.statusCode);
            checkResponse(command, data, cb, errorCB)
        });
    } else {

        //return ES6 promise
        return new Promise((resolve, reject) => {
            request({
                method: 'POST',
                uri: context.m_parent.m_address,
                body: command,
                json: true
            }, function (error, response, data) {
                if (error) reject(error);
                else if (response.statusCode !== 200) throw new Error('HTTP error, code: ' + response.statusCode);
                else 
                checkResponse(command, data)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        })
    }
}

module.exports = serverCall(asyncImplementation);
