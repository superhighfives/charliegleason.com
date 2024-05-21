type Props = {
  title?: string
  description?: string
  image?: string
  emoji?: string
}

type Meta = {[key: string]: string} | {key: string}


function Tags(props: Props) {
  const tags: Meta[] = []

  if (props.title) {
    tags.push({title: props.title})
    tags.push({property: 'og:title', content: props.title})
  }

  if (props.description) {
    tags.push({name: 'description', content: props.description})
    tags.push({property: 'og:description', content: props.description})
  }

  if (props.image) {
    tags.push({property: 'og:image', content: props.image})
  }

  return tags
}

export default Tags
