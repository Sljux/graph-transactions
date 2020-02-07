import { TransactionTree } from '../transactions'
import * as fs from 'fs'
import { join } from 'path'

const fileName = 'test-data.json'

export class TransactionNotFound extends Error {
}

export async function fetchTransactionTree (id: string): Promise<TransactionTree> {
  const fileContents = await fs.promises.readFile(join(__dirname, fileName), 'utf8')

  const graph: TransactionTree[] = JSON.parse(fileContents)

  return findTransaction(id, graph)
}

function findTransaction (id: string, graph: TransactionTree[]): TransactionTree {
  const queue: TransactionTree[] = [...graph]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const tree = queue.shift() as TransactionTree

    if (tree.id === id) {
      return tree
    }

    if (tree.children) {
      tree.children.forEach(child => {
        if (!visited.has(child.id)) {
          visited.add(child.id)
          queue.push(child)
        }
      })
    }
  }

  throw new TransactionNotFound()
}
