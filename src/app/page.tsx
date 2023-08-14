"use client"
import { srcTxIds, versions } from "@/lib/const"
import {
  Card,
  Title,
  BarChart,
  Subtitle,
  Metric,
  Text,
  LineChart,
} from "@tremor/react"
import { dataFormatter, fetchDataByTxId } from "@/lib/func"
import { useEffect, useState } from "react"
import Head from "next/head"
import Header from "@/components/Header"
import {
  MonthlyDeploymentData,
  VersionDeploymentData,
  SourceData,
} from "@/lib/types"

export default function Home() {
  const [totalQueries, setTotalQueries] = useState<number | null>(null)
  const [totalDeployment, setTotalDeployment] = useState<number | null>(null)
  const [versionDeployment, setVersionDeployment] = useState<
    VersionDeploymentData[]
  >([])
  const [monthlyDeployment, setMonthlyDeployment] = useState<
    MonthlyDeploymentData[]
  >([])

  const fetchDeployedDatabase = async (sourceData: SourceData[]) => {
    const _totalDeployment = sourceData.reduce((total, data) => {
      return total + (data?.paging?.items || 0)
    }, 0)

    const _versionDeployment: VersionDeploymentData[] = ([] = sourceData.map(
      (data, index) => {
        return {
          name: versions[index],
          "Number of deployed database": data?.paging?.items,
        }
      }
    ))

    setTotalDeployment(_totalDeployment)
    setVersionDeployment(_versionDeployment)
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

  const fetchDeploymentByMonth = async (sourceData: SourceData[]) => {
    const countsByMonth: Record<string, number> = {}

    // Counting the contracts by month
    sourceData.forEach((data) => {
      data.contracts.forEach((contract) => {
        const date = new Date(Number(contract.blockTimestamp) * 1000)
        const monthYearKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`

        countsByMonth[monthYearKey] = (countsByMonth[monthYearKey] || 0) + 1
      })
    })

    // Converting to an array and sorting by date
    const sortedDates = Object.keys(countsByMonth).sort()
    let _accumulatedTotal = 0
    const _monthlyDeployment = sortedDates.map((date) => {
      _accumulatedTotal += countsByMonth[date]
      return {
        date,
        Total: _accumulatedTotal,
      }
    })

    setMonthlyDeployment(_monthlyDeployment)
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
      fetchDeploymentByMonth(newData)
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
          <Subtitle>Loading.....</Subtitle>
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
          <Subtitle>Loading.....</Subtitle>
        )}
      </Card>
      <br />
      <br />
      <Card>
        <Title>Database Deployed For Each Contract Version</Title>
        <BarChart
          className="mt-6"
          data={versionDeployment}
          index="name"
          categories={["Number of deployed database"]}
          colors={["violet"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
          showXAxis={false}
          noDataText="Fetching Data....."
        />
      </Card>
      <br />
      <br />
      <Card>
        <Title>Cumulative Total Database Deployed</Title>
        <LineChart
          className="mt-6"
          data={monthlyDeployment}
          index="date"
          categories={["Total"]}
          colors={["emerald"]}
          valueFormatter={dataFormatter}
          yAxisWidth={40}
          noDataText="Fetching Data....."
        />
      </Card>
    </div>
  )
}
