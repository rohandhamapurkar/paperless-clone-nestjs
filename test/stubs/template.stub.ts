import { Stream } from 'stream';

const template: any = {
  _id: '61632f59405d4e410947991f',
  userId: '61632f59405d4e410947991d',
  name: 'name',
  imageUrl: 'https://imgur-image-url/',
  createdOn: new Date(),
  updatedOn: new Date(),
};
template.save = () => template;

export const templateStub: {
  _id: string;
  userId: string;
  name: string;
  imageUrl: string;
  createdOn: Date;
  updatedOn: Date;
  save(): any;
} = template;

export const templateImageFileStub = {
  fieldname: 'string',
  originalname: 'string',
  encoding: 'image/jpg',
  mimetype: 'string',
  size: 5000,
  stream: new Stream.Readable(),
  destination: 'string',
  filename: 'string',
  path: 'string',
  buffer: Buffer.from('test', 'utf8'),
};
