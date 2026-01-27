import React, { useState } from 'react';
import apiService from '../services/apiService';

const TestIntegration = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [testUser, setTestUser] = useState(null);

  const testRegister = async () => {
    setLoading(true);
    try {
      const userData = {
        fullName: 'Test User',
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'PARENT'
      };
      
      const response = await apiService.register(userData);
      setTestUser(userData);
      setResult('Registration Success: ' + JSON.stringify(response) + 
                '\n\nUser created: ' + JSON.stringify(userData));
    } catch (error) {
      setResult('Registration Error: ' + error.message);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    if (!testUser) {
      setResult('Please register a user first');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiService.login({
        email: testUser.email,
        password: testUser.password
      });
      setResult('Login Success: ' + JSON.stringify(response, null, 2));
    } catch (error) {
      setResult('Login Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h3>Backend Integration Test</h3>
      <div className="mb-3">
        <button 
          className="btn btn-primary me-2" 
          onClick={testRegister}
          disabled={loading}
        >
          Test Register
        </button>
        <button 
          className="btn btn-success me-2" 
          onClick={testLogin}
          disabled={loading}
        >
          Test Login
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {testUser && (
        <div className="alert alert-info">
          <strong>Test User:</strong> {testUser.email} / {testUser.password}
        </div>
      )}
      {result && (
        <div className="alert alert-secondary">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default TestIntegration;