import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SettingSection({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);
    const mutationConfig = { attributes: false, childList: true };

    useEffect(() => {
        setIsOpen(false);
    }, [title]);

   useEffect(() => {
        if (!contentRef.current) return;

        const element = contentRef.current;

        const mutationObserver = new MutationObserver((mutationConfigList) => {
              for(const mutationConfig of mutationConfigList) {
                if(mutationConfig.type === 'attributes') {
                    console.log('ATTRIBUTES CHANGED');
                } else if(mutationConfig.type === 'childList') {
                    setHeight(element.fitContent);
                }
            }
        });

        mutationObserver.observe(element, mutationConfig);

        return () => {
            mutationObserver.disconnect();
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className="setting-section">
            <div className="setting-section-header" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="setting-section-title">{title}</h2>
                <FontAwesomeIcon icon={isOpen ? "chevron-up" : "chevron-down"} />
            </div>
            <div className="setting-section-content" style={{ height }} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
