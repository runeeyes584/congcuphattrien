// ===== Sample Data =====
let stories = [
    {
        id: 1,
        name: "Naruto",
        author: "Masashi Kishimoto",
        genre: "action",
        status: "completed",
        chapters: 700,
        rating: 4.8,
        cover: "https://m.media-amazon.com/images/I/51fwDMKQzCL._SY445_SX342_.jpg",
        description: "Câu chuyện về Naruto Uzumaki, một ninja trẻ với ước mơ trở thành Hokage."
    },
    {
        id: 2,
        name: "One Piece",
        author: "Eiichiro Oda",
        genre: "fantasy",
        status: "ongoing",
        chapters: 1100,
        rating: 4.9,
        cover: "https://m.media-amazon.com/images/I/51xHrPz8UFL._SY445_SX342_.jpg",
        description: "Cuộc phiêu lưu của Luffy và băng hải tặc Mũ Rơm tìm kiếm kho báu One Piece."
    },
    {
        id: 3,
        name: "Attack on Titan",
        author: "Hajime Isayama",
        genre: "action",
        status: "completed",
        chapters: 139,
        rating: 4.7,
        cover: "https://m.media-amazon.com/images/I/51g5YDjYVLL._SY445_SX342_.jpg",
        description: "Nhân loại chiến đấu để sinh tồn trước các Titan khổng lồ."
    },
    {
        id: 4,
        name: "Your Name",
        author: "Makoto Shinkai",
        genre: "romance",
        status: "completed",
        chapters: 9,
        rating: 4.6,
        cover: "https://m.media-amazon.com/images/I/41L+xfSoCxL._SY445_SX342_.jpg",
        description: "Câu chuyện tình yêu xuyên không gian giữa hai người trẻ."
    },
    {
        id: 5,
        name: "Spy x Family",
        author: "Tatsuya Endo",
        genre: "comedy",
        status: "ongoing",
        chapters: 90,
        rating: 4.5,
        cover: "https://m.media-amazon.com/images/I/41xdLJpiDoL._SY445_SX342_.jpg",
        description: "Gia đình đặc biệt gồm điệp viên, sát thủ và cô bé có năng lực đọc tâm trí."
    },
    {
        id: 6,
        name: "Jujutsu Kaisen",
        author: "Gege Akutami",
        genre: "horror",
        status: "ongoing",
        chapters: 250,
        rating: 4.6,
        cover: "https://m.media-amazon.com/images/I/51r1aVeJ3WL._SY445_SX342_.jpg",
        description: "Thế giới của những chú thuật sư chiến đấu chống lại lời nguyền."
    },
    {
        id: 7,
        name: "My Hero Academia",
        author: "Kohei Horikoshi",
        genre: "action",
        status: "completed",
        chapters: 430,
        rating: 4.4,
        cover: "https://m.media-amazon.com/images/I/51xnS5J8b5L._SY445_SX342_.jpg",
        description: "Deku và hành trình trở thành anh hùng số một trong thế giới có siêu năng lực."
    },
    {
        id: 8,
        name: "Death Note",
        author: "Tsugumi Ohba",
        genre: "drama",
        status: "completed",
        chapters: 108,
        rating: 4.8,
        cover: "https://m.media-amazon.com/images/I/41H4nR2LqmL._SY445_SX342_.jpg",
        description: "Cuốn sổ tử thần với khả năng giết người bằng cách viết tên."
    }
];

// ===== State Variables =====
let currentPage = 1;
const itemsPerPage = 5;
let filteredStories = [...stories];
let editingStoryId = null;
let deletingStoryId = null;

// ===== DOM Elements =====
const searchInput = document.getElementById('searchInput');
const filterGenre = document.getElementById('filterGenre');
const filterStatus = document.getElementById('filterStatus');
const sortBy = document.getElementById('sortBy');
const storiesTableBody = document.getElementById('storiesTableBody');
const pagination = document.getElementById('pagination');
const emptyState = document.getElementById('emptyState');

const storyModal = document.getElementById('storyModal');
const deleteModal = document.getElementById('deleteModal');
const storyForm = document.getElementById('storyForm');

const btnAddStory = document.getElementById('btnAddStory');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const deleteModalClose = document.getElementById('deleteModalClose');
const btnCancelDelete = document.getElementById('btnCancelDelete');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

const toast = document.getElementById('toast');

// ===== Genre & Status Mappings =====
const genreMap = {
    action: 'Hành động',
    romance: 'Tình cảm',
    comedy: 'Hài hước',
    horror: 'Kinh dị',
    fantasy: 'Giả tưởng',
    drama: 'Drama'
};

const statusMap = {
    ongoing: { text: 'Đang tiến hành', icon: '🔄' },
    completed: { text: 'Hoàn thành', icon: '✅' },
    hiatus: { text: 'Tạm dừng', icon: '⏸️' }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    setupEventListeners();
});

// ===== Event Listeners =====
function setupEventListeners() {
    // Search & Filter
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    filterGenre.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    sortBy.addEventListener('change', applyFilters);

    // Modal
    btnAddStory.addEventListener('click', () => openStoryModal());
    modalClose.addEventListener('click', closeStoryModal);
    btnCancel.addEventListener('click', closeStoryModal);
    storyForm.addEventListener('submit', handleFormSubmit);

    // Delete Modal
    deleteModalClose.addEventListener('click', closeDeleteModal);
    btnCancelDelete.addEventListener('click', closeDeleteModal);
    btnConfirmDelete.addEventListener('click', confirmDelete);

    // Close modal on overlay click
    storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) closeStoryModal();
    });
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// ===== Filter & Sort Functions =====
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const genreFilter = filterGenre.value;
    const statusFilter = filterStatus.value;
    const sortValue = sortBy.value;

    // Filter
    filteredStories = stories.filter(story => {
        const matchesSearch = story.name.toLowerCase().includes(searchTerm) ||
            story.author.toLowerCase().includes(searchTerm);
        const matchesGenre = !genreFilter || story.genre === genreFilter;
        const matchesStatus = !statusFilter || story.status === statusFilter;
        return matchesSearch && matchesGenre && matchesStatus;
    });

    // Sort
    filteredStories.sort((a, b) => {
        switch (sortValue) {
            case 'newest':
                return b.id - a.id;
            case 'oldest':
                return a.id - b.id;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    currentPage = 1;
    renderTable();
    updateStats();
}

// ===== Render Functions =====
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageStories = filteredStories.slice(start, end);

    if (filteredStories.length === 0) {
        storiesTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        pagination.innerHTML = '';
        return;
    }

    emptyState.style.display = 'none';

    storiesTableBody.innerHTML = pageStories.map(story => `
        <tr>
            <td>#${story.id}</td>
            <td>
                <img src="${story.cover}" alt="${story.name}" class="story-cover" 
                     onerror="this.src='https://via.placeholder.com/50x70?text=No+Image'">
            </td>
            <td>
                <div class="story-name">${story.name}</div>
            </td>
            <td class="story-author">${story.author}</td>
            <td>
                <span class="genre-badge">${genreMap[story.genre] || story.genre}</span>
            </td>
            <td>${story.chapters}</td>
            <td>
                <span class="status-badge status-${story.status}">
                    ${statusMap[story.status].icon} ${statusMap[story.status].text}
                </span>
            </td>
            <td>
                <div class="rating">
                    <span class="rating-star">⭐</span>
                    <span class="rating-value">${story.rating.toFixed(1)}</span>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewStory(${story.id})" title="Xem chi tiết">👁️</button>
                    <button class="action-btn edit" onclick="editStory(${story.id})" title="Sửa">✏️</button>
                    <button class="action-btn delete" onclick="deleteStory(${story.id})" title="Xóa">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ←
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span style="color: var(--text-muted);">...</span>';
        }
    }

    html += `
        <button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            →
        </button>
    `;

    pagination.innerHTML = html;
}

function updateStats() {
    document.getElementById('totalStories').textContent = stories.length;
    document.getElementById('completedStories').textContent = stories.filter(s => s.status === 'completed').length;
    document.getElementById('ongoingStories').textContent = stories.filter(s => s.status === 'ongoing').length;
    document.getElementById('filteredCount').textContent = filteredStories.length;
}

// ===== Pagination =====
function goToPage(page) {
    const totalPages = Math.ceil(filteredStories.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// ===== Modal Functions =====
function openStoryModal(story = null) {
    editingStoryId = story ? story.id : null;
    document.getElementById('modalTitle').textContent = story ? 'Chỉnh Sửa Truyện' : 'Thêm Truyện Mới';
    document.getElementById('btnSave').textContent = story ? 'Cập nhật' : 'Lưu truyện';

    // Reset or fill form
    document.getElementById('storyId').value = story?.id || '';
    document.getElementById('storyName').value = story?.name || '';
    document.getElementById('storyAuthor').value = story?.author || '';
    document.getElementById('storyGenre').value = story?.genre || '';
    document.getElementById('storyStatus').value = story?.status || '';
    document.getElementById('storyChapters').value = story?.chapters || '';
    document.getElementById('storyRating').value = story?.rating || '';
    document.getElementById('storyCover').value = story?.cover || '';
    document.getElementById('storyDescription').value = story?.description || '';

    storyModal.classList.add('active');
}

function closeStoryModal() {
    storyModal.classList.remove('active');
    storyForm.reset();
    editingStoryId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const storyData = {
        name: document.getElementById('storyName').value,
        author: document.getElementById('storyAuthor').value,
        genre: document.getElementById('storyGenre').value,
        status: document.getElementById('storyStatus').value,
        chapters: parseInt(document.getElementById('storyChapters').value) || 0,
        rating: parseFloat(document.getElementById('storyRating').value) || 5,
        cover: document.getElementById('storyCover').value || 'https://via.placeholder.com/50x70?text=No+Image',
        description: document.getElementById('storyDescription').value
    };

    if (editingStoryId) {
        // Update existing story
        const index = stories.findIndex(s => s.id === editingStoryId);
        if (index !== -1) {
            stories[index] = { ...stories[index], ...storyData };
            showToast('Cập nhật truyện thành công!', 'success');
        }
    } else {
        // Add new story
        const newId = Math.max(...stories.map(s => s.id), 0) + 1;
        stories.push({ id: newId, ...storyData });
        showToast('Thêm truyện mới thành công!', 'success');
    }

    closeStoryModal();
    applyFilters();
}

// ===== CRUD Operations =====
function viewStory(id) {
    const story = stories.find(s => s.id === id);
    if (story) {
        alert(`📖 ${story.name}\n\nTác giả: ${story.author}\nThể loại: ${genreMap[story.genre]}\nTrạng thái: ${statusMap[story.status].text}\nSố chương: ${story.chapters}\nĐánh giá: ${story.rating}⭐\n\n${story.description}`);
    }
}

function editStory(id) {
    const story = stories.find(s => s.id === id);
    if (story) {
        openStoryModal(story);
    }
}

function deleteStory(id) {
    const story = stories.find(s => s.id === id);
    if (story) {
        deletingStoryId = id;
        document.getElementById('deleteStoryName').textContent = story.name;
        deleteModal.classList.add('active');
    }
}

function closeDeleteModal() {
    deleteModal.classList.remove('active');
    deletingStoryId = null;
}

function confirmDelete() {
    if (deletingStoryId) {
        stories = stories.filter(s => s.id !== deletingStoryId);
        showToast('Xóa truyện thành công!', 'success');
        closeDeleteModal();
        applyFilters();
    }
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    toast.className = `toast ${type}`;
    document.getElementById('toastIcon').textContent = type === 'success' ? '✓' : '✗';
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
