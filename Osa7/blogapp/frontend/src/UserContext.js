import { createContext, useReducer, useContext } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  return action
}


export const useUserValue = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[0]
}

export const useUserDispatch = () => {
  const userAndDispatch = useContext(UserContext)
  return userAndDispatch[1]
}


export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch] }>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
