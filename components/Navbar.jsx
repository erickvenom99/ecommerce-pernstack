'use client'

import { Menu, PackageIcon, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, UserButton, useClerk, Show } from "@clerk/nextjs";
import { assets } from '@/assets/assets';

const Navbar = () => {
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fallback to 0 if cart state isn't loaded yet
    const cartCount = useSelector(state => state?.cart?.total || 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
            setMobileMenuOpen(false); // Close mobile drawer after search
        }
    };

    return (
        <nav className="relative bg-white z-50 border-b border-gray-200">
            <div className="mx-4 sm:mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    {/* Logo Section */}
                    <Link href="/" className="relative flex items-center">
                        <img 
                            src={assets.allybuylogo.src || assets.allybuylogo} 
                            alt="Ally Buy Logo" 
                            height={60} 
                            width={150} 
                            className="h-10 w-auto object-contain"
                        />
                        <Show when={{ plan: 'plus' }}>
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-white bg-amber-500 shadow-sm">
                                plus
                            </p>
                        </Show>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-700 font-medium">
                        <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-amber-500 transition-colors">Shop</Link>
                        <Link href="/about" className="hover:text-amber-500 transition-colors">About</Link>
                        <Link href="/contact" className="hover:text-amber-500 transition-colors">Contact</Link>

                        {/* Search Bar (Desktop) */}
                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-64 text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full focus-within:ring-2 focus-within:ring-amber-500/50">
                            <Search size={18} className="text-slate-500" />
                            <input 
                                className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-500" 
                                type="text" 
                                placeholder="Search products..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        {/* Cart Icon Link */}
                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-700 hover:text-amber-500 transition-colors">
                            <ShoppingCart size={20} />
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 text-[10px] font-bold text-white bg-emerald-600 size-4 flex items-center justify-center rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Button (Desktop) */}
                        {!user ? (
                            <button 
                                onClick={openSignIn} 
                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 transition-colors text-black font-semibold rounded-full shadow-sm"
                            >
                                Login
                            </button>
                        ) : (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action 
                                        labelIcon={<PackageIcon size={16}/>} 
                                        label="My Orders" 
                                        onClick={() => router.push('/orders')}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        )}
                    </div>

                    {/* Mobile Controls Header (Cart + User Button + Hamburger) */}
                    <div className="flex items-center gap-3 sm:hidden">
                        
                        {/* Mobile Cart Link */}
                        <Link href="/cart" className="relative p-1.5 text-slate-700">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[9px] font-bold text-white bg-emerald-600 size-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Button / Login */}
                        {user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action 
                                        labelIcon={<ShoppingCart size={16}/>} 
                                        label="Cart" 
                                        onClick={() => router.push('/cart')}
                                    />
                                    <UserButton.Action 
                                        labelIcon={<PackageIcon size={16}/>} 
                                        label="My Orders" 
                                        onClick={() => router.push('/orders')}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button 
                                onClick={openSignIn} 
                                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-xs font-semibold transition text-black rounded-full"
                            >
                                Login
                            </button>
                        )}

                        {/* Hamburger Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-1.5 text-slate-700 hover:text-amber-500 focus:outline-none transition-colors"
                            aria-label="Toggle Mobile Navigation"
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                </div>

                {/* Mobile Slide-Down Drawer */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-100 py-4 space-y-4 transition-all duration-300 ease-in-out">
                        
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="flex items-center text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full mx-1">
                            <Search size={18} className="text-slate-500" />
                            <input 
                                className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-500" 
                                type="text" 
                                placeholder="Search products..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                required 
                            />
                        </form>

                        {/* Mobile Links */}
                        <div className="flex flex-col space-y-3 font-medium text-slate-700 px-3 pt-1">
                            <Link 
                                href="/" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="py-1 hover:text-amber-500 transition-colors border-b border-slate-50"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/shop" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="py-1 hover:text-amber-500 transition-colors border-b border-slate-50"
                            >
                                Shop
                            </Link>
                            <Link 
                                href="/about" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="py-1 hover:text-amber-500 transition-colors border-b border-slate-50"
                            >
                                About
                            </Link>
                            <Link 
                                href="/contact" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="py-1 hover:text-amber-500 transition-colors"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;