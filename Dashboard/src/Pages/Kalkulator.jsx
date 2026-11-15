import { CalMain } from '../components/CalMain'
import { NavPanel } from '../components/NavPanel'

export function Kalkulator({ operatorName, hidden, setHidden, pageHide }) {
    return (
        <div className='Main-view'>
                        <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                        <CalMain hidden={hidden} setHidden={setHidden}/>
                      </div>
    )
}