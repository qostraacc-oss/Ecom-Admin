import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { createBrandAPI, deleteBrandAPI, fetchBrandsAPI, updateBrandAPI } from '../../APICalls/Product';


const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo: null });
  const [logoPreview, setLogoPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await fetchBrandsAPI();
      setBrands(Array.isArray(data) ? data : data.results || []);
      setError('');
    } catch (err) {
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Brand name is required');
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateBrandAPI(editingId, formData);
        setSuccess('Brand updated successfully');
      } else {
        await createBrandAPI(formData);
        setSuccess('Brand created successfully');
      }
      setFormData({ name: '', logo: null });
      setLogoPreview('');
      setEditingId(null);
      setShowForm(false);
      loadBrands();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      logo: null,
    });
    setLogoPreview(brand.logo || '');
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        setLoading(true);
        await deleteBrandAPI(id);
        setSuccess('Brand deleted successfully');
        loadBrands();
      } catch (err) {
        setError('Failed to delete brand');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', logo: null });
    setLogoPreview('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
        <button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Brand
        </button>
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

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Brand' : 'Add New Brand'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {logoPreview && (
                <div className="mt-3">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-24 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Logo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="h-12 object-contain"
                        />
                      ) : (
                        <span className="text-gray-400">No logo</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{brand.name}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Brands;
