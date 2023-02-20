import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Marketplace from '../contracts/ethereum-contracts/Marketplace.json'
import SenciaNFT from '../contracts/ethereum-contracts/SenciaNFT.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => { loadNFTs() }, [])

  async function loadNFTs() {

    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()

    // Get all listed NFTs
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, '0xFc3B0AA689834E1a0E5b41Ff7Ac5b81F15721410')
    const listings = await marketPlaceContract.methods.getListedNfts().call()
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(listings.map(async (i) => {
      try {
        const SenciaContract = new web3.eth.Contract(SenciaNFT.abi, '0x703c03DB0Aff5325D795bc41A2053bBF50b45283')
        const tokenURI = await SenciaContract.methods.tokenURI(i.tokenId).call()
        const meta = await axios.get(tokenURI)
        const nft = {
          price: i.price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.buyer,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return nft
      } catch(err) {
        console.log(err)
        return null
      }
    }))
    setNfts(nfts.filter(nft => nft !== null))
    setLoadingState('loaded') 
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId();
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, '0xFc3B0AA689834E1a0E5b41Ff7Ac5b81F15721410');
    const accounts = await web3.eth.getAccounts();
    await marketPlaceContract.methods.buyNft('0x703c03DB0Aff5325D795bc41A2053bBF50b45283', nft.tokenId).send({ from: accounts[0], value: nft.price });
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (<h1 className="px-20 py-10 text-3xl text-white">No NFTs available!</h1>)
  } else {
    return (
      <div className="flex justify-center">
        <div className="px-4" style={ { maxWidth: '1600px' } }>
        <p className="text-white p-4">Purchase an NFT to unlock AI services. NFTs function as access keys to buy, trade, sell AI tools & services.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} />
                  <div className="p-4">
                    <p style={ { height: '64px' } } className="text-2xl font-semibold text-white">{nft.name}</p>
                    <div style={ { height: '70px', overflow: 'hidden'  } }>
                      <p className="text-white">{nft.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">{Web3.utils.fromWei(nft.price, "ether")} ETH</p>
                    <button className="mt-4 w-full bg-amber-200 text-black font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
