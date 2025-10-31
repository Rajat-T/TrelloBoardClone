const { useState, useEffect } = React;

// Utility function to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Confirmation Dialog Component
function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = "Delete" }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="confirm-overlay" onClick={onCancel} />
            <div className="confirm-dialog">
                <div className="confirm-title">{title}</div>
                <div className="confirm-text">{message}</div>
                <div className="confirm-buttons">
                    <button className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="add-card-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </>
    );
}

// Card History View Component
function CardHistoryView({ isOpen, card, onClose }) {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (!isOpen || !card) return null;

    const history = card.history || [];

    return (
        <div className="card-modal-overlay" onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
            <div className="card-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                <div className="modal-header">
                    <div className="modal-title">Card History - {card.title}</div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {history.length === 0 ? (
                        <div className="text-gray-500 text-center py-8">
                            No history available for this card.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">List</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Change Made</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice().reverse().map((entry, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {formatTimestamp(entry.timestamp)}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                                    {entry.list}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                {entry.change}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="add-card-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Card Modal Component
function CardModal({ isOpen, card, onClose, onSave, onViewHistory }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Update form when card changes
    useEffect(() => {
        if (card) {
            setTitle(card.title || '');
            setDescription(card.description || '');
        }
    }, [card]);

    const handleSave = () => {
        if (title.trim()) {
            onSave({
                ...card,
                title: title.trim(),
                description: description.trim()
            });
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter' && e.ctrlKey) {
            handleSave();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !card) return null;

    return (
        <div className="card-modal-overlay" onClick={handleOverlayClick} onKeyDown={handleKeyDown}>
            <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Edit Card</div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Card title..."
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a more detailed description..."
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                        onClick={onViewHistory}
                    >
                        View History
                    </button>
                    <button className="add-card-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// Card Component
function Card({ card, onDeleteCard, index, onEditCard }) {
    const handleCardClick = () => {
        onEditCard(card);
    };

    // Format the timestamp to a more readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Truncate description to show only first 2-3 lines
    const truncateDescription = (description) => {
        if (!description) return '';

        // Split by newlines and take the first 3 lines
        const lines = description.split('\n');
        if (lines.length <= 3) return description;

        return lines.slice(0, 3).join('\n') + '...';
    };

    return (
        <div className="card" onClick={handleCardClick}>
            <div className="card-title">{card.title}</div>
            {card.description && card.description.trim() !== '' && (
                <div className="card-description-preview">{truncateDescription(card.description)}</div>
            )}
            <div className="card-timestamp">{formatDate(card.lastModified)}</div>
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(card.id);
                }}
                title="Delete card"
            >
                ×
            </button>
        </div>
    );
}

// AddCardForm Component
function AddCardForm({ onAddCard, onCancel }) {
    const [cardTitle, setCardTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cardTitle.trim()) {
            onAddCard(cardTitle.trim());
            setCardTitle('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="add-card-form">
            <textarea
                className="add-card-input"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a title for this card..."
                autoFocus
            />
            <div className="add-card-buttons">
                <button className="add-card-btn" onClick={handleSubmit}>
                    Add card
                </button>
                <button className="cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

// AddListForm Component
function AddListForm({ onAddList, onCancel }) {
    const [listTitle, setListTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (listTitle.trim()) {
            onAddList(listTitle.trim());
            setListTitle('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e);
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="add-list-form">
            <input
                type="text"
                className="list-title-input"
                value={listTitle}
                onChange={(e) => setListTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter list title..."
                autoFocus
            />
            <div className="add-card-buttons">
                <button className="add-card-btn" onClick={handleSubmit}>
                    Add list
                </button>
                <button className="cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

// List Component
function List({ list, onAddCard, onDeleteCard, onDeleteList, onRenameList, onEditCard }) {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(list.title);

    const handleAddCard = (title) => {
        onAddCard(list.id, title);
        setIsAddingCard(false);
    };

    const handleCancelAdd = () => {
        setIsAddingCard(false);
    };

    const handleTitleClick = () => {
        setIsEditingTitle(true);
        setEditedTitle(list.title);
    };

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (editedTitle.trim()) {
                onRenameList(list.id, editedTitle.trim());
                setIsEditingTitle(false);
            }
        } else if (e.key === 'Escape') {
            setIsEditingTitle(false);
            setEditedTitle(list.title);
        }
    };

    const handleTitleBlur = () => {
        if (editedTitle.trim() && editedTitle !== list.title) {
            onRenameList(list.id, editedTitle.trim());
        }
        setIsEditingTitle(false);
    };

    return (
        <div className="list">
            <div className="list-header">
                {isEditingTitle ? (
                    <input
                        type="text"
                        className="list-title-input-edit"
                        value={editedTitle}
                        onChange={handleTitleChange}
                        onKeyDown={handleTitleKeyDown}
                        onBlur={handleTitleBlur}
                        autoFocus
                    />
                ) : (
                    <div className="list-title" onClick={handleTitleClick}>
                        {list.title}
                    </div>
                )}
                <button
                    className="delete-list-btn"
                    onClick={() => onDeleteList(list.id)}
                    title="Delete list"
                >
                    ×
                </button>
            </div>

            <div>
                {list.cards.map((card, index) => (
                    <Card
                        key={card.id}
                        card={card}
                        index={index}
                        onDeleteCard={(cardId) => onDeleteCard(list.id, cardId)}
                        onEditCard={onEditCard}
                    />
                ))}
            </div>

            {/* Add Card Section */}
            {isAddingCard ? (
                <AddCardForm
                    onAddCard={handleAddCard}
                    onCancel={handleCancelAdd}
                />
            ) : (
                <button
                    className="add-card-trigger"
                    onClick={() => setIsAddingCard(true)}
                >
                    + Add a card
                </button>
            )}
        </div>
    );
}

// Project Management Modal Component
function ProjectManagementModal({ isOpen, onClose, projects, currentProject, onProjectSelect, onAddProject, onRenameProject, onDeleteProject }) {
    const [newProjectName, setNewProjectName] = useState('');
    const [editingProject, setEditingProject] = useState(null);
    const [editingName, setEditingName] = useState('');

    const handleAddProject = () => {
        if (newProjectName.trim()) {
            onAddProject(newProjectName.trim());
            setNewProjectName('');
        }
    };

    const handleRenameProject = (projectId, newName) => {
        if (newName.trim()) {
            onRenameProject(projectId, newName.trim());
            setEditingProject(null);
            setEditingName('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddProject();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="management-modal" onClick={onClose}>
            <div className="management-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="management-modal-header">
                    <div className="management-modal-title">Manage Projects</div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="management-modal-body">
                    <ul className="management-list">
                        {projects.map(project => (
                            <li key={project.id} className="management-item">
                                {editingProject === project.id ? (
                                    <input
                                        type="text"
                                        className="add-form-input"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onRenameProject(project.id, editingName);
                                                setEditingProject(null);
                                                setEditingName('');
                                            } else if (e.key === 'Escape') {
                                                setEditingProject(null);
                                                setEditingName('');
                                            }
                                        }}
                                        onBlur={() => {
                                            onRenameProject(project.id, editingName);
                                            setEditingProject(null);
                                            setEditingName('');
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <span className="management-item-name">{project.name}</span>
                                        <div className="management-item-actions">
                                            <button
                                                className="action-button edit-button"
                                                onClick={() => {
                                                    setEditingProject(project.id);
                                                    setEditingName(project.name);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            {projects.length > 1 && (
                                                <button
                                                    className="action-button delete-button"
                                                    onClick={() => onDeleteProject(project.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="add-form">
                        <input
                            type="text"
                            className="add-form-input"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="New project name..."
                        />
                        <div className="add-form-buttons">
                            <button className="add-card-btn" onClick={handleAddProject}>
                                Add Project
                            </button>
                            <button className="cancel-btn" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Board Management Modal Component
function BoardManagementModal({ isOpen, onClose, boards, currentBoard, onBoardSelect, onAddBoard, onRenameBoard, onDeleteBoard }) {
    const [newBoardName, setNewBoardName] = useState('');
    const [editingBoard, setEditingBoard] = useState(null);
    const [editingName, setEditingName] = useState('');

    const handleAddBoard = () => {
        if (newBoardName.trim()) {
            onAddBoard(newBoardName.trim());
            setNewBoardName('');
        }
    };

    const handleRenameBoard = (boardId, newName) => {
        if (newName.trim()) {
            onRenameBoard(boardId, newName.trim());
            setEditingBoard(null);
            setEditingName('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddBoard();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="management-modal" onClick={onClose}>
            <div className="management-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="management-modal-header">
                    <div className="management-modal-title">Manage Boards</div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="management-modal-body">
                    <ul className="management-list">
                        {boards.map(board => (
                            <li key={board.id} className="management-item">
                                {editingBoard === board.id ? (
                                    <input
                                        type="text"
                                        className="add-form-input"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                onRenameBoard(board.id, editingName);
                                                setEditingBoard(null);
                                                setEditingName('');
                                            } else if (e.key === 'Escape') {
                                                setEditingBoard(null);
                                                setEditingName('');
                                            }
                                        }}
                                        onBlur={() => {
                                            onRenameBoard(board.id, editingName);
                                            setEditingBoard(null);
                                            setEditingName('');
                                        }}
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <span className="management-item-name">{board.name}</span>
                                        <div className="management-item-actions">
                                            <button
                                                className="action-button edit-button"
                                                onClick={() => {
                                                    setEditingBoard(board.id);
                                                    setEditingName(board.name);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            {boards.length > 1 && (
                                                <button
                                                    className="action-button delete-button"
                                                    onClick={() => onDeleteBoard(board.id)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="add-form">
                        <input
                            type="text"
                            className="add-form-input"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="New board name..."
                        />
                        <div className="add-form-buttons">
                            <button className="add-card-btn" onClick={handleAddBoard}>
                                Add Board
                            </button>
                            <button className="cancel-btn" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Board Tile Component for Project Overview
function BoardTile({ board, onClick, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(board.name);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const totalCards = board.lists.reduce((sum, list) => sum + list.cards.length, 0);
    const totalLists = board.lists.length;

    // Get up to 3 lists to preview
    const previewLists = board.lists.slice(0, 3);

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditTitle(board.name);
    };

    const handleSaveEdit = () => {
        if (editTitle.trim() && editTitle !== board.name) {
            onEdit(board.id, editTitle.trim());
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditTitle(board.name);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = (e) => {
        e.stopPropagation();
        onDelete(board.id);
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowDeleteConfirm(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <div
            className={`board-tile board-tile-relative ${showDeleteConfirm ? 'board-tile-deleting' : ''}`}
            onClick={() => !isEditing && !showDeleteConfirm && onClick(board.id)}
        >
            {/* Edit/Delete Controls */}
            <div className="board-tile-controls">
                <button
                    className="board-tile-control-btn board-edit-btn"
                    onClick={handleEditClick}
                    title="Edit board"
                >
                    ✏️
                </button>
                <button
                    className="board-tile-control-btn board-delete-btn"
                    onClick={handleDeleteClick}
                    title="Delete board"
                >
                    🗑️
                </button>
            </div>

            {/* Delete Confirmation Overlay */}
            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-title">Delete Board?</div>
                    <div className="delete-confirm-text">
                        Are you sure you want to delete "{board.name}"? This action cannot be undone.
                    </div>
                    <div className="delete-confirm-buttons">
                        <button
                            className="delete-confirm-btn cancel-delete-btn"
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </button>
                        <button
                            className="delete-confirm-btn confirm-delete-btn"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            <div className="board-tile-header">
                {isEditing ? (
                    <input
                        type="text"
                        className="board-title-edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSaveEdit}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <h3 className="board-tile-title">{board.name}</h3>
                )}
            </div>

            <div className="board-tile-stats">
                <div className="board-stat">
                    <div className="board-stat-number">{totalLists}</div>
                    <div className="board-stat-label">Lists</div>
                </div>
                <div className="board-stat">
                    <div className="board-stat-number">{totalCards}</div>
                    <div className="board-stat-label">Cards</div>
                </div>
            </div>

            {previewLists.length > 0 && (
                <div className="board-preview-lists">
                    {previewLists.map(list => (
                        <div key={list.id} className="board-preview-list">
                            <span className="board-preview-list-name">{list.title}</span>
                            <span className="board-preview-card-count">{list.cards.length}</span>
                        </div>
                    ))}
                    {board.lists.length > 3 && (
                        <div className="board-preview-list">
                            <span className="board-preview-list-name">+{board.lists.length - 3} more</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Main App Component
function App() {
    // Default state for new users - creating hierarchical structure
    const defaultState = {
        projects: [
            {
                id: 'project-1',
                name: 'My First Project',
                boards: [
                    {
                        id: 'board-1',
                        name: 'Main Board',
                        lists: [
                            {
                                id: 'list-1',
                                title: 'To Do',
                                cards: []
                            },
                            {
                                id: 'list-2',
                                title: 'In Progress',
                                cards: []
                            },
                            {
                                id: 'list-3',
                                title: 'Done',
                                cards: []
                            }
                        ]
                    }
                ]
            }
        ],
        currentProject: 'project-1',
        currentBoard: 'board-1'
    };

    // Load from localStorage on mount
    const getInitialState = () => {
        try {
            const savedData = localStorage.getItem('trelloBoardHierarchy');
            if (savedData) {
                const parsedData = JSON.parse(savedData);

                // Handle migration from old format to new format
                if (Array.isArray(parsedData)) {
                    // Old format - migrate to new structure
                    return {
                        projects: [{
                            id: 'migrated-project',
                            name: 'Migrated Project',
                            boards: [{
                                id: 'migrated-board',
                                name: 'Main Board',
                                lists: parsedData.map(list => ({
                                    ...list,
                                    cards: list.cards.map(card => ({
                                        ...card,
                                        description: card.description || '',
                                        lastModified: card.lastModified || new Date().toISOString(),
                                        history: card.history || []
                                    }))
                                }))
                            }]
                        }],
                        currentProject: 'migrated-project',
                        currentBoard: 'migrated-board'
                    };
                }

                // New format - ensure all cards have required fields
                return {
                    ...parsedData,
                    projects: parsedData.projects.map(project => ({
                        ...project,
                        boards: project.boards.map(board => ({
                            ...board,
                            lists: board.lists.map(list => ({
                                ...list,
                                cards: list.cards.map(card => ({
                                    ...card,
                                    description: card.description || '',
                                    lastModified: card.lastModified || new Date().toISOString(),
                                    history: card.history || []
                                }))
                            }))
                        }))
                    }))
                };
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
        }
        return defaultState;
    };

    const [appState, setAppState] = useState(getInitialState());

    // Helper functions to get current data
    const getCurrentProject = () => {
        return appState.projects.find(p => p.id === appState.currentProject);
    };

    const getCurrentBoard = () => {
        const project = getCurrentProject();
        return project ? project.boards.find(b => b.id === appState.currentBoard) : null;
    };

    const getCurrentLists = () => {
        const board = getCurrentBoard();
        return board ? board.lists : [];
    };

    // Save to localStorage whenever app state changes
    useEffect(() => {
        try {
            localStorage.setItem('trelloBoardHierarchy', JSON.stringify(appState));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [appState]);

    const [isAddingList, setIsAddingList] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        listId: null,
        listTitle: ''
    });
    const [cardModal, setCardModal] = useState({
        isOpen: false,
        card: null
    });
    const [historyView, setHistoryView] = useState({
        isOpen: false,
        card: null
    });

    // Project and Board Management State
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [boardModalOpen, setBoardModalOpen] = useState(false);

    // View State: 'project-overview' or 'board-view'
    const [currentView, setCurrentView] = useState('board-view');

    const addCard = (listId, cardTitle) => {
        const timestamp = new Date().toISOString();
        const lists = getCurrentLists();
        const listName = lists.find(list => list.id === listId)?.title || 'Unknown List';

        const newCard = {
            id: generateId(),
            title: cardTitle,
            description: '',
            lastModified: timestamp,
            history: [{
                timestamp: timestamp,
                list: listName,
                change: 'Card created'
            }]
        };

        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? {
                                    ...board,
                                    lists: board.lists.map(list =>
                                        list.id === listId
                                            ? { ...list, cards: [...list.cards, newCard] }
                                            : list
                                    )
                                }
                                : board
                        )
                    }
                    : project
            )
        }));
    };

    const deleteCard = (listId, cardId) => {
        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? {
                                    ...board,
                                    lists: board.lists.map(list =>
                                        list.id === listId
                                            ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
                                            : list
                                    )
                                }
                                : board
                        )
                    }
                    : project
            )
        }));
    };

    const addList = (listTitle) => {
        const newList = {
            id: generateId(),
            title: listTitle,
            cards: []
        };

        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? {
                                    ...board,
                                    lists: [...board.lists, newList]
                                }
                                : board
                        )
                    }
                    : project
            )
        }));
        setIsAddingList(false);
    };

    const deleteList = (listId) => {
        const lists = getCurrentLists();
        const list = lists.find(l => l.id === listId);
        setConfirmDialog({
            isOpen: true,
            listId: listId,
            listTitle: list ? list.title : '',
            message: `Are you sure you want to delete "${list ? list.title : ''}" and all its cards? This action cannot be undone.`, 
            confirmText: 'Delete'
        });
    };

    const confirmAction = () => {
        if (confirmDialog.listId === 'reset-board') {
            confirmResetBoard();
        } else {
            setAppState(prevState => ({
                ...prevState,
                projects: prevState.projects.map(project =>
                    project.id === appState.currentProject
                        ? {
                            ...project,
                            boards: project.boards.map(board =>
                                board.id === appState.currentBoard
                                    ? {
                                        ...board,
                                        lists: board.lists.filter(list => list.id !== confirmDialog.listId)
                                    }
                                    : board
                            )
                        }
                        : project
                )
            }));
            setConfirmDialog({ isOpen: false, listId: null, listTitle: '' });
        }
    };

    const cancelAction = () => {
        setConfirmDialog({ isOpen: false, listId: null, listTitle: '' });
    };

    const renameList = (listId, newTitle) => {
        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? {
                                    ...board,
                                    lists: board.lists.map(list =>
                                        list.id === listId
                                            ? { ...list, title: newTitle }
                                            : list
                                    )
                                }
                                : board
                        )
                    }
                    : project
            )
        }));
    };

    const handleAddList = (title) => {
        addList(title);
        setIsAddingList(false);
    };

    const handleCancelAddList = () => {
        setIsAddingList(false);
    };

    const openCardModal = (card) => {
        setCardModal({
            isOpen: true,
            card: card
        });
    };

    const closeCardModal = () => {
        setCardModal({
            isOpen: false,
            card: null
        });
    };

    const openHistoryView = (card) => {
        setHistoryView({
            isOpen: true,
            card: card
        });
    };

    const closeHistoryView = () => {
        setHistoryView({
            isOpen: false,
            card: null
        });
    };

    const saveCardChanges = (updatedCard) => {
        const timestamp = new Date().toISOString();
        const lists = getCurrentLists();

        // Find the current card and list to track changes
        let currentCard = null;
        let currentListName = '';

        for (const list of lists) {
            const card = list.cards.find(c => c.id === updatedCard.id);
            if (card) {
                currentCard = card;
                currentListName = list.title;
                break;
            }
        }

        if (!currentCard) return;

        // Determine what changes were made
        const changes = [];
        if (currentCard.title !== updatedCard.title) {
            changes.push(`Title modified from "${currentCard.title}" to "${updatedCard.title}"`);
        }
        if (currentCard.description !== updatedCard.description) {
            if (currentCard.description === '' && updatedCard.description !== '') {
                changes.push('Description added');
            } else if (currentCard.description !== '' && updatedCard.description === '') {
                changes.push('Description removed');
            } else {
                changes.push('Description modified');
            }
        }

        const cardWithTimestamp = {
            ...updatedCard,
            lastModified: timestamp,
            history: [
                ...(currentCard.history || []),
                ...changes.map(change => ({
                    timestamp: timestamp,
                    list: currentListName,
                    change: change
                }))
            ]
        };

        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? {
                                    ...board,
                                    lists: board.lists.map(list => ({
                                        ...list,
                                        cards: list.cards.map(card =>
                                            card.id === updatedCard.id ? cardWithTimestamp : card
                                        )
                                    }))
                                }
                                : board
                        )
                    }
                    : project
            )
        }));
    };

    const resetBoard = () => {
        setConfirmDialog({
            isOpen: true,
            listId: 'reset-board',
            listTitle: 'Reset Board',
            message: 'Are you sure you want to reset the current board? This will delete all lists and cards and cannot be undone.',
            confirmText: 'Reset'
        });
    };

    const confirmResetBoard = () => {
        setAppState(prevState => ({
            ...defaultState,
            currentProject: prevState.currentProject,
            currentBoard: prevState.currentBoard,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === appState.currentBoard
                                ? { ...defaultState.projects[0].boards[0] }
                                : board
                        )
                    }
                    : project
            )
        }));
        setConfirmDialog({ isOpen: false, listId: null, listTitle: '' });
    };

    // Navigation Functions
    const goToProjectOverview = () => {
        setCurrentView('project-overview');
    };

    const goToBoardView = (boardId) => {
        setAppState(prevState => ({
            ...prevState,
            currentBoard: boardId
        }));
        setCurrentView('board-view');
    };

    // Project Management Functions
    const selectProject = (projectId) => {
        const project = appState.projects.find(p => p.id === projectId);
        if (project && project.boards.length > 0) {
            setAppState(prevState => ({
                ...prevState,
                currentProject: projectId,
                currentBoard: project.boards[0].id
            }));
            // Keep current view when switching projects
        }
    };

    const addProject = (projectName) => {
        const newProject = {
            id: generateId(),
            name: projectName,
            boards: [
                {
                    id: generateId(),
                    name: 'Main Board',
                    lists: [
                        {
                            id: generateId(),
                            title: 'To Do',
                            cards: []
                        },
                        {
                            id: generateId(),
                            title: 'In Progress',
                            cards: []
                        },
                        {
                            id: generateId(),
                            title: 'Done',
                            cards: []
                        }
                    ]
                }
            ]
        };

        setAppState(prevState => ({
            ...prevState,
            projects: [...prevState.projects, newProject],
            currentProject: newProject.id,
            currentBoard: newProject.boards[0].id
        }));
        setProjectModalOpen(false);
    };

    const renameProject = (projectId, newName) => {
        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === projectId
                    ? { ...project, name: newName }
                    : project
            )
        }));
    };

    const deleteProject = (projectId) => {
        if (appState.projects.length <= 1) {
            alert('Cannot delete the last project.');
            return;
        }

        const newProjects = appState.projects.filter(p => p.id !== projectId);
        let newCurrentProject = appState.currentProject;
        let newCurrentBoard = appState.currentBoard;

        // If we deleted the current project, switch to another one
        if (projectId === appState.currentProject) {
            const fallbackProject = newProjects[0];
            newCurrentProject = fallbackProject.id;
            newCurrentBoard = fallbackProject.boards[0].id;
        }

        setAppState({
            ...appState,
            projects: newProjects,
            currentProject: newCurrentProject,
            currentBoard: newCurrentBoard
        });
        setProjectModalOpen(false);
    };

    // Board Management Functions
    const selectBoard = (boardId) => {
        setAppState(prevState => ({
            ...prevState,
            currentBoard: boardId
        }));
    };

    const addBoard = (boardName) => {
        const newBoard = {
            id: generateId(),
            name: boardName,
            lists: [
                {
                    id: generateId(),
                    title: 'To Do',
                    cards: []
                },
                {
                    id: generateId(),
                    title: 'In Progress',
                    cards: []
                },
                {
                    id: generateId(),
                    title: 'Done',
                    cards: []
                }
            ]
        };

        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? { ...project, boards: [...project.boards, newBoard] }
                    : project
            ),
            currentBoard: newBoard.id
        }));
        setBoardModalOpen(false);
    };

    const renameBoard = (boardId, newName) => {
        setAppState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.map(board =>
                            board.id === boardId
                                ? { ...board, name: newName }
                                : board
                        )
                    }
                    : project
            )
        }));
    };

    const deleteBoard = (boardId) => {
        const currentProject = getCurrentProject();
        if (!currentProject || currentProject.boards.length <= 1) {
            alert('Cannot delete the last board in a project.');
            return;
        }

        setAppState(prevState => {
            const newProjects = prevState.projects.map(project =>
                project.id === appState.currentProject
                    ? {
                        ...project,
                        boards: project.boards.filter(board => board.id !== boardId)
                    }
                    : project
            );

            let newCurrentBoard = prevState.currentBoard;
            let shouldSwitchToOverview = false;

            if (boardId === prevState.currentBoard) {
                const updatedProject = newProjects.find(p => p.id === appState.currentProject);
                if (updatedProject.boards.length > 0) {
                    newCurrentBoard = updatedProject.boards[0].id;
                } else {
                    // If no boards left, switch to project overview
                    shouldSwitchToOverview = true;
                }
            }

            return {
                ...prevState,
                projects: newProjects,
                currentBoard: newCurrentBoard
            };
        });

        // If we deleted the current board and we're in board view, switch to project overview
        if (boardId === appState.currentBoard && currentView === 'board-view') {
            setCurrentView('project-overview');
        }

        setBoardModalOpen(false);
    };


    const currentProject = getCurrentProject();
    const currentBoard = getCurrentBoard();
    const currentLists = getCurrentLists();

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* App Header */}
            <header className="app-header">
                <div className="app-title">Trello Clone</div>
                <div className="nav-section">
                    <div className="breadcrumb">
                        <span
                            className="breadcrumb-item breadcrumb-project"
                            onClick={goToProjectOverview}
                        >
                            {currentProject?.name || 'Unknown Project'}
                        </span>
                        {currentView === 'board-view' && (
                            <>
                                <span className="breadcrumb-separator">›</span>
                                <span className="breadcrumb-item">{currentBoard?.name || 'Unknown Board'}</span>
                            </>
                        )}
                    </div>
                    <div className="project-selector">
                        <span className="selector-label">Project:</span>
                        <select
                            className="selector-dropdown"
                            value={appState.currentProject}
                            onChange={(e) => selectProject(e.target.value)}
                        >
                            {appState.projects.map(project => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <button className="add-button" onClick={() => setProjectModalOpen(true)}>
                            Manage
                        </button>
                    </div>
                    {currentView === 'board-view' ? (
                        <div className="board-selector">
                            <span className="selector-label">Board:</span>
                            <select
                                className="selector-dropdown"
                                value={appState.currentBoard}
                                onChange={(e) => selectBoard(e.target.value)}
                            >
                                {currentProject?.boards.map(board => (
                                    <option key={board.id} value={board.id}>
                                        {board.name}
                                    </option>
                                ))}
                            </select>
                            <button className="add-button" onClick={() => setBoardModalOpen(true)}>
                                Manage
                            </button>
                            <button className="reset-board-btn" onClick={resetBoard}>
                                Reset Board
                            </button>
                        </div>
                    ) : (
                        <div className="board-selector">
                            <button className="add-button" onClick={() => setBoardModalOpen(true)}>
                                Manage Boards
                            </button>
                        </div>
                    )}
                </div>
            </header>
            {currentView === 'project-overview' ? (
                // Project Overview View
                <div className="project-overview">
                    <div className="project-header">
                        <h1 className="project-title">{currentProject?.name || 'Unknown Project'}</h1>
                        <p className="project-subtitle">
                            {currentProject?.boards.length || 0} board{currentProject?.boards.length !== 1 ? 's' : ''} in this project
                        </p>
                    </div>

                    <div className="boards-grid">
                        {currentProject?.boards.map(board => (
                            <BoardTile
                                key={board.id}
                                board={board}
                                onClick={goToBoardView}
                                onEdit={renameBoard}
                                onDelete={deleteBoard}
                            />
                        ))}

                        {/* Add Board Tile */}
                        <div
                            className="board-tile add-board-tile"
                            onClick={() => setBoardModalOpen(true)}
                        >
                            <div className="add-board-icon">+</div>
                            <div>Add New Board</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="board-container">
                    <div className="board-content">
                        {currentLists.map((list, index) => (
                            <List
                                key={list.id}
                                list={list}
                                index={index}
                                onAddCard={addCard}
                                onDeleteCard={deleteCard}
                                onDeleteList={deleteList}
                                onRenameList={renameList}
                                onEditCard={openCardModal}
                            />
                        ))}
                        {/* Add List Section */}
                        {isAddingList ? (
                            <AddListForm
                                onAddList={handleAddList}
                                onCancel={handleCancelAddList}
                            />
                        ) : (
                            <div
                                className="add-list"
                                onClick={() => setIsAddingList(true)}
                            >
                                + Add another list
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onConfirm={confirmAction}
                onCancel={cancelAction}
                title={confirmDialog.title}
                message={confirmDialog.message || `Are you sure you want to delete "${confirmDialog.listTitle}" and all its cards? This action cannot be undone.`}
                confirmText={confirmDialog.confirmText}
            />

            {/* Card Modal */}
            <CardModal
                isOpen={cardModal.isOpen}
                card={cardModal.card}
                onClose={closeCardModal}
                onSave={saveCardChanges}
                onViewHistory={() => openHistoryView(cardModal.card)}
            />

            {/* Card History View */}
            <CardHistoryView
                isOpen={historyView.isOpen}
                card={historyView.card}
                onClose={closeHistoryView}
            />

            {/* Project Management Modal */}
            <ProjectManagementModal
                isOpen={projectModalOpen}
                onClose={() => setProjectModalOpen(false)}
                projects={appState.projects}
                currentProject={appState.currentProject}
                onProjectSelect={selectProject}
                onAddProject={addProject}
                onRenameProject={renameProject}
                onDeleteProject={deleteProject}
            />

            {/* Board Management Modal */}
            <BoardManagementModal
                isOpen={boardModalOpen}
                onClose={() => setBoardModalOpen(false)}
                boards={currentProject?.boards || []}
                currentBoard={appState.currentBoard}
                onBoardSelect={selectBoard}
                onAddBoard={addBoard}
                onRenameBoard={renameBoard}
                onDeleteBoard={deleteBoard}
            />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);