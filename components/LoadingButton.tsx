import React from 'react'
import styles from './LoadingButton.module.css';

const LoadingButton = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <div className={styles.loader}></div>
      <div className='font-medium text-lg text-center text-[#344054]'>
        Please wait...
      </div>
    </div>
  )
}

export default LoadingButton
