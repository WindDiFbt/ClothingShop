import { useEffect, useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { getCategories } from "../../services/APIService"

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  // {
  //   id: 'category',
  //   name: 'Category',
  //   options: [
  //     { value: 'new-arrivals', label: 'New Arrivals', checked: false },
  //     { value: 'sale', label: 'Sale', checked: false },
  //     { value: 'travel', label: 'Travel', checked: true },
  //     { value: 'organization', label: 'Organization', checked: false },
  //     { value: 'accessories', label: 'Accessories', checked: false },
  //   ],
  // },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: 's', label: 'S', checked: false },
      { value: 'm', label: 'M', checked: false },
      { value: 'l', label: 'L', checked: false },
      { value: '39', label: '39', checked: false },
      { value: '40', label: '40', checked: false },
      { value: '41', label: '41', checked: true },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Filters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="border-r border-gray-200 bg-white p-10 h-full px-4 py-16 lg:px-6">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2 mt-10">Category</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {(Array.isArray(categories) ? categories : []).map((category) => (
            <li key={category.name}>
              <button
                onClick={() => onFilterChange({
                  query: `$filter=categoryId eq ${category.id}`,
                  name: category.name
                })}
                className="ml-4 cursor-pointer hover:text-indigo-600 transition"
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        {filters.map((section) => (
          <Disclosure key={section.id} as="div" className="border-t border-gray-200 pt-4">
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full items-center justify-between text-sm font-medium text-gray-900">
                  {section.name}
                  {open ? (
                    <MinusIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  ) : (
                    <PlusIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  )}
                </DisclosureButton>
                <DisclosurePanel className="pt-4">
                  <div className="space-y-3">
                    {section.options.map((option, idx) => (
                      <div key={option.value} className="flex items-center gap-2">
                        <input
                          id={`filter-${section.id}-${idx}`}
                          name={`${section.id}[]`}
                          type="checkbox"
                          defaultChecked={option.checked}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`filter-${section.id}-${idx}`} className="text-sm text-gray-700">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default Filters;