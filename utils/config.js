/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

module.exports = {
  creds: {
    redirectUrl: 'http://localhost:3000/token',
    clientID: 'e1c43244-399a-41d3-8cde-2347d2074732',
    clientSecret: 'dc8c0Vv65DRt6iYLCF43qQ0',
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    allowHttpForRedirectUrl: true, // For development only
    responseType: 'code',
    validateIssuer: false, // For development only
    responseMode: 'query',
    scope: ['User.Read', 'Contacts.Read','Calendars.ReadWrite','Calendars.ReadWrite.Shared']
  }
};
