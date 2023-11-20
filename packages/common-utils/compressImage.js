import imageCompression from 'browser-image-compression';

export const compressImage = async function(file, op = {}) {
  if (!file) return;
  if (!file.type?.toLocaleLowerCase().startsWith('image/')) {
    return file;
  }
  const options = {
    initialQuality: 0.75,
    // maxSizeMB: 3,
    // maxWidthOrHeight: 1080,
    useWebWorker: true
  };
  let fileOfBlob = await imageCompression(file, Object.assign({}, options, op));
  return new File([fileOfBlob], fileOfBlob.name);
};
