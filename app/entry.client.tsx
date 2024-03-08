import { RemixBrowser } from '@remix-run/react'
import { hydrateRoot } from 'react-dom/client'
import egg from '~/components/ui/egg'

hydrateRoot(document, <RemixBrowser />)

console.info(
  '%c ',
  `padding-left:192px; padding-block:96px; background-image: url('${egg}'); background-size: 192px; background-repeat: no-repeat;`
)

console.info(
  '👋 Interested in how this site was made? You can check out the source code at https://github.com/superhighfives/charliegleason.com'
)
