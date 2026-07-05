'use client';

import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Dashboard, EmojiEvents, Loyalty, Receipt, Person } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/dashboard', icon: <Dashboard /> },
  { label: 'Rewards', href: '/dashboard/rewards', icon: <EmojiEvents /> },
  { label: 'Coupons', href: '/dashboard/coupons', icon: <Loyalty /> },
  { label: 'Purchases', href: '/dashboard/purchases', icon: <Receipt /> },
  { label: 'Profile', href: '/dashboard/profile', icon: <Person /> },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const currentValue = navItems.findIndex((item) => pathname.startsWith(item.href));

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        borderTop: '1px solid rgba(124,58,237,0.1)',
        boxShadow: '0px -4px 20px rgba(124,58,237,0.08)',
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
      }}
    >
      <BottomNavigation
        value={currentValue === -1 ? 0 : currentValue}
        onChange={(_, newVal) => router.push(navItems[newVal].href)}
        sx={{
          bgcolor: 'white',
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            color: '#9CA3AF',
            minWidth: 0,
            '&.Mui-selected': {
              color: '#7C3AED',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.65rem',
            fontWeight: 600,
            '&.Mui-selected': { fontSize: '0.7rem' },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction key={item.href} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
