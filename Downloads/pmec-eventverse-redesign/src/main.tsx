import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@fontsource/big-shoulders-display/800'
import '@fontsource/big-shoulders-display/900'
import '@fontsource-variable/instrument-sans'
import '@fontsource/noto-sans-oriya/700'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
