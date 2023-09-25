import App from './App';
import { ThemeProvider } from './context/ThemeContext';


// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
<ThemeProvider>

<App tab="home"/>
</ThemeProvider>

);