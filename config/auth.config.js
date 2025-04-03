module.exports = {
    secret: "lexx-secret-key",

    login_expire_days: 365,

    validationMessages: {
        usernameNotFound: 'Invalid login credentials.',
        mobileNotFound: 'Mobile is invalid.',
        emailNotFound: 'Invalid login credentials.',
        passwordError: 'Invalid login credentials.',
        otpNotMatch: 'OTP does not match.',
        confirmPwdNotMatch: 'New password and confirm password must be same'
    },

    messages: {
        tokensMissing: "Authorization Required!",
        adminAccess: "The action is beyond your pay-grade!",
        cutomserAccess: "Unauthorized Access!",
        default: "Unauthorized Access!",
    }
};