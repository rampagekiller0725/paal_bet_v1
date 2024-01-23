interface Props {
  value: number
}

export default function ServiceFee({ value }: Props) {
  return (
    <div className="service-fee">
      <span>Service fee</span>
      <span>{value === 0 ? '_' : value}</span>
    </div>
  )
}