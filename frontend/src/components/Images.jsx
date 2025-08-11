import { Image } from '@imagekit/react';

 const Images  =({src, className, w, h, alt}) => {
  return (
    <Image
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      src={src}
      className={className}
      loading='lazy'
      lqip = {{active: true, quality: 20}}
      width={w}
      height={h}
      alt={alt}
      transformation ={[
       {
         width: w,
         height: h,
       }

      ]}
    />
  )
}
export default Images;