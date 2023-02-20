import { useState } from 'react'
import Web3 from 'web3'
import Web3Modal from 'web3modal'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'

import Marketplace from '../contracts/ethereum-contracts/Marketplace.json'
import SenciaNFT from '../contracts/ethereum-contracts/SenciaNFT.json'


const projectId = process.env["NEXT_PUBLIC_IPFS_KEY"];
const projectSecret = process.env["NEXT_PUBLIC_IPFS_SECRET"];
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

const IPFSGateway = `https://sencia.infura-ipfs.io/ipfs/`;

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `${IPFSGateway}${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) {
      return
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name, description, image: fileUrl
      })
      try {
        const added = await client.add(data)
        const url = `${IPFSGateway}${added.path}`
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction
        return url
      } catch (error) {
        console.log('Error uploading file: ', error)
      } 
    }
  }

  async function listNFTForSale() {
    const web3Modal = new Web3Modal()
    const provider = await web3Modal.connect()
    const web3 = new Web3(provider)
    const url = await uploadToIPFS()
    const networkId = await web3.eth.net.getId()
    
    // Mint the NFT
    const SenciaContractAddress = '0x703c03DB0Aff5325D795bc41A2053bBF50b45283'
    const SenciaContract = new web3.eth.Contract(SenciaNFT.abi, '0x703c03DB0Aff5325D795bc41A2053bBF50b45283')
    const accounts = await web3.eth.getAccounts()
    const marketPlaceContract = new web3.eth.Contract(Marketplace.abi, '0xFc3B0AA689834E1a0E5b41Ff7Ac5b81F15721410')
    let listingFee = await marketPlaceContract.methods.getListingFee().call()
    listingFee = listingFee.toString()
    SenciaContract.methods.mint(url).send({ from: accounts[0] }).on('receipt', function (receipt) {
        console.log('minted');
        // List the NFT
        const tokenId = receipt.events.NFTMinted.returnValues[0];
        marketPlaceContract.methods.listNft(SenciaContractAddress, tokenId, Web3.utils.toWei(formInput.price, "ether"))
            .send({ from: accounts[0], value: listingFee }).on('receipt', function () {
                console.log('listed')
                router.push('/')
            });
    });
  }

  return (
    <div className="flex justify-center">
      
      <div className="w-1/2 flex flex-col pb-12">
      <p className="text-white p-4">As a service provider, you can create an NFT tied to AI services and receive proceeds each time the NFT is sold.</p>
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <select id="servicetype" name="servicetype" className="mt-2 border rounded p-4">
          <option value="audio">Audio Generation</option>
          <option value="diffusion">Diffusion Models</option>
          <option value="video">Video Creation & Editing</option>
          <option value="ml">ML Makeovers</option>
          <option value="textgeneration">Text Generation</option>
        </select>
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-amber-200 text-black rounded p-4 shadow-lg">
          Mint and list NFT
        </button>
      </div>
    </div>
  )
}