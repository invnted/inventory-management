import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import fetchWithToken from '../services/api';
import Navbar from './Navbar';

function IssueReport() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const REPORT_URL = `${serverUrl}/products/issuedReport`;
    const CSV_URL = `${serverUrl}/products/get-issueReport-csv`;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetchWithToken(REPORT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("LIST Data:", data);
    
            if (data.success) {
                toast.success("Fetched Successfully");
                setProducts(data.issueList); // Change this line to use `data.issueList`
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Fetch products error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const filterProducts = () => {
        if (!products) return;

        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = products.filter(product =>
            (product.productId && product.productId.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.productType && product.productType.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.productName && product.productName.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.productModel && product.productModel.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.productBrand && product.productBrand.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.productPrice && product.productPrice.toString().toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.issuedTo && product.issuedTo.toLowerCase().includes(lowercasedSearchTerm)) ||
            (product.status && product.status.toLowerCase().includes(lowercasedSearchTerm))
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setFilteredProducts(products);
        setCurrentPage(1);
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await fetch(CSV_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'products-report.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download CSV error:', error);
            toast.error('Failed to download CSV');
        }
    };

    const getRowBackgroundColor = (product) => {
        if (product.issuedTo === 'NONE' || product.status === 'held') {
            return 'bg-yellow-400';
        }
        return 'bg-green-400';
    };

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    const totalPages = Math.ceil((filteredProducts ? filteredProducts.length : 0) / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <Navbar />
            <div className='m-4 md:m-12 justify-between'>
                <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                    <div className='flex gap-10'>
                        <div className='text-4xl text-white font-semibold'>Issue Report</div>
                    </div>
                </div>
                <div className='bg-sky-300'>
                    <div className="p-2 md:p-10">
                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-600">Error: {error}</p>}
                        <div className="m-4 flex flex-col md:flex-row justify-center gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 rounded-md w-full max-w-xs bg-sky-600 outline-none text-white placeholder:text-gray-700 text-xl mb-4 md:mb-0"
                            />
                            <div className="flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={handleRefresh}
                                    className="p-2 rounded-md bg-sky-800 text-white hover:bg-sky-600 outline-none text-xl"
                                >
                                    Refresh
                                </button>
                                <button
                                    onClick={handleDownloadCSV}
                                    className="p-2 rounded-md bg-sky-800 text-white hover:bg-sky-600 outline-none text-xl"
                                >
                                    Download CSV
                                </button>
                            </div>
                        </div>
                        {!loading && !error && currentProducts.length > 0 && (
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full bg-white border-2 border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product ID</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product Type</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product Name</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product Model</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product Brand</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Product Price</th>
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Issued To</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProducts.map((product) => (
                                            <tr key={product.productId} className={getRowBackgroundColor(product)}>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productId}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productType}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productName}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productModel}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productBrand}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productPrice}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.issuedTo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loading && !error && currentProducts.length === 0 && <p className="text-center">No products found</p>}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                                <button
                                    key={number}
                                    onClick={() => handlePageChange(number)}
                                    className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-sky-600 text-white' : 'bg-sky-300 text-black'}`}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueReport;



