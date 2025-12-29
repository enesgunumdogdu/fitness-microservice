export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/fitness-oauth2/protocol/openid-connect/auth`,
    tokenEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/fitness-oauth2/protocol/openid-connect/token`,
    logoutEndpoint: `${import.meta.env.VITE_KEYCLOAK_URL}/realms/fitness-oauth2/protocol/openid-connect/logout`,
    redirectUri: window.location.origin,
    logoutRedirect: window.location.origin,
    scope: 'openid profile email offline_access',
    autoLogin: false,
  }