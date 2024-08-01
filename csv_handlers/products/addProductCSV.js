const Product = require('../../models/Product');
const csvParser = require('csv-parser');
const fs = require('fs');

function product_csv_validator(headings) {
    const validHeadings = [
        'productId',
        'productType',
        'productName',
        'productModel',
        'productBrand',
        'productPrice',
        'additionalDetail'
    ];

    // Check if all headings are valid
    return headings.every(heading => validHeadings.includes(heading));
}

exports.receiveProductCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const filePath = req.file.path;
        console.log("Uploaded file path:", filePath);

        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const headings = Object.keys(results[0]);
                if (!product_csv_validator(headings)) {
                    console.log("Fail to upload due to invalid heading");
                    return res.status(400).json({ msg: 'Invalid CSV headings. Must include productId, productType, productName, productModel, productBrand, productPrice, additionalDetail' });
                }

                // Counters for tracking valid and existing products
                let validProductsAdded = 0;
                let existingProductsSkipped = 0;

                // Store promises to handle them collectively
                const savePromises = results.map(async (row) => {
                    try {
                        // Check if product with the same productId already exists
                        const existingProduct = await Product.findOne({ productId: row.productId });
                        if (!existingProduct) {
                            const product = new Product(row);
                            await product.save();
                            validProductsAdded++;
                        } else {
                            existingProductsSkipped++;
                        }
                    } catch (err) {
                        console.error('Error saving product from CSV:', err);
                    }
                });

                // Wait for all save promises to complete
                await Promise.all(savePromises);

                // Response with counts
                res.status(200).json({
                    msg: 'CSV file uploaded and products processed successfully',
                    validProductsAdded,
                    existingProductsSkipped
                });
            });

    } catch (err) {
        console.error('Error uploading CSV:', err);
        res.status(500).json({ error: 'Failed to upload CSV file.' });
    }
};
