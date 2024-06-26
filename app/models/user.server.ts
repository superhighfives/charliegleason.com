export type User =
  | {
      id: string
    }
  | null
  | undefined

export async function getUserById(id: string) {
  if (id === 'guest') {
    return { id: 'guest' }
  } else {
    return null
  }
}
