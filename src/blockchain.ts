import { hash, validatedHash } from "./helpers"

export interface Block {
  header: {
    nonce: number
    blockHash: string
  }
  payload: {
    sequence: number
    timestamp: number
    data: any
    previousHash: string
  }
}

export class Blockchain {
  #chain: Block[] = []
  private powPrefix = '0'

  constructor(private readonly difficulty: number = 4){
    this.#chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      data: 'Initial Block',
      previousHash: ''
    }

    const header: Block['header'] = {
      nonce: 0,
      blockHash: hash(JSON.stringify(payload))
    }

    return {
      header,
      payload
    }
  }

  get chain() {
    return this.#chain
  }

  private get returnLastBlock(): Block {
    return this.#chain.at(-1) as Block
  }

  private returnLastBlockHash(): string {
    return this.returnLastBlock.header.blockHash
  }

  createBlock(data: any): Block['payload'] {
    const newBlock: Block['payload'] = {
      sequence: this.returnLastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      data,
      previousHash: this.returnLastBlockHash()
    }

    console.log(`Block #${newBlock.sequence} created: ${JSON.stringify(newBlock)}`)

    return newBlock;
  }

  mineBlock(block: Block['payload']) {
    let nonce = 0
    const initial = +new Date()

    while(true) {
      const blockHash = hash(JSON.stringify(block))
      const powHash = hash(blockHash + nonce)

      if(validatedHash({ hash: powHash, difficulty: this.difficulty, prefix: this.powPrefix })) {
        const final = +new Date()
        const reducedHash = blockHash.slice(0, 12)
        const minedTime = (final - initial) / 1000

        console.log(`Block #${block.sequence} mined in ${minedTime}s. Hash: ${reducedHash} (${nonce} tentativas)`)

        return {
          minedBlock: {
            payload: { ...block },
            header: {
              nonce,
              blockHash
            }
          }
        }
      }

      nonce++
    }
  }

  verifyBlock(block: Block): boolean {
    if (block.payload.previousHash !== this.returnLastBlockHash()) {
      console.error(`Block #${block.payload.sequence} invalid! Hash Block: ${block.payload.previousHash.slice(0, 12)} | Previous Hash: ${this.returnLastBlockHash().slice(0, 12)}`)
      return false
    }

    const testHash = hash(hash(JSON.stringify(block.payload)) + block.header.nonce)
    if(!validatedHash({ hash: testHash, difficulty: this.difficulty, prefix: this.powPrefix })) {
      console.error(`Block #${block.payload.sequence} invalid and Invalid Nonce
      : ${block.header.nonce}`)

      return false
    }

    return true
  }

  sendBlock(block: Block): Block[] {
    if(this.verifyBlock(block)) {
      this.#chain.push(block)
      console.log(`Block #${block.payload.sequence} has been added to the blockchain: ${JSON.stringify(block, null, 2)}`)
    }

    return this.#chain
  }
}
