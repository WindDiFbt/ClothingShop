export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NOIRÉ</h3>
            <p className="text-sm text-gray-500 leading-6">
              Timeless essentials designed for modern living.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">New Arrivals</a></li>
              <li><a href="#" className="hover:text-black">Best Sellers</a></li>
              <li><a href="#" className="hover:text-black">Clothing</a></li>
              <li><a href="#" className="hover:text-black">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">About</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">Our Story</a></li>
              <li><a href="#" className="hover:text-black">Sustainability</a></li>
              <li><a href="#" className="hover:text-black">Careers</a></li>
              <li><a href="#" className="hover:text-black">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-black">Contact Us</a></li>
              <li><a href="#" className="hover:text-black">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-black">FAQs</a></li>
              <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-sm text-gray-400 flex flex-col sm:flex-row justify-between">
          <p>&copy; 2025 Noiré. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex gap-x-4">
            <a href="#" className="hover:text-black">Instagram</a>
            <a href="#" className="hover:text-black">Facebook</a>
            <a href="#" className="hover:text-black">TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
