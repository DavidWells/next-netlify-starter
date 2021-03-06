import Head from 'next/head'
import Link from 'next/link'
import Error from 'next/error'
import Skeleton from '@components/Skeleton'
import ActualComponent from '@components/ActualComponent'
import { useRouter } from 'next/router'

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export async function getStaticProps({ params }) {
  const { other } = params
  const TIME_TO_CACHE_IN_SECONDS = 2
  try {
    return {
      // revalidate: seconds
      /* The `revalidate` property is not yet available for general use.
        To try the experimental implementation, please use `unstable_revalidate` instead.
        We're excited for you to try this feature—please share all feedback on the RFC:
        https://nextjs.link/issg
      */
      unstable_revalidate: TIME_TO_CACHE_IN_SECONDS,
      props: {
        hello: other
      }
    }
  } catch (error) {
    console.error(error)
    return {
      unstable_revalidate: TIME_TO_CACHE_IN_SECONDS,
      props: {}
    }
  }
}

export default function Other({ date, hello }) {
  const { isFallback } = useRouter()

  if (!isFallback && !hello) {
    return <Error statusCode={404} title="This page errored" />
  }

  return (
    <div className={`page-wrapper`}>
      <Head>
        <title>Title - {hello}</title>
      </Head>
      <h1>Other Page</h1>
      <main>
        {isFallback ? <Skeleton /> : <ActualComponent hello={hello} />}
        <Link href="/">
          <a>Back home</a>
        </Link>
        <footer>
          <p>
            {isFallback
              ? 'This page is statically generating & from CDN'
              : 'This page not statically generated, it is from serverless function'}
          </p>
        </footer>
      </main>

      <style jsx>{`
        .page-wrapper {
          color: var(--tweet-font-color);
          background: var(--bg-color);
          height: 100vh;
          overflow: auto;
          padding: 2rem 1rem;
        }
      `}</style>
    </div>
  )
}
