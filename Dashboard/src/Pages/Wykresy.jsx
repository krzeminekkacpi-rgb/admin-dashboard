import { WykresyComp } from '../components/WykresyComp'
import { NavPanel } from '../components/NavPanel'

export function Wykresy({ operatorName, hidden, setHidden, pageHide, btc, eth, sol, gold, silver, oil, usd, eur }) {
    return (
        <div className='Main-view'>
                        <NavPanel hidden={hidden} pageHide={pageHide} operatorName={operatorName}/>
                        <WykresyComp hidden={hidden} setHidden={setHidden} btc={btc} eth={eth} sol={sol} gold={gold} silver={silver} oil={oil} usd={usd} eur={eur}/>
                      </div>
    )
}