import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import abi from './utils/WavePortal.json';
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("")
  const [message, setMessage] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [waveNumber,setWaveNumber] = useState(0)

  const contractAddress = '0xfE3C852Ca17650927ea92A3b06951F2963d4d32F'
  const contractABI = abi.abi

    const getAllWaves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
          
          const waves = await wavePortalContract.getAllWaves()
          
          let wavesCleaned = [];
          waves.forEach(wave => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            })
          })
          
          setAllWaves(wavesCleaned);
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
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
        getAllWaves()
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

        const waveTxn = await wavePortalContract.wave(message)
        console.log("Mining...", waveTxn)

        await waveTxn.wait()
        console.log("Mined--", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()  
        console.log("Retrieve total wave count...", count.toNumber())
        setWaveNumber(count.toNumber())
        getAllWaves()
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
        👋 Wazzup!
        </div>

        <div className="bio">
        I am Meezy, this is my first Dapp application. Connect your Ethereum wallet and send me message!
        </div>
        <input type="text" className="message" value={message} placeholder="Send me a message here!" onChange={(e) => setMessage(e.target.value)}  />
        <button className="waveButton" onClick={wave}>
          Send me message !!
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
