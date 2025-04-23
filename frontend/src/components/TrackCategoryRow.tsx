import React from 'react'
import useIsMobile from './useIsMobile';

const TrackCategoryRow = () => {


  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  return  (
    <div className='flex justify-center items-center w-full'>
        <div className='flex w-1/5'>
            <h1 className='text-zinc-400 text-md font-light'>Track</h1>
        </div>
        <div className='flex w-1/5 justify-center'>
            <h1 className='text-zinc-400 text-md font-light'>Uploaded By</h1>
         </div>
        <div className='flex w-1/5 justify-end'>
            <h1 className='text-zinc-400 text-md font-light text-right'>Date Uploaded</h1>
        </div>
    </div>
  )
}

export default TrackCategoryRow