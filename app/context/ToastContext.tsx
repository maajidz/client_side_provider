"use client";

import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

export type ToastVariant = 'default' | 'destructive';
export type ToastAction = 'create' | 'update' | 'delete' | 'status_update' | 'comment_update';

interface ToastContextType {
  showToast: (title: string, description: string, variant?: ToastVariant) => void;
  showActionToast: (action: ToastAction, isError?: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('default');

  const showToast = (title: string, description: string, variant: ToastVariant = 'default') => {
    setTitle(title);
    setDescription(description);
    setVariant(variant);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  const showActionToast = (action: ToastAction, isError: boolean = false) => {
    const messages: Record<ToastAction, { success: string; error: string }> = {
      create: {
        success: "New item has been created successfully",
        error: "Failed to create item"
      },
      update: {
        success: "Item has been updated successfully",
        error: "Failed to update item"
      },
      delete: {
        success: "Item has been deleted successfully",
        error: "Failed to delete item"
      },
      status_update: {
        success: "Status has been updated successfully",
        error: "Failed to update status"
      },
      comment_update: {
        success: "Comment has been added successfully",
        error: "Failed to add comment"
      }
    };

    const message = messages[action];
    showToast(
      isError ? 'Error' : 'Success',
      isError ? message.error : message.success,
      isError ? 'destructive' : 'default'
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, showActionToast }}>
      {children}
      {visible && (
        <Toast variant={variant}>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      )}
    </ToastContext.Provider>
  );
};
