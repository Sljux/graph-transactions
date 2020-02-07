import { Request, Response } from 'express'
import { combineTransaction } from '../transactions'
import { TransactionNotFound } from '../data'

export function getTransactions (request: Request, response: Response): void {
  const { id, confidence } = parseQueryParams(request.query)

  if (!id) {
    response.status(400)
      .send('Query parameter transactionId required')
    return
  }

  if (confidence === undefined
    || Number.isNaN(confidence)
    || confidence < 0
    || confidence > 1
  ) {
    response.status(400)
      .send('Query param confidenceLevel required and needs to be a valid float between 0 and 1')
    return
  }

  combineTransaction(id, confidence)
    .then(transactions => {
      response.json(transactions)
    })
    .catch(err => {
      let status = 500
      let message = 'Internal server error'

      if (err instanceof TransactionNotFound) {
        status = 404
        message = `Transaction ${id} not found`
      }

      console.error(err)

      response.status(status).send(message)
    })
}

type Params = { id?: string, confidence?: number }

function parseQueryParams (
  { transactionId, confidenceLevel }: { transactionId: string, confidenceLevel: string }
): Params {
  const params: Params = {}

  if (transactionId) {
    params.id = transactionId
  }

  if (confidenceLevel) {
    params.confidence = parseFloat(confidenceLevel)
  }

  return params
}
