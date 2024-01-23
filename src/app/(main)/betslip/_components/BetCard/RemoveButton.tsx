import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface Props {
  onClick: () => void
}

export default function RemoveButton({ onClick }: Props) {
  return (
    <div className="remove-button" onClick={onClick}>
      <DeleteOutlineIcon />
    </div>
  )
}