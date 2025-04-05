import React, { useState, useEffect } from 'react';

function API() {
  // State to store the fetched data for Remote CDM
  const [deviceInfo, setDeviceInfo] = useState({
    device_type: '',
    system_id: '',
    security_level: '',
    host: '',
    secret: '',
    device_name: ''
  });

  // Fetch data when the component mounts
  useEffect(() => {
    // Replace this with the actual URL of your API
    fetch('https://cdrm-project.com/remotecdm/widevine/deviceinfo')
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched data
        setDeviceInfo({
          device_type: data.device_type,
          system_id: data.system_id,
          security_level: data.security_level,
          host: data.host,
          secret: data.secret,
          device_name: data.device_name
        });
      })
      .catch(error => console.error('Error fetching device info:', error));
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <>
      <div className='min-w-full w-full min-h-full overflow-x-auto bg-zinc-900 shadow-lg shadow-black flex flex-col flex-wrap p-10 justify-around'>
        
        {/* Decryption Request Section */}
        <details open className='p-5 mb-5 border shadow-lg shadow-black overflow-y-auto'>
          <summary className='bg-[rgba(0,0,0,0.2)] p-2 rounded text-white flex shadow-purple-900 shadow-sm'>
            Sending a decryption request | {`(Python)`}
          </summary>
          <br />
          <div className='h-9/10 bg-[rgba(0,0,0,0.2)] p-2 rounded text-white shadow-sm shadow-purple-900 w-full overflow-x-auto overflow-y-auto'>
            <pre className='p-2'>
              {`import requests

print(requests.post(
    url='https://cdrm-project.com/api/decrypt',
    headers={
        'Content-Type': 'application/json',
    },
    json={
        'pssh': 'AAAAW3Bzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAADsIARIQ62dqu8s0Xpa7z2FmMPGj2hoNd2lkZXZpbmVfdGVzdCIQZmtqM2xqYVNkZmFsa3IzaioCSEQyAA==',
        'licurl': 'https://cwip-shaka-proxy.appspot.com/no_auth',
        'headers': str({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
        })
    }
).json()['message'])`}
            </pre>
          </div>
        </details>
        
        {/* Search Request Section */}
        <details open className=' p-5 mb-5 shadow-lg shadow-black border overflow-y-auto' >
          <summary className='bg-[rgba(0,0,0,0.2)] p-2 rounded text-white flex shadow-sm shadow-purple-900'>
            Sending a search request | {`(Python)`}
          </summary>
          <br />
          <div className='h-9/10 bg-[rgba(0,0,0,0.2)] p-2 rounded text-white shadow-sm shadow-purple-900'>
            <pre className='p-2'>{`import requests

print(requests.post(
    url='https://cdrm-project.com/api/cache/search',
    json={
        'input': 'AAAAW3Bzc2gAAAAA7e+LqXnWSs6jyCfc1R0h7QAAADsIARIQ62dqu8s0Xpa7z2FmMPGj2hoNd2lkZXZpbmVfdGVzdCIQZmtqM2xqYVNkZmFsa3IzaioCSEQyAA=='
    }
).json())`}</pre>
          </div>
        </details>
        
        {/* Remote CDM Configuration Section */}
        <details open className=' p-5 mb-5 shadow-lg shadow-black border overflow-y-auto'>
          <summary className='bg-[rgba(0,0,0,0.2)] p-2 rounded text-white flex shadow-sm shadow-purple-900'>
            Remote CDM configuration | {`(For Devine / VineTrimmeer / Extensions)`}
          </summary>
          <br />
          <div className='h-9/10 bg-[rgba(0,0,0,0.2)] p-2 rounded text-white shadow-sm shadow-purple-900'>
            <p className='p-2'>
              device_type: <span id='wv_device_type'>{deviceInfo.device_type}</span>
              <br></br>
              system_id: <span id='wv_system_id'>{deviceInfo.system_id}</span>
              <br></br>
              security_level: <span id='wv_security_level'>{deviceInfo.security_level}</span>
              <br></br>
              host: <span id='wv_host'>{deviceInfo.host}</span>
              <br></br>
              secret: <span id='wv_secret'>{deviceInfo.secret}</span>
              <br></br>
              device_name: <span id='wv_device_name'>{deviceInfo.device_name}</span>
            </p>
          </div>
        </details>
        
        {/* Webvault Configuration Section */}
        <details  open className='p-5 mb-5 shadow-lg shadow-black border overflow-y-auto'>
          <summary className='bg-[rgba(0,0,0,0.2)] p-2 rounded text-white flex shadow-sm shadow-purple-900 transition-all transition-300 ease-in'>
            Webvault configuration | {`(For Devine / VineTrimmer)`}
          </summary>
          <br />
          <div className='h-9/10 bg-[rgba(0,0,0,0.2)] p-2 rounded text-white shadow-sm shadow-purple-900'>
            <pre className='p-2'>{`key_vaults:
    - type: API
      name: "CDRM"
      uri: "https://cdrm-project.com/api/cache"
      token: "CDRM"`}</pre>
          </div>
        </details>
        
      </div>
    </>
  );
}

export default API;
