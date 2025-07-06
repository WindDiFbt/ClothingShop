import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ShoppingBagIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { fetchSuggestion } from "../../services/APIService";

const navigation = [
  { name: "Home", href: "/home" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, user } = useSelector(state => state.auth);
  const cartDetails = useSelector(state => state.cart.cart?.cartDetails ?? []);
  const cartCount = cartDetails.length;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  const fetchSuggestions = async (kw) => {
    if (!kw) return setSuggestions([]);
    try {
      const response = await fetchSuggestion(kw);
      setSuggestions(response.data.value || []);
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 300), []);

  const handleChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    debouncedFetch(val);
  };

  const handleSelect = (name) => {
    setKeyword("");
    setSuggestions([]);
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  const handleSearch = () => {
    if (keyword.trim()) {
      setSuggestions([]);
      setKeyword("");
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Noiré
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium tracking-wide transition duration-200 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search for products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition duration-200 ease-in-out"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-lg max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <button
                      key={item.Id}
                      onClick={() => handleSelect(item.Name)}
                      className="w-full px-4 py-3 text-left text-sm text-gray-800 hover:bg-gray-50 transition duration-150 ease-in-out first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.Name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {token ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Hello, <span className="font-medium">{user?.username}</span>
                </span>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-gray-700 hover:text-black transition duration-200 ease-in-out"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-black transition duration-200 ease-in-out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-black transition duration-200 ease-in-out"
              >
                Sign In
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-black transition duration-200 ease-in-out">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-black rounded-full min-w-[18px] h-[18px]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full min-w-[18px] h-[18px]">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="px-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                      setMobileMenuOpen(false);
                    }
                  }}
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="px-2 pt-4 border-t border-gray-200">
              {token ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-700">
                    Hello, <span className="font-medium">{user?.username}</span>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition duration-150 ease-in-out"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition duration-150 ease-in-out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition duration-150 ease-in-out"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
