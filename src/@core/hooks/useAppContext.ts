import { useContext } from "react"
import { AppContext } from "../providers/ContextProvider"

const useAppContext = () => {
  return useContext(AppContext);
}

export default useAppContext;