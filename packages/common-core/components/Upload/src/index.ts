/** 统一upload */

import type {
  UploadInstance,
  UploadProps,
  UploadUserFile,
  UploadFile as UploadFile_,
  UploadRawFile,
  UploadRequestOptions,
} from 'element-plus';

export declare interface UploadFile extends UploadFile_ {
  file: UploadRawFile;
  fileSize: number;
  fileName: string;
  filePath: string;
}

export interface UploadPropsExt {
  maxSize?: number;
  nameLength?: number;
  showTips?: boolean;
  readonly?: boolean;
  showList?: boolean;
  modelValue?: UploadUserFile[];
}

export type MUploadProps = UploadPropsExt;
