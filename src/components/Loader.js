import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loader = () => {
    return (
        <div className="skeleton-container">
        <Skeleton
            // width="100%" // Make the width responsive
            width={250}
            // height={20}  // Adjust the height as needed
            className="skeleton-loading"
            baseColor="#8f90da" // Adjust the base color
            highlightColor="#e0e0e0" // Optional: Adjust the highlight color
        />
    </div>
    )
}

export default Loader