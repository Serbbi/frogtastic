import HelpSection from './HelpSection';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categories from './HelpCategories';
import './HelpPage.css';

export default function HelpContent() {
    const [activeCategory, setActiveCategory] = useState("tutorials");
    const [highlightStyle, setHighlightStyle] = useState({});
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const { category } = useParams();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const activeBtn = container.querySelector(".help-menu-button.active");
        if (activeBtn) {
            setHighlightStyle({
                left: activeBtn.offsetLeft,
                width: activeBtn.offsetWidth,
            });
        }
    }, [activeCategory]);

    useEffect(() => {
        if (category && categories[category]) {
            setActiveCategory(category);
        }
    }, [category]);

    const handleCategoryChange = (newCategory) => {
        setActiveCategory(newCategory);
        navigate(`/home/help/${newCategory}`);
    };

    return (
        <div className="help-content">
            <div className='title-and-buttons help-page'>
                <h1 className='title'>Help</h1>
                <div className="help-menu-buttons" ref={containerRef}>
                    <span
                        className="help-menu-highlight"
                        style={highlightStyle}
                    />
                    {Object.keys(categories).map((category) => (
                        <button
                            key={category}
                            className={`help-menu-button ${activeCategory === category ? "active" : ""
                                }`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            {categories[activeCategory].map((section, idx) => (
                <HelpSection key={idx} title={section.title}>
                    {section.content}
                </HelpSection>
            ))}
        </div>
    );
}