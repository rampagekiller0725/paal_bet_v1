import My from "@/@core/components/Button";

export default function ClaimButton(props: My.ButtonProps) {
  return (
    <My.Button {...props} className="claim-button">
      Claim
    </My.Button>
  )
}