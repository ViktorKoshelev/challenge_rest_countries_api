import styles from './App.module.less';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { toggleTheme, selectTheme } from './stores/ThemeSlice';
import { useDispatch, useSelector } from 'react-redux';

const Countries = lazy(() => import('./Countries'));
const Country = lazy(() => import('./Country'));

const App = () => {
  const Theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  return (
    <Router>
      <div className={`${styles[Theme + '-background']} ${styles.page}`}>
        <header className={`${styles[Theme + '-element']} ${styles.header}`}>
          <h2 className={styles.h2}>Where in the world?</h2>
          <div
            data-testid='switcher'
            onClick={() => dispatch(toggleTheme())}
            className={`${styles.tumbler} ${styles[Theme + '-text']}`}>
            <svg className={`${styles.icon} ${styles['icon-' + Theme]}`} xmlns="http://www.w3.org/2000/svg">
              <use href="/src/icons.svg#moon"></use>
            </svg>
            Dark Mode</div>
        </header>
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/:id" element={<Country />} />
              <Route path="/" element={<Countries />} />
            </Routes>
          </Suspense>
        </main>
      </div >
    </Router>
  )
}

export default App;
