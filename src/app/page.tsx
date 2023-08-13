"use client"
import { srcTxIds, versions } from "@/lib/const"
import { Card, Title, BarChart, Subtitle, Metric, Text } from "@tremor/react"
import { dataFormatter, fetchDataByTxId } from "@/lib/func"
import { use, useEffect, useState } from "react"
import Head from "next/head"
import Header from "@/components/Header"
import { DeploymentData, SourceData } from "@/lib/types"

export default function Home() {
  const [totalQueries, setTotalQueries] = useState<number | null>(null)
  const [totalDeployment, setTotalDeployment] = useState<number | null>(null)
  const [deploymentData, setDeploymentData] = useState<DeploymentData[]>([])

  const fetchDeployedDatabase = async (sourceData: SourceData[]) => {
    const _totalDeployment = sourceData.reduce((total, data) => {
      return total + (data?.paging?.items || 0)
    }, 0)

    const _deployChartData: DeploymentData[] = ([] = sourceData.map(
      (data, index) => {
        return {
          name: versions[index],
          "Number of deployed database": data?.paging?.items,
        }
      }
    ))

    setTotalDeployment(_totalDeployment)
    setDeploymentData(_deployChartData)
    console.log("_totalDeployment", _totalDeployment)
  }

  const fetchTotalQueries = async (sourceData: SourceData[]) => {
    const _totalQueries = sourceData.reduce((total, source) => {
      return (
        total +
        source.contracts.reduce(
          (contractTotal, contract) =>
            contractTotal + Number(contract?.interactions || 0),
          0
        )
      )
    }, 0)
    setTotalQueries(_totalQueries)
    console.log("_totalQueries:", _totalQueries)
  }

  const fetchData = async () => {
    try {
      const newData = await Promise.all(
        srcTxIds.map(async (srcTxId, index) => {
          const _data = await fetchDataByTxId(srcTxId)
          return _data
        })
      )
      fetchDeployedDatabase(newData)
      fetchTotalQueries(newData)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Head>
        <title>WeaveDB Dashboard</title>
        <meta name="description" content="NoSQL Database as a Smart Contract" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <br />
      <br />
      <Card
        className="max-w-xs mx-auto"
        decoration="top"
        decorationColor="indigo"
      >
        <Text>Total Database Deployed</Text>

        {totalDeployment ? (
          <Metric>{totalDeployment}</Metric>
        ) : (
          <Subtitle>"Loading....."</Subtitle>
        )}
      </Card>
      <br />
      <br />
      <Card
        className="max-w-xs mx-auto"
        decoration="top"
        decorationColor="indigo"
      >
        <Text>Total Write Queries</Text>

        {totalQueries ? (
          <Metric>{totalQueries}</Metric>
        ) : (
          <Subtitle>"Loading....."</Subtitle>
        )}
      </Card>
      <br />
      <br />
      <Card>
        <Title>WeaveDB</Title>
        <Subtitle>
          Contract versions with their corresponding number of deployed database
        </Subtitle>
        <BarChart
          className="mt-6"
          data={deploymentData}
          index="name"
          categories={["Number of deployed database"]}
          colors={["violet"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          showXAxis={false}
          noDataText="Fetching Data....."
        />
      </Card>
    </div>
  )
}
