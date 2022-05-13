import { projects, articles, features } from '~/data'

const content = [projects.data, articles.data, features.data]
  .map((entry: any) => entry.icon)
  .filter((val) => typeof val !== 'undefined')

const art = [
  '😊',
  '😂',
  '🦑',
  '🙈',
  '🙉',
  '🙊',
  '💀',
  '💩',
  '🔥',
  '✨',
  '🌟',
  '💫',
  '🙌',
  '💪',
  '💃',
  '🎩',
  '👑',
  '💖',
  '💞',
  '🐒',
  '🌸',
  '🍂',
  '🌱',
  '⭐',
  '💝',
  '🎒',
  '🎉',
  '🎊',
  '🎈',
  '📷',
  '💡',
  '🎧',
  '🎶',
  '🎹',
  '🎸',
  '🎮',
  '☕',
  '🍻',
  '🍔',
  '🍟',
  '🍫',
  '🍭',
  '🍉',
  '🍓',
  '🍌',
  '🍆',
  '🏠',
  '🏡',
  '🏯',
  '🗼',
  '🎠',
  '🎡',
  '🎢',
  '⛵',
  '⚓',
  '🚀',
  '🚁',
  '🚂',
  '🎪',
  '🎭',
  '💯',
  '😳',
  '😵',
  '💻',
  '📚',
  '🐖',
  '🐀',
]

export default [...content, ...art]
