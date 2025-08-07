import axios from "axios";
import * as fs from "fs";
import * as path from "path";

export async function processDocumentWithVeryfi(
  filePath: string,
  extraPayload: Record<string, unknown> = {}
) {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

  const stat = fs.statSync(filePath);
  if (stat.size === 0)
    throw new Error("File is empty; Veryfi requires > 0 bytes.");

  const fileBuffer = fs.readFileSync(filePath);
  const fileBase64 = fileBuffer.toString("base64");

  const payload = {
    file_name: path.basename(filePath),
    file_data: fileBase64,
    bounding_boxes: false,
    confidence_details: false,
    async: false,
    ...extraPayload,
  };

  const res = await axios.post(
    "https://api.veryfi.com/api/v8/partner/documents",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "CLIENT-ID": process.env.VERYFI_CLIENT_ID ?? "",
        AUTHORIZATION: process.env.VERYFI_AUTHORIZATION ?? "",
      },
      maxBodyLength: Infinity,
    }
  );

  return res.data;
}

try {
  const result = await processDocumentWithVeryfi(
    "./receipts/coffee.jpg",
    { bounding_boxes: true } // optional extras
  );
  console.log("Extracted JSON:", JSON.stringify(result, null, 2));
} catch (err) {
  if (
    err &&
    typeof err === "object" &&
    "response" in err &&
    err.response &&
    typeof err.response === "object" &&
    "data" in err.response
  ) {
    console.error("Veryfi error:", err.response.data);
  } else {
    console.error("Veryfi error:", err);
  }
}
