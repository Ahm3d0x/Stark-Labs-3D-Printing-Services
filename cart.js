// Initialize cart from localStorage or create empty cart
// let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM elements
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggleButton = document.getElementById('cart-toggle-button');
const mobileCartToggle = document.getElementById('mobile-cart-toggle');
const closeCartButton = document.getElementById('close-cart-button');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartItemCount = document.getElementById('cart-item-count');
const mobileCartItemCount = document.getElementById('mobile-cart-item-count');
const body = document.body;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupCartEventListeners();
    setupAddToCartButton();
});
function openCart() {
    if (!cartSidebar || !cartBackdrop) return;

    document.body.style.overflow = 'hidden';

    cartSidebar.classList.remove('hidden');
    cartBackdrop.classList.remove('hidden');

    // ✅ تأكد إن transform يعمل
    cartSidebar.classList.add('flex', 'transition-all', 'duration-300', 'translate-x-full');
    cartBackdrop.classList.add('opacity-0');

    // ✅ Force reflow to apply initial state
    cartSidebar.offsetHeight; // 🧠 لازم تعمل كده قبل إزالة translate-x-full

    setTimeout(() => {
        cartSidebar.classList.remove('translate-x-full');
        cartSidebar.classList.add('translate-x-0'); // ✅ أضف دي
        cartBackdrop.classList.remove('opacity-0');
        cartBackdrop.classList.add('opacity-100');
    }, 10); // مش لازم 20، 10 تكفي
}


function setupCartEventListeners() {
    if (cartToggleButton) cartToggleButton.addEventListener('click', openCart);
    if (mobileCartToggle) mobileCartToggle.addEventListener('click', openCart);
    if (closeCartButton) closeCartButton.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !cartSidebar.classList.contains('hidden')) {
            closeCart();
        }
    });
}
function setupAddToCartButton() {
    const addToCartButton = document.getElementById('modal-add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCart);
    }
}

function openModal(project) {

    let galleryData = [];

fetch('gallery.json')
  .then(res => res.json())
  .then(data => {
    galleryData = data;
  });

    const modal = document.getElementById('project-modal');
    modal.setAttribute('data-project-id', project.id);
    modal.setAttribute('data-design-link', project.designLink || '');
    modal.setAttribute('data-material', project.material || 'Not specified');
    // باقي الإعدادات مثل العنوان، السعر، الصور...
  }
  
  function addToCart() {
    const modal = document.getElementById('project-modal');
    const projectId = modal.getAttribute('data-project-id')?.trim();
  
    const project = galleryData.find(p => p.id === projectId);
  
    if (!project) {
      console.error("❌ Project not found in gallery data.");
      return;
    }
  
    const itemId = project.id;
    const cartItem = {
      id: itemId,
      title: project.title,
      price: project.price,
      quantity: 1,
      image: project.thumbnail, // أو من الصور
      designLink: project.designLink || '',
      material: project.material || 'Not specified',
      timestamp: Date.now()
    };
  
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
  
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
  
    saveCart();
    updateCartUI();
    showNotification('Item added to cart!');
  }
  

  function orderNow() {
    addToCart() 
    closeModal()
    go_order()
  }
  
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('❌ Failed to save cart:', e);
    }
    updateCartCount();
}

function updateCartCount() {
    
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartItemCount) {
        cartItemCount.textContent = count;
        cartItemCount.classList.toggle('hidden', count === 0);
    }
    if (mobileCartItemCount) {
        mobileCartItemCount.textContent = count;
        mobileCartItemCount.classList.toggle('hidden', count === 0);
    }
}

function updateCartUI() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
                <svg class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Your cart is empty</h3>
                <p class="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any items yet.</p>
                <button type="button" onclick="closeCart()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-indigo hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Continue Shopping
                </button>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = `
            <div class="divide-y divide-gray-200 dark:divide-dark-700">
                ${cart.map(item => `
                    <div class="flex items-center py-4 px-4" data-item-id="${item.id}">
                        <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100 dark:bg-dark-700">
                            ${item.image ? `
                                <img src="${item.image}" alt="${item.title}" class="h-full w-full object-cover">
                            ` : `
                                <div class="h-full w-full flex items-center justify-center text-gray-400">
                                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            `}
                        </div>
                        <div class="ml-4 flex-1">
                            <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3 class="truncate max-w-[180px]">${item.title}</h3>
                                <p class="ml-4">${item.price.toFixed(2)} EGP</p>
                            </div>
                            <div class="flex items-center mt-1">
                                <button type="button" class="text-gray-500 hover:text-brand-indigo dark:hover:text-brand-yellow" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                    <span class="sr-only">Decrease quantity</span>
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                    </svg>
                                </button>
                                <span class="mx-2 text-sm text-gray-500 dark:text-gray-400">${item.quantity}</span>
                                <button type="button" class="text-gray-500 hover:text-brand-indigo dark:hover:text-brand-yellow" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                    <span class="sr-only">Increase quantity</span>
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="ml-4 text-gray-400 hover:text-red-500" onclick="removeItem('${item.id}')">
                            <span class="sr-only">Remove</span>
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="border-t border-gray-200 dark:border-dark-700 px-4 py-6">
                <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                    <p>Subtotal</p>
                    <p>${calculateSubtotal().toFixed(2)} EGP</p>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Price includes VAT. Shipping not included.</p>
                <button id="checkout-btn" type="button" onclick="go_order()" class="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-indigo hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Checkout
                </button>
                <div class="mt-4 flex justify-center text-sm text-center text-gray-500 dark:text-gray-400">
                    <p>
                        or <button type="button" onclick="closeCart()" class="text-brand-indigo font-medium hover:text-indigo-500 dark:hover:text-brand-yellow">Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
                    </p>
                </div>
            </div>
        `;
    }
    updateCartCount();
}

function go_order() {

    window.spaNavigator.navigateTo('order');
}
  
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

window.updateQuantity = function(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        if (newQuantity < 1) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        saveCart();
        updateCartUI();
    }
}

window.removeItem = function(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart');
}

function showNotification(message) {
    console.log(message); // Replace with custom toast system
}

function closeCart() {
    if (!cartSidebar || !cartBackdrop) return;
    if (cartItemsContainer) cartItemsContainer.scrollTop = 0;
    cartSidebar.classList.remove('flex', 'translate-x-0');
    cartSidebar.classList.add('translate-x-full');
    cartBackdrop.classList.remove('opacity-100');
    cartBackdrop.classList.add('opacity-0');
    const onTransitionEnd = () => {
        cartSidebar.classList.add('hidden');
        cartBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
        cartSidebar.removeEventListener('transitionend', onTransitionEnd);
    };
    cartSidebar.addEventListener('transitionend', onTransitionEnd, { once: true });
}
