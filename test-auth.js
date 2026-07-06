const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

async function test() {
    try {
        const secret = process.env.JWT_SECRET;
        const payload = { sub: 1, email: 'eduardo@teste.com', role: 'ADMIN' };
        const token = jwt.sign(payload, secret);
        
        console.log('Token generated:', token.substring(0, 20) + '...');
        
        const authApiUrl = process.env.AUTH_MICROSERVICE_URL || 'http://localhost:3000';
        
        console.log(`Sending request to ${authApiUrl}/usuarios/1`);
        
        const response = await axios.get(`${authApiUrl}/usuarios/1`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (err) {
        console.log('Error caught!');
        console.log('err.message:', err.message);
        if (err.response) {
            console.log('err.response.status:', err.response.status);
            console.log('err.response.data:', err.response.data);
        } else {
            console.log('No err.response. Full err:', err);
        }
    }
}

test();
