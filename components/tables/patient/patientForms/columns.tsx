'use client';
import { ColumnDef } from '@tanstack/react-table';
import { UserForm } from '@/types/userInterface';

export const columns = (): ColumnDef<UserForm>[] => [
  {
    accessorKey: 'questionType',
    header: 'Question Type'
  },
  {
    accessorKey: 'question',
    header: 'Question'
  },
  {
    accessorKey: 'answerTexts',
    header: 'Answer Texts'
  },
];
