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
  Flex,
  BadgeDelta,
} from "@tremor/react"
import { dataFormatter, fetchDataByTxId } from "@/lib/func"
import { useEffect, useState } from "react"
import Head from "next/head"
import Header from "@/components/Header"
import {
  MonthlyQueriesData,
  YearlyDeploymentData,
  MonthlyDeploymentData,
  VersionDeploymentData,
  SourceData,
} from "@/lib/types"
import Background from "@/components/Background"

export default function Home() {
  const [totalQueries, setTotalQueries] = useState<number | null>(null)
  const [totalDeployment, setTotalDeployment] = useState<number | null>(null)
  const [versionDeployment, setVersionDeployment] = useState<
    VersionDeploymentData[]
  >([])
  const [monthlyDeployment, setMonthlyDeployment] = useState<
    MonthlyDeploymentData[]
  >([])
  const [yearlyDeployment, setYearlyDeployment] = useState<
    YearlyDeploymentData[]
  >([])
  const [yearlyGrowthRate, setYearlyGrowthRate] = useState<number | null>(null)
  const [monthlyQueries, setMonthlyQueries] = useState<MonthlyQueriesData[]>([])

  const fetchDeployedDatabase = async (sourceData: SourceData[]) => {
    const _totalDeployment = sourceData.reduce((total, data) => {
      return total + (data?.paging?.items || 0)
    }, 0)

    const _versionDeployment: VersionDeploymentData[] = ([] = sourceData.map(
      (data, index) => {
        return {
          name: versions[index].version,
          "Number of deployed database": data?.paging?.items,
        }
      }
    ))

    setTotalDeployment(_totalDeployment)
    setVersionDeployment(_versionDeployment)
    console.log("_totalDeployment", _totalDeployment)
    console.log("_versionDeployment", _versionDeployment)
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
    sourceData.forEach((data, index) => {
      data.contracts.forEach((contract) => {
        const monthYearKey = versions[index].monthYear
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
    console.log("_monthlyDeployment:", _monthlyDeployment)
  }

  const fetchDeploymentPerYear = async (sourceData: SourceData[]) => {
    const countsByYear: Record<string, number> = {}

    sourceData.forEach((data, index) => {
      data.contracts.forEach((contract) => {
        const yearKey = versions[index].year
        countsByYear[yearKey] = (countsByYear[yearKey] || 0) + 1
      })
    })

    const _yearlyDeployment: YearlyDeploymentData[] = Object.entries(
      countsByYear
    )
      .map(([year, count]) => ({
        year: year.toString(),
        "Deployment Per Year": count,
      }))
      .sort((a, b) => Number(a.year) - Number(b.year))

    // Calculate percentage growth for the last two years
    const length = _yearlyDeployment.length
    if (length >= 2) {
      const lastYearDeployment =
        _yearlyDeployment[length - 1]["Deployment Per Year"]
      const secondToLastYearDeployment =
        _yearlyDeployment[length - 2]["Deployment Per Year"]

      const percentageGrowth =
        (lastYearDeployment / secondToLastYearDeployment) * 100
      const wholeNumberPercentageGrowth = Math.round(percentageGrowth)
      setYearlyGrowthRate(wholeNumberPercentageGrowth)
    }

    setYearlyDeployment(_yearlyDeployment)
    console.log("_yearlyDeployment:", _yearlyDeployment)
  }

  const fetchQueriesByMonth = async (sourceData: SourceData[]) => {
    const countsByMonth: Record<string, number> = {}

    sourceData.forEach((data) => {
      data.contracts.forEach((contract) => {
        const date = new Date(Number(contract.blockTimestamp) * 1000)
        const monthYearKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`

        countsByMonth[monthYearKey] =
          (countsByMonth[monthYearKey] || 0) + Number(contract?.interactions)
      })
    })

    const sortedDates = Object.keys(countsByMonth).sort()
    let _accumulatedTotal = 0
    const _monthlyQueries = sortedDates.map((date) => {
      _accumulatedTotal += countsByMonth[date]
      return {
        date,
        "Write Queries": _accumulatedTotal,
      }
    })

    setMonthlyQueries(_monthlyQueries)
  }

  const fetchQueriesPerMonth = async (sourceData: SourceData[]) => {
    const countsByMonth: Record<string, number> = {}

    sourceData.forEach((data) => {
      data.contracts.forEach((contract) => {
        const date = new Date(Number(contract.blockTimestamp) * 1000)
        const monthYearKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`

        countsByMonth[monthYearKey] =
          (countsByMonth[monthYearKey] || 0) + Number(contract?.interactions)
      })
    })

    const _monthlyQueries: MonthlyQueriesData[] = Object.keys(countsByMonth)
      .sort()
      .map((key) => ({
        date: key,
        "Write Queries": countsByMonth[key],
      }))
  }

  const fetchData = async () => {
    try {
      const newData = await Promise.all(
        srcTxIds.map(async (srcTxId, index) => {
          const _data = await fetchDataByTxId(srcTxId)
          return _data
        })
      )
      console.log("newData", newData)
      fetchDeployedDatabase(newData)
      fetchTotalQueries(newData)
      fetchDeploymentByMonth(newData)
      fetchDeploymentPerYear(newData)
      fetchQueriesByMonth(newData)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-[-1] w-full h-full">
          <Background />
        </div>
        <div className="container mx-auto px-4 dark">
          <Head>
            <title>WeaveDB Dashboard</title>
            <meta
              name="description"
              content="NoSQL Database as a Smart Contract"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="col-span-1 lg:col-span-2 lg:flex lg:flex-col lg:space-y-6">
              {/* Card 1 */}
              <Card
                className="max-w-xs mx-auto lg:mb-auto"
                decoration="top"
                decorationColor="violet"
              >
                <Text>Total Database Deployed</Text>

                {totalDeployment ? (
                  <Metric>{totalDeployment.toLocaleString()}</Metric>
                ) : (
                  <Subtitle>Loading.....</Subtitle>
                )}
              </Card>
              {/* Card 2 */}
              <Card
                className="max-w-xs mx-auto lg:mt-auto"
                decoration="top"
                decorationColor="violet"
              >
                <Text>Total Write Queries</Text>

                {totalQueries ? (
                  <Metric>{totalQueries.toLocaleString()}</Metric>
                ) : (
                  <Subtitle>Loading.....</Subtitle>
                )}
              </Card>
            </div>
            <div className="col-span-1 lg:col-span-2">
              {/* Line Chart 1 */}
              <Card>
                <Title>Cumulative Total Database Deployed</Title>
                <LineChart
                  className="mt-6"
                  data={monthlyDeployment}
                  index="date"
                  categories={["Total"]}
                  colors={["emerald"]}
                  valueFormatter={dataFormatter}
                  yAxisWidth={48}
                  noDataText="Fetching Data....."
                />
              </Card>
            </div>
            <div className="col-span-1 lg:col-span-2">
              {/* Line Chart 2 */}
              <Card>
                <Title>Cumulative Total Write Queries</Title>
                <LineChart
                  className="mt-6"
                  data={monthlyQueries}
                  index="date"
                  categories={["Write Queries"]}
                  colors={["emerald"]}
                  valueFormatter={dataFormatter}
                  yAxisWidth={48}
                  noDataText="Fetching Data....."
                />
              </Card>
            </div>
            <div className="col-span-1 lg:col-span-2">
              {/* Bar Chart 1 */}
              <Card
                className="max-w-xs mx-auto"
                decoration="top"
                decorationColor="violet"
              >
                <Flex justifyContent="between" alignItems="center">
                  <Text>Growth Percentage</Text>
                  {yearlyGrowthRate ? (
                    <BadgeDelta
                      deltaType="moderateIncrease"
                      isIncreasePositive={true}
                      size="xs"
                    >
                      {yearlyGrowthRate?.toLocaleString() + "%"}
                    </BadgeDelta>
                  ) : null}
                </Flex>
                {yearlyGrowthRate ? (
                  <Metric>{yearlyGrowthRate?.toLocaleString() + "%"}</Metric>
                ) : null}

                <BarChart
                  className="mt-6"
                  data={yearlyDeployment}
                  index="year"
                  categories={["Deployment Per Year"]}
                  colors={["violet"]}
                  valueFormatter={dataFormatter}
                  yAxisWidth={48}
                  noDataText="Fetching Data....."
                />
              </Card>
            </div>
            <div className="col-span-1 lg:col-span-4">
              {/* Bar Chart 2 */}
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
                  noDataText="Fetching Data....."
                />
              </Card>
            </div>
          </div>
          <br />
        </div>
      </div>
    </>
  )
}
