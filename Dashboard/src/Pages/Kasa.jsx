import { Cash } from '../components/Cash'
import { NavPanel } from '../components/NavPanel'

export function Kasa({ operatorName, hidden, setHidden, pageHide }) {
    return (
        <div className='Main-view'>
                        <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                        <Cash hidden={hidden} setHidden={setHidden}/>
                      </div>
    )
}