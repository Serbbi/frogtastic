import { useState, useContext, createContext } from "react";

const ImageContext = createContext();

export default function ImageProvider({ children }) {
    const [ extractionImageURL, setExtractionImageURL ] = useState(null);

    return (
        <ImageContext.Provider value={{ extractionImageURL, setExtractionImageURL }}>
            {children}
        </ImageContext.Provider>
    );
}

export const useImage = () => useContext(ImageContext);