// client/src/utils/storage.js
class StorageUtil {
  setItem(key, value, expireInMinutes = null) {
    const item = {
      value,
      timestamp: Date.now()
    };
    
    if (expireInMinutes) {
      item.expiry = Date.now() + expireInMinutes * 60 * 1000;
    }
    
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem(key) {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      
      if (item.expiry && Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch {
      return null;
    }
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  isExpired(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return true;
    
    try {
      const item = JSON.parse(itemStr);
      return item.expiry ? Date.now() > item.expiry : false;
    } catch {
      return true;
    }
  }
}

export default new StorageUtil();