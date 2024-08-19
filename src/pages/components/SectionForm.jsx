import React, { useState, useEffect } from 'react';

function SectionForm({ section, onSubmit, onCancel, language }) {
    const [title, setTitle] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        if (section) {
            setTitle(section.title || '');
            setIcon(section.icon || '');
        }
    }, [section]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...section, title, icon });
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '제목' : 'Title'}
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '아이콘' : 'Icon'}
                </label>
                <input
                    type="text"
                    id="icon"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <button type="submit" className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    {section.id ? (language === 'ko' ? '섹션 수정' : 'Modify Section') : (language === 'ko' ? '섹션 추가' : 'Add Section')}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    {language === 'ko' ? '취소' : 'Cancel'}
                </button>
            </div>
        </form>
    );
}

export default SectionForm;