import { ThemeProvider } from "@emotion/react"
import { Box, Typography, TextField, FormControlLabel, Checkbox, Button } from "@mui/material"
import defaultTheme from "../../theme"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthPageLayout from "./AuthPageLayout";

interface Props {
    toggleAuthenticationMode: () => void
}

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
});

const SignUpPage: React.FC<Props> = ({ toggleAuthenticationMode }) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            console.log(values);
        },
    });
    return (
        <ThemeProvider theme={defaultTheme}>
            <AuthPageLayout>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                }}>
                    <Box>
                        <Typography sx={{ letterSpacing: 2 }} component="h1" variant="h4">
                            Welcome to Strive
                        </Typography>
                        <Typography sx={{ letterSpacing: 2 }} component="h1" variant="h6" fontWeight="300">
                            Start your productivity journey with other achievers
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email-signup"
                                label="Email Address"
                                autoComplete="email"
                                variant="outlined"
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                id="password-signup"
                                label="Password"
                                autoComplete="password"
                                variant="outlined"
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                id="confirmPassword"
                                label="Confirm Password"
                                autoComplete="new-password"
                                variant="outlined"
                                {...formik.getFieldProps('confirmPassword')}
                                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                        </>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={Object.keys(formik.errors).length > 0 || formik.values.email.length === 0 || formik.values.password.length === 0}
                                variant="outlined"
                                sx={{
                                    my: 3,
                                }}
                            >
                                Create new account
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Typography sx={{ opacity: .8 }}>
                                    Or, already have an account?
                                </Typography>
                                <Button onClick={toggleAuthenticationMode} sx={{
                                    ':hover': {
                                        bgcolor: 'transparent',
                                        color: 'white',
                                    }
                                }}>
                                    Log in
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </AuthPageLayout>
        </ThemeProvider>)
}

export default SignUpPage