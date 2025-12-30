import Client from "@veryfi/veryfi-sdk";

export default async function processDocument(
  filePath: string,
) {
  const clientID = process.env.VERYFI_CLIENT_ID;
  const clientSecret = process.env.VERYFI_CLIENT_SECRET;
  const username = process.env.VERYFI_USERNAME;
  const apiKey = process.env.VERYFI_API_KEY;

  if (!clientID || !clientSecret || !username || !apiKey) {
    throw new Error("Missing Veryfi credentials in .env");
  }

  const veryfi = new Client(clientID, clientSecret, username, apiKey);
  return veryfi.process_document(filePath);
}

// try {
//   const result = await processDocument(
//     "./receipts/coffee.jpg",
//     { bounding_boxes: true } // optional extras
//   );
//   console.log("Extracted JSON:", JSON.stringify(result, null, 2));
// } catch (err) {
//   if (
//     err &&
//     typeof err === "object" &&
//     "response" in err &&
//     err.response &&
//     typeof err.response === "object" &&
//     "data" in err.response
//   ) {
//     console.error("Veryfi error:", err.response.data);
//   } else {
//     console.error("Veryfi error:", err);
//   }
// }
