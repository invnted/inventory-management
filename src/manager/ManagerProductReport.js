import { useState, useEffect } from 'react';
import ManagerNavbar from '../components/ManagerNavbar';
import { toast } from 'react-toastify';

function ManagerProductReport() {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const REPORT_URL = `${serverUrl}/products/getProductReport`;
    const CSV_URL = `${serverUrl}/products/get-products-csv`;

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(REPORT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Body can be added if needed (e.g., { someKey: 'someValue' })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
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
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setFilteredProducts(products);
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await fetch(CSV_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Include body if necessary
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Create a Blob from the response
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

    // Function to determine row background color
    const getRowBackgroundColor = (product) => {
        if (product.issuedTo === 'NONE' || product.status === 'held') {
            return 'bg-yellow-400'; // Golden background color
        }
        return 'bg-green-400'; // Green background color
    };

    return (
        <div>
            <ManagerNavbar />
            <div className='m-4 md:m-12 justify-between'>
                <div className='text-center bg-sky-800 text-black h-24 flex items-center justify-center'>
                    <div className='flex gap-10'>
                        <div className='text-4xl text-white font-semibold'>All Products Report</div>
                    </div>
                </div>
                <div className='bg-sky-300'>
                    <div className="p-2 md:p-10">
                        {loading && <p>Loading...</p>}
                        {error && <p className="text-red-600">Error: {error}</p>}
                        <div className="mb-4 flex justify-center gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md w-full max-w-xs"
                                style={{ backgroundColor: '#e0f2fe', color: '#000' }}
                            />
                            <button
                                onClick={handleRefresh}
                                className="p-2 border border-gray-300 rounded-md bg-sky-800 text-white hover:bg-sky-600"
                            >
                                Refresh
                            </button>
                            <button
                                onClick={handleDownloadCSV}
                                className="p-2 border border-gray-300 rounded-md bg-sky-800 text-white hover:bg-sky-600"
                            >
                                Download CSV
                            </button>
                        </div>
                        {!loading && !error && filteredProducts.length > 0 && (
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
                                            <th className="py-2 px-4 border-2 border-gray-400 text-center font-bold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr key={product.productId} className={getRowBackgroundColor(product)}>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productId}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productType}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productName}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productModel}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productBrand}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.productPrice}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.issuedTo}</td>
                                                <td className="py-2 px-4 border-2 border-gray-400 text-center font-bold">{product.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loading && !error && filteredProducts.length === 0 && <p className="text-center">No products found</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManagerProductReport;
