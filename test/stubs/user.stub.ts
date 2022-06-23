import { UserTokenDto } from 'src/auth/dto/user-token-payload.dto';

export const userStub: UserTokenDto = {
  iss: 'string',
  _id: '61632f59405d4e410947991d',
  sub: 'string',
  aud: ['string'],
  iat: 100,
  exp: 100,
  azp: 'string',
  scope: 'string',
};

export const paginationStub = {
  pageNo: '1',
  pageSize: '10',
  searchText: '',
};
