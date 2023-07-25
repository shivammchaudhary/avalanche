import { useState } from 'react';
import { ethers } from 'ethers';
import HelloWorld from './artifacts/contracts/HelloWorld.sol/HelloWorld.json';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [hello, setHelloValue] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchHello() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, HelloWorld.abi, provider);
      try {
        const data = await contract.hello();
        setHelloValue(data);
        console.log('Greeting: ', data);
        console.log('Contract Address: ', contract.address);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  async function setHello() {
    if (!hello) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, HelloWorld.abi, signer);
      const transaction = await contract.setHello(hello);
      await transaction.wait();
      fetchHello();
    }
  }

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#007BFF', color: '#fff', padding: '1rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>A V A L A N C H E</h1>
      </header>

      <main style={{ padding: '1rem' }}>
        <h3 style={{ color: '#007BFF' }}>Hello George Brown</h3>

        <button
          onClick={fetchHello}
          style={{
            backgroundColor: '#007BFF',
            color: '#fff',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Click me, you will see the change
        </button>
        <br />
        <input
          onChange={e => setHelloValue(e.target.value)}
          placeholder="Hi message"
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            width: '100%',
            marginTop: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        <br />
        <button
          onClick={setHello}
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginTop: '1rem',
          }}
        >
          Set hello message
        </button>

        <div style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {hello || 'No greeting yet'}
        </div>
      </main>
    </div>
  );
}

export default App;
