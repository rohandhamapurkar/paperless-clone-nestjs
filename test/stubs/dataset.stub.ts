import { Stream } from 'stream';
import { userStub } from './user.stub';

export const dataset: any = {
  _id: '61632f59405d4e410947991e',
  userId: userStub._id,
  name: 'test-dataset',
  createdOn: new Date(),
  headers: ['a', 'b', 'c'],
};
dataset.save = () => dataset;

export const datasetStub: {
  _id: string;
  userId: string;
  name: string;
  createdOn: Date;
  headers: string[];
  save(): any;
} = dataset;

export const datasetRowsStub = [
  { _id: 'ObjectId', a: 1, b: 1, c: 1 },
  { _id: 'ObjectId', a: 2, b: 2, c: 2 },
];

export const datasetFileStub = {
  fieldname: 'string',
  originalname: 'string',
  encoding: 'application/xlsx',
  mimetype: 'string',
  size: 5000,
  stream: new Stream.Readable(),
  destination: 'string',
  filename: 'string',
  path: 'string',
  buffer: Buffer.from('test', 'utf8'),
};
