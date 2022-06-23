import { Stream } from 'stream';

export const mockCommonService = {
  uploadImageToImgur: () => 'https://imgur.image.link/',
  xlsxToJson: () => new Stream.Readable(),
  createSearchRegex: (text: string) => {
    return new RegExp(text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  },
};
