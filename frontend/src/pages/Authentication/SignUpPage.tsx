import { Box, Typography, FormControlLabel, Checkbox, Button, CircularProgress } from "@mui/material"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthPageLayout from "./AuthPageLayout";
import StyledTextField from "../../components/commons/TextFields/StyledTextField";
import { CheckCircleOutline, ConfirmationNumberOutlined, EmailOutlined, PasswordOutlined } from "@mui/icons-material";
import { signInWithEmail, signUpWithEmail } from "../../services/auth.service";
import { useState } from "react";
import { green } from "@mui/material/colors";

interface Props {
    toggleAuthenticationMode: () => void
    notify: (message: String) => void
}

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email address is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Password confirmation is required'),
});

const SignUpPage: React.FC<Props> = ({ toggleAuthenticationMode, notify }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            rememberMe: true,
        },
        validationSchema: validationSchema,

        onSubmit: async (values) => {
            if (!loading && !success) {
                setSuccess(false);
                setLoading(true);
                try {
                    await signUpWithEmail(values)
                    await signInWithEmail(values)
                    setSuccess(true)
                } catch (error: any) {
                    console.error("Form submission error:", error.message)
                    notify("Error: " + error.message)
                }
                setLoading(false)
            }

        },
    });

    return (
        <AuthPageLayout>
            <Box sx={{
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
                        {StyledTextField(formik, 'email', 'Enter your email address here...', 'email', <EmailOutlined />)}
                        {StyledTextField(formik, 'password', 'Enter your password here...', 'password', <PasswordOutlined />)}
                        {StyledTextField(formik, 'confirmPassword', 'Confirm your password here...', 'password', <ConfirmationNumberOutlined />)}
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
                                        <Typography>Create an account</Typography>
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
    )
}

export default SignUpPage