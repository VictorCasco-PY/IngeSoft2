import React from 'react';

const SkeletonWrapper = ({ children, width = 300 }) => {
    return (
        <div
            style={{
                display: 'block',
                width: width,
            }}
        >
            {children}
        </div>
    );
};

export default SkeletonWrapper;