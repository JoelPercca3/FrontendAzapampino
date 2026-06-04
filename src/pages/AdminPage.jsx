// frontend/src/pages/AdminPage.jsx

import { useState } from 'react';
import { IoArrowBackOutline, IoSettingsOutline, IoGridOutline, IoFolderOpenOutline } from 'react-icons/io5';
import { ItemsManager } from '../components/admin/ItemsManager';
import { CategoriesManager } from '../components/admin/CategoriesManager';
import { TabBtn } from '../components/admin/TabBtn';

export function AdminPage() {
    const [tab, setTab] = useState('items');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm flex-shrink-0">
                <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <IoArrowBackOutline size={22} />
                </a>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <IoSettingsOutline size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-900 text-lg">Panel Admin</h1>
                        <p className="text-xs text-gray-500">Gestión del menú</p>
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <TabBtn
                        icon={<IoGridOutline size={16} />}
                        label="Platos"
                        active={tab === 'items'}
                        onClick={() => setTab('items')}
                    />
                    <TabBtn
                        icon={<IoFolderOpenOutline size={16} />}
                        label="Categorías"
                        active={tab === 'categories'}
                        onClick={() => setTab('categories')}
                    />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    {tab === 'items' && <ItemsManager />}
                    {tab === 'categories' && <CategoriesManager />}
                </div>
            </div>
        </div>
    );
}