# TypeScript Blockchain

> A simple implementation of blockchain in TypeScript.

## Description

This is a simple implementation of blockchain in TypeScript.

This is __not__ a fully featured blockchain implementation. It is only intended to show how to use the basic concepts of blockchain.

Current features:

- Runs in a single node
- Can be used to create a new blockchain
- Can be used to add new blocks to an existing blockchain
- Can be used to verify the validity of a block
- Blocks support any data on the payloads

## Installation

```bash
npm i // or npm i --legacy-peer-deps
```

## Usage

It takes a two optional parameters which are

- the difficulty of the mining process. Default is `4`.
- the number of blocks to mine. Default is `10`.

```bash
npm start [difficulty = 4] [numberOfBlocks = 10]
```
