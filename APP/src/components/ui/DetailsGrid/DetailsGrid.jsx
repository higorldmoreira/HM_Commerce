import React from 'react';
import { Grid, Stack, Typography, Divider } from '@mui/material';

/**
 * DetailsGrid - Grid de detalhes com label/valor
 * @param {Object} props - Props do componente
 * @param {Array} props.fields - Array de campos para exibir
 * @param {Object} props.data - Dados do objeto
 * @param {Object} props.sx - Estilos customizados
 */
export const DetailsGrid = ({ fields = [], data = {}, sx = {}, ...props }) => {
  return (
    <Grid container spacing={3} sx={sx} {...props}>
      {fields.map((field, index) => (
        <Field
          key={field.key || index}
          label={field.label}
          value={field.value || (field.render ? field.render(data[field.key], data) : data[field.key])}
          xs={field.xs || 12}
          md={field.md || 4}
        />
      ))}
    </Grid>
  );
};

/**
 * Field - Campo individual do grid
 * @param {Object} props - Props do componente
 * @param {string} props.label - Label do campo
 * @param {any} props.value - Valor do campo
 * @param {number} props.xs - Tamanho em xs
 * @param {number} props.md - Tamanho em md
 */
const Field = ({ label, value, xs = 12, md = 4 }) => {
  return (
    <Grid item xs={xs} md={md}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" component="div">
          {label}
        </Typography>
        <Typography variant="body1" component="div">
          {value ?? '-'}
        </Typography>
      </Stack>
    </Grid>
  );
};
