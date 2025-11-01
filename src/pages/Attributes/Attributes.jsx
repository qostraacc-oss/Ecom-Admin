import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createAttributeAPI, deleteAttributeAPI, fetchAttributesAPI, fetchSubCategoriesAPI, updateAttributeAPI } from '../../APICalls/Product';
// import {
//   fetchAttributesAPI,
//   createAttributeAPI,
//   updateAttributeAPI,
//   deleteAttributeAPI,
//   fetchSubCategoriesAPI,
// } from '../../APICalls/CategoryAPI';


const ATTRIBUTE_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'decimal', label: 'Decimal' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'option', label: 'Option' },
  { value: 'color', label: 'Color' },
];

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sub_category: '',
    name: '',
    type: 'text',
    is_filterable: false,
    is_required: false,
    options: [],
  });
  const [optionInput, setOptionInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [attrData, subCatData] = await Promise.all([
        fetchAttributesAPI(),
        fetchSubCategoriesAPI(),
      ]);
      setAttributes(Array.isArray(attrData) ? attrData : attrData.results || []);
      setSubCategories(Array.isArray(subCatData) ? subCatData : subCatData.results || []);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData({
        ...formData,
        options: [...formData.options, optionInput.trim()],
      });
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sub_category || !formData.name.trim()) {
      setError('SubCategory and Name are required');
      return;
    }

    if (formData.type === 'option' && formData.options.length === 0) {
      setError('Please add at least one option');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        sub_category: formData.sub_category,
        name: formData.name,
        type: formData.type,
        is_filterable: formData.is_filterable,
        is_required: formData.is_required,
      };

      if (formData.type === 'option') {
        payload.options = formData.options;
      }

      if (editingId) {
        await updateAttributeAPI(editingId, payload);
        setSuccess('Attribute updated successfully');
      } else {
        await createAttributeAPI(payload);
        setSuccess('Attribute created successfully');
      }

      setFormData({
        sub_category: '',
        name: '',
        type: 'text',
        is_filterable: false,
        is_required: false,
        options: [],
      });
      setOptionInput('');
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save attribute');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (attribute) => {
    setFormData({
      sub_category: attribute.sub_category,
      name: attribute.name,
      type: attribute.type,
      is_filterable: attribute.is_filterable || false,
      is_required: attribute.is_required || false,
      options: attribute.options || [],
    });
    setEditingId(attribute.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      try {
        setLoading(true);
        await deleteAttributeAPI(id);
        setSuccess('Attribute deleted successfully');
        loadData();
      } catch (err) {
        setError('Failed to delete attribute');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      sub_category: '',
      name: '',
      type: 'text',
      is_filterable: false,
      is_required: false,
      options: [],
    });
    setOptionInput('');
  };

  const getSubCategoryName = (subCatId) => {
    return subCategories.find((sc) => sc.id === subCatId)?.name || 'Unknown';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
        <button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Attribute
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
            {editingId ? 'Edit Attribute' : 'Add New Attribute'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SubCategory *
                </label>
                <select
                  value={formData.sub_category}
                  onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select SubCategory</option>
                  {subCategories.map((sc) => (
                    <option key={sc.id} value={sc.id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attribute Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Size, Color, Material"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {ATTRIBUTE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_filterable}
                    onChange={(e) =>
                      setFormData({ ...formData, is_filterable: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Is Filterable</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_required}
                    onChange={(e) =>
                      setFormData({ ...formData, is_required: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Is Required</span>
                </label>
              </div>
            </div>

            {formData.type === 'option' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter option and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{opt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  SubCategory
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Filterable
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Required
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Options</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {attributes.length > 0 ? (
                attributes.map((attr) => (
                  <tr key={attr.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{attr.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getSubCategoryName(attr.sub_category)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {ATTRIBUTE_TYPES.find((t) => t.value === attr.type)?.label || attr.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {attr.is_filterable ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {attr.is_required ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {attr.options && attr.options.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {attr.options.slice(0, 3).map((opt, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                              {opt}
                            </span>
                          ))}
                          {attr.options.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                              +{attr.options.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(attr)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(attr.id)}
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
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No attributes found
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

export default Attributes;
