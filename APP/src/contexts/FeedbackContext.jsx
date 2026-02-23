import React, { useState, useCallback, createContext, useContext } from 'react'
import { Snackbar, Alert } from '@mui/material'

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'info'
  })

  const showMessage = useCallback((message, severity = 'info') => {
    setFeedback({ open: true, message, severity })
  }, [])

  const handleClose = () => {
    setFeedback(prev => ({ ...prev, open: false }))
  }

  return (
    <FeedbackContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={feedback.severity} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  )
}

export const useFeedback = () => useContext(FeedbackContext)
