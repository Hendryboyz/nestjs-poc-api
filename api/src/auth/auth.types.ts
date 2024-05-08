export type OAuthUserInfo = {
  idp: string;
  id: string; // subject(sub)
  name: string;
  firstName: string;
  lastName: string
  email: string;
}