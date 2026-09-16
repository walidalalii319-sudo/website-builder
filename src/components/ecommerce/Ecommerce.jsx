import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * E-commerce Service
 * Handles products, cart, checkout, orders, and payments
 */
class EcommerceService {
  constructor() {
    this.productsKey = 'website-builder-products';
    this.cartKey = 'website-builder-cart';
    this.ordersKey = 'website-builder-orders';
    this.products = this.loadProducts();
    this.orders = this.loadOrders();
  }

  loadProducts() {
    try {
      const stored = localStorage.getItem(this.productsKey);
      return stored ? JSON.parse(stored) : this.getDefaultProducts();
    } catch {
      return this.getDefaultProducts();
    }
  }

  saveProducts() {
    try {
      localStorage.setItem(this.productsKey, JSON.stringify(this.products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }

  getDefaultProducts() {
    return [
      {
        id: 'prod-1',
        name: 'Premium Template',
        slug: 'premium-template',
        description: 'A beautiful, responsive website template',
        price: 49.99,
        compareAtPrice: 79.99,
        images: [],
        inventory: 100,
        sku: 'TEMP-001',
        category: 'Templates',
        tags: ['website', 'responsive', 'premium'],
        status: 'active',
        variants: [
          { id: 'var-1', name: 'Single License', price: 49.99, sku: 'TEMP-001-S' },
          { id: 'var-2', name: 'Extended License', price: 149.99, sku: 'TEMP-001-E' }
        ],
        createdAt: new Date().toISOString()
      }
    ];
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(this.cartKey);
      return stored ? JSON.parse(stored) : { items: [], coupon: null };
    } catch {
      return { items: [], coupon: null };
    }
  }

  saveCart(cart) {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem(this.ordersKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveOrders() {
    try {
      localStorage.setItem(this.ordersKey, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }

  // Product operations
  getProducts(options = {}) {
    let result = [...this.products];

    if (options.status) {
      result = result.filter(p => p.status === options.status);
    }

    if (options.category) {
      result = result.filter(p => p.category === options.category);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    if (options.tags) {
      result = result.filter(p => 
        options.tags.some(tag => p.tags.includes(tag))
      );
    }

    if (options.sortBy) {
      result.sort((a, b) => {
        if (options.sortBy === 'price') {
          return options.sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
        }
        if (options.sortBy === 'createdAt') {
          return options.sortOrder === 'desc' 
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
      });
    }

    return result;
  }

  getProduct(id) {
    return this.products.find(p => p.id === id);
  }

  getProductBySlug(slug) {
    return this.products.find(p => p.slug === slug);
  }

  addProduct(product) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...product,
      createdAt: new Date().toISOString(),
      status: product.status || 'draft'
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveProducts();
    return this.products[index];
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    this.saveProducts();
    return true;
  }

  // Cart operations
  getCart() {
    return this.loadCart();
  }

  addToCart(productId, variantId, quantity = 1) {
    const cart = this.loadCart();
    const product = this.getProduct(productId);
    
    if (!product) return null;

    const variant = variantId ? product.variants?.find(v => v.id === variantId) : null;
    const price = variant ? variant.price : product.price;
    const sku = variant ? variant.sku : product.sku;

    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.variantId === variantId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `item-${Date.now()}`,
        productId,
        variantId,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0],
        price,
        sku,
        variantName: variant?.name,
        quantity
      });
    }

    this.saveCart(cart);
    return cart;
  }

  removeFromCart(itemId) {
    const cart = this.loadCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    this.saveCart(cart);
    return cart;
  }

  updateCartItemQuantity(itemId, quantity) {
    const cart = this.loadCart();
    const item = cart.items.find(i => i.id === itemId);
    
    if (!item) return null;

    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }

    item.quantity = quantity;
    this.saveCart(cart);
    return cart;
  }

  clearCart() {
    const cart = { items: [], coupon: null };
    this.saveCart(cart);
    return cart;
  }

  applyCoupon(code) {
    // Simple coupon validation (expandable)
    const validCoupons = {
      'SAVE10': { type: 'percent', value: 10 },
      'SAVE20': { type: 'percent', value: 20 },
      'FLAT5': { type: 'fixed', value: 5 }
    };

    const coupon = validCoupons[code.toUpperCase()];
    if (!coupon) return { success: false, error: 'Invalid coupon code' };

    const cart = this.loadCart();
    cart.coupon = { code: code.toUpperCase(), ...coupon };
    this.saveCart(cart);
    return { success: true, coupon };
  }

  removeCoupon() {
    const cart = this.loadCart();
    cart.coupon = null;
    this.saveCart(cart);
    return cart;
  }

  getCartTotals(cart = null) {
    const currentCart = cart || this.loadCart();
    
    const subtotal = currentCart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    let discount = 0;
    if (currentCart.coupon) {
      if (currentCart.coupon.type === 'percent') {
        discount = subtotal * (currentCart.coupon.value / 100);
      } else if (currentCart.coupon.type === 'fixed') {
        discount = currentCart.coupon.value;
      }
    }

    const totalAfterDiscount = Math.max(0, subtotal - discount);
    const tax = totalAfterDiscount * 0.08; // 8% tax example
    const shipping = totalAfterDiscount > 100 ? 0 : 9.99; // Free shipping over $100
    const total = totalAfterDiscount + tax + shipping;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: currentCart.items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  // Order operations
  createOrder(checkoutData) {
    const cart = this.loadCart();
    
    if (cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const totals = this.getCartTotals(cart);
    
    const order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      items: cart.items,
      customer: checkoutData.customer,
      shipping: checkoutData.shipping,
      payment: checkoutData.payment,
      totals,
      coupon: cart.coupon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update inventory
    cart.items.forEach(item => {
      const product = this.getProduct(item.productId);
      if (product && product.inventory !== null) {
        product.inventory -= item.quantity;
      }
    });
    this.saveProducts();

    this.orders.push(order);
    this.saveOrders();
    this.clearCart();

    return order;
  }

  getOrder(id) {
    return this.orders.find(o => o.id === id);
  }

  getOrderHistory(customerEmail) {
    return this.orders.filter(o => o.customer.email === customerEmail);
  }

  updateOrderStatus(orderId, status) {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index === -1) return null;

    this.orders[index].status = status;
    this.orders[index].updatedAt = new Date().toISOString();
    this.saveOrders();
    return this.orders[index];
  }
}

export const ecommerce = new EcommerceService();

// Cart Context
export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(ecommerce.getCart());
  const [isUpdating, setIsUpdating] = useState(false);

  const refreshCart = () => {
    setCart(ecommerce.getCart());
  };

  const addToCart = (productId, variantId, quantity) => {
    setIsUpdating(true);
    const newCart = ecommerce.addToCart(productId, variantId, quantity);
    setCart(newCart);
    setIsUpdating(false);
    return newCart;
  };

  const removeFromCart = (itemId) => {
    setIsUpdating(true);
    const newCart = ecommerce.removeFromCart(itemId);
    setCart(newCart);
    setIsUpdating(false);
    return newCart;
  };

  const updateQuantity = (itemId, quantity) => {
    setIsUpdating(true);
    const newCart = ecommerce.updateCartItemQuantity(itemId, quantity);
    setCart(newCart);
    setIsUpdating(false);
    return newCart;
  };

  const applyCoupon = (code) => {
    const result = ecommerce.applyCoupon(code);
    if (result.success) {
      setCart(ecommerce.getCart());
    }
    return result;
  };

  const clearCart = () => {
    ecommerce.clearCart();
    setCart({ items: [], coupon: null });
  };

  const totals = ecommerce.getCartTotals(cart);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      applyCoupon,
      clearCart,
      refreshCart,
      totals,
      isUpdating,
      isEmpty: cart.items.length === 0
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

/**
 * ProductCard Component
 */
export function ProductCard({ product, onAddToCart, theme = {} }) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const displayPrice = selectedVariant 
    ? product.variants.find(v => v.id === selectedVariant)?.price 
    : product.price;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id, selectedVariant, quantity);
    }
  };

  return (
    <div className="product-card" style={{
      border: `1px solid ${theme.borderColor || '#e5e7eb'}`,
      borderRadius: theme.radius || '0.5rem',
      overflow: 'hidden',
      background: '#fff'
    }}>
      {product.images?.[0] && (
        <div className="product-image" style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover',
          background: '#f3f4f6'
        }}>
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      
      <div className="product-info" style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>{product.name}</h3>
        
        <div className="product-price" style={{ 
          marginBottom: '0.75rem',
          color: theme.accent || '#3b82f6',
          fontWeight: '600',
          fontSize: '1.25rem'
        }}>
          ${displayPrice?.toFixed(2)}
          {product.compareAtPrice && displayPrice < product.compareAtPrice && (
            <span style={{ 
              marginLeft: '0.5rem', 
              textDecoration: 'line-through', 
              color: '#9ca3af',
              fontSize: '0.875rem'
            }}>
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.variants?.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              Variant
            </label>
            <select
              value={selectedVariant || ''}
              onChange={(e) => setSelectedVariant(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: `1px solid ${theme.borderColor || '#d1d5db'}`,
                borderRadius: theme.radius || '0.375rem'
              }}
            >
              {product.variants.map(variant => (
                <option key={variant.id} value={variant.id}>{variant.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="number"
            min="1"
            max={product.inventory || 999}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={{
              width: '60px',
              padding: '0.5rem',
              border: `1px solid ${theme.borderColor || '#d1d5db'}`,
              borderRadius: theme.radius || '0.375rem',
              textAlign: 'center'
            }}
          />
          <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              background: product.inventory === 0 ? '#9ca3af' : (theme.accent || '#3b82f6'),
              color: '#fff',
              border: 'none',
              borderRadius: theme.radius || '0.375rem',
              cursor: product.inventory === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ShoppingCart Component
 */
export function ShoppingCart({ onCheckout, theme = {} }) {
  const { cart, removeFromCart, updateQuantity, applyCoupon, totals, isUpdating } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    if (!result.success) {
      setCouponError(result.error);
    } else {
      setCouponError('');
      setCouponCode('');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      {/* Cart Items */}
      <div className="cart-items" style={{ marginBottom: '1.5rem' }}>
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="cart-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderBottom: `1px solid ${theme.borderColor || '#e5e7eb'}`
            }}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: theme.radius || '0.375rem' }}
              />
            )}
            
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem' }}>{item.name}</h4>
              {item.variantName && (
                <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  {item.variantName}
                </p>
              )}
              <p style={{ margin: 0, fontWeight: '600', color: theme.accent || '#3b82f6' }}>
                ${item.price.toFixed(2)}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                disabled={isUpdating}
                style={{
                  width: '50px',
                  padding: '0.25rem',
                  border: `1px solid ${theme.borderColor || '#d1d5db'}`,
                  borderRadius: theme.radius || '0.375rem',
                  textAlign: 'center'
                }}
              />
              <button
                onClick={() => removeFromCart(item.id)}
                disabled={isUpdating}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: theme.radius || '0.375rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="cart-coupon" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: `1px solid ${couponError ? '#ef4444' : (theme.borderColor || '#d1d5db')}`,
              borderRadius: theme.radius || '0.375rem'
            }}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={isUpdating || !couponCode}
            style={{
              padding: '0.75rem 1.5rem',
              background: theme.accent || '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: theme.radius || '0.375rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Apply
          </button>
        </div>
        {couponError && (
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{couponError}</p>
        )}
      </div>

      {/* Cart Totals */}
      <div className="cart-totals" style={{
        padding: '1.5rem',
        background: theme.background || '#f9fafb',
        borderRadius: theme.radius || '0.5rem'
      }}>
        <h3 style={{ margin: '0 0 1rem' }}>Order Summary</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        
        {totals.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
            <span>Discount</span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Tax</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Shipping</span>
          <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: `1px solid ${theme.borderColor || '#e5e7eb'}`,
          fontWeight: '600',
          fontSize: '1.25rem'
        }}>
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>

        <button
          onClick={onCheckout}
          disabled={isUpdating || cart.items.length === 0}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '1rem',
            background: theme.accent || '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: theme.radius || '0.375rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

/**
 * CheckoutForm Component
 */
export function CheckoutForm({ onComplete, theme = {} }) {
  const { cart, totals } = useCart();
  const [formData, setFormData] = useState({
    customer: { email: '', firstName: '', lastName: '', phone: '' },
    shipping: { address: '', city: '', state: '', zip: '', country: 'US' },
    payment: { method: 'card', cardNumber: '', expiry: '', cvc: '' }
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer.email)) {
      newErrors['customer.email'] = 'Valid email required';
    }
    if (!formData.customer.firstName) newErrors['customer.firstName'] = 'Required';
    if (!formData.customer.lastName) newErrors['customer.lastName'] = 'Required';
    if (!formData.shipping.address) newErrors['shipping.address'] = 'Required';
    if (!formData.shipping.city) newErrors['shipping.city'] = 'Required';
    if (!formData.shipping.zip) newErrors['shipping.zip'] = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setProcessing(true);
    try {
      const order = ecommerce.createOrder(formData);
      onComplete?.(order);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const InputField = ({ section, field, label, type = 'text', placeholder }) => (
    <div>
      <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.875rem' }}>
        {label}
      </label>
      <input
        type={type}
        value={formData[section][field]}
        onChange={(e) => handleChange(section, field, e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: `1px solid ${errors[`${section}.${field}`] ? '#ef4444' : (theme.borderColor || '#d1d5db')}`,
          borderRadius: theme.radius || '0.375rem'
        }}
      />
      {errors[`${section}.${field}`] && (
        <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {errors[`${section}.${field}`]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <InputField section="customer" field="email" label="Email" type="email" placeholder="you@example.com" />
        <InputField section="customer" field="firstName" label="First Name" placeholder="John" />
        <InputField section="customer" field="lastName" label="Last Name" placeholder="Doe" />
        <InputField section="customer" field="phone" label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
      </div>

      <h4 style={{ margin: '1.5rem 0 1rem' }}>Shipping Address</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <InputField section="shipping" field="address" label="Address" placeholder="123 Main St" />
        </div>
        <InputField section="shipping" field="city" label="City" placeholder="New York" />
        <InputField section="shipping" field="state" label="State" placeholder="NY" />
        <InputField section="shipping" field="zip" label="ZIP Code" placeholder="10001" />
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500', fontSize: '0.875rem' }}>
            Country
          </label>
          <select
            value={formData.shipping.country}
            onChange={(e) => handleChange('shipping', 'country', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${theme.borderColor || '#d1d5db'}`,
              borderRadius: theme.radius || '0.375rem'
            }}
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>

      <h4 style={{ margin: '1.5rem 0 1rem' }}>Payment</h4>
      <div style={{ padding: '1rem', background: theme.background || '#f9fafb', borderRadius: theme.radius || '0.5rem', marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          🔒 Secure payment powered by Stripe (demo mode)
        </p>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: theme.background || '#f9fafb',
        borderRadius: theme.radius || '0.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span>Items ({totals.itemCount})</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        {totals.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
            <span>Discount</span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '1.125rem', marginTop: '0.5rem' }}>
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing || cart.items.length === 0}
        style={{
          width: '100%',
          marginTop: '1.5rem',
          padding: '1rem',
          background: processing ? '#9ca3af' : (theme.accent || '#3b82f6'),
          color: '#fff',
          border: 'none',
          borderRadius: theme.radius || '0.375rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: processing ? 'not-allowed' : 'pointer'
        }}
      >
        {processing ? 'Processing...' : `Pay $${totals.total.toFixed(2)}`}
      </button>
    </form>
  );
}
