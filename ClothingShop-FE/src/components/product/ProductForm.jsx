import { useState, useEffect } from "react";
import axios from "axios";

export default function ProductForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    Name: initialData.Name || "",
    Price: initialData.Price ?? "",
    Discount: initialData.Discount ?? "",
    ThumbnailUrl: initialData.ThumbnailUrl || "",
    Description: initialData.Description || "",
    CategoryId: initialData.CategoryId || "",
    Status: initialData.Status ?? 1,
    Variants: initialData.Variants || [{ Size: "", Quantity: "" }],
    Images: initialData.Images || [""],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5078/api/Categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVariantChange = (index, key, value) => {
    const variants = [...form.Variants];
    variants[index][key] = value;
    setForm({ ...form, Variants: variants });
  };

  const addVariant = () => {
    setForm({
      ...form,
      Variants: [...form.Variants, { Size: "", Quantity: "" }],
    });
  };

  const removeVariant = (index) => {
    const updated = [...form.Variants];
    updated.splice(index, 1);
    setForm({ ...form, Variants: updated });
  };

  const handleImageChange = (index, value) => {
    const updated = [...form.Images];
    updated[index] = value;
    setForm({ ...form, Images: updated });
  };

  const addImage = () => {
    setForm({ ...form, Images: [...form.Images, ""] });
  };

  const removeImage = (index) => {
    const updated = [...form.Images];
    updated.splice(index, 1);
    setForm({ ...form, Images: updated });
  };

  const validateForm = () => {
    if (!form.Name.trim()) return false;
    if (isNaN(Number(form.Price)) || Number(form.Price) <= 0) return false;
    if (!form.CategoryId) return false;
    if (form.Variants.some((v) => !v.Size || isNaN(Number(v.Quantity))))
      return false;
    if (form.Images.some((url) => !url.trim())) return false;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const cleanedForm = {
      Name: form.Name,
      Price: Number(form.Price),
      Discount: Number(form.Discount),
      ThumbnailUrl: form.ThumbnailUrl,
      Description: form.Description,
      CategoryId: Number(form.CategoryId),
      ProductVariants: form.Variants.map((v) => ({
        Size: v.Size,
        Quantity: Number(v.Quantity),
      })),
      Images: form.Images.map((url) => url.trim()),
    };

    onSubmit(cleanedForm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold text-gray-700">
        Product Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-600 mb-1">Name</label>
          <input
            name="Name"
            value={form.Name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Thumbnail URL</label>
          <input
            name="ThumbnailUrl"
            value={form.ThumbnailUrl}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Price (VND)</label>
          <input
            type="number"
            name="Price"
            value={form.Price}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Discount (%)</label>
          <input
            type="number"
            name="Discount"
            value={form.Discount}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-1">Category</label>
          <select
            name="CategoryId"
            value={form.CategoryId}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-600 mb-1">Description</label>
        <textarea
          name="Description"
          value={form.Description}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          rows="4"
        />
      </div>

      {/* Images */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 mb-2">Image URLs</h4>
        {form.Images.map((url, i) => (
          <div key={i} className="flex gap-4 items-center mb-2">
            <input
              value={url}
              onChange={(e) => handleImageChange(i, e.target.value)}
              placeholder="https://image-url"
              className="border rounded-md p-2 w-full"
            />
            {form.Images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="text-blue-600 hover:underline text-sm mt-1"
        >
          + Add Image
        </button>
      </div>

      {/* Variants */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 mb-2">Variants</h4>
        {form.Variants.map((v, i) => (
          <div key={i} className="flex gap-4 items-center mb-2">
            <input
              value={v.Size}
              onChange={(e) => handleVariantChange(i, "Size", e.target.value)}
              placeholder="Size"
              className="border rounded-md p-2 w-1/3"
            />
            <input
              type="number"
              value={v.Quantity}
              onChange={(e) =>
                handleVariantChange(i, "Quantity", e.target.value)
              }
              placeholder="Quantity"
              className="border rounded-md p-2 w-1/3"
            />
            {form.Variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="text-blue-600 hover:underline text-sm mt-1"
        >
          + Add Variant
        </button>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
