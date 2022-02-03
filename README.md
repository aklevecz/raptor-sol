# Raptor Solana NFT
Uses Metaplex Candy Machine V2 to upload assets to IPFS via Pinata and a UI framework to mint tokens to users who verify their Solana address on Twitter
### Metadata and Images
`makeRaptor.js`  
Creates 69 randomly colored Raptor png's and their associated metadata in the `raptors/` directory. Leaving the asset directory in the repo for fun and because it's only 3MB~. You can also look in `.cache/` to see all of the IPFS metadata references
### Backend
`server.js`  
Checks Twitter for the verification tweet including the user's Solana address
### Frontend
`app/`  
React TypeScript implementing Phantom wallet to mint, verify the tweet, and then mint an NFT. `candy-machine.ts` and `connection.tsx` were taken from Metaplex's minting UI with a few edits to grab the NFT's metadata

## To run (in dev mode)
### (Recommend you use Node 14.17.0)
### Backend
#### Install backend dependencies  
`npm i`  
#### Start server
`npm run start`  

### Frontend  
#### Navigate into `app` dir
`cd app`
#### Install dependencies
`yarn`
#### Start frontend
`yarn start`  

### Create NFTs
- Open browser with [Phantom Wallet](https://phantom.app) extension
- Navigate to Frontend, http://localhost:3000
- Fill wallet with marginal amount of Sol
- Profit