export interface ConnectionInfo {
  type: string
  confidence: number
}

export interface Transaction {
  id: string
  age: number
  name: string
  phone: string
  geoInfo: {
    latitude: number
    longitude: number
  },
  connectionInfo?: ConnectionInfo
}

export interface TransactionTree extends Transaction {
  children?: TransactionTree[]
}

export interface CombinedConnectionInfo {
  type: string[]
  confidence: number
}

export interface CombinedTransaction extends Transaction {
  combinedConnectionInfo: CombinedConnectionInfo
}
