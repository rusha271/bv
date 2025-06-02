"use client"

import { ReactNode } from 'react';
import { useForm, UseFormProps, FieldValues, Control } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, ButtonProps } from '@mui/material';
import * as yup from 'yup';
import { useThemeContext } from '@/contexts/ThemeContext';

interface FormProps<T extends FieldValues> {
  onSubmit: (data: T) => void;
  children: (props: { control: Control<T>; isSubmitting: boolean }) => ReactNode;
  validationSchema?: yup.ObjectSchema<any>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  submitButtonText?: string;
  submitButtonProps?: ButtonProps;
}

export const Form = <T extends FieldValues>({
  onSubmit,
  children,
  validationSchema,
  defaultValues,
  submitButtonText = 'Submit',
  submitButtonProps,
}: FormProps<T>) => {
  const { theme } = useThemeContext();
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<T>({
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    defaultValues,
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 2,
        borderRadius: 1,
      }}
    >
      {children({ control, isSubmitting })}
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': { backgroundColor: theme.palette.primary.dark },
        }}
        {...submitButtonProps}
      >
        {submitButtonText}
      </Button>
    </Box>
  );
};