import React from 'react';
import { LoginForm } from '@/features/auth';
import { UserCard } from '@/entities/user';

export const HomePage = () => {
  return (
    <div>
      <LoginForm />
      <UserCard />
    </div>
  );
};
