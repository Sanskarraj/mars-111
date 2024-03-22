

"use client"


import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const TermsPage = () => {
    const [showProgress, setShowProgress] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowProgress(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div >
            {showProgress && (
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress sx={{ color: 'white', animationDuration: '650ms' }} size={200} />
                </div>
            )}
            {!showProgress && <FromComponent />}
        </div>
    );
};


const FromComponent = () => {
    return (
        <div>

            <div className="bg-black w-full h-full">

                <div className="p-4 sm:p-8 md:p-12 lg:p-20 xl:p-96 flex flex-col gap-24 md:gap-32 lg:gap-48 xl:gap-64">


                    <div class="relative z-10 flex items-center justify-center w-full h-[100px] sm:h-[100px] lg:h-[100px]">
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-tl from-transparent to-red-400 sm:bg-gradient-radial sm:from-red-400 sm:to-transparent lg:bg-gradient-radial lg:from-red-400 lg:to-transparent blur-3xl rounded-full"></div>
                    </div>


                    <div className="flex flex-col gap-12 justify-center text-white">
                        <h1 className="text-4xl">About US</h1>
                        <p>SSYoutube Downloader is a prominent downloader that specializes in providing free HD video services. Discover a vast collection of videos and music, and easily download content from multiple websites, including popular platforms like Youtube, Facebook, and Instagram. With its user-friendly interface, fast performance, and compact size, SSYoutube Downloader is the ultimate choice for video downloads!</p>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default TermsPage