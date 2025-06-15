'use client'
import React, { useEffect } from 'react'
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};


const Layout = ({children}: LayoutProps) => {

const pathname = usePathname();

  return (
<div className="w-full">


         <div className="py-4 md:py-8 md:pl-4 md:pr-8 fixed w-30vh md:w-64">
    <Sidebar />
  </div>


  <main className="flex-1 border-r border-l ml-20 md:ml-64 min-h-screen">

      {children}

  </main>
 
   
     </div>
    
    
  )
}

export default Layout