import { useState, useEffect, useMemo, useCallback } from 'react'
import TimerController from '../utils/timer/timerController'
import getNetworkTime from '../utils/networkTime/getNetworkTime'

const PARTICIPANTS_AMOUNT = 5
const TURN_TIME = 120000
const FULL_CYCLE_TIME = TURN_TIME * PARTICIPANTS_AMOUNT
const PERIODICALY_CORRECT_TIME = 5000

const numberToString = (num: number | undefined) => {
  if (!num) {
    return '00'
  }
  return num < 10 ? `0${num}` : `${num}`
}

export const useTimer = () => {
  const [isDocumentHidden, setIsDocumentHidden] = useState(false)
  const [startHiddenTimeStamp, setStartHiddenTimeStamp] = useState(0)
  const [minutes, setMinutes] = useState<number | undefined>()
  const [seconds, setSeconds] = useState<number | undefined>()
  const [activeParticipant, setActiveParticipant] = useState<number | undefined>()

  const getActiveParticipant = useCallback(async () => {
    const networkTime = await getNetworkTime()
    const elapsedFullCycleTime = networkTime % FULL_CYCLE_TIME
    const restFullCycleTime = FULL_CYCLE_TIME - elapsedFullCycleTime
    const activeParticipantNumber = Math.floor(elapsedFullCycleTime / TURN_TIME)
    const participantTime = restFullCycleTime % TURN_TIME || TURN_TIME
    return { activeParticipantNumber, participantTime }
  }, [])

  const startTimer = useCallback(async () => {
    const { activeParticipantNumber, participantTime } = await getActiveParticipant()

    setActiveParticipant(activeParticipantNumber)

    TimerController.start(participantTime)
    TimerController.addChangeListener(({ min, sec }) => {
      setMinutes(prev => (prev !== min ? min : prev))
      setSeconds(prev => (prev !== sec ? sec : prev))
    })
  }, [getActiveParticipant])

  const correctTimer = useCallback(async () => {
    const { activeParticipantNumber, participantTime } = await getActiveParticipant()
    TimerController.correct(participantTime)
    setActiveParticipant(activeParticipantNumber)
  }, [getActiveParticipant])

  useEffect(() => {
    startTimer()

    TimerController.addStopListener(() => {
      startTimer()
    })

    return () => {
      TimerController.removeAllListeners()
      TimerController.stop()
    }
  }, [startTimer])

  useEffect(() => {
    const visibilitychangeHandler = () => {
      setIsDocumentHidden(document.visibilityState === 'hidden')
    }
    document.addEventListener('visibilitychange', visibilitychangeHandler)
    return () => document.removeEventListener('visibilitychange', visibilitychangeHandler)
  }, [])

  useEffect(() => {
    if (isDocumentHidden) {
      setStartHiddenTimeStamp(Date.now())
    }
  }, [isDocumentHidden])

  useEffect(() => {
    if (!isDocumentHidden && startHiddenTimeStamp) {
      console.log('correct timer after hidding document')
      correctTimer()
      setStartHiddenTimeStamp(0)
    }
  }, [isDocumentHidden, startHiddenTimeStamp, correctTimer])

  useEffect(() => {
    const correctInterval = setInterval(() => {
      console.log('periodically correct timer')
      correctTimer()
    }, PERIODICALY_CORRECT_TIME)

    return () => clearInterval(correctInterval)
  }, [correctTimer])

  const time = useMemo(() => `00:${numberToString(minutes)}:${numberToString(seconds)}`, [minutes, seconds])
  return { time, activeParticipant }
}
