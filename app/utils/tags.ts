type Props = {
  title?: string
  description?: string
  image?: string
  emoji?: string
}

type Meta = {
  charset: string
  viewport: string
  [key: string]: string
}

function Tags(props: Props) {
  const tags: Meta = {
    charset: 'utf-8',
    viewport: 'width=device-width,initial-scale=1',
  }

  if (props.title) {
    tags.title = props.title
    tags['og:title'] = props.title
  }

  if (props.description) {
    tags.description = props.description
    tags['og:description'] = props.description
  }

  if (props.image) {
    tags.image = props.image
    tags['og:image'] = props.image
  }

  const metatags = Object.keys(tags).map((tag) => {
    return { [tag]: tags[tag] }
  })

  return metatags
}

export default Tags
