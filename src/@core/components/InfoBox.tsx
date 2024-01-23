import { Field } from '../enums';
import useAppContext from '../hooks/useAppContext';
import { Market } from '../interfaces';

interface Props {
  title: string
  field: Field
  value: string | number
  market: Market
  onClick: VoidFunction
}

export default function InfoBox({title, field, value, market, onClick}: Props) {
  const {data} = useAppContext();
  const selected = data.positions.find(p => p.market.address === market.address && p.position === field);

  return (
    <div className="info-box" onClick={onClick} style={selected ? {backgroundColor: 'yellow', color: 'black', fontWeight: 'bold'} : undefined}>
      <span className="field-text">{title}</span>
      <span className="value-text">{value}</span>
    </div>
  )
}