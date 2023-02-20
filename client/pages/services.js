import Web3 from 'web3';
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import Image from "next/image"

import Marketplace from '../contracts/ethereum-contracts/Marketplace.json';
import SenciaNFT from '../contracts/ethereum-contracts/SenciaNFT.json';

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  const [theProgress, setTheProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const resetBtn = async () => {
    setTheProgress(0);
  };

  const generateArt = async () => {
    // generate art
    setTheProgress(1);
    let thePrompt = document.getElementById("desc").value;
    const artData = {
      desc: thePrompt
    }
    const JSONartdata = JSON.stringify(artData)
    const endpoint = '/api/generate'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONartdata,
    }
    const response = await fetch(endpoint, options)
    const result = await response.json()
    //console.log(result.path);
    setImageUrl(result.path);
    setTheProgress(2);
    
  };

  useEffect(() => { loadNFTs() }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, '0xFc3B0AA689834E1a0E5b41Ff7Ac5b81F15721410')
    const SenciaContractAddress = '0x703c03DB0Aff5325D795bc41A2053bBF50b45283'
    const SenciaContract = new web3.eth.Contract(SenciaNFT.abi, SenciaContractAddress)
    const accounts = await web3.eth.getAccounts()
    const data = await marketPlaceContract.methods.getMyNfts().call({from: accounts[0]})
    console.log(data);

    const nfts = await Promise.all(data.map(async i => {
      
      try {
        const tokenURI = await SenciaContract.methods.tokenURI(i.tokenId).call()
        const meta = await axios.get(tokenURI)
        let nft = {
          contract: i.nftContract,
          price: i.price,
          tokenId: i.tokenId,
          seller: i.seller,
          owner: i.buyer,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenURI: tokenURI
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

  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }

  if (loadingState === 'loaded' && !nfts.length) {
    return (<h1 className="py-10 px-20 text-3xl text-white">No NFTs owned</h1>);
  } else {
    return (
      <div className="flex justify-center">
        <p className="text-white p-4">If you currently hold an NFT tied to an AI service, access to your services will appear below.</p>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4">
            {
              
              nfts.map((nft, i) => (
                <div className="card">
                  {nft.name == "AI Art Gen"  &&
                    <div className="text-center justify-center mx-0 my-auto rounded-md bg-amber-200 p-20">
                    {theProgress == 0 && 
                      <div>
                        <h2 className="text-black text-2xl font-bold pb-[20px]">AI Art Gen</h2>
                        <p className="description pb-[20px]">
                          Your ownership of the 'AI Art Gen' NFT has unlocked this service.
                        </p>
                        <p className="description pb-[20px]">
                          Enter a detailed description of the NFT artwork you'd like to generate using DALL-E. 
                        </p>
                        <input type="text" name="desc" id="desc" placeholder="Text description" className="mt-2 border rounded p-4" />
                        <button className="btn round-md bg-black text-white p-4" onClick={generateArt}>Generate</button>
          
                      </div>
                    }
                    {theProgress == 1 &&
                      <div>
                      <p className="description">
                        Generating artwork using DALL-E machine learning models...
                      </p>
                      </div>
                    }
                    {theProgress == 2 &&
                    <>
                      <div className="imageContainer pb-[20px]"><img src={imageUrl} /></div>
                      <button className="btn round-md bg-black text-white p-4" onClick={resetBtn}>Run Again</button>
                    </>
                    }
                    </div>
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}
