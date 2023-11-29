export const fetchDataByTxId = async (srcTxId: string) => {
    try {
        const response = await fetch(
            `https://gw.warp.cc/gateway/contracts-by-source?id=${srcTxId}`
        )
        const jsonData = await response.json()
        return jsonData
    } catch (error) {
        console.error("Error fetching data:", error)
        return null
    }
}

export const dataFormatter = (num: number) => {
    return Intl.NumberFormat("us").format(num).toString()
}