document.addEventListener('DOMContentLoaded', () => {
    // --- MODAL ELEMENTS ---
    const modal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalPanel = document.getElementById('modal-panel');
    const closeButton = document.getElementById('modal-close-button');
    const mainImage = document.getElementById('modal-main-image');
    const thumbnailGallery = document.getElementById('modal-thumbnail-gallery');
    const prevButton = document.getElementById('modal-prev-image');
    const nextButton = document.getElementById('modal-next-image');

    // --- STATE ---
    let currentProject = null;
    let currentImageIndex = 0;

    /**
     * Opens the modal and populates it with project data.
     * @param {object} project - The project data object from gallery.json.
     */
    window.openProjectModal = function(project) {
        currentProject = project;
        currentImageIndex = 0;

        // Update modal text content with fallbacks
        document.getElementById('modal-project-title').textContent = project.title || 'Untitled Project';
        document.getElementById('modal-project-description').textContent = project.description || 'No description available.';
        document.getElementById('modal-likes').textContent = project.likes || 0;
        document.getElementById('modal-project-material').textContent = project.material || 'N/A';
        document.getElementById('modal-project-weight').textContent = project.weight ? `${project.weight}g` : 'N/A';
        document.getElementById('modal-project-resolution').textContent = project.resolution ? `${project.resolution}mm` : 'N/A';
        document.getElementById('modal-project-print-time').textContent = project.printTime || 'N/A';
        document.getElementById('modal-project-price').textContent = project.price ? `${project.price.toFixed(2)}` : 'Contact for price';
        
        // Set project ID on the modal for the cart functionality
        modal.setAttribute('data-project-id', project.id);

        // Populate image gallery
        setupImageGallery();

        // Show the modal with animation
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modalPanel.classList.remove('scale-95');
        }, 10);

        closeButton.focus();
    }

    /**
     * Closes the modal with animation.
     */
    function closeModal() {
        modal.classList.add('opacity-0');
        modalPanel.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    /**
     * Sets up the main image and thumbnails for the current project.
     */
    function setupImageGallery() {
        if (!currentProject || !currentProject.images || currentProject.images.length === 0) {
            // Hide gallery if no images
            mainImage.parentElement.classList.add('hidden');
            thumbnailGallery.classList.add('hidden');
            return;
        }

        mainImage.parentElement.classList.remove('hidden');
        thumbnailGallery.classList.remove('hidden');

        // Show/hide navigation buttons
        const hasMultipleImages = currentProject.images.length > 1;
        prevButton.classList.toggle('hidden', !hasMultipleImages);
        nextButton.classList.toggle('hidden', !hasMultipleImages);
        
        // Render thumbnails
        thumbnailGallery.innerHTML = '';
        currentProject.images.forEach((imageUrl, index) => {
            const thumbButton = document.createElement('button');
            thumbButton.type = 'button';
            thumbButton.className = 'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-indigo';
            thumbButton.innerHTML = `<img src="${imageUrl}" alt="Thumbnail ${index + 1}" class="w-full h-full object-cover">`;
            thumbButton.addEventListener('click', () => showImage(index));
            thumbnailGallery.appendChild(thumbButton);
        });

        // Show the first image
        showImage(0);
    }

    /**
     * Displays a specific image in the main view and updates thumbnails.
     * @param {number} index - The index of the image to show.
     */
    function showImage(index) {
        if (!currentProject || index < 0 || index >= currentProject.images.length) return;
        
        currentImageIndex = index;
        mainImage.src = currentProject.images[index];

        // Update active state on thumbnails
        const thumbnails = thumbnailGallery.querySelectorAll('button');
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('border-brand-indigo', 'dark:border-brand-yellow', 'scale-105');
                thumb.classList.remove('border-transparent');
                // Scroll thumbnail into view
                thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                thumb.classList.remove('border-brand-indigo', 'dark:border-brand-yellow', 'scale-105');
                thumb.classList.add('border-transparent');
            }
        });
    }

    /**
     * Navigates to the next or previous image.
     * @param {number} direction - 1 for next, -1 for previous.
     */
    function navigateImages(direction) {
        if (!currentProject) return;
        const newIndex = (currentImageIndex + direction + currentProject.images.length) % currentProject.images.length;
        showImage(newIndex);
    }

    // --- EVENT LISTENERS ---
    if(modal){
        modalBackdrop.addEventListener('click', closeModal);
        closeButton.addEventListener('click', closeModal);
        prevButton.addEventListener('click', () => navigateImages(-1));
        nextButton.addEventListener('click', () => navigateImages(1));
    
        document.addEventListener('keydown', (e) => {
            if (modal.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') navigateImages(-1);
            if (e.key === 'ArrowRight') navigateImages(1);
        });
    }

});
