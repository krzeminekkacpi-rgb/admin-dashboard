import { KalPage } from '../components/KalPage'
import { NavPanel } from '../components/NavPanel'
import './Kalendarz.css'

export function Kalendarz({ operatorName, hidden, setHidden, newEvent, newEventWeek, setNewEvent, setNewEventWeek, pageHide }) {
    return (
        <div className='Main-view'>
                        <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                        <KalPage hidden={hidden} setHidden={setHidden} newEvent={newEvent} newEventWeek={newEventWeek} setNewEvent={setNewEvent} setNewEventWeek={setNewEventWeek}/>
                      </div>
    )
}