import NoBets from "@/@core/components/NoBets"
import { Position, PositionType } from "@/@core/interfaces"
import { Spinner } from "@nextui-org/react"

interface Props {
  positions: {[key in PositionType]: Position[]}
  loading: boolean
  SingleCard: (props: Position) => JSX.Element
  ParlayCard: (props: Position) => JSX.Element
}

export default function PositionBox({ positions, loading, SingleCard, ParlayCard }: Props) {

  if (loading) {
    return <div className="position-box loading-box">
      <Spinner />
    </div>
  }

  if ((positions.singles.length + positions.parlays.length) === 0) {
    return <NoBets />
  }

  return (
    <div className="position-box">
      {positions.singles.map((pos, index) => <SingleCard key={index} {...pos} />)}
      {positions.parlays.map((pos, index) => <ParlayCard key={index} {...pos} />)}
    </div>
  );
}