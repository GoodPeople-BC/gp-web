import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { IconButton } from '@mui/material'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { accountState, chainIdState } from '../../atom'
import { doCopy } from '../../utils/doCopy'

const Metamask = () => {
  const [account, setAccount] = useRecoilState(accountState)
  const [chainId, setChainId] = useRecoilState(chainIdState)

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const accounts = await provider.send('eth_requestAccounts', [])
    setAccount(accounts[0])
    const network = await provider.getNetwork()
    setChainId(network.chainId)
  }

  const handleAccountChange = (accounts: string[]) => {
    const newAccount = accounts[0]
    if (!newAccount) {
      return
    } else if (newAccount !== account) {
      setAccount(newAccount)
    }
  }

  useEffect(() => {
    window.ethereum.on('accountsChanged', (res: string[]) =>
      handleAccountChange(res)
    )
    return () => {
      window.ethereum.removeListener('accountsChanged', (res: string[]) =>
        handleAccountChange(res)
      )
    }
  })

  useEffect(() => {
    window.ethereum.on('chainChanged', (res: string) =>
      document.location.reload()
    )
    return () => {
      window.ethereum.removeListener('chainChanged', (res: string) =>
        document.location.reload()
      )
    }
  }, [])

  useEffect(() => {
    connectToMetamask()
  }, [])

  const metaTestMetaData = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com'],
    nativeCurrency: {
      name: 'MATIC',
      decimals: 18,
      symbol: 'MATIC',
    },
  }

  const addChain = async () => {
    const tx = await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [metaTestMetaData],
    })
    return tx
  }

  const changeChain = async () => {
    const tx = await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }],
    })
    return tx
  }

  useEffect(() => {
    if (chainId !== 137) {
      try {
        changeChain()
      } catch {
        addChain()
      }
    }
  }, [chainId])

  return (
    <>
      {account !== '0x00' ? (
        <div>
          <span>
            chainId: {ethers.utils.hexlify(chainId)} ({chainId}) /
          </span>
          <span>
            address: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
          <IconButton onClick={() => doCopy(account)}>
            <ContentCopyIcon sx={{ width: 15, height: 15 }} htmlColor='black' />
          </IconButton>
        </div>
      ) : (
        <IconButton onClick={connectToMetamask}>
          <AccountBalanceWalletIcon htmlColor='black' />
        </IconButton>
      )}
    </>
  )
}

export default Metamask
