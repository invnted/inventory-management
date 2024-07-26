import React from 'react';
import NotAuthorize from '../Images/NotAuthorize.png';

function AuthorizationFailed() {
    return (
        <div className='relative w-screen h-screen overflow-hidden'>
            <img
                src={NotAuthorize}
                alt="Authorization Failed"
                className='absolute inset-0 w-full h-full object-cover'
            />
        </div>
    );
}

export default AuthorizationFailed;
