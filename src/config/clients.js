export const clientColors = {
  'Legacya Sphere': {
    bg: 'bg-[#EFF4FB]',
    border: 'border-[#2A4D88]',
    badge: 'bg-[#2A4D88] text-white',
    dot: 'bg-[#2A4D88]',
    text: 'text-[#2A4D88]',
    strip: '#2A4D88'
  },
  default: {
    bg: 'bg-[#F3F4F6]',
    border: 'border-[#6B7A8D]',
    badge: 'bg-[#6B7A8D] text-white',
    dot: 'bg-[#6B7A8D]',
    text: 'text-[#6B7A8D]',
    strip: '#6B7A8D'
  }
}

export const colorPalette = [
  { bg: 'bg-[#FDF2F8]', border: 'border-[#9333EA]', badge: 'bg-[#9333EA] text-white', dot: 'bg-[#9333EA]', text: 'text-[#9333EA]', strip: '#9333EA' },
  { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', badge: 'bg-[#16A34A] text-white', dot: 'bg-[#16A34A]', text: 'text-[#16A34A]', strip: '#16A34A' },
  { bg: 'bg-[#FFF7ED]', border: 'border-[#EA580C]', badge: 'bg-[#EA580C] text-white', dot: 'bg-[#EA580C]', text: 'text-[#EA580C]', strip: '#EA580C' },
  { bg: 'bg-[#F0F9FF]', border: 'border-[#0284C7]', badge: 'bg-[#0284C7] text-white', dot: 'bg-[#0284C7]', text: 'text-[#0284C7]', strip: '#0284C7' },
  { bg: 'bg-[#FEF9C3]', border: 'border-[#CA8A04]', badge: 'bg-[#CA8A04] text-white', dot: 'bg-[#CA8A04]', text: 'text-[#CA8A04]', strip: '#CA8A04' }
]

const _assignedColors = {}
let _paletteIndex = 0

export function getClientColor(clientName) {
  if (!clientName) return clientColors.default
  if (clientColors[clientName]) return clientColors[clientName]
  if (_assignedColors[clientName]) return _assignedColors[clientName]
  const color = colorPalette[_paletteIndex % colorPalette.length]
  _paletteIndex++
  _assignedColors[clientName] = color
  return color
}
