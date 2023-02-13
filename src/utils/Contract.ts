import { ethers } from 'ethers'

export class Contract {
  static #provider: ethers.providers.JsonRpcBatchProvider

  static {
    this.#provider = new ethers.providers.JsonRpcBatchProvider(
      'https://rpc-mumbai.maticvigil.com/'
    )
  }

  static async getProvider() {
    return this.#provider
  }
}
