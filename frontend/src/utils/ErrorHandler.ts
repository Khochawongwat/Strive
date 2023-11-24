export function matchAuthErrorCode(error: any): String {
    let errorMessage

    switch (error.code) {
        case "auth/claims-too-large":
            errorMessage = "The claims payload provided to setCustomUserClaims() exceeds the maximum allowed size of 1000 bytes.";
            break;

        case "auth/email-already-exists":
            errorMessage = "The provided email is already in use by an existing user. Each user must have a unique email.";
            break;

        case "auth/id-token-expired":
            errorMessage = "The provided Firebase ID token is expired.";
            break;

        case "auth/id-token-revoked":
            errorMessage = "The Firebase ID token has been revoked.";
            break;

        case "auth/internal-error":
            errorMessage = "The Authentication server encountered an unexpected error while trying to process the request. The error message should contain the response from the Authentication server containing additional information. If the error persists, please report the problem to our Bug Report support channel.";
            break;

        case "auth/invalid-argument":
            errorMessage = "An invalid argument was provided to an Authentication method. The error message should contain additional information.";
            break;

        case "auth/invalid-claims":
            errorMessage = "The custom claim attributes provided to setCustomUserClaims() are invalid.";
            break;

        case "auth/invalid-continue-uri":
            errorMessage = "The continue URL must be a valid URL string.";
            break;

        case "auth/invalid-creation-time":
            errorMessage = "The creation time must be a valid UTC date string.";
            break;

        case "auth/invalid-credential":
            errorMessage = "The credential used to authenticate the Admin SDKs cannot be used to perform the desired action. Certain Authentication methods such as createCustomToken() and verifyIdToken() require the SDK to be initialized with a certificate credential as opposed to a refresh token or Application Default credential. See Initialize the SDK for documentation on how to authenticate the Admin SDKs with a certificate credential.";
            break;

        case "auth/invalid-disabled-field":
            errorMessage = "The provided value for the disabled user property is invalid. It must be a boolean.";
            break;

        case "auth/invalid-display-name":
            errorMessage = "The provided value for the displayName user property is invalid. It must be a non-empty string.";
            break;

        case "auth/invalid-dynamic-link-domain":
            errorMessage = "The provided dynamic link domain is not configured or authorized for the current project.";
            break;

        case "auth/invalid-email":
            errorMessage = "The provided value for the email user property is invalid. It must be a string email address.";
            break;

        case "auth/invalid-email-verified":
            errorMessage = "The provided value for the emailVerified user property is invalid. It must be a boolean.";
            break;

        case "auth/invalid-hash-algorithm":
            errorMessage = "The hash algorithm must match one of the strings in the list of supported algorithms.";
            break;

        case "auth/invalid-hash-block-size":
            errorMessage = "The hash block size must be a valid number.";
            break;
        case "auth/invalid-login-credentials":
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
            break;
            
        case "auth/too-many-requests":
            errorMessage = "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
            break;

        case "auth/insufficient-permission":
            errorMessage = "Insufficient permission. Please contact support.";
            break;
        case "auth/session-cookie-expired":
            errorMessage = "The provided Firebase session cookie is expired.";
            break;
        case "auth/session-cookie-revoked":
            errorMessage = "The Firebase session cookie has been revoked.";
            break;
        case "":
            errorMessage = "An unknown error has occurred. Please try again";
            break
        default:
            errorMessage = error.code
            break;
    }
    return errorMessage
}