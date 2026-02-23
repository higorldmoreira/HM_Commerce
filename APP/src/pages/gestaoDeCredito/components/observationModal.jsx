import React from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useCommercial } from '../../../contexts/CommercialContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
}

export const ObservationModal = ({ open, onClose, observation }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Observação
        </Typography>

        <TextField type="text" multiline rows={3} fullWidth value={observation ?? ""} disabled />
      </Box>
    </Modal>
  )
}
