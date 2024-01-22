import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  }
  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }
  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout >
      <p className="bg-blue-300 p-2 rounded font-bold text-white text-center text-xl">Categories</p>
      <label className="text-lg font-bold">
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : 'Create New Category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1 ">
          <input
            className="border-blue-300 placeholder:text-blue-300 border-2"
            type="text"
            placeholder={'Category Name'}
            onChange={ev => setName(ev.target.value)}
            value={name}
          />

          <select
            className="border-blue-300 text-blue-300 placeholder-blue-300 border-2"
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No Super Category</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

        </div>
        <div className="mb-2">
          <label className="block text-lg font-bold">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="border p-2 rounded mb-2 hover:border-blue-700 text-blue-700 shadow-md bg-blue-300 hover:bg-white hover:text-blue-700">
            Add New Property
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div key={property.name} className="flex gap-1 mb-2">
              <input type="text"

                value={property.name}
                className="border-blue-300 placeholder:text-blue-300 border-2 mb-0"
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                placeholder="Property name (example: color)" />
              <input type="text"
                className="border-blue-300 placeholder:text-blue-300 border-2 mb-0"
                onChange={ev =>
                  handlePropertyValuesChange(
                    index,
                    property, ev.target.value
                  )}
                value={property.values}
                placeholder="values, comma separated" />
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="bg-red-300 text-red-700 border px-3 py-2 rounded hover:bg-white hover:border-red-700">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="bg-blue-300 text-blue-700 px-5 rounded py-2 border hover:bg-white hover:border-blue-700">Cancel</button>
          )}
          <button type="submit"
            className="bg-green-300 text-green-700 px-5 rounded py-2 border hover:bg-white hover:border-green-700">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4 ">
          <thead >
            <tr className="bg-green-300">
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody className="bg-blue-100 rounded-lg border border-blue-300">
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id} className="hover:bg-green-300 hover:text-white">
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="bg-green-300 text-green-500 px-5 py-2 border rounded hover:border-green-700 hover:bg-white mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="bg-red-300 text-red-500 px-5 py-2 border rounded hover:border-red-700 hover:bg-white mr-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
