export type AuthCookiePayload = {
  sid: string;       // session_id
  uid: string;       // user_id
  cid: string;       // company_id
  iat: number;
  exp: number;
};

export const AUTH_COOKIES = {
  ACCESS: 'mill_access',
  REFRESH: 'mill_refresh',
  CSRF: 'mill_csrf',
} as const;