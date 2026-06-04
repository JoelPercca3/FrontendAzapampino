// frontend/src/components/admin/TabBtn.jsx

export function TabBtn({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}