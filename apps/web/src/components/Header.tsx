"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { User, Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/3 backdrop-blur-xl shadow-lg supports-[backdrop-filter]:bg-white/2">
      <div className="mx-auto px-6 lg:px-12 xl:px-16 max-w-[1440px]">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="サプティア Logo"
              width={40}
              height={50}
              priority
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary-900 leading-none">
                サプティア
              </span>
              <span className="text-xs text-primary-600 leading-none">
                Suptia
              </span>
            </div>
          </Link>

          {/* Right: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* About Link */}
            <Link
              href="/about"
              className="text-sm text-primary-800 hover:text-primary transition-colors font-medium"
            >
              サプティアとは
            </Link>

            {/* How to Use Link */}
            <Link
              href="/how-to-use"
              className="text-sm text-primary-800 hover:text-primary transition-colors font-medium"
            >
              サプティアの使い方
            </Link>

            {/* Login Button - Hidden for now */}
            {/* <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              <User size={18} />
              <span>ログイン</span>
            </Link> */}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-primary-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-primary-600" />
            ) : (
              <Menu size={24} className="text-primary-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-primary-200 py-4 space-y-4">
            {/* About - Mobile */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
            >
              サプティアとは
            </Link>

            {/* How to Use - Mobile */}
            <Link
              href="/how-to-use"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2 text-primary-800 hover:text-primary transition-colors font-medium"
            >
              サプティアの使い方
            </Link>

            {/* Login - Mobile - Hidden for now */}
            {/* <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mx-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <User size={18} />
              <span>ログイン</span>
            </Link> */}
          </div>
        )}
      </div>
    </header>
  );
}
