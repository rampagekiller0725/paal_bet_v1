'use client'

import { ReactNode, SetStateAction, createContext, useState } from "react"
import { PositionDto } from "../interfaces"

interface ContextData {
  openDetailed: string[]
  positions: PositionDto[]
}

const initials: ContextData = {
  openDetailed: [],
  positions: [],
}

export const AppContext = createContext<{
  data: ContextData,
  setData: (data: Partial<ContextData>) => void,
  setDataWith: (value: SetStateAction<ContextData>) => void
}>({
  data: initials,
  setData: () => {},
  setDataWith: () => {},
});

const AppContextProvider = (props: {children: ReactNode}) => {
  const [data, setData] = useState(initials);

  return (
    <AppContext.Provider value={{
      data,
      setData: (data) => setData(d => ({...d, ...data})),
      setDataWith: setData,
    }}>
      {props.children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;