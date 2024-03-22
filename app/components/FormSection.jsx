"use client";
import React, { useState, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client'; // Import io object from socket.io-client

const ENDPOINT = 'https://back-mars-one.onrender.com';


const FormSection = () => {
    const scrollToRef = useRef(null);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [responseData, setResponseData] = useState(null);
    const [bigLoading, setBigLoading] = useState(false);
    const [ID, setID] = useState(null);

    const [phases, setPhases] = useState([]);
    const [isExecutionCompleted, setIsExecutionCompleted] = useState(false);
    const [urlError, setURLError] = useState(false);




    const handleSubmit = async (indexData) => {
        const clientId = uuidv4();
        const socket = io(ENDPOINT, {
            query: { clientId, indexData },
        });


        // initiate downlaod code implementation which sends requests to backend download endpoint
        const initiateDownload = () => {
            setTimeout(() => {
                const downloadUrl = 'https://back-mars-one.onrender.com/download'; // Replace with actual download endpoint
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'large_file.zip'; // Change the filename if needed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 4000); // 10 seconds delay
        };







        socket.on('phase_executed', ({ phase, indexData }) => {
            setPhases((prevPhases) => [...prevPhases, { phase, indexData }]);
        });

        socket.on('execution_completed', () => {
            setIsExecutionCompleted(true);
            socket.disconnect(); // Disconnect socket after execution completion
            initiateDownload();
            setBigLoading(false);

        });


        setPhases([]);
        setIsExecutionCompleted(false);
        setBigLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
        socket.emit('start_execution', { message: url });
    };

    const removeBlankSpaces = () => {
        console.log("remove blank spaces ke andar")

        setUrl(url.trim());
    };
    const isValidUrl = () => {
        const youtubeShortenedRegex = /^https:\/\/youtu\.be\//;
        const youtubeShortsRegex = /^https:\/\/(?:www\.)?youtube\.com\/shorts\//;
        const youtubeVideoRegex = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=/;

        if (youtubeShortenedRegex.test(url) || youtubeShortsRegex.test(url) || youtubeVideoRegex.test(url)) {
            return true;
        }

        return false;
    };


    const handleError = () => {
        console.log("handle error ke andar")
        setURLError(true);
        // Vibrate the input by adding animation directly in className
        setTimeout(() => {
            setURLError(false);
        }, 1000); // Remove the error state after 1 second
    };



    const fetchData = async () => {
        console.log("fetch data ke andar")
        setURLError(false); // Reset error state
        if (!isValidUrl()) {
            console.log("error sapadla")
            handleError();
            return;
        }



        setLoading(true);
        setError(null);
        setIsExecutionCompleted(false);
        setPhases([]);
        try {
            setData(null);
            // const response = await fetch(`api/.as?url=${url}`);
            // if (!response.ok) {
            //     throw new Error('Failed to fetch data');
            // }
            console.log("hii")
            // const requestData = await response.json();
            // setData(requestData.data);


            const response = await axios.get(`https://back-mars-one.onrender.com/data?url=${url}`);
            console.log(response)
            console.log(response.data);

            setData(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {/* <h1 className='text-center text-4xl font-semibold'>hiii</h1> */}
            <div className='lg:mt-10 flex-col flex items-center'>
                <input
                    type="text"
                    onChange={(e) => setUrl(e.target.value)}
                    onBlur={removeBlankSpaces}
                    value={url}
                    name="url"
                    placeholder="Enter youtube video link here..."
                    // style={{ border: `${error ? '1px solid red' : '1px solid #CBD5E0'}`, animation: `${error ? 'vibrate 0.3s ease infinite' : 'none'}` }}
                    className={`font-sans w-72 lg:w-1/2 border ${urlError ? 'border-red-500 animate-vibrate' : 'border-slate-200'} rounded-lg py-2 px-3 outline-none	bg-transparent transition-colors duration-300 ${urlError ? 'animate-shake' : ''}`} />


                <button
                    onClick={fetchData} disabled={loading}
                    className="mt-2 inline-flex items-center justify-center px-6 font-sans font-semibold tracking-wide text-gray-700 bg-white rounded-lg py-2">
                    {loading ? (
                        <CircularProgress style={{ color: 'black' }} size={24} />
                    ) : (
                        'GO'
                    )}

                </button>
            </div>
            {/* data from backend for indexing */}
            <div className="flex flex-col items-center justify-center text-sm">
                <div className="h-10"></div>
                {loading && <CircularProgress style={{ color: 'white' }} size={80} />}
                {data && (

                    <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
                        <p className='text-[#ADB7BE] text-sm font-mono lg:font-normal'>Select the Video format to download
                        </p>
                        <div className="underline flex flex-row justify-evenly pb-4 pt-3 font-mono">
                            <div className="ml-5 mr-10">Format</div>
                            <div className="mr-14">Quality</div>
                            <div className="mr-10">Size</div>
                        </div>
                        {data.map((item, index) => (
                            <button key={index}
                                className='flex flex-row justify-around rounded-lg border border-transparent px-1 py-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
                                onClick={() => handleSubmit(index)} disabled={bigLoading}
                            >
                                <div style={{ marginRight: '30px' }}> {item.Format}</div>
                                <div style={{ marginRight: '25px' }}> {item.Quality}</div>
                                <div> {item.Size}MB</div>
                                {/* <div>AV: {item.userId}</div> */}
                            </button>
                        ))}
                    </div>
                )}
                {bigLoading && <CircularProgress ref={scrollToRef} className='absolute z-20' style={{ color: 'white', animationDuration: '800ms' }} size={250} />}
                <div className="h-10"></div>
                {phases.length > 0 && bigLoading && (
                    <div>
                        {/* <h3>Execution Phases:</h3> */}
                        <ul>
                            {phases.map((phase, index) => (
                                <li key={index}>{phase.phase}...</li>
                            ))}
                        </ul>
                        {/* <div>Loading...</div> */}
                    </div>
                )}
                {isExecutionCompleted && (
                    <div>
                        <h3>Execution Completed</h3>
                        {/* Add any completion message or action here */}
                    </div>
                )}
            </div>




            <p className='text-[#ADB7BE] text-center p-10 lg:p-0 text-sm font-mono lg:font-normal'>Secured by AI based malware detector
            </p>
        </>
    )
}

export default FormSection