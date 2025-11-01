import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';

import {
    createProductAPI,
    fetchAttributesAPI,
    fetchBrandsAPI,
    fetchCategoriesAPI,
    fetchProductByIdAPI,
    fetchSubCategoriesAPI,
    updateProductAPI
} from '../../APICalls/Product';


const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dropdown data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    discount_price: '',
    category: '',
    sub_category: '',
    product_family: '',
    stock: '',
    available: true,
    media: [],
    product_attributes: [],
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  useEffect(() => {
    loadDropdownData();
    if (isEditMode) {
      loadProductData();
    }
  }, [id]);

  useEffect(() => {
    if (formData.category) {
      const filtered = allSubCategories.filter(
        (sc) => sc.category === parseInt(formData.category)
      );
      setSubCategories(filtered);
    } else {
      setSubCategories([]);
    }
  }, [formData.category, allSubCategories]);

  useEffect(() => {
    if (formData.sub_category) {
      const filtered = allAttributes.filter(
        (attr) => attr.sub_category === parseInt(formData.sub_category)
      );
      setAttributes(filtered);
    } else {
      setAttributes([]);
    }
  }, [formData.sub_category, allAttributes]);

  const loadDropdownData = async () => {
    try {
      const [brandsData, categoriesData, subCategoriesData, attributesData] =
        await Promise.all([
          fetchBrandsAPI(),
          fetchCategoriesAPI(),
          fetchSubCategoriesAPI(),
          fetchAttributesAPI(),
        ]);

      setBrands(Array.isArray(brandsData) ? brandsData : brandsData.results || []);
      setCategories(
        Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []
      );
      setAllSubCategories(
        Array.isArray(subCategoriesData) ? subCategoriesData : subCategoriesData.results || []
      );
      setAllAttributes(
        Array.isArray(attributesData) ? attributesData : attributesData.results || []
      );
    } catch (err) {
      setError('Failed to load dropdown data');
    }
  };

  const loadProductData = async () => {
    setLoading(true);
    try {
      const product = await fetchProductByIdAPI(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        category: product.category || '',
        sub_category: product.sub_category || '',
        product_family: product.product_family || '',
        stock: product.stock || '',
        available: product.available || true,
        media: [],
        product_attributes: product.product_attributes || [],
      });

      if (product.media && product.media.length > 0) {
        setMediaPreviews(product.media.map((m) => m.file));
      }
    } catch (err) {
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setMediaPreviews([...mediaPreviews, ...previews]);
  };

  const removeMedia = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  const handleAddAttribute = () => {
    setFormData({
      ...formData,
      product_attributes: [
        ...formData.product_attributes,
        {
          attribute: '',
          value_text: null,
          value_number: null,
          value_decimal: null,
          value_boolean: null,
          value_option: null,
          value_color: null,
        },
      ],
    });
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = formData.product_attributes.filter((_, i) => i !== index);
    setFormData({ ...formData, product_attributes: newAttributes });
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...formData.product_attributes];
    newAttributes[index][field] = value;

    // Reset all value fields when changing attribute
    if (field === 'attribute') {
      newAttributes[index] = {
        attribute: value,
        value_text: null,
        value_number: null,
        value_decimal: null,
        value_boolean: null,
        value_option: null,
        value_color: null,
      };
    }

    setFormData({ ...formData, product_attributes: newAttributes });
  };

  const getAttributeType = (attributeId) => {
    const attr = allAttributes.find((a) => a.id === parseInt(attributeId));
    return attr ? attr.type : null;
  };

  const getAttributeOptions = (attributeId) => {
    const attr = allAttributes.find((a) => a.id === parseInt(attributeId));
    return attr && attr.options ? attr.options : [];
  };

  const renderAttributeInput = (attrData, index) => {
    const attrType = getAttributeType(attrData.attribute);
    const options = getAttributeOptions(attrData.attribute);

    switch (attrType) {
      case 'text':
        return (
          <input
            type="text"
            value={attrData.value_text || ''}
            onChange={(e) => handleAttributeChange(index, 'value_text', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter text value"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={attrData.value_number || ''}
            onChange={(e) =>
              handleAttributeChange(index, 'value_number', parseFloat(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter number"
          />
        );

      case 'decimal':
        return (
          <input
            type="number"
            step="0.01"
            value={attrData.value_decimal || ''}
            onChange={(e) =>
              handleAttributeChange(index, 'value_decimal', parseFloat(e.target.value))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter decimal"
          />
        );

      case 'boolean':
        return (
          <select
            value={attrData.value_boolean === null ? '' : attrData.value_boolean.toString()}
            onChange={(e) =>
              handleAttributeChange(index, 'value_boolean', e.target.value === 'true')
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );

      case 'option':
        return (
          <select
            value={attrData.value_option || ''}
            onChange={(e) => handleAttributeChange(index, 'value_option', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select option</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <input
            type="color"
            value={attrData.value_color || '#000000'}
            onChange={(e) => handleAttributeChange(index, 'value_color', e.target.value)}
            className="w-full h-10 px-2 py-1 border border-gray-300 rounded-lg cursor-pointer"
          />
        );

      default:
        return <span className="text-gray-400">Select an attribute first</span>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.name ||
      !formData.brand ||
      !formData.category ||
      !formData.sub_category ||
      !formData.price
    ) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        media: mediaFiles,
      };

      if (isEditMode) {
        await updateProductAPI(id, payload);
        setSuccess('Product updated successfully');
      } else {
        await createProductAPI(payload);
        setSuccess('Product created successfully');
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h1>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Family
            </label>
            <input
              type="text"
              name="product_family"
              value={formData.product_family}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., gucci1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter product description"
            rows="4"
          />
        </div>

        {/* Brand, Category, SubCategory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SubCategory *
            </label>
            <select
              name="sub_category"
              value={formData.sub_category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
              disabled={!formData.category}
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((subCat) => (
                <option key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price, Discount, Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Price (%)
            </label>
            <input
              type="number"
              step="0.01"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Available Checkbox */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Available for Sale</span>
          </label>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMediaChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {mediaPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {mediaPreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${idx}`}
                    className="h-24 w-full object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Attributes */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">Product Attributes</label>
            <button
              type="button"
              onClick={handleAddAttribute}
              disabled={!formData.sub_category}
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-4 h-4" />
              Add Attribute
            </button>
          </div>

          {formData.product_attributes.length > 0 && (
            <div className="space-y-3">
              {formData.product_attributes.map((attr, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-5">
                    <select
                      value={attr.attribute}
                      onChange={(e) => handleAttributeChange(index, 'attribute', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Attribute</option>
                      {attributes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6">{renderAttributeInput(attr, index)}</div>

                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
