import { ThemeProvider } from "@emotion/react"
import { Box, Typography, Button, Checkbox, FormControlLabel, CircularProgress } from "@mui/material"
import defaultTheme from "../../theme"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthPageLayout from "./AuthPageLayout";
import { CheckCircleOutline, EmailOutlined, PasswordOutlined } from "@mui/icons-material";
import StyledTextField from "../../components/commons/TextFields/StyledTextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmail } from "../../services/auth.service";
import { green } from "@mui/material/colors";

interface Props {
    toggleAuthenticationMode: () => void
    notify: (message: String) => void
}

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email address is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignInPage: React.FC<Props> = ({ toggleAuthenticationMode, notify }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: true,
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            if (!loading && !success) {
                setSuccess(false);
                setLoading(true);
                try {
                    await signInWithEmail(values);
                    setLoading(false);
                    setSuccess(true);
                    setTimeout(async () => {
                        navigate('/')
                    }, 2000);
                } catch (error: any) {
                    console.error("Form submission error:", error.message);
                    setLoading(false);
                    notify("Error: " + error.message);
                }
            }
        },
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <AuthPageLayout>
                <Box sx={{
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
                        {StyledTextField(formik, 'email', 'Enter your email address here...', 'email', <EmailOutlined />)}

                        {StyledTextField(formik, 'password', 'Enter your password here...', 'password', <PasswordOutlined />)}
                        <FormControlLabel
                            sx={{
                                mb: 2
                            }}
                            control={
                                <Checkbox
                                    checked={formik.values.rememberMe}
                                    onChange={formik.handleChange('rememberMe')}
                                    color="primary" />
                            }
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
                                disabled={(Object.keys(formik.errors).length > 0 || formik.values.email.length === 0 || formik.values.password.length === 0) && !loading || success}
                                variant="outlined"
                                sx={{
                                    ...(success && {
                                        bgcolor: green[500],
                                        '&:hover': {
                                            bgcolor: green[700],
                                        },
                                    }),
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transition: 'background-color 0.3s ease',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        transition: 'opacity 0.3s ease',
                                    }}
                                >
                                    {loading && (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: green,
                                                top: '50%',
                                                left: '50%',
                                                opacity: success ? 0 : 1,
                                            }}
                                        />
                                    )}
                                    {!loading && (
                                        success ? (
                                            <CheckCircleOutline sx={{ marginRight: 1, opacity: 1 }} />
                                        ) : (
                                            <Typography>Continue with email</Typography>
                                        )
                                    )}
                                </Box>
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