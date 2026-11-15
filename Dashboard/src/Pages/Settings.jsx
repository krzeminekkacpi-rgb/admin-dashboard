import { Ustawienia } from '../components/Ustawienia'
import { NavPanel } from '../components/NavPanel'

export function Settings({ hidden, setHidden, pageHide, setPageHide, marketHide, setMarketHide, operatorName, setOperatorName }) {
    return (
        <div className='Main-view'>
                        <NavPanel operatorName={operatorName} hidden={hidden} pageHide={pageHide}/>
                        <Ustawienia setOperatorName={setOperatorName} operatorName={operatorName} hidden={hidden} setHidden={setHidden} pageHide={pageHide} setPageHide={setPageHide} marketHide={marketHide} setMarketHide={setMarketHide}/>
                      </div>
    )
}