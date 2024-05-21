import type {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  MetaFunction,
  LinksFunction,
} from '@remix-run/cloudflare'

import { Form, useSearchParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/cloudflare'

import { getUserId, createUserSession } from '~/session.server'

import { safeRedirect } from '~/utils/user'


import Avatar from '~/components/ui/avatar'

import tags from '~/utils/tags'
import HorizontalRule from '~/components/ui/hr'
import Link from '~/components/ui/link'

import { LockClosedIcon, ArrowRightIcon } from '@heroicons/react/20/solid'

import { EMOJI_URL } from '~/constants'

export const meta: MetaFunction = () => {
  return tags({
    title: 'Login! Charlie Gleason is hiding!',
    description:
      'Designer, developer, creative coder, musician, and login page enthusiast.',
    image: 'https://charliegleason.com/social-error.png',
    emoji: '🙈',
  })
}

export const links: LinksFunction = () => {
  return [
    {
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${'🙈'}?animated=false`,
    },
  ]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const userId = await getUserId(request, context)

  if (userId) {
    return redirect('/')
  }

  return json({}, { status: 200 })
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData()
  const redirectTo = safeRedirect(formData.get('redirectTo'))

  const password = formData.get('password')
  const user = password === context.AUTH_PASSWORD ? { id: 'guest' } : false

  if (!user) {
    const searchParams = new URLSearchParams([
      ['redirectTo', redirectTo],
      ['error', 'unauthorized'],
    ])
    throw redirect(`/login?${searchParams}`)
  }

  return createUserSession({
    request,
    userId: user.id,
    redirectTo,
    context,
  })
}

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const unauthorized = searchParams.get('error') === 'unauthorized'
  const symbol = unauthorized ? '💀' : '🙈'

  return (
    <>
      <div className="grid place-items-center h-full">
        <div className="flex items-start space-x-4">
          <div className="flex">
            <Avatar symbol={symbol} photo="01" />
          </div>
          <div className="max-w-xs space-y-0">
            <hgroup className="inline-flex whitespace-nowrap space-x-1 font-display uppercase tracking-wider text-xs">
              <h1>C#@rl!e G/3as0n</h1>
              <h2 className="bg-yellow-800 dark:bg-yellow-300 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 dark:from-yellow-500 to-transparent">
                needs you to log in
              </h2>
            </hgroup>
            <div className="space-y-4">
              <h1 className="font-mono text-lg">This is a protected area.</h1>
              <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <p>
                  To abide by Intellectual Property policies, this content is{' '}
                  <span className="font-semibold">password protected</span>.
                </p>
                <p>
                  <Link href="mailto:hi@charliegleason" type="text">
                    Contact me
                  </Link>{' '}
                  to get access.
                </p>
              </div>
              <HorizontalRule />
              <Form method="POST" className="h-full space-y-2">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon
                        className={`h-4 w-4 transition-color ${
                          unauthorized
                            ? 'text-yellow-700 dark:text-yellow-500'
                            : 'text-neutral-500'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      className="block w-full rounded-none rounded-l-md bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 pl-10 focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                      placeholder="Enter password..."
                    />
                  </div>
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <button
                    type="submit"
                    className="relative -ml-px inline-flex items-center rounded-r-md border border-yellow-500 dark:border-yellow-700 bg-yellow-50 dark:bg-neutral-900 px-4 py-2 text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100  dark:hover:bg-yellow-800 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  >
                    <span className="sr-only">Submit</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
                <div
                  className={`text-xxs font-mono ${
                    unauthorized
                      ? 'text-yellow-700 dark:text-yellow-500'
                      : 'text-transparent'
                  }`}
                >
                  {unauthorized
                    ? 'Beep boop! Incorrect password! Please try again.'
                    : '...'}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
