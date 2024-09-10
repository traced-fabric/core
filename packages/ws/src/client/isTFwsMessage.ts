export function isTFwsMessage(message: unknown): boolean {
  return typeof message === 'object'
    && message !== null
    && 'type' in message
    && message.type === '@traced-fabric/ws';
}
