import { combineTransaction } from './transactions/combineTransactions'
import { inspect } from 'util'

async function test (): Promise<void> {
  const transactions = await combineTransaction('5c868b22eb7069b50c6d2d32', 0)

  console.log(inspect(transactions, false, Infinity))
}

test()
