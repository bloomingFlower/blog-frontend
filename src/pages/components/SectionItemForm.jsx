import React, { useState, useEffect } from 'react';

function SectionItemForm({ item, onSubmit, onCancel, language }) {
    const [title, setTitle] = useState('');
    const [institution, setInstitution] = useState('');
    const [company, setCompany] = useState('');
    const [year, setYear] = useState('');
    const [period, setPeriod] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (item) {
            setTitle(item.title || '');
            setInstitution(item.institution || '');
            setCompany(item.company || '');
            setYear(item.year || '');
            setPeriod(item.period || '');
            setDescription(item.description || '');
        }
    }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...item, title, institution, company, year, period, description });
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
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '기관' : 'Institution'}
                </label>
                <input
                    type="text"
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '회사' : 'Company'}
                </label>
                <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '연도' : 'Year'}
                </label>
                <input
                    type="text"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="period" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '기간' : 'Period'}
                </label>
                <input
                    type="text"
                    id="period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {language === 'ko' ? '설명' : 'Description'}
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    rows="3"
                ></textarea>
            </div>
            <div>
                <button type="submit" className="mr-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    {item.id ? (language === 'ko' ? '아이템 수정' : 'Modify Item') : (language === 'ko' ? '아이템 추가' : 'Add Item')}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    {language === 'ko' ? '취소' : 'Cancel'}
                </button>
            </div>
        </form>
    );
}

export default SectionItemForm;