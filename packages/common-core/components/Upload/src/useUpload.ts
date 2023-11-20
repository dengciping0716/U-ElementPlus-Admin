import { downloadByForm } from '@common/utils/file';
import { compressImage } from '@common/utils/compressImage';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadInstance, UploadProps, UploadUserFile, UploadFile, UploadRawFile, UploadRequestOptions } from 'element-plus';
import { Ref } from 'vue';

import { MUploadProps } from './index';

export const useUpload = function (self: Ref<UploadInstance | undefined>, props: MUploadProps) {
  const { appContext } = getCurrentInstance()!;
  const attrs = useAttrs();
  const fileList = ref<UploadUserFile[]>();

  const previewBindValues = reactive({
    visible: false,
    initialIndex: 0,
    urlList: [] as string[],
    'z-index': '3000',
    onClose: () => (previewBindValues.visible = false),
  });

  // /** 自定义上传 */
  //   async function httpRequest(options: UploadRequestOptions) {
  //   }

  function onExceed(files: File[], uploadFiles: UploadUserFile[]) {
    const { limit } = attrs;

    ElMessage.warning(
      `当前限制选择 ${limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + uploadFiles.length} 个文件`
    );
  }

  async function beforeRemove(uploadFile: UploadFile, uploadFiles: UploadUserFile[]) {
    console.log('beforeRemove', appContext);
    return ElMessageBox.confirm(`确定移除 ${uploadFile.name}？`, {}, appContext)
      .then((data) => true)
      .catch((e) => false);
  }

  /** */
  function onChange(uploadFile: UploadFile, uploadFiles: UploadFile[]) {
    console.log('onChange:', uploadFile, uploadFiles);
    const { maxSize = 0, nameLength = 0 } = props;

    if (nameLength > 0 && uploadFile.name.length > nameLength) {
      ElMessage.error(`上传文件名称不能超过${nameLength}个字符!`);
      self.value!.handleRemove(uploadFile);
    }

    compressImage(uploadFile.raw).then((cfile) => {
      uploadFile.raw = cfile;
      //   let fileSize = cfile?.size || uploadFile?.size || 0;
      //   uploadFile.fileSize = (fileSize / 1024).toFixed(1);
      uploadFile.size = cfile?.size;
    });
    //

    // 选中文件
    if (maxSize > 0 && uploadFile.size && uploadFile.size / 1024 / 1024 > maxSize) {
      ElMessage.error(`上传文件大小不能超过 ${maxSize}MB!`);
      self.value!.handleRemove(uploadFile);
    }
  }

  /** */
  function onPreview(uploadFile: any | (UploadFile & { fileName: string; filePath: string })) {
    const { fileName = '', filePath = '', url } = uploadFile;
    let previewSrc = url || `${resolveUrl('/fastdfs/file/preview')}?filePath=${filePath}&fileName=${fileName}`;

    if (checkImg(uploadFile)) {
      const previewSrcList = createPreList(unref(fileList));

      previewBindValues.urlList = previewSrcList;
      previewBindValues.initialIndex = imageIndex(previewSrc, previewSrcList);
      previewBindValues.visible = true;
    } else {
      // 新开页签预览
      window.open(url, '_blank');
    }
  }
  /** 区分图片 */
  function checkImg(uploadFile: UploadFile) {
    const { fileName = '', filePath = '', url, raw } = uploadFile as any;
    if (raw?.type.startsWith('image')) return true;

    let name = fileName || filePath || url;
    if (name) {
      var index = name.lastIndexOf('.');
      var ext = name.substr(index + 1);
      return ['jpeg', 'jpg', 'png', 'gif'].includes(ext?.toLocaleLowerCase());
    }

    return false;
  }

  /** 生成图片预览url */
  function createPreList(uploadFiles: any[] = []): string[] {
    const previewSrcList: string[] = uploadFiles.map((item: any) => {
      return item.url;
    });
    return previewSrcList;
  }

  /** 计算图片下标 */
  function imageIndex(previewSrc: string, previewSrcList: string[]) {
    let previewIndex = 0;
    const srcIndex = previewSrcList.indexOf(previewSrc);
    if (srcIndex >= 0) {
      previewIndex = srcIndex;
    }
    return previewIndex;
  }

  /** 附件文件列表中下载（仅回显的文件可下载） */
  function fileDownload(row: any) {
    let params = {
      //   token: cookie.get('token') || '',
      fileName: row.fileName,
      filePath: row.filePath,
    };
    downloadByForm(resolveUrl('/fastdfs/file/download'), params);
  }

  return { fileList, previewBindValues, onChange, onPreview, onExceed, fileDownload, beforeRemove };
};
