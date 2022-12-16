import React from 'react'
import styles from './App.module.css'
import { TradeTable } from './TradeTable/TradeTable'

export const App = () => (
  <div className={styles.app}>
    <h1 className={styles.visuallyHidden}>Test_React_Trade</h1>
    <h2>
      Ход торгов&nbsp;
      <b>Тестовые торги на аппарат ЛОТОС №2033564 (09.11.2020 07:00)</b>
    </h2>
    <h3>Уважаемые участники, во время вашего хода вы можете изменить параметры торгов, указанных в таблице:&nbsp;</h3>
    <TradeTable />
  </div>
)
