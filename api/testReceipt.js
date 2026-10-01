// Usage: node api/testReceipt.js <path-to-receipt-image>
require('dotenv').config({ path: __dirname + '/.env' });
const Client = require('@veryfi/veryfi-sdk');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node api/testReceipt.js <path-to-receipt-image>');
  process.exit(1);
}

const clientID = process.env.VERYFI_CLIENT_ID;
const clientSecret = process.env.VERYFI_CLIENT_SECRET;
const username = process.env.VERYFI_USERNAME;
const apiKey = process.env.VERYFI_API_KEY;

if (!clientID || !clientSecret || !username || !apiKey) {
  console.error('Missing Veryfi credentials. Fill in api/.env (see api/.env.example).');
  process.exit(1);
}

const veryfi = new Client(clientID, clientSecret, username, apiKey);

veryfi
  .process_document(filePath)
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error('Veryfi error:', err.response ? err.response.data : err);
    process.exit(1);
  });
