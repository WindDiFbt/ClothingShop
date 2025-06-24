import { useEffect, useState } from 'react';
import { getCategories } from '../../services/APIService';
import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter, setPriceFilter, setCurrentPage } from '../../redux/slices/ProductSlice';

const priceRanges = [
  { label: 'Dưới 200.000₫', query: 'price lt 200000' },
  { label: '200.000₫ - 500.000₫', query: 'price ge 200000 and price le 500000' },
  { label: 'Trên 500.000₫', query: 'price gt 500000' },
];

const Filters = () => {
  const dispatch = useDispatch();
  const { categoryFilter, priceFilter } = useSelector((state) => state.product);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (id, name) => {
    const query = `categoryId eq ${id}`;
    const isSelected = categoryFilter.query === query;
    dispatch(
      setCategoryFilter(isSelected ? { name: "", query: "" } : { name, query })
    );
    dispatch(setCurrentPage(1));
  };

  const handlePriceClick = (query, label) => {
    const isSelected = priceFilter.query === query;
    dispatch(
      setPriceFilter(isSelected ? { label: "", query: "" } : { label, query })
    );
    dispatch(setCurrentPage(1));
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div className="border-r border-gray-200 bg-white p-10 h-full px-4 py-16 lg:px-6">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2 mt-10">Category</h3>
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id, category.name)}
              className={`px-3 py-1 rounded border text-sm ${categoryFilter.query === `categoryId eq ${category.id}`
                ? 'bg-indigo-600 text-white border-indigo-600 cursor-pointer'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Price</h3>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range, idx) => (
            <button
              key={idx}
              onClick={() => handlePriceClick(range.query, range.label)}
              className={`px-3 py-1 rounded border text-sm ${priceFilter.query === range.query
                  ? 'bg-indigo-600 text-white border-indigo-600 cursor-pointer'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;