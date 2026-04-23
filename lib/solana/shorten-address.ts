export function shortenAddress(
  address: string,
  startCharacters = 4,
  endCharacters = 4,
) {
  if (address.length <= startCharacters + endCharacters) {
    return address;
  }

  return `${address.slice(0, startCharacters)}…${address.slice(-endCharacters)}`;
}
