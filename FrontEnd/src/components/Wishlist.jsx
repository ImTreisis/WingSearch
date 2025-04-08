import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Wishlist() {

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      console.log('Fetching wishlist...');
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        console.log('No token found');
        setError('Please login to view your wishlist');
        return;
      }

      const response = await axios.get('https://wingsearch.onrender.com/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Wishlist response:', response.data);
      setWishlist(response.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      console.log('Adding item to wishlist:', newItem);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        console.log('No token found');
        setError('Please login to add items to your wishlist');
        return;
      }

      const response = await axios.post(
        'https://wingsearch.onrender.com/api/wishlist',
        { item: newItem },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Add item response:', response.data);
      setWishlist(prevWishlist => [...prevWishlist, response.data]);
      setNewItem('');
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      console.log('Removing item:', itemId);
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        console.log('No token found');
        setError('Please login to remove items from your wishlist');
        return;
      }

      await axios.delete(`https://wingsearch.onrender.com/api/wishlist/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Item removed successfully');
      setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error removing item:', err);
      setError(err.response?.data?.message || 'Failed to remove item');
    }
  };

  if (loading) {
    return <div className="wishlist-page">Loading...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>My Wishlist</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleAddItem} className="wishlist-form">
          <div className="form-group">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add a new destination"
              required
            />
          </div>
          <button type="submit" className="add-button" disabled={!newItem.trim()}>
            Add to Wishlist
          </button>
        </form>
        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <p>Your wishlist is empty</p>
          ) : (
            wishlist.map((item) => (
              <div key={item._id} className="wishlist-item">
                <div className="item-details">
                  <h3>{item.item}</h3>
                  <p>Added on {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 