import { CombinedConnectionInfo, CombinedTransaction, TransactionTree } from './dtos'
import { fetchTransactionTree } from '../data'

interface TreeAndParentInfo {
  tree: TransactionTree
  parentConfidence: number
  parentType: string[]
}

export async function combineTransaction (id: string, confidence: number): Promise<CombinedTransaction[]> {
  const tree = await fetchTransactionTree(id)

  const transactions: CombinedTransaction[] = []

  transactions.push(rootTransactionCombined(tree))

  if (tree.children) {
    const stack: TreeAndParentInfo[] = tree.children
      .map(c => ({
        tree: c,
        parentConfidence: 1,
        parentType: []
      }))

    while (stack.length > 0) {
      const { tree, parentConfidence, parentType } = stack.pop() as TreeAndParentInfo

      if (tree.connectionInfo && tree.connectionInfo.confidence > confidence) {
        const combined = combinedTransaction(tree, parentConfidence, parentType)
        transactions.push(combined)

        if (tree.children) {
          const children = tree.children.map(c => ({
            tree: c,
            parentConfidence: tree.connectionInfo?.confidence ?? 0,
            parentType: combined.combinedConnectionInfo.type,
          }))

          stack.push(...children)
        }
      }
    }
  }

  return transactions
}

function combinedTransaction (
  tree: TransactionTree,
  parentConfidence: number,
  parentType: string[]
): CombinedTransaction {
  const info: CombinedConnectionInfo = tree.connectionInfo
    ? { confidence: parentConfidence * tree.connectionInfo.confidence, type: [...parentType, tree.connectionInfo.type] }
    : { confidence: parentConfidence, type: parentType }

  return {
    id: tree.id,
    age: tree.age,
    name: tree.name,
    geoInfo: tree.geoInfo,
    phone: tree.phone,
    combinedConnectionInfo: info,
  }
}

function rootTransactionCombined (tree: TransactionTree): CombinedTransaction {
  return {
    id: tree.id,
    age: tree.age,
    geoInfo: tree.geoInfo,
    name: tree.name,
    phone: tree.phone,
    combinedConnectionInfo: {
      confidence: 1,
      type: []
    },
  }
}
