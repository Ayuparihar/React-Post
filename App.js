const { useState, useEffect, createContext, useContext } = React;

// Create Context for Posts
const PostsContext = createContext();

// Posts Provider Component
function PostsProvider({ children }) {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const postsPerPage = 6;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        // Show loading for 5 seconds as requested
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const posts = await response.json();
        setAllPosts(posts);
        updateDisplayedPosts(posts, 1);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Update displayed posts based on current page
  const updateDisplayedPosts = (posts, page) => {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    setDisplayedPosts(posts.slice(startIndex, endIndex));
  };

  // Navigation functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateDisplayedPosts(allPosts, page);
    }
  };

  const removePost = (postId) => {
    const updatedPosts = allPosts.filter(post => post.id !== postId);
    setAllPosts(updatedPosts);
    
    const newTotalPages = Math.ceil(updatedPosts.length / postsPerPage);
    let newCurrentPage = currentPage;
    
    if (currentPage > newTotalPages && newTotalPages > 0) {
      newCurrentPage = newTotalPages;
    }
    
    setCurrentPage(newCurrentPage);
    updateDisplayedPosts(updatedPosts, newCurrentPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const value = {
    allPosts, displayedPosts, currentPage, totalPages,
    isLoading, error, postsPerPage,
    goToPage, removePost, goToNextPage, goToPreviousPage
  };

  return React.createElement(PostsContext.Provider, { value }, children);
}

// Hook to use Posts Context
function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within PostsProvider');
  }
  return context;
}

// Loading Component
function LoadingSpinner() {
  return React.createElement('div', { className: 'loading-container' },
    React.createElement('div', { className: 'spinner' }),
    React.createElement('h2', null, 'Loading...'),
    React.createElement('p', null, 'Please wait while we fetch the latest content')
  );
}

// Post Card Component
function PostCard({ post }) {
  const { removePost } = usePosts();

  return React.createElement('div', { className: 'post-card' },
    React.createElement('button', {
      className: 'remove-btn',
      onClick: () => removePost(post.id),
      title: `Remove post ${post.id}`
    }, '×'),
    
    React.createElement('div', { className: 'post-header' },
      React.createElement('span', { className: 'post-id' }, `#${post.id}`),
      React.createElement('span', { className: 'user-id' }, `User ${post.userId}`)
    ),
    
    React.createElement('h3', { className: 'post-title' }, post.title),
    React.createElement('p', { className: 'post-body' }, post.body),
    
    React.createElement('div', { className: 'post-footer' },
      React.createElement('button', { className: 'read-more-btn' }, 'Read More →'),
      React.createElement('span', { className: 'reading-time' }, 
        `${Math.ceil(post.body.split(' ').length / 200)} min read`)
    )
  );
}

// Pagination Component
function Pagination() {
  const { currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage } = usePosts();

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return React.createElement('div', { className: 'pagination' },
    React.createElement('button', {
      onClick: goToPreviousPage,
      disabled: currentPage === 1,
      className: 'nav-btn'
    }, '← Previous'),
    
    React.createElement('div', { className: 'page-numbers' },
      getVisiblePages().map((page, index) => 
        React.createElement('div', { key: index },
          typeof page === 'number' 
            ? React.createElement('button', {
                onClick: () => goToPage(page),
                className: currentPage === page ? 'page-btn active' : 'page-btn'
              }, page)
            : React.createElement('span', { className: 'ellipsis' }, page)
        )
      )
    ),
    
    React.createElement('button', {
      onClick: goToNextPage,
      disabled: currentPage === totalPages,
      className: 'nav-btn'
    }, 'Next →')
  );
}

// Main Posts Component
function Posts() {
  const { displayedPosts, currentPage, totalPages, allPosts, postsPerPage, isLoading, error } = usePosts();

  if (isLoading) return React.createElement(LoadingSpinner);

  if (error) {
    return React.createElement('div', { className: 'error-container' },
      React.createElement('h2', null, 'Error Loading Posts'),
      React.createElement('p', null, error),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        className: 'retry-btn'
      }, 'Retry')
    );
  }

  if (allPosts.length === 0) {
    return React.createElement('div', { className: 'error-container' },
      React.createElement('h2', null, 'No Posts Available'),
      React.createElement('p', null, 'We couldn\'t find any posts to display.'),
      React.createElement('button', {
        onClick: () => window.location.reload(),
        className: 'retry-btn'
      }, 'Retry')
    );
  }

  const startPost = (currentPage - 1) * postsPerPage + 1;
  const endPost = Math.min(currentPage * postsPerPage, allPosts.length);

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'header' },
      React.createElement('h1', null, 'Posts Dashboard'),
      React.createElement('div', { className: 'header-info' }, `${allPosts.length} Posts`)
    ),
    
    React.createElement('main', { className: 'main' },
      React.createElement('div', { className: 'stats-bar' },
        React.createElement('div', { className: 'stats-info' },
          `Showing ${startPost}-${endPost} of ${allPosts.length} posts`),
        React.createElement('div', { className: 'page-info' },
          `Page ${currentPage} of ${totalPages}`)
      ),
      
      React.createElement('div', { className: 'posts-grid' },
        displayedPosts.map(post => 
          React.createElement(PostCard, { key: post.id, post })
        )
      ),
      
      React.createElement(Pagination)
    ),
    
    React.createElement('footer', { className: 'footer' },
      React.createElement('p', null, 'Data fetched from JSONPlaceholder API • Built with React & Context'),
      React.createElement('p', null, 'Real-time data • Responsive design')
    )
  );
}

// Main App Component
function App() {
  return React.createElement(PostsProvider, null,
    React.createElement(Posts)
  );
}

// Render the App
ReactDOM.render(React.createElement(App), document.getElementById('root'));