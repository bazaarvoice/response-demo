export function getenv() {
  // Change this to 'qa', 'stg' or 'prod'
  // depending on which environment you want to use
  return 'qa';
}

// Empty strings are placeholders to enter your credentials
export const configurations = {

  // configuration for QA environment
  qa: {
    auth: {
      passkey: '',
      client_id: '',
      client_secret: '',
      endpoint: 'https://qa.api.bazaarvoice.com/auth/v1'
    },
    clientResponse: {
      passkey: '',
      endpoint: 'https://qa.api.bazaarvoice.com/contentmanagement/v1'
    },
    conversations: {
      version: '5.4',
      passkey: '',
      endpoint: 'https://qa.api.bazaarvoice.com/data'
    }
  },

  // configuration for staging environment
  stg: {
    auth: {
      passkey: '',
      client_id: '',
      client_secret: '',
      endpoint: 'https://stg.api.bazaarvoice.com/auth/v1'
    },
    clientResponse: {
      passkey: '',
      endpoint: 'https://stg.api.bazaarvoice.com/contentmanagement/v1'
    },
    conversations: {
      passkey: '',
      endpoint: 'https://stg.api.bazaarvoice.com/data'
    }
  },

  // configuration for production environment
  prod: {
    auth: {
      passkey: '',
      client_id: '',
      client_secret: '',
      endpoint: 'https://api.bazaarvoice.com/auth/v1'
    },
    clientResponse: {
      passkey: '',
      endpoint: 'https://api.bazaarvoice.com/contentmanagement/v1'
    },
    conversations: {
      passkey: '',
      endpoint: 'https://api.bazaarvoice.com/data'
    }
  }
};
