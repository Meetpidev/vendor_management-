import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    accountNo: '',
    bankName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    zipCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem('google_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios.get(`http://localhost:5000/api/vendors/${id}`, config)
        .then(res => setForm(res.data))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Vendor name is required';
    if (!form.bankName) errs.bankName = 'Bank name is required';
    if (!form.accountNo) errs.accountNo = 'Bank account number is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to perform this action.');
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/vendors/${id}`, form, config);
      } else {
        await axios.post('http://localhost:5000/api/vendors', form, config);
      }
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendors
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">{id ? 'Edit Vendor' : 'Add New Vendor'}</h2>
          <p className="text-gray-600">
            {id
              ? 'Update vendor information below'
              : 'Fill in the details to create a new vendor'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Vendor Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter vendor name"
                className="w-full border rounded px-3 py-2"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                className="w-full border rounded px-3 py-2"
              />
              {errors.bankName && <p className="text-sm text-red-500">{errors.bankName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <input
              name="accountNo"
              value={form.accountNo}
              onChange={handleChange}
              placeholder="Enter bank account number"
              className="w-full border rounded px-3 py-2"
            />
            {errors.accountNo && <p className="text-sm text-red-500">{errors.accountNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1
            </label>
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              placeholder="Enter address line 1"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              placeholder="Enter address line 2"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Zip Code
              </label>
              <input
                name="zipCode"
                value={form.zipCode}
                onChange={handleChange}
                placeholder="Enter zip code"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-black text-white rounded px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition cursor-pointer"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Update Vendor' : 'Create Vendor'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
