import {setApiLoading} from '../redux/actions/config';
import ApiCloudinaryKit from './ApiCloudinaryKit';
import {store} from '../redux';

export const cloudinaryUpload = async (image, transactionInfo, isTagged) => {
  if (!image?.src) {
    console.log('image empty :', image);
    return null;
  }

  const photo = {
    uri: image?.src,
    type: image?.type,
    name: image?.name,
  };

  const data = new FormData();
  data.append('file', photo);
  data.append('upload_preset', 'staging');
  data.append('cloud_name', 'trupaid');
  if (isTagged) {
    let tags = transactionInfo?.brand?.name;   // tags = Nike,
    data.append('tags', tags);
  }

  store.dispatch(setApiLoading(true));
  try {
    const res = await ApiCloudinaryKit.post('image/upload', data);
    console.log('cloudinary image upload success :', res?.data);
    const cloudinaryDataPayload = {
      asset_id: res?.data?.asset_id,
      public_id: res?.data?.public_id,
      version: res?.data?.version,
      version_id: res?.data?.version_id,
      signature: res?.data?.signature,
      width: res?.data?.width,
      height: res?.data?.height,
      format: res?.data?.format,
      resource_type: res?.data?.resource_type,
      created_at: res?.data?.created_at,
      tags: res?.data?.tags,
      bytes: res?.data?.bytes,
      type: res?.data?.type,
      etag: res?.data?.etag,
      placeholder: res?.data?.placeholder,
      url: res?.data?.url,
      secure_url: res?.data?.secure_url,
      access_mode: res?.data?.access_mode,
      original_filename: res?.data?.original_filename,
      // original_extension: image.src.split('.').pop(),
    };

    store.dispatch(setApiLoading(false));
    return cloudinaryDataPayload;
  } catch (err) {
    console.log('cloudinary image upload error: ', err);
    store.dispatch(setApiLoading(false));
    return null;
  }
};
