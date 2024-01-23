import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { HTMLAttributes, forwardRef } from "react";

namespace My {
  export interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean
    icon?: any
    to?: Url
  }

  export const Button = forwardRef<any, ButtonProps>(function ({
    selected, children, to,
    ...other
  }:  ButtonProps, ref) {
    const content = <div {...other}>{children}</div> ;
    return (
      <div ref={ref}>
        {to && (
          <Link href={to} scroll={false} as={to}>
            {content}
          </Link>
        )}
        {!to && content}
      </div>
    )
  });

  Button.displayName = 'Button';
}

export default My;