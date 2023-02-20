import Web3 from 'web3';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';

import Marketplace from '../contracts/ethereum-contracts/Marketplace.json';
import SenciaNFT from '../contracts/ethereum-contracts/SenciaNFT.json';

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => { loadNFTs() }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()

    // Get listed NFTs
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, '0xFc3B0AA689834E1a0E5b41Ff7Ac5b81F15721410')
    const accounts = await web3.eth.getAccounts()
    const listings = await marketPlaceContract.methods.getMyListedNfts().call({from: accounts[0]})
    // Iterate over my listed NFTs and retrieve their metadata
    const nfts = await Promise.all(listings.map(async i => {
      try {
        const SenciaContract = new web3.eth.Contract(SenciaNFT.abi, '0x703c03DB0Aff5325D795bc41A2053bBF50b45283')
        const tokenURI = await SenciaContract.methods.tokenURI(i.tokenId).call();
        const meta = await axios.get(tokenURI);
        let item = {
          price: i.price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        }
        return item
      } catch(err) {
        console.log(err)
        return null
      }
    }))
    setNfts(nfts.filter(nft => nft !== null))
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (<h1 className="py-10 px-20 text-3xl text-white">No NFTs listed</h1>)
  } else {
    return (
      <div>
        <div className="p-4">
          <h2 className="text-2xl py-2 text-white">Items Listed</h2>
          <p className="text-white p-4">These NFTs are currently listed on the marketplace for sale.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} className="rounded" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Price - {Web3.utils.fromWei(nft.price, "ether")} Eth</p>
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
