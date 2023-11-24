import { Check } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";

const StyledTextField = (
    formik: any,
    field: string,
    placeholder: string,
    type: string = 'text',
    startAdornment: React.ReactNode = null,
) => (
    <TextField
        margin="normal"
        required
        fullWidth
        type={type}
        placeholder={placeholder}
        {...formik.getFieldProps(field)}
        InputProps={{
            startAdornment: startAdornment && <InputAdornment position="start" sx={{
                transition: 'opacity 0.25s ease-in-out', 
                opacity: formik.touched[field] && Boolean(formik.errors[field]) ? 1 : (
                    !formik.errors[field] && formik.values[field].length > 0 ? 1: 0.5
                ), 
                color: formik.touched[field] && Boolean(formik.errors[field]) ? 'red' : (
                    !formik.errors[field] && formik.values[field].length > 0 ? 'green' : ''
                )}}>
                    {!formik.errors[field] && formik.values[field].length > 0 ? <Check /> : startAdornment}
                    </InputAdornment>,
        }}
        inputProps={{
            sx: {
                '&::placeholder': {
                    color: formik.touched[field] && Boolean(formik.errors[field]) ? 'red' : '',
                    opacity: formik.touched[field] && Boolean(formik.errors[field]) ? 1 : 0.5,
                }
            },
            autoComplete: field === 'password' ? 'current-password' : 'off', 
        }}
        error={formik.touched[field] && Boolean(formik.errors[field])}
        helperText={formik.touched[field] && formik.errors[field]}
    />
);

export default StyledTextField