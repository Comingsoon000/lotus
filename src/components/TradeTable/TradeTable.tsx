import React, { useCallback, useState } from 'react'
import clsx from 'clsx'
import styles from './TradeTable.module.css'
import { useTimer } from '../../hooks/useTimer'

const participants = [
  { id: 0, name: 'участник №1' },
  { id: 1, name: 'участник №2' },
  { id: 2, name: 'участник №3' },
  { id: 3, name: 'участник №4' },
  { id: 4, name: 'участник №5' },
]

export const TradeTable = (): JSX.Element => {
  const { time, activeParticipant } = useTimer()
  const [isAllActive, setIsAllActive] = useState(false)

  const checkBoxClickHandler = useCallback(() => {
    setIsAllActive(prev => !prev)
  }, [])

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          <tr>
            <th>
              <h4>ход</h4>
            </th>
            {participants.map(participant => (
              <th key={participant.id}>
                <div className={styles.timerBox}>
                  <div
                    className={clsx({
                      [styles.timer]: true,
                      [styles.hidden]: !isAllActive && activeParticipant !== participant.id,
                    })}
                  >
                    <div>{time}</div>
                  </div>
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th>
              <h4>параметры и требования</h4>
            </th>
            {participants.map(participant => (
              <th key={participant.id}>
                <h4>{participant.name}</h4>
              </th>
            ))}
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <label className={styles.label}>
        <input type="checkbox" className={styles.checkbox} checked={isAllActive} onChange={checkBoxClickHandler} />
        <p>сделать таймер активным для всех участников</p>
      </label>
    </div>
  )
}
