export default function getEmoji(codes: string[]) {
  return codes.reduce((result, code) => `${result}${String.fromCodePoint(parseInt(code, 16))}`, '');
}
