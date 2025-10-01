import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';

interface FormInputProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>;
  label: string;
}

export const FormInput = ({ name, control, label, ...props }: FormInputProps) => {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          error={!!error}
          helperText={error?.message}
          fullWidth
          margin="normal"
          sx={{
            '& .MuiInputBase-input': { color: theme.palette.text.primary },
            '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: theme.palette.divider },
              '&:hover fieldset': { borderColor: theme.palette.primary.main },
            },
          }}
        />
      )}
    />
  );
};