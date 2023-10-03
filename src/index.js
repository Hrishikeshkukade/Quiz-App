import App from './App';
import { ThemeProvider } from './context/ThemeContext';



import { createRoot } from 'react-dom/client';
import { UserContextProvider } from './context/UserContext';
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
<ThemeProvider>
<UserContextProvider>  

<App tab="home"/>
</UserContextProvider>  
</ThemeProvider>
);