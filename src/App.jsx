import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import abi from './utils/WavePortal.json';
import './App.css';

export default function App() {

  const [currentAcount, setCurrentAccount] = useState("")

  const [allWaves, setAllWaves] = useState([])

  const contractAddress = '0xdAB401676E9c96344B3069eAf97730B26C42B82B'
  const contractABI = abi.abi

  const getAllWaves = async () =>{
    try{
      const {ethereum} = window

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const waveProtalContract = new ethers.Contract(contractAddress, contractABI, signer)

        const waves = await wavePortalContract.getAllWaves()

        let wavesCleaned = []
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: newDate(wave.timestamp * 1000),
            message: wave.message
          })
        })

        setAllWaves(wavesCleaned)
      }else{
        console.lgo("Ethereum object doesn't exist!")
      }

    }catch(error){
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try{
      const  {ethereum} = window

      if(!ethereum){
        console.log("Make sure you have metamask!")
      }else{
        console.log("We have the ehtereum object",ethereum)
      }

      const accounts = await ethereum.request({method : 'eth_accounts'})

      if(accounts.length !== 0){
        const account = accounts[0]
        console.log("Found an authorized account", account)
        setCurrentAccount(account)
      }else{
        console.log("No authorized account found")
      }

    }catch(error){
        console.log(error)
    }

  }

  const connectWallet = async() => {
    try{
      const {ethereum} = window

      if(!ethereum){
        alert("Get Metamask")
        return
      }

      const accounts =  await ethereum.request({method: 'eth_requestAccounts'})

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])

      }catch(error){
      console.log(error)
      }
  }

  const wave = async () => {
    try{
      const {ehereum} = window
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves()  
        console.log("Retrieve total wave count...", count.toNumber())

        const waveTxn = await wavePortalContract.wave()
        console.log("Mining...", waveTxn)

        await waveTxn.wait()
        console.log("Mined--", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()  
        console.log("Retrieve total wave count...", count.toNumber())
        setWaveNumber(count.toNumber())
      }else{
        console.log("Ethereum object doesn't exist!")
      }
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    checkIfWalletIsConnected()
  },[])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Meezy, this is my first Dapp application. Connect your Ethereum wallet and wave at me!
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <button className="waveButton" onClick={connectWallet}>
          Connect wallet
        </button>
      </div>
    </div>
  );
}
