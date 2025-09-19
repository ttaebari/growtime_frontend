import React, { useState, useRef, useEffect } from "react";

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    onClick: () => void;
}

interface MenuButtonProps {
    items: MenuItem[];
}

const MenuButton: React.FC<MenuButtonProps> = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMenuClick = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item: MenuItem) => {
        item.onClick();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* 메뉴 버튼 */}
            <button
                onClick={handleMenuClick}
                className="flex fixed top-4 left-4 z-50 justify-center items-center w-12 h-12 text-gray-700 bg-white rounded-full border border-gray-200 shadow-lg transition-all duration-200 hover:bg-gray-50"
                aria-label="메뉴 열기"
            >
                <svg
                    className={`w-6 h-6 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <div className="fixed left-4 top-16 z-40 py-2 bg-white rounded-xl border border-gray-200 shadow-xl min-w-48">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item)}
                            className="flex gap-3 items-center px-4 py-3 w-full text-left text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuButton;
