import httpClient from "../Constant/API";

// Category APIs
export const fetchCategoriesAPI = async () => {
  try {
    const response = await httpClient.get("/products/categories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategoryAPI = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }
    const response = await httpClient.post("/products/categories/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategoryAPI = async (id, categoryData) => {
  try {
    const formData = new FormData();
    formData.append("name", categoryData.name);
    formData.append("description", categoryData.description);
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }
    const response = await httpClient.put(`/products/categories/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategoryAPI = async (id) => {
  try {
    await httpClient.delete(`/products/categories/${id}/`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// SubCategory APIs
export const fetchSubCategoriesAPI = async () => {
  try {
    const response = await httpClient.get("/products/subcategories/");
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const createSubCategoryAPI = async (subCategoryData) => {
  try {
    const formData = new FormData();
    formData.append("category", subCategoryData.category);
    formData.append("name", subCategoryData.name);
    formData.append("description", subCategoryData.description);
    if (subCategoryData.image) {
      formData.append("image", subCategoryData.image);
    }
    const response = await httpClient.post("/products/subcategories/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw error;
  }
};

export const updateSubCategoryAPI = async (id, subCategoryData) => {
  try {
    const formData = new FormData();
    formData.append("category", subCategoryData.category);
    formData.append("name", subCategoryData.name);
    formData.append("description", subCategoryData.description);
    if (subCategoryData.image) {
      formData.append("image", subCategoryData.image);
    }
    const response = await httpClient.put(`/products/subcategories/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
};

export const deleteSubCategoryAPI = async (id) => {
  try {
    await httpClient.delete(`/products/subcategories/${id}/`);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw error;
  }
};

// Attribute APIs
export const fetchAttributesAPI = async () => {
  try {
    const response = await httpClient.get("/products/attributes/");
    return response.data;
  } catch (error) {
    console.error("Error fetching attributes:", error);
    throw error;
  }
};

export const createAttributeAPI = async (attributeData) => {
  try {
    const payload = {
      sub_category: attributeData.sub_category,
      name: attributeData.name,
      type: attributeData.type,
      is_filterable: attributeData.is_filterable || false,
      is_required: attributeData.is_required || false,
    };
    
    // Only add options if type is "option" and options are provided
    if (attributeData.type === "option" && attributeData.options) {
      payload.options = attributeData.options;
    }
    
    const response = await httpClient.post("/products/attributes/", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating attribute:", error);
    throw error;
  }
};

export const updateAttributeAPI = async (id, attributeData) => {
  try {
    const payload = {
      sub_category: attributeData.sub_category,
      name: attributeData.name,
      type: attributeData.type,
      is_filterable: attributeData.is_filterable || false,
      is_required: attributeData.is_required || false,
    };
    
    // Only add options if type is "option" and options are provided
    if (attributeData.type === "option" && attributeData.options) {
      payload.options = attributeData.options;
    }
    
    const response = await httpClient.put(`/products/attributes/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating attribute:", error);
    throw error;
  }
};

export const deleteAttributeAPI = async (id) => {
  try {
    await httpClient.delete(`/products/attributes/${id}/`);
  } catch (error) {
    console.error("Error deleting attribute:", error);
    throw error;
  }
};



/////////////////////////////////////////////////////////////////////////////////


// Fetch all products
export const fetchProductsAPI = async () => {
  try {
    const response = await httpClient.get("/products/");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch single product by ID
export const fetchProductByIdAPI = async (id) => {
  try {
    const response = await httpClient.get(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create product
export const createProductAPI = async (productData) => {
  try {
    const formData = new FormData();
    
    // Add basic fields
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("brand", productData.brand);
    formData.append("price", productData.price);
    formData.append("discount_price", productData.discount_price);
    formData.append("category", productData.category);
    formData.append("sub_category", productData.sub_category);
    formData.append("product_family", productData.product_family);
    formData.append("stock", productData.stock);
    formData.append("available", productData.available);

    // Add media files
    if (productData.media && productData.media.length > 0) {
      productData.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    // Add product_attributes as JSON string
    if (productData.product_attributes && productData.product_attributes.length > 0) {
      formData.append("product_attributes", JSON.stringify(productData.product_attributes));
    }

    const response = await httpClient.post("/products/create/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product
export const updateProductAPI = async (id, productData) => {
  try {
    const formData = new FormData();
    
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("brand", productData.brand);
    formData.append("price", productData.price);
    formData.append("discount_price", productData.discount_price);
    formData.append("category", productData.category);
    formData.append("sub_category", productData.sub_category);
    formData.append("product_family", productData.product_family);
    formData.append("stock", productData.stock);
    formData.append("available", productData.available);

    if (productData.media && productData.media.length > 0) {
      productData.media.forEach((file) => {
        if (file instanceof File) {
          formData.append("media", file);
        }
      });
    }

    if (productData.product_attributes && productData.product_attributes.length > 0) {
      formData.append("product_attributes", JSON.stringify(productData.product_attributes));
    }

    const response = await httpClient.patch(`/products/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product
export const deleteProductAPI = async (id) => {
  try {
    await httpClient.delete(`/products/${id}/`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Fetch brands for dropdown
export const fetchBrandsAPI = async () => {
  try {
    const response = await httpClient.get("/products/brands/");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};


export const createBrandAPI = async (brandData) => {
  try {
    const formData = new FormData();
    formData.append("name", brandData.name);
    if (brandData.logo) {
      formData.append("logo", brandData.logo);
    }
    const response = await httpClient.post("/products/brands/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const updateBrandAPI = async (id, brandData) => {
  try {
    const formData = new FormData();
    formData.append("name", brandData.name);
    if (brandData.logo) {
      formData.append("logo", brandData.logo);
    }
    const response = await httpClient.put(`/products/brands/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

export const deleteBrandAPI = async (id) => {
  try {
    await httpClient.delete(`/products/brands/${id}/`);
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};