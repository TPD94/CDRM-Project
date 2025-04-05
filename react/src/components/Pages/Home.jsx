import React, { useState, useEffect } from 'react';
import { readTextFromClipboard } from '../functions/ParseChallenge';

function Home() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    let divToScroll = document.getElementById('main_content');
    divToScroll.scrollTop = 0;  // Scroll to the top of the div
  };

  const copyToClipboard = (event) => {
    let message = document.getElementById('messageresults').innerHTML;
  
    // Replace <br> tags with newline characters
    message = message.replace(/<br\s*\/?>/gi, '\n');
  
    // Use textContent to get the actual text without HTML tags
    navigator.clipboard.writeText(message);  // Copy the message to the clipboard
    console.log(message);
  };

  // Handlers for form submission and reset
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSubmitButton = (event) => {
    let pssh = document.getElementById('pssh').value;
    let licurl = document.getElementById('licurl').value;
    let headers = document.getElementById('headers').value;
    let cookies = document.getElementById('cookies').value;
    let data = document.getElementById('data').value;

    fetch('https://cdrm-project.com/api/decrypt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pssh: pssh,
        licurl: licurl,
        headers: headers,
        cookies: cookies,
        data: data
      }),
    })
      .then(response => response.json())
      .then(data => {
        const resultMessage = data['message'].replace(/\n/g, '<br />'); // Format the message as HTML
        setMessage(resultMessage);
        setIsVisible(true);
      })
      .catch((error) => {
        console.error('Error during decryption request:', error);
        setMessage('Error: Unable to process request.');
        setIsVisible(true);
      });
};


  const handleResetButton = (event) => {
    let pssh = document.getElementById('pssh');
    let licurl = document.getElementById('licurl');
    let headers = document.getElementById('headers');
    let cookies = document.getElementById('cookies');
    let data = document.getElementById('data');
    pssh.value = '';
    licurl.value = '';
    headers.value = '';
    cookies.value = '';
    data.value = '';
    setMessage('');
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      let divToScroll = document.getElementById('main_content');
      divToScroll.scrollTop = divToScroll.scrollHeight;
    }
  }, [message, isVisible]);

  return (
    <>
      <div className='w-full min-h-full bg-zinc-900 flex flex-col items-center justify-center'>
        <form className='flex flex-col w-8/10 min-h-8/10 bg-[rgba(0,0,0,0.2)] p-10 border-black border-1 rounded-xl shadow-lg shadow-cyan-500/50 overflow-y-auto' onSubmit={handleSubmit}>
          <label htmlFor='pssh' className='text-white mb-1'>PSSH:</label>
          <input type='text' id='pssh' name='pssh' className='text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded focus:shadow-sm focus:shadow-cyan-500/50 transition-shadow duration-300 ease-in-out p-2' />
          <label htmlFor='licurl' className='text-white mb-1 mt-1'>License URL:</label>
          <input type='text' id='licurl' name='licurl' className='text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded focus:shadow-sm focus:shadow-cyan-500/50 transition-shadow duration-300 ease-in-out p-2' />
          <label htmlFor='headers' className='text-white mb-1 mt-1'>Headers:</label>
          <textarea id='headers' name='headers' className='text-white bg-[rgba(0,0,0,0.2)] h-24 focus:h-92 focus:outline-none rounded focus:shadow-sm focus:shadow-cyan-500/50 transition-all duration-300 ease-in-out p-2 resize-none' />
          <label htmlFor='cookies' className='text-white mb-1 mt-1'>Cookies:</label>
          <textarea id='cookies' name='cookies' className='text-white bg-[rgba(0,0,0,0.2)] h-24 focus:h-92 focus:outline-none rounded focus:shadow-sm focus:shadow-cyan-500/50 transition-all duration-300 ease-in-out p-2 resize-none' />
          <label htmlFor='data' className='text-white mb-1 mt-1'>Data:</label>
          <textarea id='data' name='data' className='text-white bg-[rgba(0,0,0,0.2)] h-24 focus:h-92 focus:outline-none rounded focus:shadow-sm focus:shadow-cyan-500/50 transition-all duration-300 ease-in-out p-2 resize-none' />
          <div className='flex flex-row w-full justify-evenly mt-5 mb-5'>
            <button type='button' onClick={handleSubmitButton} className='bg-cyan-500 text-white rounded p-2 hover:bg-cyan-600 transition-colors duration-300 ease-in-out w-1/6 cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden'>Submit</button>
            <button type='button'  onClick={readTextFromClipboard} className='bg-yellow-500 text-white rounded p-2 hover:bg-yellow-600 transition-colors duration-300 ease-in-out w-1/6 cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden'>Paste from fetch</button>
            <button type='button' onClick={handleResetButton} className='bg-red-500 text-white rounded p-2 hover:bg-red-600 transition-colors duration-300 ease-in-out w-1/6 cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden'>Reset</button>
          </div>
        </form>
      </div>

      {isVisible && (
        <div className='w-full min-h-full h-full bg-zinc-900 flex flex-col items-center justify-center'>
          <div className='w-8/10 min-h-8/10 flex flex-col bg-[rgba(0,0,0,0.2)] items-center p-10 border-black border-1 rounded-xl shadow-lg shadow-cyan-500/50 overflow-y-auto'>
            <p className='w-full text-center text-white text-2xl overflow-hidden mb-10 pb-2 border-b'>Results:</p>
            <p id='messageresults' className='w-8/10 h-6/10 text-center text-white text-2xl overflow-hidden bg-[rgba(0,0,0,0.2)] rounded-xl p-5' dangerouslySetInnerHTML={{ __html: message }}></p>
            <div className='w-full h-1/10 flex justify-evenly mt-5 , mb-5'>
              <button type='button' onClick={copyToClipboard} className='bg-green-500 text-white rounded p-2 hover:bg-green-600 transition-colors duration-300 ease-in-out min-w-1/6 w-1/6 min-h-4/6 h-4/6 cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden'>Copy</button>
              <button type='button' onClick={scrollToTop} className='bg-yellow-600 text-white rounded p-2 hover:bg-yellow-700 transition-colors duration-300 ease-in-out min-w-1/6 w-1/6 min-h-4/6 h-4/6 cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden'>Back to top</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
