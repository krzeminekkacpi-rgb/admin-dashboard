import { NotePage } from '../components/NotePage'
import { NavPanel } from '../components/NavPanel'
import './Kalendarz.css'

export function Notatnik({ hidden, setHidden, pageHide, operatorName }) {
    return (
        <div className='Main-view'>
                        <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                        <NotePage hidden={hidden} setHidden={setHidden}/>
                      </div>
    )
}