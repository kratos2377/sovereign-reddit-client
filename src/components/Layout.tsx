'use client'
import React, { useEffect } from 'react'
import Sidebar from './Sidebar';

type LayoutProps = {
  children: React.ReactNode;
};


const Layout = ({children}: LayoutProps) => {

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