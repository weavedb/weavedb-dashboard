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

export type VersionData = {
  version: string
  monthYear: string
  year: string
}

export type VersionDeploymentData = {
  name: string
  "Deployed database count": number
}

export type MonthlyDeploymentData = {
  date: string
  Total: number
}

export type YearlyDeploymentData = {
  year: string
  "Deployments Per Year": number
  "Percentage Growth"?: number
}

export type MonthlyQueriesData = {
  date: string
  "Transactions": number
}

export type MonthlyGrowthRateData = {
  date: string
  "Growth Percentage": number
}