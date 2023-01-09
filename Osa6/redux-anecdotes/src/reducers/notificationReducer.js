import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message:'',
    isVisible: false,
    timeoutID: undefined
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification: (state, action) => {
          clearTimeout(state.timeoutID)
          state.message = action.payload;
          state.isVisible = true;
        },
        hideNotification: (state, action) => {
          state.message = '';
          state.isVisible = false;
        },
        setTimeoutId: (state, action) => {
          state.timeoutID = action.payload;
        },
      },
})

export const { showNotification, hideNotification, setTimeoutId } = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(showNotification(message))

    const timeoutID = setTimeout(() => {
      dispatch(hideNotification(''));
    }, time*1000);

    dispatch(setTimeoutId(timeoutID))
  }
}

export default notificationSlice.reducer