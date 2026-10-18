import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HelpSection({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        setIsOpen(false);
    }, [title]);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className="help-section">
            <div className="help-section-header" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="help-section-title">{title}</h2>
                <FontAwesomeIcon icon={isOpen ? "chevron-up" : "chevron-down"} />
            </div>
            <div className="help-section-content" style={{ height }} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
