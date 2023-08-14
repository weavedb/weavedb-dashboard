export type Contracts = {
  blockHeight: number
  blockTimestamp: string
  bundlerTxId: string
  contractId: string
  interactions: string
  owner: string
  total: string
}

export type SourceData = {
  paging: Record<string, any>
  contracts: Contracts[]
}

export type VersionDeploymentData = {
  name: string
  "Number of deployed database": number
}

export type MonthlyDeploymentData = {
  date: string
  "Total": number
}