'use client'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import { FaHome, FaSearch, FaUser, FaSignOutAlt, FaPlus } from 'react-icons/fa'
import { useStore } from '@/store/useStore'
import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'
import { LogoutModal } from './LogoutModal'

export default function Sidebar() {
  const pathname = usePathname()
  const { isAuthenticated, resetAllStates } = useStore()
  const { logout: WalletLogout} = usePrivy()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
 // const cookieStore = await cookies()

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    await WalletLogout()
    // Reset all states
    resetAllStates()
    setShowLogoutModal(false);

    setTimeout(() => {
      redirect('/')
    } , 1000)
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const navItems = [
    { href: '/home', label: 'Home', icon: FaHome },
    { href: '/home/search', label: 'Search', icon: FaSearch },
    { href: '/home/profile', label: 'Profile', icon: FaUser },
    { href: '/home/create', label: 'Create Post', icon: FaPlus },
    ...(isAuthenticated ? [{ href: '/profile', label: 'Profile', icon: FaUser }] : []),
  ]

  return (
    <>
      <div className="w-64 h-screen bg-background shadow-lg fixed left-0 top-0 flex flex-col">
        <nav className="flex-1 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-white-700 hover:bg-gray-700 ${
                  pathname === item.href ? 'bg-gray-700' : 'bg-white-400'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {true && (
          <div className="p-4 border-t border-gray-700 hover:cursor-pointer">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
      
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  )
}