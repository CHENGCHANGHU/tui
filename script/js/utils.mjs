export function gracefullyExit() {
  process.kill(process.pid, 'SIGTERM');
}

export function camelString(str) {
  return str
    .replaceAll(/(\-+(\w))/g, (m_match, m_with_dash, m_first_char) => m_first_char.toUpperCase())
    .replace(/^(\w)/, m_match => m_match.toUpperCase());
}
