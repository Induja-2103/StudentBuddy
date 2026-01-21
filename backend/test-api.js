// Test script to verify backend API and create sample user
const https = require('https');
const http = require('http');

// Test 1: Health Check
console.log('🔍 Testing API Health...\n');
http.get('http://localhost:5000/api/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('✅ Health Check Response:', data);
        console.log('\n---\n');

        // Test 2: Create Sample User
        console.log('👤 Creating Sample User...\n');
        const userData = JSON.stringify({
            email: 'test@student.com',
            password: 'Test123!',
            full_name: 'Test Student',
            grade_level: '10',
            subjects_enrolled: ['Mathematics', 'Science', 'English']
        });

        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': userData.length
            }
        };

        const req = http.request(options, (res) => {
            let signupData = '';
            res.on('data', chunk => signupData += chunk);
            res.on('end', () => {
                console.log('Status Code:', res.statusCode);
                console.log('Response:', signupData);

                if (res.statusCode === 201) {
                    console.log('\n✅ Sample user created successfully!');
                    console.log('📧 Email: test@student.com');
                    console.log('🔑 Password: Test123!');
                } else if (res.statusCode === 400 && signupData.includes('already exists')) {
                    console.log('\n⚠️  User already exists. Testing login instead...\n');

                    // Test 3: Login with existing user
                    const loginData = JSON.stringify({
                        email: 'test@student.com',
                        password: 'Test123!'
                    });

                    const loginOptions = {
                        hostname: 'localhost',
                        port: 5000,
                        path: '/api/auth/login',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': loginData.length
                        }
                    };

                    const loginReq = http.request(loginOptions, (res) => {
                        let loginResponse = '';
                        res.on('data', chunk => loginResponse += chunk);
                        res.on('end', () => {
                            console.log('Login Status Code:', res.statusCode);
                            console.log('Login Response:', loginResponse);

                            if (res.statusCode === 200) {
                                console.log('\n✅ Login successful!');
                                console.log('📧 Email: test@student.com');
                                console.log('🔑 Password: Test123!');
                            }
                        });
                    });

                    loginReq.on('error', (e) => {
                        console.error('❌ Login Error:', e.message);
                    });

                    loginReq.write(loginData);
                    loginReq.end();
                } else {
                    console.log('\n❌ Unexpected response');
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ Signup Error:', e.message);
        });

        req.write(userData);
        req.end();
    });
}).on('error', (e) => {
    console.error('❌ Health Check Error:', e.message);
    console.error('Make sure the backend server is running on port 5000');
});
