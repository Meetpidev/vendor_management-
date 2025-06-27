import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export function VendorList() {
    const [vendors, setVendors] = useState([]);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('google_user') || '{}');
    const URL = "https://vendor-management-gh2p.onrender.com";

    // Fetch paginated vendors 
    const fetchVendors = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${URL}/api/vendors`, {
                params: { page, limit: pageSize }
            });
            setVendors(res.data.vendors || []);
            setTotal(res.data.total || 0);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        } finally {
            setLoading(false);
        }
    };

  
    useEffect(() => {
        fetchVendors();
    }, [page]);

    const filteredVendors = search.trim()
        ? vendors.filter(v =>
            v.name.toLowerCase().includes(search.trim().toLowerCase())
        )
        : vendors;

   
    const displayVendors = search.trim() ? filteredVendors : vendors;
    const displayTotal = search.trim() ? filteredVendors.length : total;
    const totalPages = Math.max(1, Math.ceil(displayTotal / pageSize));

 
    const paginatedVendors = search.trim()
        ? filteredVendors
        : vendors;

    // Reset to page 1 if search changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('google_token');
        if (!token) {
            alert('You must be logged in to perform this action.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            await axios.delete(`${URL}/api/vendors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
           const remainingVendors = vendors.length - 1;
        const isLastVendorOnPage = remainingVendors === 0;

        if (isLastVendorOnPage && page > 1) {
            setPage(1); 
        } else {
            fetchVendors(); 
        }
            
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-7">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-7">Vendors</h2>
                    <p className="text-gray-600 mt-1">
                        Manage your vendor database ({displayTotal} total)
                    </p>
                </div>
                <button
                    onClick={() => navigate("/add")}
                    className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vendor
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search vendor by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-full"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : displayTotal === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                    <p className="text-gray-600 mb-6">
                        Get started by adding your first vendor.
                    </p>
                </div>
            ) : (
                <>
                    {/* Vendor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayVendors.map(vendor => (
                            <div key={vendor._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <div className="text-lg font-semibold">{vendor.name}</div>
                                            <div className="text-sm text-gray-500">{vendor.bankName}</div>
                                        </div>
                                        <span className="text-xs bg-gray-100 rounded px-2 py-1">ID: {vendor._id.slice(-6)}</span>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-xs text-gray-600">Account Number</div>
                                        <div className="font-mono bg-gray-50 p-2 rounded border text-sm">{vendor.accountNo}</div>
                                    </div>
                                    {(vendor.addressLine1 || vendor.city || vendor.country) && (
                                        <div className="mt-3">
                                            <div className="text-xs text-gray-600">Address</div>
                                            <div className="text-sm text-gray-900">
                                                {vendor.addressLine1 && <div>{vendor.addressLine1}</div>}
                                                {vendor.addressLine2 && <div>{vendor.addressLine2}</div>}
                                                {(vendor.city || vendor.country || vendor.zipCode) && (
                                                    <div>
                                                        {[vendor.city, vendor.country, vendor.zipCode].filter(Boolean).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {vendor.creatorEmail === user.email && (
                                    <div className="flex gap-2 pt-4">
                                        <button
                                            onClick={() => navigate(`/edit/${vendor._id}`)}
                                            className="flex-1 flex items-center justify-center border rounded px-3 py-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vendor._id)}
                                            className="flex-1 flex items-center justify-center border rounded px-3 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    
                    {!search.trim() && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-600">
                                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} vendors
                            </p>
                            <div className="flex items-center space-x-2">
                                <button
                                    className="border rounded px-2 py-1"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        className={`border rounded px-3 py-1 ${page === p ? 'bg-blue-600 text-white' : ''}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="border rounded px-2 py-1"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
