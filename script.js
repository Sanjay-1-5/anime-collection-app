class AnimeApp {
    constructor() {
        this.data = {
            movies: [],
            manga: [],
            settings: {
                theme: 'dark',
                currency: '$'
            }
        };
        
        this.loadData();
        this.init();
    }
    
    loadData() {
        const saved = localStorage.getItem('animeData');
        if (saved) {
            this.data = JSON.parse(saved);
        }
    }
    
    saveData() {
        localStorage.setItem('animeData', JSON.stringify(this.data));
        this.updateTotal();
    }
    
    init() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Form submission
        document.getElementById('addForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });
        
        // Load initial data
        this.renderMovies();
        this.renderManga();
        this.updateTotal();
    }
    
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activate selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }
    
    addItem() {
        const type = document.getElementById('itemType').value;
        const title = document.getElementById('title').value;
        const price = parseFloat(document.getElementById('price').value) || 0;
        const notes = document.getElementById('notes').value;
        
        if (!title) {
            alert('Please enter a title!');
            return;
        }
        
        const item = {
            id: Date.now(),
            title: title,
            price: price,
            notes: notes,
            date: new Date().toISOString()
        };
        
        if (type === 'movie') {
            this.data.movies.push(item);
            this.renderMovies();
        } else {
            this.data.manga.push(item);
            this.renderManga();
        }
        
        this.saveData();
        
        // Clear form
        document.getElementById('title').value = '';
        document.getElementById('price').value = '';
        document.getElementById('notes').value = '';
        
        alert(`${type} added successfully!`);
    }
    
    renderMovies() {
        const container = document.getElementById('moviesList');
        
        if (this.data.movies.length === 0) {
            container.innerHTML = '<p class="empty">No movies added yet.</p>';
            return;
        }
        
        container.innerHTML = this.data.movies.map(movie => `
            <div class="movie-item">
                <div>
                    <div class="item-title">${movie.title}</div>
                    <div class="item-notes">${movie.notes}</div>
                </div>
                <div class="item-price">$${movie.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    renderManga() {
        const container = document.getElementById('mangaList');
        
        if (this.data.manga.length === 0) {
            container.innerHTML = '<p class="empty">No manga added yet.</p>';
            return;
        }
        
        container.innerHTML = this.data.manga.map(manga => `
            <div class="manga-item">
                <div>
                    <div class="item-title">${manga.title}</div>
                    <div class="item-notes">${manga.notes}</div>
                </div>
                <div class="item-price">$${manga.price.toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    updateTotal() {
        const moviesTotal = this.data.movies.reduce((sum, m) => sum + m.price, 0);
        const mangaTotal = this.data.manga.reduce((sum, m) => sum + m.price, 0);
        const total = moviesTotal + mangaTotal;
        
        document.getElementById('totalValue').textContent = `$${total.toFixed(2)}`;
    }
}

// Start the app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.animeApp = new AnimeApp();
});