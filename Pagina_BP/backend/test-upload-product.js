import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function testUploadAndUpdateProduct() {
  try {
    // Step 1: Upload image
    const form = new FormData();
    form.append('image', fs.createReadStream('./test-image.jpg')); // Ensure test-image.jpg exists in backend folder

    const uploadResponse = await axios.post('http://localhost:4002/api/upload', form, {
      headers: form.getHeaders(),
    });
    console.log('Upload response:', uploadResponse.data);

    const imageUrl = uploadResponse.data.url;
    if (!imageUrl) {
      console.error('No image URL returned from upload');
      return;
    }

    // Step 2: Create a new product with uploaded image
    const newProductData = {
      name: 'Test Product',
      description: 'Test product description',
      price: 9.99,
      category_id: 1, // Adjust category_id as needed
      stock_quantity: 10,
      image_url: imageUrl,
      sku: 'TESTSKU123',
    };

    const createResponse = await axios.post('http://localhost:4002/api/products', newProductData);
    console.log('Create product response:', createResponse.data);

    const productId = createResponse.data.id;
    if (!productId) {
      console.error('No product ID returned from create');
      return;
    }

    // Step 3: Update the product image_url to a new value (simulate update)
    const updatedImageUrl = imageUrl; // For test, keep same image URL
    const updateResponse = await axios.put(`http://localhost:4002/api/products/${productId}`, {
      image_url: updatedImageUrl,
    });
    console.log('Update product response:', updateResponse.data);

  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
  }
}

testUploadAndUpdateProduct();
