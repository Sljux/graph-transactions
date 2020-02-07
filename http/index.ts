import express, { Request, NextFunction, Response } from 'express'
import helmet from 'helmet'
import { getTransactions } from './getTransactionsHandler'

export const app = express()

app.use(helmet())

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/api/transaction', getTransactions)
