import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
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
  const { token, user } = useSelector(state => state.auth);
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
      console.log(response.data.value)
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

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white shadow-md transition-all duration-300">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-4 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <link
              href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap"
              rel="stylesheet"
            ></link>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Noiré
            </h1>
          </a>
          <div className="flex flex-1 max-w-xs ml-30">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSuggestions([]);
                    setKeyword("");
                    navigate(`/products?search=${encodeURIComponent(keyword)}`);
                  }
                }}
                placeholder="Search"
                className="w-full rounded-full border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-0.5 focus:ring-gray-500 focus:border-gray-500"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-50 top-10 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <li
                      key={item.Id}
                      onClick={() => handleSelect(item.Name)}
                      className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-gray-700">
                Welcome, {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm/6 font-semibold text-gray-900 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
