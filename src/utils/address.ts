export function normalizeAddress(address: string | bigint | number): string {
  let hexAddress: string;

  // If the address is passed as a string (decimal number), convert it to BigInt first
  if (typeof address === 'string' && /^[0-9]+$/.test(address)) {
    hexAddress = '0x' + BigInt(address).toString(16);
  }
  // If the address is already a number or BigInt, convert to hex
  else if (typeof address === 'number' || typeof address === 'bigint') {
    hexAddress = '0x' + BigInt(address).toString(16);
  }
  // If the address is passed as a hexadecimal string
  else if (typeof address === 'string') {
    hexAddress = address.toLowerCase();
  } else {
    throw new Error('Invalid address format');
  }

  // Remove '0x' prefix if it's already present
  hexAddress = hexAddress.replace(/^0x/, '');

  // Pad the address to ensure it's 64 characters long
  const paddedAddress = hexAddress.padStart(64, '0');

  // Return the normalized address with the '0x' prefix
  return '0x' + paddedAddress;
}
