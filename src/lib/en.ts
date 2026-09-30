const l = {
  metadata: {
    title: 'EmailApp | Remote Programming Companies',
    description:
      'Discover remote programming and IT companies that hire across Europe.',
  },
  home: {
    appName: 'EmailApp',
    eyebrow: 'Remote companies. Direct contacts.',
    heroTitle: 'Choose your specialty.',
    heroHighlight: 'Get up to 200 company emails for direct applications.',
    heroDescription:
      'Filter remote programming employers hiring across Europe and start reaching out in minutes.',
    selectSpecializationPrompt:
      'Choose a specialization to see matching companies and their contact emails.',
    loadError: 'We could not load companies right now. Please try again later.',
    footer: 'EmailApp — remote programming companies hiring across Europe.',
  },
  filters: {
    specialization: 'Specialization',
    chooseSpecialization: 'Choose a specialization',
    region: 'Region',
    anyRegion: 'Any region',
    eu: 'EU',
    europe: 'Europe',
    countries: 'Countries',
    submit: 'Show company contacts',
  },
  companies: {
    sectionLabel: 'Companies',
    empty: 'No companies match these filters',
  },
  auth: {
    appName: 'EmailApp',
    signupMetadataTitle: 'Create account | EmailApp',
    signupMetadataDescription:
      'Create an EmailApp account and verify your email address.',
    signupTitle: 'Create your account',
    signupDescription: 'Verify your email to access company contact addresses.',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    passwordHint: 'Use at least 8 characters.',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    invalidSignupDetails: 'Enter a valid email and a secure password.',
    passwordsDoNotMatch: 'Passwords do not match.',
    accountExists: 'An account with this email already exists.',
    signupSuccess:
      'Account created. Check your inbox to verify your email address.',
    signupFailed: 'We could not create your account. Please try again.',
    verifyMetadataTitle: 'Verify email | EmailApp',
    verifyMetadataDescription: 'Verify your EmailApp email address.',
    verifyTitle: 'Verify your email',
    verifyDescription:
      'Confirm your email address before accessing company contacts.',
    verifyButton: 'Verify email address',
    verifying: 'Verifying...',
    verificationSuccess: 'Your email address has been verified.',
    invalidVerificationLink: 'This verification link is invalid or expired.',
    verificationFailed: 'We could not verify your email. Please try again.',
    backHome: 'Back to home',
  },
} as const;

export default l;
export type Language = typeof l;
