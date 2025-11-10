export function redirectToGoogleOAuth() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '332708538777-vvd74v3311l093p8b257o2m2einv9o0c.apps.googleusercontent.com';
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI || 'https://bibinoma.com/oauth2/callback';
  const scope = encodeURIComponent('email profile');
  const authUrl =
    'https://accounts.google.com/o/oauth2/v2/auth' +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    '&response_type=code' +
    `&scope=${scope}`;
  window.location.href = authUrl;
}


