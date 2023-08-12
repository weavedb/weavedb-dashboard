"use client"
import { srcTxIds, versions } from "@/lib/const"
import { Card, Title, BarChart, Subtitle, Metric, Text } from "@tremor/react"
import { dataFormatter, fetchDataByTxId } from "@/lib/func"
import Image from "next/image"
import { useEffect, useState } from "react"
import Head from "next/head"
import Header from "@/components/Header"
import { ChartData } from "@/lib/types"

export default function Home() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [totalCount, setTotalCount] = useState(null)

  const fetchData = async () => {
    try {
      const newData: ChartData[] = await Promise.all(
        srcTxIds.map(async (srcTxId, index) => {
          const data = await fetchDataByTxId(srcTxId)
          const itemCount = data?.paging?.items || 0
          return {
            name: versions[index],
            "Number of deployed database": data?.paging?.items,
            itemCount,
          }
        })
      )
      console.log(newData)
      const total = newData.reduce(
        (prevTotal, item) => prevTotal + item.itemCount,
        0
      )
      setTotalCount(total)
      setChartData(newData)
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
        <Metric>{totalCount ? totalCount : "Fetching Data....."}</Metric>
      </Card>
      <br />
      <br />
      <br />
      <br />

      <Card>
        <Title>WeaveDB</Title>
        <Subtitle>
          Contract versions with their corresponding number of deployed database
        </Subtitle>
        <BarChart
          className="mt-6"
          data={chartData}
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
