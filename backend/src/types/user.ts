export type Token = {
  token: string;
}

export interface IUser {
  name: string,
  email: string,
  password: string,
  tokens: Token[],
}
