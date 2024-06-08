import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [totalDiscountedPrice, setTotalDiscountedPrice] = useState(0);

  useEffect(() => {
    fetch('/product.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data && Array.isArray(data.products)) {
          console.log('Fetched products:', data.products);
          setProducts(data.products.map(product => ({ ...product, quantity: 1 })));
        } else {
          console.error('Fetched data is not in the expected format:', data);
        }
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  useEffect(() => {
    const totalPrice = products.reduce((total, product) => {
      const discountedPrice = Math.round(product.price * (1 - product.discountPercentage / 100));
      return total + discountedPrice * product.quantity;
    }, 0);
    setTotalDiscountedPrice(totalPrice);
  }, [products]);

  const handleUpdateQuantity = (productId, newQuantity) => {
    setProducts(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ products, totalDiscountedPrice, handleUpdateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
