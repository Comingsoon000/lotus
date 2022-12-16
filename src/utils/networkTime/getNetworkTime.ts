type FetchResults = {
  now: number
  backoff: number
}

const getNetworkTime = async (): Promise<number> => {
  const requestTime = Date.now() // фиксируем время начала запроса
  const res = await fetch('https://use.ntpjs.org/v1/time.json')
  const json: FetchResults = await res.json()
  const { now } = json // получаем время с сервера ntpjs
  const responseTime = Date.now() // фиксируем время получения ответа
  const deltaTime = responseTime - requestTime // высчитываем время на запрос до сервера
  // корректируем время, полученное с сервера, на дельту пока до него шел запрос
  const networkTime = Math.round(now * 1000) + Math.round(deltaTime)
  return networkTime
}

export default getNetworkTime
