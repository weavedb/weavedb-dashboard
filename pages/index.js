import { Card, Title, BarChart, Subtitle, Metric, Text } from "@tremor/react"
import { useEffect, useState } from "react"
import Head from "next/head"

export default function Home() {
  const versions = [
    "v0.27.0",
    "v0.26.4",
    "v0.26.3",
    "v0.26.2",
    "v0.26.1",
    "v0.26.0",
    "v0.25.0",
    "v0.24.0",
    "v0.23.0",
    "v0.22.0",
    "v0.21.0",
    "v0.20.0",
    "v0.19.0",
    "v0.18.0",
    "v0.17.0",
    "v0.16.0",
    "v0.15.0",
    "v0.14.0",
    "v0.13.0",
    "v0.12.0",
    "v0.11.0",
    "v0.10.0",
    "v0.9.0",
    "v0.8.0",
    "v0.7.0",
  ]
  const [chartData, setChartData] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const dataFormatter = (number) => {
    return Intl.NumberFormat("us").format(number).toString()
  }

  useEffect(() => {
    const srcTxIds = [
      "jsZqVEOGdMFAvVlof_WXi6DO5vWxhteiG91xVPiIwqQ",
      "QhbIPso1lx8wbHx4c7225L9PkNYh-Djp6N_YCjqdr_E",
      "rTp2E6oipzJODmAGbqWbo2wzagoV7tt3JRyBsyVgo6A",
      "-TBbRLWsP8wAlj8y5bh7RHRdwGJ7kT9urFvEbn1UomQ",
      "OSYm83qQFF5gf4m3BbdZtrHMHjVAMPJcBhfZiJVYjYE",
      "zdP_QTSZ2zO9Nxa1sPAKhyR4geua1_a621_fZm2XPKU",
      "_156pyhqtRr6Zh3KX-Hp4q3-CIrMa2leTqKdu2HpXB8",
      "fuSpwZIxJtIq3eTdbRgBSwsFYd5f6oMwKB91RR3hXOo",
      "_gUR1-XzkZhsMlzZLIUEYp-rg73b9W-bhSrRIb06zKk",
      "JglKj1PoKu1moG7H3uAP1HxnXRH4kDIuqQzil1ZlbLc",
      "nNz22bZG_Y2K9r68iqnL1iOPEu8rvqCWNE4TX17OsgA",
      "pfzMiEGWwoyAL33M2ceRUkgG3XvxUyjxUqiyLNHD66g",
      "jhQ9kWIqjNYzGrg96zr7q7xbot4NwkKT8UZwsrb-fvE",
      "fHH99N1FIxkU-vYwbg30eYHpBpOjN_Qa3k3ch73Yz04",
      "WEFEoY33ntimvQzUtC7bS3A1bsGRrtXST_z9E8yx9yw",
      "viUyq-GD9kxDYRVkvT-NPjEvzLIgQYEx70DoliFwytQ",
      "ZRREoTw94icjJVyVnCHnR7T_Q96AWLLLnYugmt9OgAQ",
      "ThKJQwNBy2tdELecqmlG86bo9NacyMxquQef1DOLBPA",
      "4lSfFFQIpX37GMdab6c4ZdWli33b70qu_KJan5vB1ZI",
      "8dUFGgl05GiunNN_5LMBYEorkS2Znr1-L2JYVb0Cpm4",
      "9vwjxsX0856iTRFsEMEXBC7UFJ3Utok_e6dFyB1s4TA",
      "F-nDTtI50sJYDJyPq3cqnQg2UApu9_bBoy8NItEPPQI",
      "eufj3L8Qx1JPLVnoJHWRNNj5FvJ4E8OT07MZ9BhmpT8",
      "cvDUleFkH8v_hU-pBwInngotLszGpUGF-e_Ask6juwI",
      "7vXOxkxZ_eG0mwBO4pc_mB_oh1MY4pmHXzRQJfdMGCw",
    ]

    const fetchData = async (srcTxId) => {
      try {
        const response = await fetch(
          `https://gateway.warp.cc/gateway/contracts-by-source?id=${srcTxId}`
        )
        const jsonData = await response.json()
        return jsonData
      } catch (error) {
        console.error("Error fetching data:", error)
        return null
      }
    }

    ;(async () => {
      try {
        const newData = await Promise.all(
          srcTxIds.map(async (srcTxId, index) => {
            const data = await fetchData(srcTxId)
            const itemCount = data?.paging?.items || 0
            setTotalCount((prevTotal) => prevTotal + itemCount)
            return {
              name: versions[index],
              "Number of deployed database": data?.paging?.items,
            }
          })
        )
        setChartData(newData)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  const Header = () => {
    return (
      <>
        <div style={{ display: "flex", alignItems: "center", padding: "28px" }}>
          <svg
            width="48"
            height="29"
            viewBox="0 0 63 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M46.9565 5.0801L42.0443 10.0458L47.6338 15.6344L53.2232 21.223L58.1117 16.3356C60.8003 13.6476 63 11.3949 63 11.3296C63 11.2642 60.4954 8.71406 57.4344 5.66257L51.8688 0.114502L46.9565 5.0801ZM4.90823 10.0632L0 14.981L14.3981 29.4331L28.7961 43.8854L33.7655 38.915L38.7347 33.9446L24.3348 19.5451C16.4149 11.6253 9.90822 5.14547 9.87559 5.14547C9.84296 5.14547 7.60764 7.35841 4.90823 10.0632ZM28.576 10.0632L23.6597 14.981L32.5129 23.9129L41.3659 32.8447L46.3525 27.8592L51.3389 22.8738L42.4753 14.0096C37.6004 9.13434 33.5849 5.14547 33.552 5.14547C33.5192 5.14547 31.28 7.35841 28.576 10.0632Z"
              fill="url(#paint0_linear_512_13479)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_512_13479"
                x1="-4.69387e-07"
                y1="21.9999"
                x2="63"
                y2="21.9999"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#B51DA6" />
                <stop offset="0.50702" stop-color="#7924BA" />
                <stop offset="0.971875" stop-color="#265EC7" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ marginLeft: ".4em", fontWeight: 800 }}>WeaveDB</span>
        </div>
      </>
    )
  }

  return (
    <>
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
        <Metric>{totalCount}</Metric>
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
    </>
  )
}
