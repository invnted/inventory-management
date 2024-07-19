import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import ManagerNavbar from '../components/ManagerNavbar';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const ADDPRODUCTURL = `${serverUrl}/products/add`;
const UPLOADCSVURL = `${serverUrl}/products/upload-product-csv`;

function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function ManagerAddProduct() {
  const [product, setProduct] = useState({
    productId: generateRandomString(),
    productType: "",
    productName: "",
    productModel: "",
    productBrand: "",
    productPrice: "",
    additionalDetail: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [csvFileName, setCsvFileName] = useState("");

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      toast.error("Please select a CSV file to upload");
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', csvFile);

    try {
      const response = await fetch(UPLOADCSVURL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("CSV file uploaded successfully");
        setCsvFile(null);
        setCsvFileName("");
      } else {
        const data = await response.json();
        toast.error(data.msg || "Failed to upload CSV file");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("An error occurred while uploading CSV");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    setCsvFileName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(ADDPRODUCTURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received:", data);

        toast.success("Product successfully added");


        setProduct({
          productId: generateRandomString(),
          productType: "",
          productName: "",
          productModel: "",
          productBrand: "",
          productPrice: "",
          additionalDetail: "",
        });
      } else {
        toast.error("Invalid details");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <div>
      <ManagerNavbar/>
      <div className='m-4 md:m-12 border border-black '>
        <div className=' text-center bg-sky-800 text-white text-5xl h-24 flex items-center justify-center '>
          <div>Add Product</div>
        </div>
        <div className=' bg-sky-300 h-auto'>
          <div className='md:px-72 md:p-10'>
            <form className='grid grid-cols-1 md:grid-cols-1' onSubmit={handleSubmit}>
              <input type='text' name="productType" placeholder='Product Type' className='m-5 p-2 outline-none rounded-xl' value={product.productType} onChange={handleInput} required />




              <input type='text' name="productName" placeholder='Product Name' className='m-5 p-2  outline-none border rounded-xl' value={product.productName} onChange={handleInput} required />
              <input type='text' name="productBrand" placeholder='Brand' className='m-5 p-2 outline-none border rounded-xl' value={product.productBrand} onChange={handleInput} required />
              <input type='number' name="productPrice" placeholder='Price' className='m-5 p-2 outline-none border rounded-xl' value={product.productPrice} onChange={handleInput} required />
              <input type='text' name="productModel" placeholder='Model' className='m-5 p-2 outline-none border rounded-xl' value={product.productModel} onChange={handleInput} required />
              <input type='text' name="additionalDetail" placeholder='Additional Details' className='m-5 p-2 outline-none border rounded-xl' value={product.additionalDetail} onChange={handleInput} required />

              <div className='grid grid-cols-1 md:grid-cols-3'>
                <button type="submit" className='m-5 p-2 outline-none rounded-xl  bg-sky-800  font-bold text-white'>Submit Form</button>
                <label className='m-5 p-2 outline-none rounded-xl  bg-sky-800  font-bold text-white text-center cursor-pointer'>
                  Choose CSV File
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                </label>
                <button type="button" onClick={handleCSVUpload} className='m-5 p-2 outline-none rounded-xl  bg-sky-800  font-bold text-white'>Submit CSV File
                </button>
              </div>
              {csvFileName && (
                <div className='m-5 p-2 text-center'>
                  Selected file: {csvFileName}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerAddProduct;