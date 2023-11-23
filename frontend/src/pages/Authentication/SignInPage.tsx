import { ThemeProvider } from "@emotion/react"
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from "@mui/material"
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
});

const SignInPage: React.FC<Props> = ({ toggleAuthenticationMode }) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
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
                            Welcome, Achiever
                        </Typography>
                        <Typography sx={{ letterSpacing: 2 }} component="h1" variant="h6" fontWeight="300">
                            Log in to sync your content.
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email-signin"
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
                            id="password-signin"
                            label="Password"
                            autoComplete="password"
                            variant="outlined"
                            {...formik.getFieldProps('password')}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
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
                                Continue with email
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Typography sx={{ opacity: .8 }}>
                                    Don't have an account?
                                </Typography>
                                <Button onClick={toggleAuthenticationMode} sx={{
                                    ':hover': {
                                        bgcolor: 'transparent',
                                        color: 'white',
                                    }
                                }}>
                                    Sign Up
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </AuthPageLayout>
        </ThemeProvider >)
}

export default SignInPage