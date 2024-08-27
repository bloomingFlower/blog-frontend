import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
  memo,
} from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { api } from "./components/api";
import { AuthContext } from "./components/AuthContext";
import {
  FaGraduationCap,
  FaBriefcase,
  FaCode,
  FaProjectDiagram,
  FaCertificate,
  FaBook,
  FaPlane,
  FaUtensils,
  FaMicrochip,
  FaChartLine,
  FaEllipsisH,
  FaGithub,
  FaEnvelope,
  FaLinkedin,
  FaTwitter,
  FaBlog,
  FaEdit,
  FaTrash,
  FaPlus,
  FaGlobe,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
} from "react-icons/fa";
import { SiCoursera, SiOrcid } from "react-icons/si";
import SectionItemForm from "./components/SectionItemForm";
import SectionForm from "./components/SectionForm";
import { useInView } from "react-intersection-observer";

// Contact & Social Links component
function ContactInfo() {
  const contacts = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      link: "mailto:yourrubber@duck.com",
    },
    {
      icon: <FaGithub />,
      label: "GitHub",
      link: "https://github.com/bloomingFlower",
    },
    {
      icon: <SiOrcid />,
      label: "ORCID",
      link: "https://orcid.org/0009-0001-5288-7745",
    },
    {
      icon: <SiCoursera />,
      label: "Coursera",
      link: "https://www.coursera.org/user/6fc30c5f564982f4134e32b619efef76",
    },
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

// AnimatedSection 컴포넌트 추가
const AnimatedSection = memo(({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});

// Section component
function Section({
  ID,
  title,
  items = [],
  icon,
  isLoggedIn,
  onEdit,
  onDelete,
  onAddItem,
  editingSectionItems,
  handleEditSectionItem,
  handleCancelEditSectionItem,
  handleUpdateSectionItem,
  handleDeleteSectionItem,
  language,
  isPreviewMode,
}) {
  // Filter items for preview mode
  const displayItems = isPreviewMode
    ? items.filter((item) => item.isPublic !== false)
    : items;

  return (
    <AnimatedSection>
      <div id={title.replace(/\s+/g, "-").toLowerCase()} className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center text-gray-800">
          {title}
          <span className="ml-2 text-sm text-gray-500">{icon}</span>
          {/* {isLoggedIn && !isPreviewMode && (
            <span className="ml-2 text-sm text-gray-500">(ID: {ID})</span>
          )} */}
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
                  {item.description && (
                    <p className="mt-1">{item.description}</p>
                  )}
                  {isLoggedIn && !isPreviewMode && (
                    <div className="mt-1 mb-2">
                      <button
                        onClick={() => handleEditSectionItem(item.ID)}
                        className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        <FaEdit className="inline mr-1" />{" "}
                        {language === "ko" ? "수정" : "Edit"}
                      </button>
                      <button
                        onClick={() => handleDeleteSectionItem(item.ID)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        <FaTrash className="inline mr-1" />{" "}
                        {language === "ko" ? "삭제" : "Delete"}
                      </button>
                    </div>
                  )}
                  {editingSectionItems[item.ID] && !isPreviewMode && (
                    <SectionItemForm
                      item={item}
                      onSubmit={(updatedItem) =>
                        handleUpdateSectionItem(updatedItem)
                      }
                      onCancel={() => handleCancelEditSectionItem(item.ID)}
                      language={language}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {language === "ko" ? "아직 항목이 없습니다." : "No items yet."}
            </p>
          )}
        </div>
        {isLoggedIn && !isPreviewMode && (
          <div className="mt-2 mb-4">
            <button
              onClick={onEdit}
              className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <FaEdit className="inline mr-1" />{" "}
              {language === "ko" ? "수정" : "Edit"}
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaTrash className="inline mr-1" />{" "}
              {language === "ko" ? "삭제" : "Delete"}
            </button>
            <button
              onClick={onAddItem}
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FaPlus className="inline mr-1" />{" "}
              {language === "ko" ? "아이템 추가" : "Add Item"}
            </button>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

// Helper function to get icon component
function getIconComponent(iconName) {
  const iconMap = {
    FaGraduationCap,
    FaBriefcase,
    FaCode,
    FaProjectDiagram,
    FaCertificate,
    FaBook,
    FaPlane,
    FaUtensils,
    FaMicrochip,
    FaChartLine,
    FaEllipsisH,
    FaGithub,
    FaEnvelope,
    FaLinkedin,
    FaTwitter,
    FaBlog,
    SiCoursera,
    SiOrcid,
  };
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : null;
}

// New loading component
function PersonalizedLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
        <p className="mt-6 text-gray-600 text-center">
          {"Loading personal information..."}
        </p>
      </div>
    </div>
  );
}

// ScrollToTopButton 컴포넌트 추가
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
}

function AboutMe() {
  const [aboutInfo, setAboutInfo] = useState(null);
  const [language, setLanguage] = useState("ko");
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
  const [isLoading, setIsLoading] = useState(true);

  const memoizedAboutInfo = useMemo(() => aboutInfo, [aboutInfo]);

  const previewInfo = useMemo(() => {
    if (!memoizedAboutInfo) return null;
    return {
      ...memoizedAboutInfo,
      sections: memoizedAboutInfo.sections.map((section) => ({
        ...section,
        items: section.items.filter((item) => item.isPublic !== false),
      })),
    };
  }, [memoizedAboutInfo]);

  const displayInfo = isPreviewMode ? previewInfo : memoizedAboutInfo;

  const fetchAboutInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const id = language === "ko" ? 2 : 1;
      const response = await api.get(`/api/v1/about-me/${id}?lang=${language}`);
      const data = response.data.data;
      setAboutInfo(data);
      setAboutInfoId(id);
    } catch (error) {
      console.error("Failed to fetch about info:", error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchAboutInfo();
  }, [fetchAboutInfo]);

  const handleLanguageChange = () => {
    const newLanguage = language === "ko" ? "en" : "ko";
    setLanguage(newLanguage);
    window.history.pushState(null, "", `/${newLanguage}/about-me`);
  };

  const createAboutInfo = async () => {
    try {
      const newAboutInfo = {
        name: "New Name",
        title: "New Title",
        description: "New Description",
        language: language,
        contacts: [],
        sections: [],
      };
      await api.post("/api/v1/about-me", newAboutInfo);
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
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (window.location.hash && aboutInfo) {
      const sectionId = window.location.hash.slice(1);
      const section = aboutInfo.sections.find(
        (s) => s.title.toLowerCase().replace(/\s+/g, "-") === sectionId
      );
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
      const response = await api.post(
        `/api/v1/about-me/${aboutInfoId}/sections`,
        sectionWithItems
      );
      const addedSection = response.data.data;
      setAboutInfo((prevInfo) => ({
        ...prevInfo,
        sections: [...prevInfo.sections, addedSection],
      }));
      setEditingSection(null);
      // 섹션 추가 후 데이터 다시 불러오기
      fetchAboutInfo();
    } catch (error) {
      console.error("섹션 추가 실패:", error);
    }
  };

  const handleUpdateSection = async (updatedSection) => {
    if (
      window.confirm(
        language === "ko"
          ? "이 섹션을 수정하시겠습니까?"
          : "Are you sure you want to modify this section?"
      )
    ) {
      try {
        await api.put(
          `/api/v1/about-me/${aboutInfoId}/sections/${updatedSection.id}`,
          updatedSection
        );
        setAboutInfo({
          ...aboutInfo,
          sections: aboutInfo.sections.map((s) =>
            s.id === updatedSection.id ? updatedSection : s
          ),
        });
        setEditingSection(null);
      } catch (error) {
        console.error("섹션 수정 실패:", error);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (
      window.confirm(
        language === "ko"
          ? "이 섹션을 삭제하시겠습니까?"
          : "Are you sure you want to delete this section?"
      )
    ) {
      try {
        await api.delete(
          `/api/v1/about-me/${aboutInfoId}/sections/${sectionId}`
        );
        setAboutInfo({
          ...aboutInfo,
          sections: aboutInfo.sections.filter((s) => s.id !== sectionId),
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
      const response = await api.post(
        `/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items`,
        newItem
      );
      const addedItem = response.data.data;

      setAboutInfo((prevInfo) => {
        const updatedInfo = {
          ...prevInfo,
          sections: prevInfo.sections.map((s) =>
            s.ID === sectionId ? { ...s, items: [...s.items, addedItem] } : s
          ),
        };
        return updatedInfo;
      });

      setEditingSectionItem(null);
    } catch (error) {
      console.error("섹션 아이템 추가 실패:", error);
    }
  };

  const handleUpdateSectionItem = async (sectionId, updatedItem) => {
    if (
      window.confirm(
        language === "ko"
          ? "이 아이템을 수정하시겠습니까?"
          : "Are you sure you want to modify this item?"
      )
    ) {
      try {
        await api.put(
          `/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items/${updatedItem.ID}`,
          updatedItem
        );
        setAboutInfo((prevInfo) => ({
          ...prevInfo,
          sections: prevInfo.sections.map((s) => {
            if (s.ID === sectionId) {
              return {
                ...s,
                items: s.items.map((i) =>
                  i.ID === updatedItem.ID ? updatedItem : i
                ),
              };
            }
            return s;
          }),
        }));
        setEditingSectionItems((prev) => ({
          ...prev,
          [updatedItem.ID]: false,
        }));
      } catch (error) {
        console.error("섹션 아이템 수정 실패:", error);
      }
    }
  };

  const handleDeleteSectionItem = async (sectionId, itemId) => {
    if (
      window.confirm(
        language === "ko"
          ? "이 아이템을 삭제하시겠습니까?"
          : "Are you sure you want to delete this item?"
      )
    ) {
      try {
        await api.delete(
          `/api/v1/about-me/${aboutInfoId}/sections/${sectionId}/items/${itemId}`
        );
        setAboutInfo((prevInfo) => ({
          ...prevInfo,
          sections: prevInfo.sections.map((s) => {
            if (s.ID === sectionId) {
              return { ...s, items: s.items.filter((i) => i.ID !== itemId) };
            }
            return s;
          }),
        }));
      } catch (error) {
        console.error("섹션 아이템 삭제 실패:", error);
      }
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

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
      setAboutInfo((prevInfo) => ({
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

  // Check user permission
  const hasEditPermission = useMemo(() => {
    return (
      isLoggedIn &&
      user &&
      user.first_name === "bloomingFlower" &&
      user.id === 6
    );
  }, [isLoggedIn, user]);

  const renderSections = useMemo(() => {
    if (!displayInfo) return null;

    return displayInfo.sections.map((section, index) => {
      return (
        <AnimatedSection key={section.ID} delay={index * 100}>
          <div ref={(el) => (sectionRefs.current[section.title] = el)}>
            <Section
              ID={section.ID}
              title={section.title}
              items={section.items || []}
              icon={section.icon}
              isLoggedIn={hasEditPermission}
              onEdit={() => setEditingSection(section)}
              onDelete={() => handleDeleteSection(section.ID)}
              onAddItem={() => setEditingSectionItem(section.ID)}
              editingSectionItems={editingSectionItems}
              handleEditSectionItem={(itemId) =>
                setEditingSectionItems((prev) => ({ ...prev, [itemId]: true }))
              }
              handleCancelEditSectionItem={(itemId) =>
                setEditingSectionItems((prev) => ({ ...prev, [itemId]: false }))
              }
              handleUpdateSectionItem={(updatedItem) =>
                handleUpdateSectionItem(section.ID, updatedItem)
              }
              handleDeleteSectionItem={(itemId) =>
                handleDeleteSectionItem(section.ID, itemId)
              }
              language={language}
              isPreviewMode={isPreviewMode}
            />
            {editingSectionItem === section.ID &&
              !isPreviewMode &&
              hasEditPermission && (
                <SectionItemForm
                  item={{ sectionId: section.ID }}
                  onSubmit={(item) => handleAddSectionItem(section.ID, item)}
                  onCancel={() => setEditingSectionItem(null)}
                  language={language}
                />
              )}
          </div>
        </AnimatedSection>
      );
    });
  }, [
    displayInfo,
    hasEditPermission,
    editingSectionItems,
    editingSectionItem,
    language,
    handleDeleteSection,
    handleUpdateSectionItem,
    handleDeleteSectionItem,
    handleAddSectionItem,
    isPreviewMode,
  ]);

  if (isLoading) return <PersonalizedLoadingScreen />;

  if (!memoizedAboutInfo) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>{displayInfo?.name}</title>
        <meta name="description" content={displayInfo?.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200 sm:px-3 sm:py-2 sm:text-sm sm:bg-indigo-600 sm:text-white sm:hover:bg-indigo-700 sm:rounded-md"
          >
            <FaArrowLeft className="mr-1 sm:mr-2" />
            <span>Blog</span>
          </Link>

          <button
            onClick={handleLanguageChange}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 focus:outline-none transition-colors duration-200 sm:px-3 sm:py-2 sm:text-sm sm:bg-white sm:text-gray-700 sm:border sm:border-gray-300 sm:hover:bg-gray-50 sm:rounded-md"
          >
            <span>{language === "ko" ? "Eng" : "한국어"}</span>
            <FaArrowRight className="ml-1 sm:ml-2" />
          </button>
        </div>

        {isEditingInfo && !isPreviewMode && hasEditPermission ? (
          <div className="mb-6">
            <input
              type="text"
              name="name"
              value={editedInfo.name}
              onChange={handleInfoChange}
              className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2 w-full"
            />
            <input
              type="text"
              name="title"
              value={editedInfo.title}
              onChange={handleInfoChange}
              className="text-base sm:text-lg text-center text-gray-600 mb-2 w-full"
            />
            <textarea
              name="description"
              value={editedInfo.description}
              onChange={handleInfoChange}
              className="text-sm sm:text-base text-center text-gray-600 mb-6 w-full"
            />
            <div className="flex justify-center">
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              >
                {language === "ko" ? "저장" : "Save"}
              </button>
              <button
                onClick={handleCancelEditInfo}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {language === "ko" ? "취소" : "Cancel"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              {displayInfo.name}
            </h1>
            <p className="text-base sm:text-lg text-center text-gray-600 mb-2">
              {displayInfo.title}
            </p>
            <p className="text-sm sm:text-base text-center text-gray-600 mb-6">
              {displayInfo.description}
            </p>
            {hasEditPermission && !isPreviewMode && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleEditInfo}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaEdit className="inline mr-2" />
                  {language === "ko" ? "기본 정보 수정" : "Edit Basic Info"}
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 md:pr-8 mb-8 md:mb-0">
            <div className="md:sticky md:top-20">
              <ContactInfo />
              <TableOfContents
                sections={displayInfo?.sections || []}
                scrollTo={scrollTo}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            {hasEditPermission && !isPreviewMode && aboutInfoId && (
              <button
                onClick={() => setEditingSection({})}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                <FaPlus className="inline mr-2" />
                {language === "ko" ? "새 섹션 추가" : "Add New Section"}
              </button>
            )}
            {editingSection && !isPreviewMode && hasEditPermission && (
              <SectionForm
                section={editingSection}
                onSubmit={
                  editingSection.id ? handleUpdateSection : handleAddSection
                }
                onCancel={() => setEditingSection(null)}
                language={language}
              />
            )}
            {renderSections}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default React.memo(AboutMe);
