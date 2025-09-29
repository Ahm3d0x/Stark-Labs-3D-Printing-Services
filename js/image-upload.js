document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('file-upload');
    const imageStrip = document.getElementById('image-strip-container');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const mainImagePreview = document.getElementById('main-image-preview');
    const mainPreview = document.getElementById('main-preview');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRight = document.getElementById('scroll-right');

    // If any required elements are missing, exit early
    if (!fileUpload || !imageStrip || !imagePreviewContainer || !mainImagePreview || !mainPreview) {
        console.warn('Required elements for image upload not found');
        return;
    }

    let uploadedImages = [];
    let currentImageIndex = 0;

    // Handle file selection
    fileUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                uploadedImages.push(imageUrl);
                renderThumbnails();
                if (uploadedImages.length === 1) setMainPreview(0);
            };
            reader.readAsDataURL(file);
        });
    });

    function renderThumbnails() {
        imageStrip.innerHTML = '';
        uploadedImages.forEach((url, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'flex-shrink-0 relative group';
            thumbnail.innerHTML = `
                <img src="${url}" alt="Preview" data-index="${index}" class="w-20 h-20 object-cover rounded-lg border-2 ${index === currentImageIndex ? 'border-brand-indigo dark:border-brand-yellow' : 'border-transparent'} cursor-pointer transition-colors">
                <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity" data-index="${index}">×</button>
            `;

            thumbnail.querySelector('img').addEventListener('click', () => setMainPreview(index));
            thumbnail.querySelector('button').addEventListener('click', (e) => {
                e.stopPropagation();
                removeImage(index);
            });

            imageStrip.appendChild(thumbnail);
        });

        imagePreviewContainer.classList.toggle('hidden', uploadedImages.length === 0);
    }

    function setMainPreview(index) {
        if (index < 0 || index >= uploadedImages.length) return;
        currentImageIndex = index;
        mainPreview.src = uploadedImages[index];
        mainImagePreview.classList.remove('hidden');
        renderThumbnails();
    }

    function removeImage(index) {
        uploadedImages.splice(index, 1);
        if (currentImageIndex >= uploadedImages.length) currentImageIndex = uploadedImages.length - 1;
        renderThumbnails();
        if (uploadedImages.length > 0) {
            setMainPreview(currentImageIndex);
        } else {
            imagePreviewContainer.classList.add('hidden');
            mainImagePreview.classList.add('hidden');
        }
    }

    if (scrollLeftBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            imageStrip.scrollBy({ left: -150, behavior: 'smooth' });
        });
    }

    if (scrollRight) {
        scrollRight.addEventListener('click', () => {
            imageStrip.scrollBy({ left: 150, behavior: 'smooth' });
        });
    }

    const dropArea = fileUpload.closest('div[class*="border-dashed"]');
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults);
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight);
        });
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight);
        });
        dropArea.addEventListener('drop', handleDrop);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('border-brand-indigo', 'dark:border-brand-yellow', 'bg-opacity-50');
    }

    function unhighlight() {
        dropArea.classList.remove('border-brand-indigo', 'dark:border-brand-yellow', 'bg-opacity-50');
    }

    function handleDrop(e) {
        const files = e.dataTransfer.files;
        fileUpload.files = files;
        fileUpload.dispatchEvent(new Event('change'));
    }
});
