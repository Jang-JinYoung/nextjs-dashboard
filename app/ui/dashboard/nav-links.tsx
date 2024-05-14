'use client';
 
import { usePathname } from 'next/navigation';
 
// ...
 
export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/dashboard', icon: "HomeIcon" },
    {
      name: 'Invoices',
      href: '/dashboard/invoices',
      icon: "DocumentDuplicateIcon",
    },
    { name: 'Customers', href: '/dashboard/customers', icon: "UserGroupIcon" },
  ];

  console.log("test");
 
  return (
    <div>123</div>
  );
}