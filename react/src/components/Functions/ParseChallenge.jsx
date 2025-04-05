import "./protobuf.min.js";
import "./license_protocol.min.js";

const { SignedMessage, LicenseRequest } = protobuf.roots.default.license_protocol;

function uint8ArrayToBase64(uint8Array) {
  const binaryString = Array.from(uint8Array)
    .map(b => String.fromCharCode(b))
    .join('');

  return btoa(binaryString);
}

function parseFetch(fetchString) {
    // Remove `await` if it exists in the string
    fetchString = fetchString.replace(/^await\s+/, "");

    // Use a more lenient regex to capture the fetch pattern (including complex bodies)
    const fetchRegex = /fetch\(['"](.+?)['"],\s*(\{.+?\})\)/s; // Non-greedy match for JSON
    const lines = fetchString.split('\n').map(line => line.trim()).filter(Boolean);
    const result = {
        method: 'UNDEFINED',
        url: '',
        headers: {},
        body: null,
    };

    // Try matching the regex
    const fetchMatch = fetchString.match(fetchRegex);
    if (!fetchMatch) {
        console.log(fetchString);
        throw new Error("Invalid 'Copy as fetch' string.");
    }

    // Extract URL from the match
    result.url = fetchMatch[1];

    // Parse the options JSON from the match (this will include headers, body, etc.)
    const optionsString = fetchMatch[2];
    const options = JSON.parse(optionsString);

    // Assign method, headers, and body if available
    if (options.method) result.method = options.method;
    if (options.headers) result.headers = options.headers;
    if (options.body) result.body = options.body;

    return result;
}


const WIDEVINE_SYSTEM_ID = new Uint8Array([0xed, 0xef, 0x8b, 0xa9, 0x79, 0xd6, 0x4a, 0xce, 0xa3, 0xc8, 0x27, 0xdc, 0xd5, 0x1d, 0x21, 0xed]);
const PLAYREADY_SYSTEM_ID = new Uint8Array([0x9a, 0x04, 0xf0, 0x79, 0x98, 0x40, 0x42, 0x86, 0xab, 0x92, 0xe6, 0x5b, 0xe0, 0x88, 0x5f, 0x95]);
const PSSH_MAGIC = new Uint8Array([0x70, 0x73, 0x73, 0x68]);

function intToUint8Array(num, endian) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, num, endian);
    return new Uint8Array(buffer);
}

function shortToUint8Array(num, endian) {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setUint16(0, num, endian);
    return new Uint8Array(buffer);
}

function psshDataToPsshBoxB64(pssh_data, system_id) {
    const dataLength = pssh_data.length;
    const totalLength = dataLength + 32;
    const pssh = new Uint8Array([
        ...intToUint8Array(totalLength, false),
        ...PSSH_MAGIC,
        ...new Uint8Array(4),
        ...system_id,
        ...intToUint8Array(dataLength, false),
        ...pssh_data
    ]);
    return uint8ArrayToBase64(pssh);
}

function wrmHeaderToPlayReadyHeader(wrm_header){
    const playready_object = new Uint8Array([
        ...shortToUint8Array(1, true),
        ...shortToUint8Array(wrm_header.length, true),
        ...wrm_header
    ]);

    return new Uint8Array([
        ...intToUint8Array(playready_object.length + 2 + 4, true),
        ...shortToUint8Array(1, true),
        ...playready_object
    ]);
}

function encodeUtf16LE(str) {
  const buffer = new Uint8Array(str.length * 2);
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    buffer[i * 2] = code & 0xff;
    buffer[i * 2 + 1] = code >> 8;
  }
  return buffer;
}

function stringToUint8Array(string) {
    return Uint8Array.from(string.split("").map(x => x.charCodeAt()));
}

export async function readTextFromClipboard() {
    try {
        // Request text from the clipboard
        const clipboardText = await navigator.clipboard.readText();
        
        const result = parseFetch(clipboardText);

        let pssh_data_string;
        let payload_string;

        if (result.body.startsWith("<")) {
            // If body starts with "<", process it as PlayReady content
            payload_string = result.body;
            const wrmHeaderMatch = payload_string.match(/.*(<WRMHEADER.*<\/WRMHEADER>).*/);
            const wrmHeader = wrmHeaderMatch ? wrmHeaderMatch[1] : null;
            const encodedWrmHeader = encodeUtf16LE(wrmHeader);
            const playreadyHeader = wrmHeaderToPlayReadyHeader(encodedWrmHeader);
            pssh_data_string = psshDataToPsshBoxB64(playreadyHeader, PLAYREADY_SYSTEM_ID);
        } else {
            // If body is in a different format, process as Widevine content
            const uint8Array = stringToUint8Array(result.body);
            let signed_message;
            let license_request;
            try {
                signed_message = SignedMessage.decode(uint8Array);
                license_request = LicenseRequest.decode(signed_message.msg);
            } catch (decodeError) {
                // If error occurs during decoding, return an empty pssh
                console.error('Decoding failed, returning empty pssh', decodeError);
                pssh_data_string = '';  // Empty pssh if decoding fails
            }
            
            if (license_request && license_request.contentId && license_request.contentId.widevinePsshData) {
                const pssh_data = license_request.contentId.widevinePsshData.psshData[0];
                pssh_data_string = psshDataToPsshBoxB64(pssh_data, WIDEVINE_SYSTEM_ID);
            }

            // Check if the body contains binary data (non-UTF-8 characters)
            if (isBinary(uint8Array)) {
                payload_string = uint8ArrayToBase64(uint8Array);
            } else {
                // If it's text, return it as is
                payload_string = result.body;
            }
        }

        // Output the result
        document.getElementById("licurl").value = result.url;
        document.getElementById("headers").value = JSON.stringify(result.headers);
        document.getElementById("pssh").value = pssh_data_string;
        document.getElementById("data").value = payload_string;
    } catch (error) {
        console.error('Failed to read clipboard contents:', error);
    }
}

// Helper function to check if the data is binary
function isBinary(uint8Array) {
    // Check for non-text (non-ASCII) bytes (basic heuristic)
    return uint8Array.some(byte => byte > 127); // Non-ASCII byte indicates binary
}


