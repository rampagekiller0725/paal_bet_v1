import { tokens } from "@/@core/constants"
import useTouchElse from "@/@core/hooks/useTouchElse"
import { Token, TokenType } from "@/@core/interfaces"
import { useRef, useState } from "react"

interface Props {
  tokenType: TokenType
  onChange: (type: TokenType) => void
}

export default function TokenSelect({ tokenType, onChange }: Props) {
  const [contentVisible, setContentVisible] = useState(false);
  const titleRef = useRef<any>();
  const contentRef = useRef<any>();
  
  const ToggleVisible = () => {
    setContentVisible(visible => !visible);
  }

  const TokenChange = (type: TokenType) => {
    onChange(type);
    setContentVisible(false);
  }

  useTouchElse(titleRef, contentRef, contentVisible, () => setContentVisible(false));
  
  return (
    <div className="token-select">
      <div className="token-select-title" ref={titleRef} onClick={ToggleVisible}>{tokenType}</div>
      {contentVisible &&
        <div className="token-select-content" ref={contentRef}>
          {Object.keys(tokens).map((type, index) => (
            <div key={index} className="token-box" onClick={() => TokenChange(type as TokenType)}>{type}</div>
          ))}
        </div>
      }
    </div>
  )
}