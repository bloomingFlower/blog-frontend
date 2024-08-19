import React, { useRef, useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import { FaGraduationCap, FaBriefcase, FaCode, FaProjectDiagram, FaCertificate, FaBook, FaPlane, FaUtensils, FaMicrochip, FaChartLine, FaEllipsisH, FaGithub, FaEnvelope, FaLinkedin, FaTwitter, FaBlog, FaEdit, FaTrash, FaPlus, FaGlobe, FaEye } from "react-icons/fa";
import { SiCoursera, SiOrcid } from "react-icons/si";
import SectionItemForm from "./components/SectionItemForm";
import SectionForm from "./components/SectionForm";

// Contact & Social Links component
function ContactInfo() {
  const contacts = [
    { icon: <FaEnvelope />, label: "Email", link: "mailto:yourrubber@duck.com" },
    { icon: <FaGithub />, label: "GitHub", link: "https://github.com/bloomingFlower" },
    { icon: <SiOrcid />, label: "ORCID", link: "https://orcid.org/0009-0001-5288-7745" },
    { icon: <SiCoursera />, label: "Coursera", link: "https://www.coursera.org/user/6fc30c5f564982f4134e32b619efef76" },
    // { icon: <FaLinkedin />, label: "LinkedIn", link: "https://www.linkedin.com/in/yourusername" },
    // { icon: <FaTwitter />, label: "Twitter", link: "https://twitter.com/yourusername" },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Contact & Social</h2>
      <div className="grid grid-cols-2 gap-2">
        {contacts.map((contact, index) => (
          <a
            key={contact.label || index}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-sm mr-2">{contact.icon}</span>
            <span className="text-sm">{contact.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TableOfContents({ sections, scrollTo }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Contents</h2>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.title}>
            <button
              onClick={() => scrollTo(section.title)}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Section component
function Section({ ID, title, items = [], icon, isLoggedIn, onEdit, onDelete, onAddItem, editingSectionItems, handleEditSectionItem, handleCancelEditSectionItem, handleUpdateSectionItem, handleDeleteSectionItem, language, isPreviewMode }) {
  // Filter items for preview mode
  const displayItems = isPreviewMode ? items.filter(item => item.isPublic !== false) : items;

  return (
    <div id={title.replace(/\s+/g, '-').toLowerCase()} className="mb-8">
      <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
        <span className="mr-2 text-gray-600">{getIconComponent(icon)}</span>
        {title}
        {isLoggedIn && !isPreviewMode && <span className="ml-2 text-sm text-gray-500">(ID: {ID})</span>}
      </h2>
      <div className="text-gray-700">
        {displayItems.length > 0 ? (
          <ul className="list-disc pl-5 mt-2">
            {displayItems.map((item, index) => (
              <li key={index} className="mb-2">
                <strong>{item.title}</strong>
                {item.institution && ` - ${item.institution}`}
                {item.company && ` - ${item.company}`}
                {item.year && ` (${item.year})`}
                {item.period && ` (${item.period})`}
                {item.description && <p className="mt-1">{item.description}</p>}
                {isLoggedIn && !isPreviewMode && (
                  <div className="mt-1 mb-2">
                    <button
                      onClick={() => handleEditSectionItem(item.ID)}
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      <FaEdit className="inline mr-1" /> {language === 'ko' ? '수정' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteSectionItem(item.ID)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      <FaTrash className="inline mr-1" /> {language === 'ko' ? '삭제' : 'Delete'}
                    </button>
                  </div>
                )}
                {editingSectionItems[item.ID] && !isPreviewMode && (
                  <SectionItemForm
                    item={item}
                    onSubmit={(updatedItem) => handleUpdateSectionItem(updatedItem)}
                    onCancel={() => handleCancelEditSectionItem(item.ID)}
                    language={language}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>{language === 'ko' ? '아직 항목이 없습니다.' : 'No items yet.'}</p>
        )}
      </div>
      {isLoggedIn && !isPreviewMode && (
        <div className="mt-2 mb-4">
          <button
            onClick={onEdit}
            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <FaEdit className="inline mr-1" /> {language === 'ko' ? '수정' : 'Edit'}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTrash className="inline mr-1" /> {language === 'ko' ? '삭제' : 'Delete'}
          </button>
          <button
            onClick={onAddItem}
            className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <FaPlus className="inline mr-1" /> {language === 'ko' ? '아이템 추가' : 'Add Item'}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to get icon component
function getIconComponent(iconName) {
  const iconMap = {
    FaGraduationCap, FaBriefcase, FaCode, FaProjectDiagram, FaCertificate,
    FaBook, FaPlane, FaUtensils, FaMicrochip, FaChartLine, FaEllipsisH,
    FaGithub, FaEnvelope, FaLinkedin, FaTwitter, FaBlog, SiCoursera, SiOrcid
  };
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : null;
}

function AboutMe() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [language, setLanguage] = useState('ko');
  const sectionRefs = useRef({});
  const { isLoggedIn, user } = useContext(AuthContext);
  const [editingSection, setEditingSection] = useState(null);
  const [editingSectionItem, setEditingSectionItem] = useState(null);
  const [aboutInfoId, setAboutInfoId] = useState(null);
  const [editingSectionItems, setEditingSectionItems] = useState({});
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSuperMode, setIsSuperMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});

  // useMemo를 사용하여 aboutInfo 객체를 메모이제이션
  const memoizedAboutInfo = useMemo(() => aboutInfo, [aboutInfo]);

  // 미리보기 모드에서 사용할 정보
  const previewInfo = useMemo(() => {
    if (!memoizedAboutInfo) return null;
    return {
      ...memoizedAboutInfo,
      sections: memoizedAboutInfo.sections.map(section => ({
        ...section,
        items: section.items.filter(item => item.isPublic !== false)
      }))
    };
  }, [memoizedAboutInfo]);

  // 실제 렌더링에 사용할 정보
  const displayInfo = isPreviewMode ? previewInfo : memoizedAboutInfo;

  // useCallback을 사용하여 함수를 메모이제이션
  const fetchAboutInfo = useCallback(async () => {
    try {
      const id = language === 'ko' ? 2 : 1;
      const response = await api.get(`/api/v1/about-me/${id}?lang=${language}`);
      const data = response.data.data;
      setAboutInfo(data);
      setAboutInfoId(id);
    } catch (error) {
      console.error("Failed to fetch about info:", error);
    }
  }, [language]);

  useEffect(() => {
    fetchAboutInfo();
  }, [fetchAboutInfo]);


  const handleLanguageChange = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    setLanguage(newLanguage);
    window.history.pushState(null, '', `/${newLanguage}/about-me`);
  };

  const createAboutInfo = async () => {
    try {
      const newAboutInfo = {
        name: "New Name",
        title: "New Title",
        description: "New Description",
        language: language,
        contacts: [],
        sections: []
      };
      await api.post('/api/v1/about-me', newAboutInfo);
      fetchAboutInfo();
    } catch (error) {
      console.error("Failed to create about info:", error);
    }
  };

  const updateAboutInfo = async () => {
    try {
      await api.put(`/api/v1/about-me/${aboutInfo.id}`, aboutInfo);
      fetchAboutInfo();
    } catch (error) {
      console.error("Failed to update about info:", error);
    }
  };

  const deleteAboutInfo = async () => {
    try {
      await api.delete(`/api/v1/about-me/${aboutInfo.id}`);
      setAboutInfo(null);
    } catch (error) {
      console.error("Failed to delete about info:", error);
    }
  };

  const scrollTo = (title) => {
    const element = sectionRefs.current[title];
    if (element) {
      const navHeight = 60; // nav height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (window.location.hash && aboutInfo) {
      const sectionId = window.location.hash.slice(1);
      const section = aboutInfo.sections.find(s => s.title.toLowerCase().replace(/\s+/g, '-') === sectionId);
      if (section) {
        setTimeout(() => scrollTo(section.title), 100);
      }
    }
  }, [aboutInfo]);

  const handleAddSection = async (newSection) => {
    if (!aboutInfoId) {
      console.error("AboutInfo ID is not set");
      return;
    }
    try {
      const sectionWithItems = { ...newSection, items: [] };
      const response = await api.post(`/api/v1/about-me/${aboutInfoId}/sections`, sectionWithItems);
      const addedSection = response.data.data;
      setAboutInfo(prevInfo => ({
        ...prevInfo,
        sections: [...prevInfo.sections, addedSection]
      }));
      setEditingSection(null);
      // 섹션 추가 후 데이터 다시 불러오기
      fetchAboutInfo();
    } catch (error) {
      console.error("섹션 추가 실패:", error);
    }
  };

  const handleUpdateSection = async (updatedSection) => {
    if (window.confirm(language === 'ko' ? '이 섹션을 수정하시겠습니까?' : 'Are you sure you want to modify this section?')) {
      try {
        await api.put(`/api/v1/about-me/${aboutInfoId}/sections/${updatedSection.id}`, updatedSection);
        setAboutInfo({
          ...aboutInfo,
          sections: aboutInfo.sections.map(s => s.id === updatedSection.id ? updatedSection : s)
        });
        setEditingSection(null);
      } catch (error) {
        console.error("섹션 수정 실패:", error);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm(language === 'ko' ? '이 섹션을 삭제하시겠습니까?' : 'Are you sure you want to delete this section?')) {
      try {
        await api.delete(`/api/v1/about-me/${aboutInfoId}/sections/${sectionId}`);
        setAboutInfo({
          ...aboutInfo,
          sections: aboutInfo.sections.filter(s => s.id !== sectionId)
        });
      } catch (error) {
        console.error("섹션 삭제 실패:", error);
      }
    }
  };

  const handleAddSectionItem = async (sectionId, newItem) => {
    if (!sectionId) {
      console.error("섹션 ID가 없습니다.");
      return;
    }
    if (!aboutInfoId) {
      console.error("AboutInfo ID가 설정되지 않았습니다.");
      return;
    }
    try {
      const response = await api.post(`/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items`, newItem);
      const addedItem = response.data.data;

      setAboutInfo(prevInfo => {
        const updatedInfo = {
          ...prevInfo,
          sections: prevInfo.sections.map(s =>
            s.ID === sectionId ? { ...s, items: [...s.items, addedItem] } : s
          )
        };
        return updatedInfo;
      });

      setEditingSectionItem(null);
    } catch (error) {
      console.error("섹션 아이템 추가 실패:", error);
    }
  };

  const handleUpdateSectionItem = async (sectionId, updatedItem) => {
    if (window.confirm(language === 'ko' ? '이 아이템을 수정하시겠습니까?' : 'Are you sure you want to modify this item?')) {
      try {
        await api.put(`/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items/${updatedItem.ID}`, updatedItem);
        setAboutInfo(prevInfo => ({
          ...prevInfo,
          sections: prevInfo.sections.map(s => {
            if (s.ID === sectionId) {
              return { ...s, items: s.items.map(i => i.ID === updatedItem.ID ? updatedItem : i) };
            }
            return s;
          })
        }));
        setEditingSectionItems(prev => ({ ...prev, [updatedItem.ID]: false }));
      } catch (error) {
        console.error("섹션 아이템 수정 실패:", error);
      }
    }
  };

  const handleDeleteSectionItem = async (sectionId, itemId) => {
    if (window.confirm(language === 'ko' ? '이 아이템을 삭제하시겠습니까?' : 'Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items/${itemId}`);
        setAboutInfo(prevInfo => ({
          ...prevInfo,
          sections: prevInfo.sections.map(s => {
            if (s.ID === sectionId) {
              return { ...s, items: s.items.filter(i => i.ID !== itemId) };
            }
            return s;
          })
        }));
      } catch (error) {
        console.error("섹션 아이템 삭제 실패:", error);
      }
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // 새로운 핸들러 함수들
  const handleEditInfo = () => {
    setEditedInfo({
      name: displayInfo.name,
      title: displayInfo.title,
      description: displayInfo.description,
    });
    setIsEditingInfo(true);
  };

  const handleCancelEditInfo = () => {
    setIsEditingInfo(false);
    setEditedInfo({});
  };

  const handleSaveInfo = async () => {
    try {
      await api.put(`/api/v1/about-me/${aboutInfoId}`, {
        ...displayInfo,
        ...editedInfo,
      });
      setAboutInfo(prevInfo => ({
        ...prevInfo,
        ...editedInfo,
      }));
      setIsEditingInfo(false);
    } catch (error) {
      console.error("Failed to update info:", error);
    }
  };

  const handleInfoChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value,
    });
  };

  // 섹션 렌더링 함수를 useMemo로 감싸기
  const renderSections = useMemo(() => {
    if (!displayInfo) return null;

    return displayInfo.sections.map((section) => {
      return (
        <div key={section.ID} ref={el => sectionRefs.current[section.title] = el}>
          <Section
            ID={section.ID}
            title={section.title}
            items={section.items || []}
            icon={section.icon}
            isLoggedIn={isLoggedIn}
            onEdit={() => setEditingSection(section)}
            onDelete={() => handleDeleteSection(section.ID)}
            onAddItem={() => setEditingSectionItem(section.ID)}
            editingSectionItems={editingSectionItems}
            handleEditSectionItem={(itemId) => setEditingSectionItems(prev => ({ ...prev, [itemId]: true }))}
            handleCancelEditSectionItem={(itemId) => setEditingSectionItems(prev => ({ ...prev, [itemId]: false }))}
            handleUpdateSectionItem={(updatedItem) => handleUpdateSectionItem(section.ID, updatedItem)}
            handleDeleteSectionItem={(itemId) => handleDeleteSectionItem(section.ID, itemId)}
            language={language}
            isPreviewMode={isPreviewMode}
          />
          {editingSectionItem === section.ID && !isPreviewMode && (
            <SectionItemForm
              item={{ sectionId: section.ID }}
              onSubmit={(item) => handleAddSectionItem(section.ID, item)}
              onCancel={() => setEditingSectionItem(null)}
              language={language}
            />
          )}
        </div>
      );
    });
  }, [displayInfo, isLoggedIn, editingSectionItems, editingSectionItem, language, handleDeleteSection, handleUpdateSectionItem, handleDeleteSectionItem, handleAddSectionItem, isPreviewMode]);

  if (!memoizedAboutInfo) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>{displayInfo?.name}</title>
        <meta name="description" content={displayInfo?.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaBlog className="mr-2" />
            {language === 'ko' ? '블로그 둘러보기' : 'Explore Blog'}
          </Link>

          {/* 언어 선택 버튼 변경 */}
          <button
            onClick={handleLanguageChange}
            className="ml-4 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {language === 'ko' ? 'Eng' : '한국어'}
          </button>

          {isLoggedIn && (
            <>
              <button
                onClick={createAboutInfo}
                className="ml-4 px-4 py-2 border border-green-500 text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
              >
                <FaPlus className="inline mr-2" />
                {language === 'ko' ? '새로 만들기' : 'Create New'}
              </button>
              <button
                onClick={updateAboutInfo}
                className="ml-4 px-4 py-2 border border-blue-500 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                <FaEdit className="inline mr-2" />
                {language === 'ko' ? '수정하기' : 'Update'}
              </button>
              <button
                onClick={deleteAboutInfo}
                className="ml-4 px-4 py-2 border border-red-500 text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <FaTrash className="inline mr-2" />
                {language === 'ko' ? '삭제하기' : 'Delete'}
              </button>
              <button
                onClick={togglePreviewMode}
                className="ml-4 px-4 py-2 border border-purple-500 text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50"
              >
                <FaEye className="inline mr-2" />
                {isPreviewMode ? (language === 'ko' ? '편집 모드' : 'Edit Mode') : (language === 'ko' ? '미리보기' : 'Preview')}
              </button>
            </>
          )}
        </div>

        {isEditingInfo && !isPreviewMode ? (
          <div className="mb-6">
            <input
              type="text"
              name="name"
              value={editedInfo.name}
              onChange={handleInfoChange}
              className="text-3xl font-bold text-center text-gray-800 mb-2 w-full"
            />
            <input
              type="text"
              name="title"
              value={editedInfo.title}
              onChange={handleInfoChange}
              className="text-xl text-center text-gray-600 mb-2 w-full"
            />
            <textarea
              name="description"
              value={editedInfo.description}
              onChange={handleInfoChange}
              className="text-lg text-center text-gray-600 mb-6 w-full"
            />
            <div className="flex justify-center">
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              >
                {language === 'ko' ? '저장' : 'Save'}
              </button>
              <button
                onClick={handleCancelEditInfo}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{displayInfo.name}</h1>
            <p className="text-xl text-center text-gray-600 mb-2">{displayInfo.title}</p>
            <p className="text-lg text-center text-gray-600 mb-6">{displayInfo.description}</p>
            {isLoggedIn && !isPreviewMode && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleEditInfo}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaEdit className="inline mr-2" />
                  {language === 'ko' ? '기본 정보 수정' : 'Edit Basic Info'}
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 md:pr-8 mb-8 md:mb-0">
            <div className="md:sticky md:top-20">
              <ContactInfo />
              <TableOfContents sections={displayInfo?.sections || []} scrollTo={scrollTo} />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            {isLoggedIn && !isPreviewMode && aboutInfoId && (
              <button
                onClick={() => setEditingSection({})}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaPlus className="inline mr-2" />
                {language === 'ko' ? '새 섹션 추가' : 'Add New Section'}
              </button>
            )}
            {editingSection && !isPreviewMode && (
              <SectionForm
                section={editingSection}
                onSubmit={editingSection.id ? handleUpdateSection : handleAddSection}
                onCancel={() => setEditingSection(null)}
                language={language}
              />
            )}
            {renderSections}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AboutMe);