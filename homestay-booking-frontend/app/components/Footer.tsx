import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#183B4E] text-white py-8 sm:py-12 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 sm:hidden">
                    <h3 className="font-playfair text-3xl font-bold text-[#DDA853] mb-2">Fishsauce</h3>
                    <h4 className="font-montserrat text-xl text-white/90">Homestay</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="hidden sm:block">
                        <div className="mb-4">
                            <h3 className="font-playfair text-2xl font-bold text-[#DDA853] mb-2">Fishsauce</h3>
                            <h4 className="font-montserrat text-lg text-white/90">Homestay</h4>
                        </div>
                        <p className="text-white/80 text-sm mb-4 font-montserrat">
                            Nền tảng booking homestay quanh Hà Nội, từ nội thành đến ngoại thành, phù hợp cho nhóm bạn, gia đình và cặp đôi.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-montserrat font-semibold text-lg mb-4 text-[#F5EEDC] text-center sm:text-left">Liên Kết Nhanh</h3>
                        <nav>
                            <ul className="flex flex-wrap justify-center sm:justify-start gap-3 sm:block sm:space-y-2 font-montserrat">
                                <li className="inline-block sm:block">
                                    <Link href="#gallery" className="text-white/80 hover:text-white text-sm transition-colors duration-300 py-2 px-3 sm:px-0 sm:py-1 block">
                                        Thư Viện Ảnh
                                    </Link>
                                </li>
                                <li className="inline-block sm:block">
                                    <Link href="#location" className="text-white/80 hover:text-white text-sm transition-colors duration-300 py-2 px-3 sm:px-0 sm:py-1 block">
                                        Vị Trí
                                    </Link>
                                </li>
                                <li className="inline-block sm:block">
                                    <Link href="#nearby" className="text-white/80 hover:text-white text-sm transition-colors duration-300 py-2 px-3 sm:px-0 sm:py-1 block">
                                        Những homestay phổ biến
                                    </Link>
                                </li>
                                <li className="inline-block sm:block">
                                    <Link href="#faq" className="text-white/80 hover:text-white text-sm transition-colors duration-300 py-2 px-3 sm:px-0 sm:py-1 block">
                                        Thông Tin Đặt Homestay
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="mt-4 sm:mt-0">
                        <h3 className="font-montserrat font-semibold text-lg mb-4 text-[#F5EEDC] text-center sm:text-left">Liên Hệ Với Chúng Tôi</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 justify-center sm:justify-start">
                                <div className="text-[#DDA853] mt-1 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <address className="text-white/80 text-sm not-italic font-montserrat">
                                    Fishsauce Homestay<br />
                                    25 Phố Hàng Bè<br />
                                    Hoàn Kiếm<br />
                                    Hà Nội<br />
                                </address>
                            </div>

                            <div className="flex items-center space-x-3 justify-center sm:justify-start">
                                <div className="text-[#DDA853] flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <Link href="tel:+84847318696" className="text-white/80 hover:text-white text-sm transition-colors duration-300 font-montserrat">
                                    (+84) 847-318-696
                                </Link>
                            </div>

                            <div className="flex items-center space-x-3 justify-center sm:justify-start">
                                <div className="text-[#DDA853] flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <Link href="mailto:booking@fishsaucehomestay.vn" className="text-white/80 hover:text-white text-sm transition-colors duration-300 font-montserrat">
                                    booking@fishsaucehomestay.vn
                                </Link>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="mt-6 text-center sm:text-left">
                            <h4 className="font-montserrat text-sm font-semibold mb-3 text-[#F5EEDC]">Theo Dõi Chúng Tôi</h4>
                            <div className="flex space-x-6 justify-center sm:justify-start">
                                <Link href="https://www.facebook.com/profile.php?id=61573273947769" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#DDA853] transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </Link>
                                <Link href="https://www.instagram.com/fishsauce.05" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#DDA853] transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 sm:mt-10 pt-6 border-t border-white/10 text-center">
                    <p className="text-white/60 text-xs font-montserrat">
                        © {currentYear} Fishsauce Homestay. Bản quyền đã được bảo lưu.
                    </p>
                    <p className="text-white/40 text-xs font-montserrat mt-2">
                        Created by{' '}
                        <Link 
                            href="https://danishaiman.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[#DDA853] hover:text-white transition-colors duration-300"
                        >
                            danishayman
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
} 