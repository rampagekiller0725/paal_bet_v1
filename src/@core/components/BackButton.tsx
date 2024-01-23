import My from "./Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BackButton(props: My.ButtonProps) {
  return (
    <My.Button className="back-button" {...props}>
      <ArrowBackIcon />
    </My.Button>
  )
}