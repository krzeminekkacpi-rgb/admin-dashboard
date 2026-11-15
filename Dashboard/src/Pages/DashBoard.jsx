import { NavPanel } from '../components/NavPanel'
import { Board } from '../components/Board'
import './DashBoard.css'

export function DashBoard({ operatorName, hidden, setHidden, pageHide, pogodaDzis, pogodaTydzien, timeFrame, setTimeFrame, newEvent, newEventWeek, btc, eth, sol, gold, silver, oil, usd, eur, marketHide }) {
    return (
        <div className='Main-view'>
                <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                <Board operatorName={operatorName} hidden={hidden} setHidden={setHidden} pogodaDzis={pogodaDzis} pogodaTydzien={pogodaTydzien} timeFrame={timeFrame} setTimeFrame={setTimeFrame} newEvent={newEvent} newEventWeek={newEventWeek} btc={btc} eth={eth} sol={sol} gold={gold} silver={silver} oil={oil} usd={usd} eur={eur} marketHide={marketHide}/>
              </div>
    )
}