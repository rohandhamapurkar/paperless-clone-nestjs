export class UserTokenDto {
  iss: string;
  _id: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
}
