import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ArticleProvider } from './context/ArticleContext';

export default function App() {
  return (
    <ArticleProvider>
      <RouterProvider router={router} />
    </ArticleProvider>
  );
}
