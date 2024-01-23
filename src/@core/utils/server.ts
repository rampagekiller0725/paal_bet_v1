import { headers } from "next/headers"

export const getPathname = () => {
  const heads = headers();
  return heads.get('next-url') ?? '/';
}

export const getNetwork = () => {
  const heads = headers();
  return heads.get('network') ?? '10';
}

