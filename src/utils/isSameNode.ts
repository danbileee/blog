export default function isSameNode(nodeName: string, el?: HTMLElement | null) {
  return nodeName === el?.nodeName?.toLowerCase();
}
