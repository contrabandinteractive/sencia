## Inspiration

Sencia explores the concept of utility NFTs on the Fantom blockchain that allow access to AI services. Artificial intelligence is a major topic in the news these days, so I wanted to incorporate AI into this project in an attempt to do what has not yet been done on Fantom. The marketplace format of the app is especially appealing to me in that I believe it will incentivize participants to offer, buy, and trade the best AI services possible.

## What it does

Sencia provides a marketplace that allows users to create and sell NFTs that enable AI-powered services. Some of these services can include text to image generation, video editing, speech synthesis, and more. NFTs act as access passes to utilize these services. Sencia seeks to show how we can use NFTs in novel ways that translate to real value, beyond the trading of just art for art's sake.

Users can also sell and trade their NFTs, allowing for NFT creators to generate income with each successive sale. The Sencia ecosystem rewards all participants by incentivizing trade. The homepage lists current NFTs available for sale with a description of each service that they unlock.

By offering the opportunity for AI service providers to showcase and sell their work, we hope to encourage and incentivize competition for the best of AI to emerge on this platform. Fantom is an ideal network choice due to EVM compatibility and low transaction fees.

In this demo version, a user must have a MetaMask wallet funded with Testnet FTM to use the dApp. There is still much work to be done in adding real AI services, but for demo purposes, the "AI Art Gen" NFTs will unlock a service that allows users to generate images from text prompts. Buying an "AI Art Gen" NFT from the homepage will unlock this feature when visiting the "AI Services" page. I have plans to expand on the process of how AI service providers will be able to add their services to the platform, but for now, the demo version shows a roadmap of what will be possible with more time dedicated to the project.

## How we built it

The smart contract for the Sencia NFT and Marketplace were written in Solidity and compiled and deployed to Fantom testnet using Remix. The dApp was written in Next.js which I found to be the perfect foundation to get this idea to the demonstrable "proof-of-concept" phase.

## Challenges we ran into

This is my first project on Fantom so an early challenge was formulating an idea that didn't appear to have already been done, and something that I felt that I could properly execute. After reviewing the documentation and learning that Fantom was compatible with the Ethereum Virtual Machine, I realized I could use some of the tools that I was already familiar with to develop this app.

## Accomplishments that we're proud of

This current proof-of-concept version of Sencia demonstrates how an NFT marketplace can have much more value than simply providing a way for users to trade art. Exploring added utility for NFTs helps to show what is possible with blockchain technology, and my goal here is to contribute what I can in my own small way to push these concepts forward.

## What we learned

I enjoyed learning about the Fantom network and how it seeks to solve the blockchain trilemma. The way it implements aBFT shows how the network is innovative and is an improvement upon existing networks. Also in working on this project, I have formulated several ideas that incorporate blockchain and AI that I'd like to explore in the future. The intersection of these two worlds is very exciting.

## What's next for Sencia - AI NFT Marketplace

This project is far from done and still has a lot of work, but I feel that the concept and direction of the project is clear and lays the groundwork to expand on how AI services are incorporated into the platform. I need to refine the process of adding custom AI services and make the platform much more robust. I am energized after working on Sencia and plan to see how far I can take it in implementing some key features such as royalties paid from every NFT sale, incorporating as many AI services as possible, and working with other developers to expand on this idea.

## How to Run

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Add these environment variables to enable uploading to IPFS via Infura:

NEXT_PUBLIC_IPFS_KEY
NEXT_PUBLIC_IPFS_SECRET


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

