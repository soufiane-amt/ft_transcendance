// utils/toast.js
import { toast } from 'react-toastify';

export const showToast = (message : string, options : string) => {
  const saveSettings = async () => {
    // Simulating an asynchronous save operation
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() < 0.5;
        if (success) {
          resolve();
        } else {
          reject();
        }
      }, 2000);
    });
  };
    if (options === 'success')
    {
        toast.success(message);
    }
    else if (options === 'error')
    {
        toast.error(message);
    }
    else if (options === 'add')
    {
      const promise: Promise<void> | (() => Promise<void>) = () => saveSettings();
      toast.promise(
        promise, 
        {
          success: message
        }
      )
    }

  };
