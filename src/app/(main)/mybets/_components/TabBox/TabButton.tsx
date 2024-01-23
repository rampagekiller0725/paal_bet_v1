import { Badge } from '@mui/material';

interface Props {
  title: string
  selected: boolean
  badgeText?: string
  onClick: () => void
}

export default function TabButton({ title, selected, badgeText, onClick }: Props) {
  return (
    <>
      {badgeText &&
        <div className="tab-button" onClick={onClick} style={selected ? { borderBottomColor: 'white', fontWeight: 'bold' } : undefined}>
          <Badge badgeContent={badgeText} color='error' invisible={!badgeText}>
            {title}
          </Badge>
        </div>
      }
      {!badgeText &&
        <div className="tab-button" onClick={onClick} style={selected ? { borderBottomColor: 'white', fontWeight: 'bold' } : undefined}>
          {title}
        </div>
      }
    </>
  )
}