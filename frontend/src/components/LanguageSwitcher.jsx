import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", label: "Bengali", nativeName: "বাংলা" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentCode = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];
  const currentLang = LANGUAGES.find((l) => l.code === currentCode) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className={`language-switcher-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Select Language"
      >
        <Globe size={15} className="lang-globe-icon" />
        <span className="lang-current-label">{currentLang.nativeName}</span>
        <ChevronDown size={14} className={`lang-chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <div className="language-dropdown-menu" role="listbox">
          <div className="lang-dropdown-header">Language</div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`language-dropdown-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(lang.code)}
              >
                <div className="lang-item-content">
                  <span className="lang-item-native">{lang.nativeName}</span>
                  {lang.code !== "en" && (
                    <span className="lang-item-sub">({lang.label})</span>
                  )}
                </div>
                {isSelected && <Check size={14} className="lang-check-icon" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
