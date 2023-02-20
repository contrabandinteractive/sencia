import '@/styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className="content-center place-items-center text-center">
      <nav className="border-b p-6 content-center mx-auto my-0 place-items-center text-center">
        <img src='/logo.png' className="text-center justify-center content-center block my-0 mx-auto" />
        <p className="underline-offset-1 pt-[20px] pb-[10px]"><Link href="https://docs.fantom.foundation/wallet/set-up-metamask-testnet" className="mr-4 text-amber-200 underline-offset-1">Status: Fantom Testnet (MetaMask Config Details Here)</Link>.</p>
        <div className="flex mt-4 justify-center">
          <Link href="/" className="mr-4 text-black bg-amber-200 rounded-md p-2 font-bold text-xl">
              Home
          </Link>
          <Link href="/create-and-list-nft" className="mr-4 text-black bg-amber-200 rounded-md p-2 font-bold text-xl">
              Sell a new NFT
          </Link>
          <Link href="/my-nfts" className="mr-4 text-black bg-amber-200 rounded-md p-2 font-bold text-xl">
              My NFTs
          </Link>
          <Link href="/my-listed-nfts" className="mr-4 text-black bg-amber-200 rounded-md p-2 font-bold text-xl">
              My Listed NFTs
          </Link>
          <Link href="/services" className="mr-4 text-black bg-amber-200 rounded-md p-2 font-bold text-xl">
              AI Services
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp